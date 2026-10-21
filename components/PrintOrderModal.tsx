"use client";

import React, { useMemo, useState } from "react";
import { X, Printer, FileText, Receipt, ArrowLeft, ChevronRight } from "lucide-react";
import type { Order } from "@/lib/db";

type Format = "thermal" | "sheet";
type ThermalSize = "58mm" | "80mm";
type SheetSize = "A4" | "A5";

type Props = {
  order: Order | null;
  onClose: () => void;
};

const STORE = {
  name: "MISHI POOJA PRODUCTS",
  tagline: "Manufacture & Exporter",
  address: "Padasallai street, Lake Road, near to spicot, Chembarambakkam, Tamil Nadu 600123",
  phone: "+91 80561 01114",
};

// Build CGST/SGST split from an order's stored totals
function gstBreakdown(order: Order) {
  const taxable = Math.max(0, order.subtotal - (order.couponDiscount || 0) - (order.manualDiscount || 0));
  const gstAmount = Math.max(0, Math.round(order.totalPrice - taxable - (order.deliveryCharge || 0)));
  const gstPercent = taxable > 0 && gstAmount > 0 ? Math.round((gstAmount / taxable) * 100) : 0;
  return {
    taxable,
    gstAmount,
    gstPercent,
    cgstAmount: gstAmount / 2,
    sgstAmount: gstAmount / 2,
    cgstPercent: gstPercent / 2,
    sgstPercent: gstPercent / 2,
  };
}

const inr = (n: number) =>
  n.toLocaleString("en-IN", {
    minimumFractionDigits: n % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });

const pctFmt = (p: number) => (p % 1 === 0 ? String(p) : p.toFixed(1));

