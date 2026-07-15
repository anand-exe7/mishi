import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchProducts as dbFetchProducts } from '@/lib/db';

export interface Product {
  id: string;
  name: string;
  nameTa?: string;
  description: string;
  descriptionTa?: string;
  benefits: string;
  benefitsTa?: string;
  category: string;
  remedy: string[];
  price: number;
  offerPrice?: number;
  rating: number;
  isActive: boolean;
  unitType: 'weight' | 'volume' | 'unit';
  unitLabel: string;
  imageUrl: string;
  predefinedOptions: { quantity: number; unit: string; label: string; price: number; isAvailable?: boolean }[];
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'cup-sambrani',
    name: 'Cup Sambrani',
    category: 'Pooja Items',
    price: 150,
    offerPrice: 150,
    rating: 4.8,
    imageUrl: 'https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-1.jpg',
    description: 'A traditional aromatic product used in many homes to create a pure and peaceful environment.',
    isActive: true,
    benefits: 'Purifies the air\nSoothing fragrance\nTraditional ritual essential',
    remedy: ['Stress Relief', 'Cleansing'],
    unitType: 'weight',
    unitLabel: 'g',
    predefinedOptions: [
      { quantity: 250, unit: 'g', label: '250g', price: 150 },
      { quantity: 500, unit: 'g', label: '500g', price: 280 }
    ]
  },
  {
    id: 'computer-sambrani',
    name: 'Computer Sambrani',
    category: 'Pooja Items',
    price: 120,
    offerPrice: 120,
    rating: 4.6,
    imageUrl: 'https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/Product-4.jpg',
    description: 'A modern and convenient form of traditional sambrani.',
    isActive: true,
    benefits: 'Easy to light\nConsistent burning\nRefreshing aroma',
    remedy: ['Aromatherapy'],
    unitType: 'weight',
    unitLabel: 'g',
    predefinedOptions: [
      { quantity: 250, unit: 'g', label: '250g', price: 120 }
    ]
  },
  {
    id: 'camphor',
    name: 'Camphor',
    category: 'Pooja Items',
    price: 80,
    offerPrice: 80,
    rating: 4.9,
    imageUrl: 'https://www.mishipoojaproducts.com/wp-content/uploads/2026/03/pr4.jpg',
    description: 'A powerful and sacred element widely used in spiritual rituals.',
    isActive: true,
    benefits: 'Spiritual purification\nDivine essence\nClears negative energies',
    remedy: ['Purification'],
    unitType: 'weight',
    unitLabel: 'g',
    predefinedOptions: [
      { quantity: 100, unit: 'g', label: '100g', price: 80 },
      { quantity: 250, unit: 'g', label: '250g', price: 180 }
    ]
  }
];

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const dbProducts = await dbFetchProducts();
      let mapped: Product[] = dbProducts.map((p) => {
        // Map db sizes to predefined options
        const predefinedOptions = p.sizes.map((s) => ({
          quantity: parseInt(s.size.replace(/[^0-9]/g, '')) || 1,
          unit: s.size.replace(/[0-9]/g, '').trim().toLowerCase() || 'unit',
          label: s.size,
          price: s.price,
          isAvailable: s.isAvailable !== false,
        }));

        // Determine unit type
        let unitType: 'weight' | 'volume' | 'unit' = 'unit';
        let unitLabel = 'unit';
        if (predefinedOptions.length > 0) {
          const u = predefinedOptions[0].unit;
          if (['g', 'kg', 'gm'].includes(u)) {
            unitType = 'weight';
            unitLabel = 'g';
          } else if (['ml', 'l'].includes(u)) {
            unitType = 'volume';
            unitLabel = 'ml';
          }
        }

        return {
          id: p.id,
          name: p.name,
          nameTa: p.tamilName,
          description: p.description,
          benefits: p.benefits ? p.benefits.join('\n') : '',
          category: p.category,
          remedy: p.herbs ? p.herbs.split(',').map((h) => h.trim()) : [],
          price: p.sizes && p.sizes.length > 0 ? Math.min(...p.sizes.map(s => s.price)) : 0,
          offerPrice: p.sizes && p.sizes.length > 0 ? Math.min(...p.sizes.map(s => s.price)) : 0,
          rating: 4.8,
          isActive: p.isAvailable ?? true,
          unitType,
          unitLabel,
          imageUrl: p.image || '',
          predefinedOptions,
        };
      });
      
      if (mapped.length === 0) {
        mapped = MOCK_PRODUCTS;
      }
      
      set({ products: mapped, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch', loading: false });
    }
  },
}));

interface VariantStore {
  variantsMap: Record<string, any[]>;
}

export const useVariantStore = create<VariantStore>(() => ({
  variantsMap: {},
}));

interface CartItem {
  product: Product;
  quantity: number;
  unit: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, unit: string) => void;
  removeItem: (productId: string, unit: string) => void;
  updateQuantity: (productId: string, unit: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity, unit) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id && i.unit === unit);
          if (existing) {
            return {
              items: state.items.map((i) =>
                (i.product.id === product.id && i.unit === unit) ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity, unit }] };
        }),
      removeItem: (productId, unit) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.product.id === productId && i.unit === unit)),
        })),
      updateQuantity: (productId, unit, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.product.id === productId && i.unit === unit ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

interface FavStore {
  favorites: string[];
  toggle: (product: Product) => void;
  isFav: (productId: string) => boolean;
}

export const useFavStore = create<FavStore>((set, get) => ({
  favorites: [],
  toggle: (product) => {
    const isFav = get().favorites.includes(product.id);
    if (isFav) {
      set((state) => ({ favorites: state.favorites.filter((id) => id !== product.id) }));
    } else {
      set((state) => ({ favorites: [...state.favorites, product.id] }));
    }
  },
  isFav: (productId) => get().favorites.includes(productId),
}));
