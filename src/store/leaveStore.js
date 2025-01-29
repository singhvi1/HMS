import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLeaveStore = create(
  persist(
    (set) => ({
      leaveRequests: [],
      addLeaveRequest: (request) => set((state) => ({
        leaveRequests: [...state.leaveRequests, request]
      })),
      updateLeaveStatus: (id, status) => set((state) => ({
        leaveRequests: state.leaveRequests.map(request =>
          request.id === id ? { ...request, status } : request
        )
      })),
      getStudentLeaves: (studentId) => {
        const { leaveRequests } = useLeaveStore.getState();
        return leaveRequests.filter(request => request.studentId === studentId);
      }
    }),
    {
      name: 'leave-storage',
    }
  )
);