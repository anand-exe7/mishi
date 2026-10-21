// Web Bluetooth thermal receipt printing (ESC/POS)
// Works in Chrome Desktop / Chrome Android over HTTPS or localhost.
// Not supported in Safari / iOS.

import type { Order } from './db';

// Common generic ESC/POS BLE printer service (many Chinese thermal printers)
const PRIMARY_SERVICE = '000018f0-0000-1000-8000-00805f9b34fb';
const WRITE_CHARACTERISTIC = '00002af1-0000-1000-8000-00805f9b34fb';

// BLE packets are capped — chunk writes to be safe
const CHUNK_SIZE = 180;

export function isBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined'
    && typeof (navigator as any).bluetooth !== 'undefined';
}

// ESC/POS byte helpers
const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

const INIT = [ESC, 0x40];
const ALIGN_LEFT = [ESC, 0x61, 0x00];
const ALIGN_CENTER = [ESC, 0x61, 0x01];
const BOLD_ON = [ESC, 0x45, 0x01];
const BOLD_OFF = [ESC, 0x45, 0x00];
const DOUBLE_ON = [GS, 0x21, 0x11];
const DOUBLE_OFF = [GS, 0x21, 0x00];
const FEED_AND_CUT = [LF, LF, LF, LF, GS, 0x56, 0x00];

function encodeText(s: string): number[] {
  // ESC/POS CP437-ish; TextEncoder gives UTF-8 which most receipt printers
  // tolerate for ASCII and ignore / mojibake non-ASCII. Replace ₹ with "Rs."
  const safe = s.replace(/₹/g, 'Rs.');
  return Array.from(new TextEncoder().encode(safe));
}

function line(cols: Array<[string, number]>, width = 32): number[] {
  // cols: [text, columnWidth]. Right-pads/truncates each column, joins.
  let out = '';
  for (const [text, w] of cols) {
    const t = text.length > w ? text.slice(0, w) : text.padEnd(w, ' ');
    out += t;
  }
  if (out.length > width) out = out.slice(0, width);
  return encodeText(out + '\n');
}

function kv(label: string, value: string, width = 32): number[] {
  const space = Math.max(1, width - label.length - value.length);
  return encodeText(label + ' '.repeat(space) + value + '\n');
}

