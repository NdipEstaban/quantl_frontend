"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const recentTrades = [
  {
    id: 1,
    symbol: "EURUSD",
    direction: "long",
    pnl: 245.5,
    pnlPercent: 2.4,
    rr: "1:2.8",
    time: "2h ago",
    setup: "Breakout",
  },
  {
    id: 2,
    symbol: "GBPJPY",
    direction: "short",
    pnl: -125.0,
    pnlPercent: -1.2,
    rr: "1:1.5",
    time: "4h ago",
    setup: "Reversal",
  },
  {
    id: 3,
    symbol: "XAUUSD",
    direction: "long",
    pnl: 420.0,
    pnlPercent: 3.8,
    rr: "1:3.2",
    time: "6h ago",
    setup: "Trend",
  },
  {
    id: 4,
    symbol: "NAS100",
    direction: "long",
    pnl: 180.25,
    pnlPercent: 1.6,
    rr: "1:2.1",
    time: "8h ago",
    setup: "Breakout",
  },
  {
    id: 5,
    symbol: "USDJPY",
    direction: "short",
    pnl: -85.0,
    pnlPercent: -0.8,
    rr: "1:1.2",
    time: "12h ago",
    setup: "Range",
  },
]

export function RecentTrades() {
  return (
    <Card className="p-4 bg-card/50 border-border/50 flex-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Recent Trades</h3>
          <p className="text-xs text-muted-foreground">Last 5 closed positions</p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          View All <ChevronRight className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-2">
        {recentTrades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  trade.direction === "long" ? "bg-success/10" : "bg-destructive/10",
                )}
              >
                {trade.direction === "long" ? (
                  <ArrowUpRight className="w-4 h-4 text-success" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{trade.symbol}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {trade.setup}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{trade.rr} RR</span>
                  <span>•</span>
                  <span>{trade.time}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className={cn("font-semibold", trade.pnl >= 0 ? "text-success" : "text-destructive")}>
                {trade.pnl >= 0 ? "+" : ""}
                {trade.pnl.toFixed(2)}
              </p>
              <p className={cn("text-xs", trade.pnl >= 0 ? "text-success/70" : "text-destructive/70")}>
                {trade.pnlPercent >= 0 ? "+" : ""}
                {trade.pnlPercent}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
