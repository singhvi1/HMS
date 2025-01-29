import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMaintenanceStore = create(
  persist(
    (set) => ({
      requests: [],
      setRequests: (requests) => set({ requests }),
      addRequest: (request) => set((state) => ({ 
        requests: [...state.requests, request] 
      })),
      updateRequestStatus: (id, status) => set((state) => ({
        requests: state.requests.map(request => 
          request.id === id ? { ...request, status } : request
        )
      }))
    }),
    {
      name: 'maintenance-storage',
    }
  )
);