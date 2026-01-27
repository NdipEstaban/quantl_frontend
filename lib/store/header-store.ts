import { subDays } from "date-fns";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

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

export const useHeaderStore = create<HeaderStore>()(
  devtools(
    (set) => ({
      // State
      activeTab: "dashboard",
      isTradeFormOpen: false,
      timeRange: "Last 30 Days",
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      notificationCount: 0,

      // Actions
      setActiveTab: (tab) =>
        set({ activeTab: tab }, false, "header/setActiveTab"),

      setIsTradeFormOpen: (isOpen) =>
        set({ isTradeFormOpen: isOpen }, false, "header/setIsTradeFormOpen"),

      setTimeRange: (range) =>
        set({ timeRange: range }, false, "header/setTimeRange"),

      setStartDate: (date) =>
        set({ startDate: date }, false, "header/setStartDate"),

      setEndDate: (date) => set({ endDate: date }, false, "header/setEndDate"),

      setNotificationCount: (count) =>
        set({ notificationCount: count }, false, "header/setNotificationCount"),

      resetDates: () =>
        set(
          {
            startDate: subDays(new Date(), 30),
            endDate: new Date(),
            timeRange: "Last 30 Days",
          },
          false,
          "header/resetDates",
        ),
    }),
    { name: "HeaderStore" },
  ),
);
