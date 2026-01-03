"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useState } from "react"
import { cn } from "@/lib/utils"

const equityData = [
  { date: "Jan", equity: 10000, drawdown: 0 },
  { date: "Feb", equity: 10850, drawdown: -2 },
  { date: "Mar", equity: 10200, drawdown: -6 },
  { date: "Apr", equity: 11400, drawdown: -1 },
  { date: "May", equity: 12100, drawdown: -3 },
  { date: "Jun", equity: 11500, drawdown: -5 },
  { date: "Jul", equity: 13200, drawdown: -1 },
  { date: "Aug", equity: 14500, drawdown: 0 },
  { date: "Sep", equity: 13800, drawdown: -5 },
  { date: "Oct", equity: 15200, drawdown: -2 },
  { date: "Nov", equity: 16800, drawdown: 0 },
  { date: "Dec", equity: 18247, drawdown: -1 },
]


export function EquityCurve() {

  console.log("[v0] EquityCurve component rendering")

  return (
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Equity Curve</h3>
          <p className="text-sm text-muted-foreground">Portfolio performance over time</p>
        </div>
      </div>

      <div className="h-70 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={equityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.72 0.19 155)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260 / 0.5)" vertical={false} />
            <XAxis dataKey="date" stroke="oklch(0.65 0 0)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="oklch(0.65 0 0)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.17 0.008 260)",
                border: "1px solid oklch(0.28 0.01 260)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "oklch(0.97 0 0)" }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Equity"]}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground">Starting Balance</p>
          <p className="text-sm font-semibold">$10,000</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Current Balance</p>
          <p className="text-sm font-semibold text-success">$18,247</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Return</p>
          <p className="text-sm font-semibold text-success">+82.47%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Trades</p>
          <p className="text-sm font-semibold">247</p>
        </div>
      </div>
    </Card>
  )
}
