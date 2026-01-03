"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

const behavioralData = [
  { day: "Mon", pnl: 420, trades: 12 },
  { day: "Tue", pnl: -180, trades: 8 },
  { day: "Wed", pnl: 650, trades: 15 },
  { day: "Thu", pnl: 280, trades: 10 },
  { day: "Fri", pnl: -90, trades: 6 },
]

const sessionData = [
  { session: "Asia", winRate: 52, trades: 34 },
  { session: "London", winRate: 64, trades: 89 },
  { session: "NY", winRate: 58, trades: 124 },
]

export function BehavioralSection() {
  return (
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Behavioral Analytics</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Level 3 Metrics</p>
        </div>
      </div>

      {/* P&L by Day */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">P&L by Weekday</p>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behavioralData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="oklch(0.65 0 0)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis
                stroke="oklch(0.65 0 0)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.008 260)",
                  border: "1px solid oklch(0.28 0.01 260)",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
                formatter={(value: number) => [`$${value}`, "P&L"]}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {behavioralData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "oklch(0.72 0.19 155)" : "oklch(0.65 0.2 25)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Session Performance */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Win Rate by Session</p>
        <div className="space-y-2">
          {sessionData.map((session) => (
            <div key={session.session} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium w-14">{session.session}</span>
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${session.winRate}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{session.trades} trades</span>
                <span className="font-semibold text-foreground">{session.winRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
