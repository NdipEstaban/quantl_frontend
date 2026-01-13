import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { emotionData } from "@/lib/constants/analytics";

export default function PsychologyTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Emotion Impact */}
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">
            Emotion Impact Analysis
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            How emotions affect your trading
          </p>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emotionData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.01 260)"
                />
                <XAxis type="number" stroke="oklch(0.65 0 0)" fontSize={11} />
                <YAxis
                  dataKey="emotion"
                  type="category"
                  stroke="oklch(0.65 0 0)"
                  fontSize={11}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="winRate"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                  name="Win Rate %"
                >
                  {emotionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.avgPnl >= 0 ? "#10b981" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Emotion Summary Cards */}
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Psychology Summary</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Key behavioral insights
          </p>
          <div className="space-y-3">
            {emotionData.map((item) => (
              <div
                key={item.emotion}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    className={cn(
                      "text-xs",
                      item.avgPnl >= 0
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    )}
                  >
                    {item.emotion}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {item.trades} trades
                  </span>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-semibold",
                      item.avgPnl >= 0 ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {item.avgPnl >= 0 ? "+" : ""}${item.avgPnl}/trade
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.winRate}% WR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Psychology Insights */}
      <Card className="p-4 bg-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-3">AI-Powered Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <h4 className="font-medium text-emerald-400 mb-2">
              What&apos;s Working
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Best performance when feeling &quot;Confident&quot;</li>
              <li>• 68% win rate with proper emotional state</li>
              <li>• Patient entries yield +$145/trade avg</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <h4 className="font-medium text-red-400 mb-2">Areas to Improve</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• FOMO trades losing -$85/trade average</li>
              <li>• Revenge trading has 22% win rate</li>
              <li>• Avoid trading when anxious</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-medium text-primary mb-2">Recommendations</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Take 5-min break after 2 consecutive losses</li>
              <li>• Review checklist before each trade</li>
              <li>• Set daily loss limit at -3%</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