function buildReceipt(order: Order): Uint8Array {
  const bytes: number[] = [];

  // Header
  bytes.push(...INIT);
  bytes.push(...ALIGN_CENTER, ...BOLD_ON, ...DOUBLE_ON);
  bytes.push(...encodeText('MISHI POOJA\n'));
  bytes.push(...encodeText('PRODUCTS\n'));
  bytes.push(...DOUBLE_OFF, ...BOLD_OFF);
  bytes.push(...encodeText('Manufacture & Exporter\n'));
  bytes.push(...encodeText('Chembarambakkam, TN 600123\n'));
  bytes.push(...encodeText('+91 80561 01114\n'));
  bytes.push(...encodeText('--------------------------------\n'));

  // Meta
  bytes.push(...ALIGN_LEFT);
  bytes.push(...kv('Invoice:', order.id));
  const d = new Date(order.createdAt);
  bytes.push(...kv('Date:', d.toLocaleDateString('en-IN')));
  bytes.push(...kv('Time:', d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })));
  bytes.push(...kv('Type:', (order.source || 'POS').toUpperCase()));
  bytes.push(...encodeText('--------------------------------\n'));

  // Customer
  bytes.push(...BOLD_ON);
  bytes.push(...encodeText('BILLED TO:\n'));
  bytes.push(...BOLD_OFF);
  bytes.push(...encodeText(order.customerName + '\n'));
  if (order.customerPhone) bytes.push(...encodeText('+91 ' + order.customerPhone + '\n'));
  bytes.push(...encodeText('--------------------------------\n'));

  // Items header
  bytes.push(...BOLD_ON);
  bytes.push(...line([['Item', 16], ['Qty', 5], ['Price', 11]]));
  bytes.push(...BOLD_OFF);
  bytes.push(...encodeText('--------------------------------\n'));

  // Items
  for (const it of order.items) {
    const total = it.price * it.quantity;
    bytes.push(...line([
      [it.name, 16],
      [String(it.quantity), 5],
      ['Rs.' + total.toLocaleString('en-IN'), 11],
    ]));
    if (it.size && it.size !== '—') {
      bytes.push(...encodeText('  ' + it.size + '\n'));
    }
  }

  // Totals
  bytes.push(...encodeText('--------------------------------\n'));
  const taxable = Math.max(0, order.subtotal - (order.couponDiscount || 0) - (order.manualDiscount || 0));
  const gstAmount = Math.max(0, Math.round(order.totalPrice - taxable - (order.deliveryCharge || 0)));
  const gstPercent = taxable > 0 && gstAmount > 0 ? Math.round((gstAmount / taxable) * 100) : 0;
  const half = gstAmount / 2;
  const halfPct = gstPercent / 2;
  const pctStr = (p: number) => (p % 1 === 0 ? String(p) : p.toFixed(1));
  const rs = (n: number) =>
    'Rs.' + n.toLocaleString('en-IN', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

  bytes.push(...kv('Subtotal:', rs(order.subtotal)));
  if (order.couponDiscount > 0)
    bytes.push(...kv(`Coupon${order.couponCode ? ' (' + order.couponCode + ')' : ''}:`, '-' + rs(order.couponDiscount)));
  if (order.manualDiscount > 0) bytes.push(...kv('Discount:', '-' + rs(order.manualDiscount)));
  if (gstAmount > 0) {
    bytes.push(...kv('CGST @ ' + pctStr(halfPct) + '%:', rs(half)));
    bytes.push(...kv('SGST @ ' + pctStr(halfPct) + '%:', rs(half)));
  }
  if (order.deliveryCharge > 0) bytes.push(...kv('Delivery:', rs(order.deliveryCharge)));

  bytes.push(...encodeText('--------------------------------\n'));
  bytes.push(...BOLD_ON, ...DOUBLE_ON);
  bytes.push(...kv('TOTAL:', rs(order.totalPrice), 16));
  bytes.push(...DOUBLE_OFF, ...BOLD_OFF);
  bytes.push(...encodeText('--------------------------------\n'));

  // Footer
  bytes.push(...ALIGN_CENTER);
  bytes.push(...encodeText('Thank you for shopping!\n'));
  bytes.push(...encodeText('Visit again\n'));

  // Feed + cut
  bytes.push(...FEED_AND_CUT);

  return new Uint8Array(bytes);
}

async function writeChunked(
  characteristic: BluetoothRemoteGATTCharacteristic,
  data: Uint8Array
) {
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    // writeValueWithoutResponse is faster but not all printers accept it
    if ((characteristic as any).writeValueWithoutResponse) {
      await (characteristic as any).writeValueWithoutResponse(chunk);
    } else {
      await characteristic.writeValue(chunk);
    }
  }
}

/**
 * Prompt the user to pair with a Bluetooth thermal printer and print the
 * given order as an ESC/POS receipt.
 *
 * Throws a human-readable error on failure.
 */
export async function printOrderOverBluetooth(order: Order): Promise<void> {
  if (!isBluetoothSupported()) {
    throw new Error(
      'Bluetooth printing is not supported in this browser. Use Chrome on desktop or Android.'
    );
  }

  const device = await (navigator as any).bluetooth.requestDevice({
    filters: [{ services: [PRIMARY_SERVICE] }],
    optionalServices: [PRIMARY_SERVICE],
  });

  if (!device.gatt) throw new Error('Printer has no GATT server');

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(PRIMARY_SERVICE);
  const characteristic = await service.getCharacteristic(WRITE_CHARACTERISTIC);

  const data = buildReceipt(order);
  await writeChunked(characteristic, data);

  // Small delay to let printer flush before disconnect
  await new Promise((r) => setTimeout(r, 400));
  try { device.gatt?.disconnect(); } catch { /* ignore */ }
}
