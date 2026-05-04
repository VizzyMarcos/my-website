import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartNoticeProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  lastAddedProduct: CartNoticeProduct | null;
  addToCart: (productId: string, quantity: number, product?: Omit<CartNoticeProduct, 'id' | 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  dismissCartNotice: () => void;
}

export const cartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      lastAddedProduct: null,
      addToCart: (productId, quantity, product) => set((state) => {
        const existingItem = state.cart.find(item => item.productId === productId);
        const lastAddedProduct = product
          ? {
              id: productId,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity,
            }
          : null;

        if (existingItem) {
          return {
            lastAddedProduct,
            cart: state.cart.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        }
        return { lastAddedProduct, cart: [...state.cart, { productId, quantity }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.productId !== productId),
      })),
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { cart: state.cart.filter(item => item.productId !== productId) };
        }
        return {
          cart: state.cart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        };
      }),
      clearCart: () => set({ cart: [] }),
      dismissCartNotice: () => set({ lastAddedProduct: null }),
    }),
    {
      name: 'vicmart-cart', // saved in localStorage
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
