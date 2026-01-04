import { subDays } from "date-fns";
import { create } from "zustand";

interface HeaderStore {
  // State
  activeTab: string;
  isTradeFormOpen: boolean;
  timeRange: string;
  startDate: Date;
  endDate: Date;
  notificationCount: number;

  // Actions
  setActiveTab: (tab: string) => void;
  setIsTradeFormOpen: (isOpen: boolean) => void;
  setTimeRange: (range: string) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  setNotificationCount: (count: number) => void;
  resetDates: () => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  // State
  activeTab: "dashboard",
  isTradeFormOpen: false,
  timeRange: "Last 30 Days",
  startDate: subDays(new Date(), 30),
  endDate: new Date(),
  notificationCount: 0,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsTradeFormOpen: (isOpen) => set({ isTradeFormOpen: isOpen }),
  setTimeRange: (range) => set({ timeRange: range }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setNotificationCount: (count) => set({ notificationCount: count }),
  resetDates: () =>
    set({
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      timeRange: "Last 30 Days",
    }),
}));