export default function PrintOrderModal({ order, onClose }: Props) {
  const [format, setFormat] = useState<Format | null>(null);
  const [thermalSize, setThermalSize] = useState<ThermalSize>("80mm");
  const [sheetSize, setSheetSize] = useState<SheetSize>("A4");

  const gst = useMemo(() => (order ? gstBreakdown(order) : null), [order]);

  if (!order) return null;

  const reset = () => {
    setFormat(null);
    setThermalSize("80mm");
    setSheetSize("A4");
  };

  const close = () => {
    reset();
    onClose();
  };

  const paperSize = format === "thermal" ? thermalSize : sheetSize;

  const handlePrint = () => {
    // Spawn a dedicated print window containing the receipt / invoice + the right @page CSS
    const w = window.open("", "mishi-print", "width=800,height=900");
    if (!w) {
      alert("Allow pop-ups to print.");
      return;
    }
    const html = buildPrintableHtml(order, format!, paperSize);
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.onload = () => {
      try {
        w.print();
      } catch { /* ignore */ }
    };
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={close}
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 min-w-0">
            {format && (
              <button
                onClick={reset}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                aria-label="Back"
                type="button"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight truncate">
                Print {order.id}
              </h3>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {!format
                  ? "Choose format"
                  : format === "thermal"
                  ? `Thermal roll — ${thermalSize}`
                  : `Sheet — ${sheetSize}`}
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 shrink-0"
            aria-label="Close"
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
          {!format ? (
            <FormatPicker onPick={setFormat} />
          ) : (
            <SizeAndPreview
              order={order}
              format={format}
              thermalSize={thermalSize}
              sheetSize={sheetSize}
              onThermalSize={setThermalSize}
              onSheetSize={setSheetSize}
              gst={gst!}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
          {format && (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-sm"
            >
              <Printer size={14} /> Print Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FormatPicker({ onPick }: { onPick: (f: Format) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => onPick("thermal")}
        className="group text-left bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all rounded-2xl p-5 flex flex-col gap-3"
      >
        <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
          <Receipt size={24} />
        </div>
        <div>
          <h4 className="text-base font-black text-slate-900">Thermal Roll</h4>
          <p className="text-xs text-slate-500 font-medium mt-1">
            POS receipt printer. Choose 58 mm or 80 mm roll width.
          </p>
        </div>
        <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
          Continue <ChevronRight size={14} />
        </span>
      </button>

      <button
        type="button"
        onClick={() => onPick("sheet")}
        className="group text-left bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all rounded-2xl p-5 flex flex-col gap-3"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
          <FileText size={24} />
        </div>
        <div>
          <h4 className="text-base font-black text-slate-900">Sheet</h4>
          <p className="text-xs text-slate-500 font-medium mt-1">
            A4 or A5 paper on a regular inkjet / laser printer.
          </p>
        </div>
        <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
          Continue <ChevronRight size={14} />
        </span>
      </button>
    </div>
  );
}

function SizeAndPreview({
  order,
  format,
  thermalSize,
  sheetSize,
  onThermalSize,
  onSheetSize,
  gst,
}: {
  order: Order;
  format: Format;
  thermalSize: ThermalSize;
  sheetSize: SheetSize;
  onThermalSize: (s: ThermalSize) => void;
  onSheetSize: (s: SheetSize) => void;
  gst: ReturnType<typeof gstBreakdown>;
}) {
  return (
    <div className="space-y-5">
      {/* Size chooser */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-1">
          Paper size:
        </span>
        {format === "thermal" ? (
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {(["58mm", "80mm"] as ThermalSize[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onThermalSize(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  thermalSize === s ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            {(["A4", "A5"] as SheetSize[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSheetSize(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  sheetSize === s ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
          Preview
        </div>
        <div className="flex items-start justify-center bg-slate-200/70 rounded-xl p-4 overflow-x-auto">
          {format === "thermal" ? (
            <ThermalPreview order={order} width={thermalSize} gst={gst} />
          ) : (
            <SheetPreview order={order} size={sheetSize} gst={gst} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Previews (plain React) ──────────────────────────────────────────────── */

function ThermalPreview({
  order,
  width,
  gst,
}: {
  order: Order;
  width: ThermalSize;
  gst: ReturnType<typeof gstBreakdown>;
}) {
  const px = width === "58mm" ? 220 : 300; // visual proxy for roll width
  const d = new Date(order.createdAt);
  return (
    <div
      className="bg-white shadow-lg font-mono text-[11px] leading-[1.3] text-black p-3"
      style={{ width: px, minHeight: 320 }}
    >
      <div className="text-center">
        <div className="font-black text-sm leading-tight">{STORE.name}</div>
        <div className="text-[10px]">{STORE.tagline}</div>
        <div className="text-[10px] mt-1">{STORE.phone}</div>
      </div>
      <div className="border-t border-dashed border-black my-2" />
      <div className="flex justify-between">
        <span>Invoice</span>
        <span className="font-bold">{order.id}</span>
      </div>
      <div className="flex justify-between">
        <span>Date</span>
        <span>{d.toLocaleDateString("en-IN")}</span>
      </div>
      <div className="flex justify-between">
        <span>Time</span>
        <span>{d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div className="border-t border-dashed border-black my-2" />
      <div className="font-bold">BILLED TO</div>
      <div>{order.customerName}</div>
      {order.customerPhone && <div>+91 {order.customerPhone}</div>}
      <div className="border-t border-dashed border-black my-2" />
      <div className="font-bold flex justify-between">
        <span>ITEM</span>
        <span>AMT</span>
      </div>
      <div className="border-t border-dashed border-black my-1" />
      {order.items.map((it, i) => (
        <div key={i} className="mb-1">
          <div className="truncate">{it.name}</div>
          <div className="flex justify-between">
            <span>
              {it.quantity} × ₹{inr(it.price)}
            </span>
            <span>₹{inr(it.price * it.quantity)}</span>
          </div>
        </div>
      ))}
      <div className="border-t border-dashed border-black my-2" />
      <KV label="Subtotal" value={`₹${inr(order.subtotal)}`} />
      {order.couponDiscount > 0 && <KV label="Coupon" value={`-₹${inr(order.couponDiscount)}`} />}
      {order.manualDiscount > 0 && <KV label="Discount" value={`-₹${inr(order.manualDiscount)}`} />}
      {gst.gstAmount > 0 && (
        <>
          <KV label={`CGST @ ${pctFmt(gst.cgstPercent)}%`} value={`₹${inr(gst.cgstAmount)}`} />
          <KV label={`SGST @ ${pctFmt(gst.sgstPercent)}%`} value={`₹${inr(gst.sgstAmount)}`} />
        </>
      )}
      {order.deliveryCharge > 0 && <KV label="Delivery" value={`₹${inr(order.deliveryCharge)}`} />}
      <div className="border-t border-dashed border-black my-1" />
      <div className="flex justify-between font-black text-sm">
        <span>TOTAL</span>
        <span>₹{inr(order.totalPrice)}</span>
      </div>
      <div className="border-t border-dashed border-black my-2" />
      <div className="text-center text-[10px]">Thank you for shopping!</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function SheetPreview({
  order,
  size,
  gst,
}: {
  order: Order;
  size: SheetSize;
  gst: ReturnType<typeof gstBreakdown>;
}) {
  // Rough visual proxy of A4 / A5 at ~72dpi, scaled for the modal
  const width = size === "A4" ? 420 : 300;
  const d = new Date(order.createdAt);
  return (
    <div
      className="bg-white shadow-lg text-black p-6 text-xs"
      style={{ width, minHeight: size === "A4" ? 560 : 420 }}
    >
      <div className="flex items-start justify-between pb-4 border-b-2 border-slate-200 mb-4">
        <div>
          <div className="text-base font-black tracking-tight">{STORE.name}</div>
          <div className="text-[10px] text-slate-600">{STORE.tagline}</div>
          <div className="text-[10px] text-slate-600 mt-1 max-w-[200px]">{STORE.address}</div>
          <div className="text-[10px] text-slate-600">{STORE.phone}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-black">INVOICE</div>
          <div className="text-[11px] font-bold">{order.id}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {d.toLocaleDateString("en-IN")} · {d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Billed To</div>
        <div className="font-bold text-sm">{order.customerName}</div>
        {order.customerPhone && <div className="text-[11px]">+91 {order.customerPhone}</div>}
        {order.customerAddress && (
          <div className="text-[11px] text-slate-600 whitespace-pre-wrap">{order.customerAddress}</div>
        )}
      </div>

      <table className="w-full text-[11px] border-collapse mb-4">
        <thead>
          <tr className="border-y border-slate-200">
            <th className="py-1.5 text-left font-bold">Item</th>
            <th className="py-1.5 text-center font-bold w-10">Qty</th>
            <th className="py-1.5 text-right font-bold w-16">Price</th>
            <th className="py-1.5 text-right font-bold w-16">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((it, i) => (
            <tr key={i} className="border-b border-slate-100">
              <td className="py-1.5 pr-2">
                <div className="font-bold">{it.name}</div>
                {it.size && it.size !== "—" && (
                  <div className="text-[9px] text-slate-500">{it.size}</div>
                )}
              </td>
              <td className="py-1.5 text-center">{it.quantity}</td>
              <td className="py-1.5 text-right">₹{inr(it.price)}</td>
              <td className="py-1.5 text-right font-bold">₹{inr(it.price * it.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-48 space-y-1 text-[11px]">
          <KV label="Subtotal" value={`₹${inr(order.subtotal)}`} />
          {order.couponDiscount > 0 && <KV label="Coupon" value={`-₹${inr(order.couponDiscount)}`} />}
          {order.manualDiscount > 0 && <KV label="Discount" value={`-₹${inr(order.manualDiscount)}`} />}
          {gst.gstAmount > 0 && (
            <>
              <KV label={`CGST @ ${pctFmt(gst.cgstPercent)}%`} value={`₹${inr(gst.cgstAmount)}`} />
              <KV label={`SGST @ ${pctFmt(gst.sgstPercent)}%`} value={`₹${inr(gst.sgstAmount)}`} />
            </>
          )}
          {order.deliveryCharge > 0 && <KV label="Delivery" value={`₹${inr(order.deliveryCharge)}`} />}
          <div className="flex justify-between pt-2 mt-1 border-t border-slate-300 font-black">
            <span>Total</span>
            <span>₹{inr(order.totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Printable HTML (opened in a new window + window.print()) ────────────── */

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

function buildPrintableHtml(order: Order, format: Format, size: string): string {
  const gst = gstBreakdown(order);
  const d = new Date(order.createdAt);

  const commonHead = `
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(order.id)}</title>
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; color: #000; background: #fff; }
    </style>
  `;

  if (format === "thermal") {
    const widthMm = size === "58mm" ? 58 : 80;
    const contentMm = widthMm - 4; // 2mm padding each side
    return `<!doctype html><html><head>${commonHead}
      <style>
        @page { size: ${widthMm}mm auto; margin: 2mm; }
        body { font-family: ui-monospace, "Courier New", monospace; font-size: 11px; line-height: 1.3; width: ${contentMm}mm; }
        .c { text-align: center; }
        .b { font-weight: 700; }
        .big { font-size: 13px; }
        .row { display: flex; justify-content: space-between; gap: 6px; }
        .hr { border-top: 1px dashed #000; margin: 4px 0; }
        .item { margin-bottom: 2px; }
        .item .nm { word-break: break-word; }
        .tot { font-size: 14px; font-weight: 900; }
      </style></head><body>
      <div class="c b big">${escapeHtml(STORE.name)}</div>
      <div class="c" style="font-size:10px">${escapeHtml(STORE.tagline)}</div>
      <div class="c" style="font-size:10px">${escapeHtml(STORE.phone)}</div>
      <div class="hr"></div>
      <div class="row"><span>Invoice</span><span class="b">${escapeHtml(order.id)}</span></div>
      <div class="row"><span>Date</span><span>${d.toLocaleDateString("en-IN")}</span></div>
      <div class="row"><span>Time</span><span>${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span></div>
      <div class="hr"></div>
      <div class="b">BILLED TO</div>
      <div>${escapeHtml(order.customerName)}</div>
      ${order.customerPhone ? `<div>+91 ${escapeHtml(order.customerPhone)}</div>` : ""}
      <div class="hr"></div>
      <div class="row b"><span>ITEM</span><span>AMT</span></div>
      <div class="hr"></div>
      ${order.items.map(it => `
        <div class="item">
          <div class="nm">${escapeHtml(it.name)}</div>
          <div class="row"><span>${it.quantity} × ₹${inr(it.price)}</span><span>₹${inr(it.price * it.quantity)}</span></div>
        </div>`).join("")}
      <div class="hr"></div>
      <div class="row"><span>Subtotal</span><span>₹${inr(order.subtotal)}</span></div>
      ${order.couponDiscount > 0 ? `<div class="row"><span>Coupon</span><span>-₹${inr(order.couponDiscount)}</span></div>` : ""}
      ${order.manualDiscount > 0 ? `<div class="row"><span>Discount</span><span>-₹${inr(order.manualDiscount)}</span></div>` : ""}
      ${gst.gstAmount > 0 ? `
        <div class="row"><span>CGST @ ${pctFmt(gst.cgstPercent)}%</span><span>₹${inr(gst.cgstAmount)}</span></div>
        <div class="row"><span>SGST @ ${pctFmt(gst.sgstPercent)}%</span><span>₹${inr(gst.sgstAmount)}</span></div>
      ` : ""}
      ${order.deliveryCharge > 0 ? `<div class="row"><span>Delivery</span><span>₹${inr(order.deliveryCharge)}</span></div>` : ""}
      <div class="hr"></div>
      <div class="row tot"><span>TOTAL</span><span>₹${inr(order.totalPrice)}</span></div>
      <div class="hr"></div>
      <div class="c" style="font-size:10px">Thank you for shopping!</div>
      <div style="height: 12mm"></div>
    </body></html>`;
  }

  // Sheet (A4 / A5)
  const sheetSize = size === "A5" ? "A5" : "A4";
  return `<!doctype html><html><head>${commonHead}
    <style>
      @page { size: ${sheetSize}; margin: 12mm; }
      body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #111; }
      .hdr { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 14px; }
      .hdr .name { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
      .hdr .tag { font-size: 11px; color: #666; }
      .hdr .addr { font-size: 10px; color: #666; max-width: 240px; margin-top: 4px; }
      .hdr .right { text-align: right; }
      .hdr .right .inv { font-size: 14px; font-weight: 800; }
      .hdr .right .id { font-size: 12px; font-weight: 700; }
      .hdr .right .meta { font-size: 10px; color: #666; margin-top: 4px; }
      .billto .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888; font-weight: 700; }
      .billto .nm { font-weight: 700; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 11px; }
      th { text-align: left; padding: 6px 4px; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
      td { padding: 6px 4px; border-bottom: 1px solid #eee; vertical-align: top; }
      .ta-c { text-align: center; }
      .ta-r { text-align: right; }
      .totals { margin-top: 10px; display: flex; justify-content: flex-end; }
      .totals .box { width: 220px; font-size: 11px; }
      .totals .row { display: flex; justify-content: space-between; padding: 2px 0; }
      .totals .grand { border-top: 2px solid #111; margin-top: 6px; padding-top: 6px; font-weight: 900; font-size: 14px; }
      .foot { margin-top: 24px; text-align: center; font-size: 10px; color: #888; }
    </style></head><body>
    <div class="hdr">
      <div>
        <div class="name">${escapeHtml(STORE.name)}</div>
        <div class="tag">${escapeHtml(STORE.tagline)}</div>
        <div class="addr">${escapeHtml(STORE.address)}</div>
        <div class="addr">${escapeHtml(STORE.phone)}</div>
      </div>
      <div class="right">
        <div class="inv">INVOICE</div>
        <div class="id">${escapeHtml(order.id)}</div>
        <div class="meta">${d.toLocaleDateString("en-IN")} · ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    </div>
    <div class="billto">
      <div class="lbl">Billed To</div>
      <div class="nm">${escapeHtml(order.customerName)}</div>
      ${order.customerPhone ? `<div>+91 ${escapeHtml(order.customerPhone)}</div>` : ""}
      ${order.customerAddress ? `<div>${escapeHtml(order.customerAddress).replace(/\n/g, "<br/>")}</div>` : ""}
    </div>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="ta-c" style="width:40px">Qty</th>
          <th class="ta-r" style="width:70px">Price</th>
          <th class="ta-r" style="width:80px">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map(it => `
          <tr>
            <td>
              <div style="font-weight:700">${escapeHtml(it.name)}</div>
              ${it.size && it.size !== "—" ? `<div style="font-size:9px;color:#888">${escapeHtml(it.size)}</div>` : ""}
            </td>
            <td class="ta-c">${it.quantity}</td>
            <td class="ta-r">₹${inr(it.price)}</td>
            <td class="ta-r" style="font-weight:700">₹${inr(it.price * it.quantity)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div class="totals">
      <div class="box">
        <div class="row"><span>Subtotal</span><span>₹${inr(order.subtotal)}</span></div>
        ${order.couponDiscount > 0 ? `<div class="row"><span>Coupon</span><span>-₹${inr(order.couponDiscount)}</span></div>` : ""}
        ${order.manualDiscount > 0 ? `<div class="row"><span>Discount</span><span>-₹${inr(order.manualDiscount)}</span></div>` : ""}
        ${gst.gstAmount > 0 ? `
          <div class="row"><span>CGST @ ${pctFmt(gst.cgstPercent)}%</span><span>₹${inr(gst.cgstAmount)}</span></div>
          <div class="row"><span>SGST @ ${pctFmt(gst.sgstPercent)}%</span><span>₹${inr(gst.sgstAmount)}</span></div>
        ` : ""}
        ${order.deliveryCharge > 0 ? `<div class="row"><span>Delivery</span><span>₹${inr(order.deliveryCharge)}</span></div>` : ""}
        <div class="row grand"><span>Total</span><span>₹${inr(order.totalPrice)}</span></div>
      </div>
    </div>
    <div class="foot">Thank you for shopping with Mishi Pooja Products.</div>
  </body></html>`;
}
