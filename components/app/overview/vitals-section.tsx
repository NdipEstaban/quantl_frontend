"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, Percent, DollarSign, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const vitalsData = [
  {
    label: "Win Rate",
    value: "58.3%",
    change: "+2.1%",
    isPositive: true,
    icon: Target,
    description: "vs last period",
  },
  {
    label: "Profit Factor",
    value: "1.87",
    change: "+0.12",
    isPositive: true,
    icon: BarChart3,
    description: "Gross profit / loss",
  },
  {
    label: "Risk/Reward",
    value: "1:2.4",
    change: "+0.3",
    isPositive: true,
    icon: Percent,
    description: "Avg RRR",
  },
  {
    label: "Net P&L",
    value: "$12,847",
    change: "+$2,341",
    isPositive: true,
    icon: DollarSign,
    description: "This period",
  },
  {
    label: "Max Drawdown",
    value: "-8.2%",
    change: "-1.3%",
    isPositive: true,
    icon: TrendingDown,
    description: "Peak to trough",
  },
  {
    label: "Avg Win/Loss",
    value: "$485 / $287",
    change: "1.69:1",
    isPositive: true,
    icon: TrendingUp,
    description: "Ratio",
  },
]

export function VitalsSection() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">The Vitals</h2>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Level 1 Metrics</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {vitalsData.map((metric, index) => (
          <Card
            key={metric.label}
            className={cn(
              "relative overflow-hidden p-4 bg-card/50 border-border/50",
            )}
          >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-2">
              <metric.icon className="w-4 h-4 text-muted-foreground" />
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  metric.isPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10",
                )}
              >
                {metric.change}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-foreground">{metric.value}</p>
              <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
              <p className="text-[10px] text-muted-foreground/60">{metric.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
