import { create } from 'zustand';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const cartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (productId, quantity) => set((state) => {
    const existingItem = state.cart.find(item => item.productId === productId);
    if (existingItem) {
      return {
        cart: state.cart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      };
    }
    return { cart: [...state.cart, { productId, quantity }] };
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
}));
