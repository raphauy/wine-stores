import { ProductDAO } from '@/services/product-services'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type CartItem = {
  product: ProductDAO
}

type CartState = {
  items: CartItem[]
  addItem: (product: ProductDAO) => void
  removeItem: (productId: string) => void
  removeAllOf: (productId: string) => void
  clearCart: () => void
  email: string
  phone: string
  address: string
  setEmail: (email: string) => void
  setPhone: (phone: string) => void
  setAddress: (address: string) => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      email: '',
      phone: '',
      address: '',
      items: [],
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, { product }] }
        }),
        removeItem: (productId) =>
          set((state) => {
            const index = state.items.findIndex(item => item.product.id === productId);
            if (index !== -1) {
              // Clonamos el arreglo actual de items
              const newItems = [...state.items];
              // Eliminamos el item en el índice encontrado
              newItems.splice(index, 1);
              // Devolvemos el nuevo estado con el item eliminado
              return { items: newItems };
            }
            return state;
          }),
      removeAllOf: (productId) =>
        set((state) => {
          const newItems = state.items.filter(item => item.product.id !== productId);
          return { items: newItems };
        }),
        clearCart: () => set({ items: [] }),
      setEmail: (email) => set({ email }),
      setPhone: (phone) => set({ phone }),
      setAddress: (address) => set({ address }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
