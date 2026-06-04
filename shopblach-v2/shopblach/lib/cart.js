import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (artwork) => {
        const { items } = get()
        const existing = items.find(i => i.id === artwork.id)
        if (existing) return // éditions limitées = 1 seul par client
        set({ items: [...items, { ...artwork, qty: 1 }], isOpen: true })
      },

      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
      },

      get count() {
        return get().items.length
      },
    }),
    { name: 'blach-cart' }
  )
)

export default useCart
