"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  LineChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Types & Interfaces ---

export interface DayData {
  pnl: number;
  trades: number;
}

export interface EquityPoint {
  period: string;
  equity: number;
  drawdown?: number;
}

export interface EquityCurveProps {
  chartData?: EquityPoint[];
  calendarData?: Record<string, DayData>;
  startingBalance?: number;
}

// --- Defaults ---

const defaultChartData: EquityPoint[] = [
  { period: "Jan", equity: 10000 },
  { period: "Feb", equity: 10850 },
  { period: "Mar", equity: 10200 },
  { period: "Apr", equity: 11400 },
  { period: "May", equity: 12100 },
  { period: "Jun", equity: 11500 },
  { period: "Jul", equity: 13200 },
  { period: "Aug", equity: 14500 },
  { period: "Sep", equity: 13800 },
  { period: "Oct", equity: 15200 },
  { period: "Nov", equity: 16800 },
  { period: "Dec", equity: 18247 },
];

const defaultCalendarData: Record<string, DayData> = {
  "2023-05-02": { pnl: 3120, trades: 2 },
  "2023-05-04": { pnl: -2400, trades: 3 },
  "2023-05-05": { pnl: -403, trades: 3 },
  "2023-05-06": { pnl: -16200, trades: 4 },
  "2023-05-12": { pnl: 4350, trades: 2 },
  "2023-05-13": { pnl: -4730, trades: 5 },
  "2023-05-18": { pnl: -2940, trades: 4 },
  "2023-05-23": { pnl: 1140, trades: 4 },
  "2023-05-26": { pnl: -3660, trades: 3 },
};

export function EquityCurve({
  chartData = defaultChartData,
  calendarData = defaultCalendarData,
  startingBalance = 10000,
}: EquityCurveProps) {
  const [view, setView] = useState<"chart" | "calendar">("chart");
  const [currentDate, setCurrentDate] = useState(new Date(2023, 4, 1));

  return (
    <Card className="p-4 bg-card/50 border-border/50 min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">
            {view === "chart" ? "Equity Curve" : "Trading Calendar"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {view === "chart"
              ? "Portfolio performance over time"
              : "Daily P&L and trade volume"}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setView(view === "chart" ? "calendar" : "chart")}
          className="gap-2 transition-colors hover:bg-primary/5"
        >
          {view === "chart" ? (
            <>
              <CalendarDays className="h-4 w-4" />
              <span>Calendar</span>
            </>
          ) : (
            <>
              <LineChart className="h-4 w-4" />
              <span>Chart</span>
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 w-full min-h-0">
        {view === "chart" ? (
          <ChartView data={chartData} />
        ) : (
          <CalendarView
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            data={calendarData}
          />
        )}
      </div>

      {view === "chart" && (
        <QuickStats
          startingBalance={startingBalance}
          currentBalance={chartData[chartData.length - 1]?.equity}
        />
      )}
    </Card>
  );
}

function CalendarCell({
  day,
  data,
  index,
}: {
  day: number;
  data?: DayData;
  index: number;
}) {
  const isPositive = data && data.pnl >= 0;
  const isNegative = data && data.pnl < 0;

  return (
    <div
      style={{ animationDelay: `${index * 12}ms` }}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border text-sm transition-all",
        "animate-in fade-in zoom-in-90 fill-mode-backwards",
        !data && "bg-secondary/10 border-border/30 text-muted-foreground/50",
        isPositive &&
          "bg-success/10 border-success/20 text-success shadow-[0_0_15px_-5px_rgba(34,197,94,0.1)]",
        isNegative &&
          "bg-destructive/10 border-destructive/20 text-destructive  shadow-[0_0_15px_-5px_rgba(239,68,68,0.1)]",
      )}
    >
      <span className="absolute top-1.5 right-2 text-[10px] font-bold opacity-40">
        {day}
      </span>
      {data ? (
        <>
          <span className="font-bold tracking-tight">
            {data.pnl < 0 ? "-" : "+"}${Math.abs(data.pnl).toLocaleString()}
          </span>
          <span className="text-[10px] font-medium opacity-70 mt-1">
            {data.trades} trades
          </span>
        </>
      ) : (
        <span className="text-[10px] opacity-0">-</span>
      )}
    </div>
  );
}

function QuickStats({
  startingBalance,
  currentBalance,
}: {
  startingBalance: number;
  currentBalance: number;
}) {
  const totalPnL = currentBalance - startingBalance;
  const totalPnLPercent = ((totalPnL / startingBalance) * 100).toFixed(2);

  return (
    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-bottom-1 duration-700">
      <Stat
        label="Starting Balance"
        value={`$${startingBalance.toLocaleString()}`}
      />
      <Stat
        label="Current Balance"
        value={`$${currentBalance.toLocaleString()}`}
        variant={totalPnL >= 0 ? "success" : "destructive"}
      />
      <Stat
        label="Total Return"
        value={`${totalPnL >= 0 ? "+" : ""}${totalPnLPercent}%`}
        variant={totalPnL >= 0 ? "success" : "destructive"}
      />
      <Stat label="Total Trades" value="247" />
    </div>
  );
}

function Stat({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "success" | "destructive";
}) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p
        className={cn(
          "text-sm font-bold",
          variant === "success" && "text-success",
          variant === "destructive" && "text-destructive",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ChartView({ data }: { data: EquityPoint[] }) {
  return (
    <div className="h-[350px] w-full animate-in fade-in zoom-in-95 duration-500">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="oklch(0.72 0.19 155)"
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor="oklch(0.72 0.19 155)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-border/30"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="currentColor"
            className="text-muted-foreground"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="currentColor"
            className="text-muted-foreground"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => [
              `$${value.toLocaleString()}`,
              "Equity",
            ]}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="oklch(0.72 0.19 155)"
            strokeWidth={2}
            fill="url(#equityGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CalendarView({
  currentDate,
  setCurrentDate,
  data,
}: {
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  data: Record<string, DayData>;
}) {
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  const handleMonthChange = (offset: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth() + offset, 1));
  };

  const days = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`pad-${i}`} className="bg-transparent" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push(
        <CalendarCell key={day} day={day} data={data[dateKey]} index={day} />,
      );
    }
    return cells;
  }, [currentDate, data, year, daysInMonth, firstDayOfMonth]);

  return (
    <div className="w-full h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleMonthChange(-1)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-lg min-w-[120px] text-center">
            {monthName} {year}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleMonthChange(1)}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-4 text-xs font-medium text-muted-foreground uppercase tracking-tight">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            Profit
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            Loss
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 auto-rows-[80px]">{days}</div>
    </div>
  );
}
