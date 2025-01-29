import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAnnouncementStore = create(
  persist(
    (set) => ({
      announcements: [],
      addAnnouncement: (announcement) => set((state) => ({
        announcements: [...state.announcements, announcement]
      })),
      updateAnnouncement: (id, updates) => set((state) => ({
        announcements: state.announcements.map(announcement =>
          announcement.id === id ? { ...announcement, ...updates } : announcement
        )
      })),
      deleteAnnouncement: (id) => set((state) => ({
        announcements: state.announcements.filter(announcement => announcement.id !== id)
      }))
    }),
    {
      name: 'announcement-storage',
    }
  )
);