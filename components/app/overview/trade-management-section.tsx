"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Info, TrendingUp, TrendingDown, Target, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const tradeManagementMetrics = [
  {
    icon: TrendingDown,
    label: "Avg MAE",
    value: "-1.2%",
    description: "Maximum Adverse Excursion - How far trades go against you before closing",
    benchmark: "Target: < 1.5%",
    status: "good",
  },
  {
    icon: TrendingUp,
    label: "Avg MFE",
    value: "+3.8%",
    description: "Maximum Favorable Excursion - How far trades go in your favor",
    benchmark: "Potential captured: 68%",
    status: "warning",
  },
  {
    icon: Target,
    label: "Edge Ratio",
    value: "3.17",
    description: "MFE / MAE - Higher is better. Measures trade efficiency",
    benchmark: "Excellent > 2.5",
    status: "excellent",
  },
  {
    icon: Clock,
    label: "Avg Hold Time",
    value: "2h 34m",
    description: "Average duration of winning vs losing trades",
    benchmark: "Winners: 3h 12m | Losers: 1h 45m",
    status: "good",
  },
]

const executionMetrics = [
  { label: "Trades at Target", value: 42, total: 100 },
  { label: "Early Exits", value: 31, total: 100 },
  { label: "Moved to B/E", value: 18, total: 100 },
  { label: "Full Runners", value: 9, total: 100 },
]

export function TradeManagementSection() {
  return (
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Trade Management</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">MAE / MFE Analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        {tradeManagementMetrics.map((metric) => (
          <div key={metric.label} className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                metric.status === "excellent"
                  ? "bg-success/10"
                  : metric.status === "good"
                    ? "bg-primary/10"
                    : "bg-warning/10"
              }`}
            >
              <metric.icon
                className={`w-4 h-4 ${
                  metric.status === "excellent"
                    ? "text-success"
                    : metric.status === "good"
                      ? "text-primary"
                      : "text-warning"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p className="text-xs">{metric.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-lg font-bold">{metric.value}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{metric.benchmark}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-3">Exit Distribution</p>
        <div className="space-y-2">
          {executionMetrics.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="font-medium">{metric.value}%</span>
              </div>
              <Progress value={metric.value} className="h-1" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
