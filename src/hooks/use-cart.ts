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
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
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
        clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
