import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { rMultipleData } from "@/lib/analyticsData";
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

export default function DistributionTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* R-Multiple Distribution */}
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">
            R-Multiple Distribution
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Trade outcomes by risk multiple
          </p>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rMultipleData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.01 260)"
                />
                <XAxis dataKey="r" stroke="oklch(0.65 0 0)" fontSize={11} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {rMultipleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.r.startsWith("-")
                          ? "#ef4444"
                          : entry.r === "B/E"
                          ? "#6b7280"
                          : "#10b981"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Win/Loss Distribution Stats */}
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">
            Distribution Statistics
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Key distribution metrics
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs text-muted-foreground mb-1">Avg Winner</p>
                <p className="text-2xl font-bold text-emerald-400">+2.1R</p>
                <p className="text-xs text-muted-foreground">$485 avg</p>
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-muted-foreground mb-1">Avg Loser</p>
                <p className="text-2xl font-bold text-red-400">-1.0R</p>
                <p className="text-xs text-muted-foreground">$287 avg</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Largest Win
                </p>
                <p className="text-lg font-bold text-emerald-400">+4.8R</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  Largest Loss
                </p>
                <p className="text-lg font-bold text-red-400">-2.4R</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Std Dev</p>
                <p className="text-lg font-bold">1.42R</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/20">
              <p className="text-xs text-muted-foreground mb-2">
                Distribution Quality
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: "72%" }}
                  />
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your winners are 2.1x larger than losers on average - excellent
                risk management.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
