import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useInventoryStore = create(
  persist(
    (set) => ({
      inventoryItems: [],
      addInventoryItem: (item) => set((state) => ({
        inventoryItems: [...state.inventoryItems, item]
      })),
      updateInventoryItem: (id, updates) => set((state) => ({
        inventoryItems: state.inventoryItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      }))
    }),
    {
      name: 'inventory-storage',
    }
  )
);