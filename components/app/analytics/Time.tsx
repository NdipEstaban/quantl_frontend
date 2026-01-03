import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { hourlyData, sessionData } from "@/lib/analyticsData";

export default function TimeAnalysisTab() {
  return (
    <div className="space-y-4">
      {/* Hourly Performance */}
      <Card className="p-4 bg-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-1">Performance by Hour</h3>
        <p className="text-xs text-muted-foreground mb-4">
          P&L distribution across trading hours (UTC)
        </p>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.01 260)"
              />
              <XAxis
                dataKey="hour"
                stroke="oklch(0.65 0 0)"
                fontSize={10}
                interval={2}
              />
              <YAxis
                stroke="oklch(0.65 0 0)"
                fontSize={11}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0.008 260)",
                  border: "1px solid oklch(0.28 0.01 260)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {hourlyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Session Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sessionData.map((session) => (
          <Card
            key={session.session}
            className="p-4 bg-card/50 border-border/50"
          >
            <h4 className="font-semibold mb-1">{session.session} Session</h4>
            <p className="text-xs text-muted-foreground mb-3">{session.time}</p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Win Rate</span>
                <span className="font-semibold">{session.winRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Trades
                </span>
                <span className="font-semibold">{session.trades}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Net P&L</span>
                <span
                  className={cn(
                    "font-semibold",
                    session.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  ${session.pnl.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Best Pair</span>
                <Badge variant="secondary">{session.best}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
