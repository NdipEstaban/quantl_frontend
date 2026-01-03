"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  ChevronDown,
  Plus,
  Settings,
  Bell,
  TrendingUp,
  Target,
  FileText,
  Sparkles,
  View,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter, usePathname } from "next/navigation";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { useHeaderStore } from "@/store/useHeaderStore";

// Remove these props since we're using Zustand store
interface DashboardHeaderProps {
  onAddTradeClick?: () => void;
  className?: string;
  showNotifications?: boolean;
}

const TIME_RANGES = [
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "This Month",
  "This Year",
  "All Time",
  "Custom Range",
] as const;

const TABS = [
  { id: "overview", label: "Overview", icon: View, path: "/app/overview" },
  { id: "journal", label: "Journal", icon: FileText, path: "/app/journal" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, path: "/app/analytics" },
  { id: "playbooks", label: "Playbooks", icon: Target, path: "/app/playbooks" },
] as const;

export function Header({
  onAddTradeClick,
  className,
  showNotifications = true,
}: DashboardHeaderProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<string>("");
  const [tempEndDate, setTempEndDate] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();

  // Get state and actions from Zustand store (only for time range and trade form)
  const {
    setIsTradeFormOpen,
    setTimeRange,
    setStartDate,
    setEndDate,
    timeRange,
    notificationCount,
    startDate,
    endDate,
  } = useHeaderStore();

  // Get active tab from current route
  const activeTab =
    TABS.find((tab) => tab.path === pathname)?.id || "dashboard";

  // Initialize temp dates when component mounts
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);

    // Set temp dates for the date input fields
    setTempStartDate(format(thirtyDaysAgo, "yyyy-MM-dd"));
    setTempEndDate(format(today, "yyyy-MM-dd"));
  }, []);

  const handleTimeRangeSelect = (range: string) => {
    const today = new Date();
    let newStartDate: Date;
    let newEndDate: Date = today;

    switch (range) {
      case "Today":
        newStartDate = today;
        newEndDate = today;
        break;
      case "Last 7 Days":
        newStartDate = subDays(today, 7);
        break;
      case "Last 30 Days":
        newStartDate = subDays(today, 30);
        break;
      case "Last 90 Days":
        newStartDate = subDays(today, 90);
        break;
      case "This Month":
        newStartDate = startOfMonth(today);
        newEndDate = endOfMonth(today);
        break;
      case "This Year":
        newStartDate = startOfYear(today);
        newEndDate = endOfYear(today);
        break;
      case "All Time":
        // Set to a very old date for "all time"
        newStartDate = new Date(2000, 0, 1);
        newEndDate = today;
        break;
      case "Custom Range":
        // Don't change dates, just show the custom picker
        setShowCustomPicker(true);
        return;
      default:
        newStartDate = subDays(today, 30);
    }

    setShowCustomPicker(false);
    // Update store with new dates
    setTimeRange(range);
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    // Also update temp dates for the input fields
    setTempStartDate(format(newStartDate, "yyyy-MM-dd"));
    setTempEndDate(format(newEndDate, "yyyy-MM-dd"));
  };

  const handleCustomDateSubmit = () => {
    if (tempStartDate && tempEndDate) {
      let start = new Date(tempStartDate);
      let end = new Date(tempEndDate);

      // Validate dates
      if (start > end) {
        // Swap dates if start is after end
        const temp = start;
        start = end;
        end = temp;
        setTempStartDate(format(end, "yyyy-MM-dd"));
        setTempEndDate(format(temp, "yyyy-MM-dd"));
      }

      // Update store with custom dates
      setTimeRange("Custom Range");
      setStartDate(start);
      setEndDate(end);
      setShowCustomPicker(false);
    }
  };

  const formatDateRangeDisplay = () => {
    if (timeRange === "Custom Range" && startDate && endDate) {
      return `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`;
    }
    return timeRange;
  };

  const handleAddTradeClick = () => {
    setIsTradeFormOpen(true);
    if (onAddTradeClick) {
      onAddTradeClick();
    }
  };

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <header
      className={cn("sticky top-0 z-50 glass glass-border border-b", className)}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary/70 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                      aria-label="TradeEdge Logo"
                      onClick={() => router.push("/app/overview")}
                    >
                      <svg
                        className="w-5 h-5 text-primary-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M3 3v18h18" />
                        <path d="M18 9l-5 5-4-4-3 3" />
                      </svg>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>TradeEdge Dashboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span
                className="text-xl font-semibold tracking-tight bg-linear-to-br from-primary to-primary/70 bg-clip-text text-transparent cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => router.push("/app/overview")}
              >
                TradeEdge
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav
              className="hidden md:flex items-center gap-1 text-sm"
              aria-label="Main navigation"
            >
              {TABS.map((tab) => (
                <TooltipProvider key={tab.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleTabClick(tab.path)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          activeTab === tab.id
                            ? "bg-secondary text-foreground font-medium shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                        aria-current={activeTab === tab.id ? "page" : undefined}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch to {tab.label} view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-background/50 backdrop-blur-sm border-border hover:bg-secondary/50"
                          >
                            <Calendar className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {formatDateRangeDisplay()}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {TIME_RANGES.map((range) => (
                            <DropdownMenuItem
                              key={range}
                              onClick={() => handleTimeRangeSelect(range)}
                              className={cn(
                                "cursor-pointer",
                                timeRange === range &&
                                  "bg-secondary font-medium"
                              )}
                            >
                              {range}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Change time range</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Custom Date Range Picker */}
              {showCustomPicker && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-background border border-border rounded-lg shadow-lg p-4 z-50">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Select Custom Range</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCustomPicker(false)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={tempStartDate}
                          onChange={(e) => setTempStartDate(e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={tempEndDate}
                          onChange={(e) => setTempEndDate(e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCustomPicker(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCustomDateSubmit}
                        disabled={!tempStartDate || !tempEndDate}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Add Trade Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-2 bg-linear-to-br from-primary to-primary/80 text-primary-foreground hover:opacity-90 transition-opacity"
                    onClick={handleAddTradeClick}
                    aria-label="Add new trade"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Trade</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Log a new trade</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Notifications */}
            {showNotifications && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-secondary/50"
                      aria-label={`Notifications (${
                        notificationCount || 0
                      } unread)`}
                    >
                      <Bell className="w-4 h-4" />
                      {notificationCount && notificationCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{notificationCount || 0} unread notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Settings */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-secondary/50"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-20",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
