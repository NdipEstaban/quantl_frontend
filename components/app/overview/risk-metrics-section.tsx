"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Percent, DollarSign, Scale } from "lucide-react"
import { cn } from "@/lib/utils"

const riskMetrics = [
  {
    icon: Shield,
    label: "Value at Risk (VaR)",
    value: "$2,340",
    description: "95% confidence 1-day VaR",
    status: "good",
  },
  {
    icon: Scale,
    label: "Position Sizing",
    value: "1.8%",
    description: "Avg risk per trade",
    target: "Target: 1-2%",
    status: "good",
  },
  {
    icon: Percent,
    label: "Kelly Criterion",
    value: "24.6%",
    description: "Optimal bet size",
    note: "Using 1/4 Kelly",
    status: "info",
  },
  {
    icon: DollarSign,
    label: "Margin Usage",
    value: "42%",
    description: "Of available margin",
    status: "good",
  },
]

const streakData = {
  current: { type: "win", count: 4 },
  maxWin: 8,
  maxLoss: 5,
  avgWinStreak: 3.2,
  avgLossStreak: 2.1,
}

const correlationAlerts = [
  { pair: "EURUSD / GBPUSD", correlation: 0.87, risk: "high" },
  { pair: "GOLD / USDJPY", correlation: -0.72, risk: "medium" },
]

export function RiskMetricsSection() {
  return (
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Risk Management</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Position & Portfolio Risk</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {riskMetrics.map((metric) => (
          <div key={metric.label} className="p-2.5 rounded-lg bg-secondary/30 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <metric.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{metric.label}</span>
            </div>
            <p className="text-lg font-bold">{metric.value}</p>
            <p className="text-[10px] text-muted-foreground">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Streak Analysis */}
      <div className="mb-4 p-3 rounded-lg bg-secondary/20 border border-border/30">
        <p className="text-xs text-muted-foreground mb-2">Streak Analysis</p>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div
              className={cn(
                "text-xl font-bold",
                streakData.current.type === "win" ? "text-success" : "text-destructive",
              )}
            >
              {streakData.current.count}
            </div>
            <p className="text-[10px] text-muted-foreground">Current {streakData.current.type}</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-success">{streakData.maxWin}</div>
            <p className="text-[10px] text-muted-foreground">Max win</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-destructive">{streakData.maxLoss}</div>
            <p className="text-[10px] text-muted-foreground">Max loss</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{streakData.avgWinStreak}</div>
            <p className="text-[10px] text-muted-foreground">Avg win</p>
          </div>
        </div>
      </div>

      {/* Correlation Alerts */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Correlation Alerts</p>
        <div className="space-y-2">
          {correlationAlerts.map((alert) => (
            <div key={alert.pair} className="flex items-center justify-between p-2 rounded-md bg-secondary/20">
              <span className="text-xs font-mono">{alert.pair}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs">
                  {alert.correlation > 0 ? "+" : ""}
                  {alert.correlation.toFixed(2)}
                </span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[9px]",
                    alert.risk === "high" && "bg-destructive/10 text-destructive",
                    alert.risk === "medium" && "bg-warning/10 text-warning",
                  )}
                >
                  {alert.risk}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
