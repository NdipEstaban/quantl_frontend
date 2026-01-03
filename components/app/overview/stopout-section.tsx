"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Octagon, TrendingDown, AlertTriangle, Shield } from "lucide-react"

// Sample stop-out data
const stopOutData = {
  totalStopOuts: 47,
  stopOutRate: 28.5,
  avgStopOutLoss: -287,
  totalStopOutLoss: -13489,
  stopOutsBySetup: [
    { setup: "Breakout", stopOuts: 12, total: 34, rate: 35.3 },
    { setup: "Pullback", stopOuts: 8, total: 42, rate: 19.0 },
    { setup: "Reversal", stopOuts: 15, total: 38, rate: 39.5 },
    { setup: "Trend Cont.", stopOuts: 7, total: 35, rate: 20.0 },
    { setup: "Range", stopOuts: 5, total: 16, rate: 31.3 },
  ],
  prematureStopOuts: 18,
  prematureRate: 38.3,
  avgPrematureRecovery: 2.1, // How much price moved in favor after stopping out
}

export function StopOutSection() {
  return (
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Octagon className="h-5 w-5 text-destructive" />
        <h3 className="text-lg font-semibold">Stop-Out Analysis</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Stop-Out Rate */}
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <p className="text-xs text-muted-foreground">Stop-Out Rate</p>
          </div>
          <p className="text-2xl font-bold text-destructive">{stopOutData.stopOutRate}%</p>
          <p className="text-xs text-muted-foreground">{stopOutData.totalStopOuts} of 165 trades</p>
        </div>

        {/* Premature Stop-Outs */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-xs text-muted-foreground">Premature Stops</p>
          </div>
          <p className="text-2xl font-bold text-amber-500">{stopOutData.prematureRate}%</p>
          <p className="text-xs text-muted-foreground">{stopOutData.prematureStopOuts} would have won</p>
        </div>
      </div>

      {/* Stop-Out by Setup */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Stop-Out by Setup</p>
        {stopOutData.stopOutsBySetup.slice(0, 4).map((item) => (
          <div key={item.setup} className="flex items-center justify-between">
            <span className="text-sm">{item.setup}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    item.rate > 30 ? "bg-destructive" : item.rate > 20 ? "bg-amber-500" : "bg-success",
                  )}
                  style={{ width: `${item.rate}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium w-10 text-right",
                  item.rate > 30 ? "text-destructive" : item.rate > 20 ? "text-amber-500" : "text-success",
                )}
              >
                {item.rate}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Summary */}
      <div className="mt-4 p-3 rounded-lg bg-secondary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Stop-Out Cost</span>
          </div>
          <span className="font-bold text-destructive">${Math.abs(stopOutData.totalStopOutLoss).toLocaleString()}</span>
        </div>
      </div>
    </Card>
  )
}
