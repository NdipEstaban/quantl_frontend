"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const refinementMetrics = [
  {
    label: "Expectancy",
    value: "$52.40",
    formula: "(Win% × Avg Win) - (Loss% × Avg Loss)",
    description: "Expected profit per trade",
    progress: 68,
  },
  {
    label: "Sharpe Ratio",
    value: "1.42",
    formula: "(Return - Risk Free) / Std Dev",
    description: "Risk-adjusted returns",
    progress: 71,
  },
  {
    label: "Sortino Ratio",
    value: "2.18",
    formula: "Return / Downside Deviation",
    description: "Downside risk-adjusted",
    progress: 82,
  },
  {
    label: "Calmar Ratio",
    value: "2.85",
    formula: "CAGR / Max Drawdown",
    description: "Return vs max drawdown",
    progress: 78,
  },
]

export function RefinementSection() {
  return (
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Strategy Refinement</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Level 2 Metrics</p>
        </div>
      </div>

      <div className="space-y-4">
        {refinementMetrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{metric.label}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="font-mono text-xs mb-1">{metric.formula}</p>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-lg font-bold text-primary">{metric.value}</span>
            </div>
            <Progress value={metric.progress} className="h-1.5" />
          </div>
        ))}
      </div>
    </Card>
  )
}
