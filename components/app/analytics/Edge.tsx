import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Target,
  TrendingUp,
  Gauge,
  Scale,
  Brain,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
} from "recharts";
import {
  edgeMetrics,
  executionMetricsData,
  getSQNRating,
  maeMfeScatterData,
  adherenceData,
  adherenceTrendData,
  sqnTrendData,
} from "@/lib/constants/analytics";

export default function EdgeMetricsTab() {
  const sqnRating = getSQNRating(edgeMetrics.sqn);

  return (
    <div className="space-y-6">
      {/* Section 1: Performance & Execution Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">
            Performance & Execution Metrics
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* R-Multiple Card */}
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Average R-Multiple
                </p>
                <p className="text-3xl font-bold text-emerald-400">
                  +{executionMetricsData.avgRMultiple}R
                </p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-400/10">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Median R</span>
                <span className="font-medium">
                  +{executionMetricsData.medianRMultiple}R
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Formula: (Exit - Entry) / (Entry - Stop Loss)
              </p>
            </div>
          </Card>

          {/* Efficiency Ratio Card */}
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Efficiency Ratio
                </p>
                <p className="text-3xl font-bold">
                  {(executionMetricsData.efficiencyRatio * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Gauge className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${executionMetricsData.efficiencyRatio * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Captures{" "}
                {(executionMetricsData.efficiencyRatio * 100).toFixed(0)}% of
                available move (MFE)
              </p>
            </div>
          </Card>

          {/* MAE Ratio Card */}
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Stop-Loss Tightness (MAE Ratio)
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {executionMetricsData.maeRatio}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-400/10">
                <Scale className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Edge Ratio (MFE/MAE)
                </span>
                <span className="font-medium text-emerald-400">
                  {executionMetricsData.edgeRatio}x
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Using only 32% of stop distance - potential to tighten stops
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* MAE vs MFE Scatter Plot */}
          <Card className="p-4 bg-card/50 border-border/50">
            <h3 className="text-lg font-semibold mb-1">MAE vs MFE Analysis</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Maximum Adverse vs Favorable Excursion per trade (R-multiples)
            </p>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.01 260)"
                  />
                  <XAxis
                    type="number"
                    dataKey="mae"
                    name="MAE"
                    stroke="oklch(0.65 0 0)"
                    fontSize={11}
                    label={{
                      value: "MAE (R)",
                      position: "bottom",
                      fill: "oklch(0.65 0 0)",
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="mfe"
                    name="MFE"
                    stroke="oklch(0.65 0 0)"
                    fontSize={11}
                    label={{
                      value: "MFE (R)",
                      angle: -90,
                      position: "left",
                      fill: "oklch(0.65 0 0)",
                      fontSize: 10,
                    }}
                  />
                  <ZAxis type="number" dataKey="pnl" range={[50, 200]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.008 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "MAE" || name === "MFE"
                        ? `${value}R`
                        : `${value >= 0 ? "+" : ""}${value}R`,
                      name,
                    ]}
                  />
                  <ReferenceLine y={1} stroke="#6b7280" strokeDasharray="3 3" />
                  <Scatter
                    name="Trades"
                    data={maeMfeScatterData}
                    fill="#3b82f6"
                  >
                    {maeMfeScatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-secondary/20">
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-400">Green</span> = profitable
                trades, <span className="text-red-400">Red</span> = losing
                trades. Ideal trades cluster in bottom-right (low MAE, high
                MFE).
              </p>
            </div>
          </Card>

          {/* Execution Quality Summary */}
          <Card className="p-4 bg-card/50 border-border/50">
            <h3 className="text-lg font-semibold mb-1">Execution Quality</h3>
            <p className="text-xs text-muted-foreground mb-4">
              How well you capture available profit
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Profit Capture Rate
                  </span>
                  <span className="text-lg font-bold text-emerald-400">
                    68%
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: "68%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You exit at 68% of MFE on average
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                  <p className="text-xs text-muted-foreground mb-1">
                    Best Capture
                  </p>
                  <p className="text-xl font-bold text-emerald-400">94%</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-muted-foreground mb-1">
                    Worst Capture
                  </p>
                  <p className="text-xl font-bold text-amber-500">23%</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Tip</p>
                <p className="text-sm">
                  Consider trailing stops when trades reach 1.5R to capture more
                  of the move.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Section 2: Behavioral & Discipline Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">
            Behavioral & Discipline Metrics
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Plan Adherence Score */}
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Plan Adherence Score (PAS)
                </p>
                <p className="text-3xl font-bold">{adherenceData.overall}%</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              {adherenceData.components.slice(0, 4).map((comp) => (
                <div key={comp.name} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-24">
                    {comp.name}
                  </span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        comp.score >= 80
                          ? "bg-emerald-400"
                          : comp.score >= 60
                          ? "bg-amber-500"
                          : "bg-red-400"
                      )}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{comp.score}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Mistake Tax */}
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Mistake Tax
                </p>
                <p className="text-3xl font-bold text-red-400">
                  ${adherenceData.mistakeTax.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-red-400/10">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Cost of not following your rules
              </p>
              {adherenceData.mistakeBreakdown.slice(0, 3).map((item) => (
                <div
                  key={item.mistake}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{item.mistake}</span>
                  <span className="text-red-400 font-medium">
                    -${item.cost}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Adherence Trend */}
          <Card className="p-4 bg-card/50 border-border/50">
            <h4 className="text-sm font-medium mb-3">Adherence Trend</h4>
            <div className="h-35">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adherenceTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.01 260)"
                  />
                  <XAxis
                    dataKey="week"
                    stroke="oklch(0.65 0 0)"
                    fontSize={10}
                  />
                  <YAxis
                    domain={[60, 85]}
                    stroke="oklch(0.65 0 0)"
                    fontSize={10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.008 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Section 3: Mathematical Edge Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Mathematical Edge Metrics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* SQN Card */}
          <Card className="p-4 bg-card/50 border-border/50 lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  System Quality Number (SQN)
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold">{edgeMetrics.sqn}</p>
                  <Badge className={cn("text-xs", sqnRating.color)}>
                    {sqnRating.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {sqnRating.description}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Poor</span>
                <span>Below Avg</span>
                <span>Good</span>
                <span>Very Good</span>
                <span>Excellent</span>
                <span>Superb</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden flex">
                <div className="bg-red-400 h-full" style={{ width: "25%" }} />
                <div
                  className="bg-amber-500 h-full"
                  style={{ width: "8.3%" }}
                />
                <div
                  className="bg-blue-400 h-full"
                  style={{ width: "16.7%" }}
                />
                <div
                  className="bg-blue-400 h-full"
                  style={{ width: "16.7%" }}
                />
                <div
                  className="bg-emerald-400 h-full"
                  style={{ width: "16.7%" }}
                />
                <div
                  className="bg-emerald-400 h-full"
                  style={{ width: "16.6%" }}
                />
              </div>
              <div className="relative h-0">
                <div
                  className="absolute -top-3 w-0 h-0 border-l-[6px] border-r-[6px] border-b-8 border-l-transparent border-r-transparent border-b-foreground"
                  style={{
                    left: `${Math.min((edgeMetrics.sqn / 6) * 100, 100)}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>
                Formula: (Average R / Standard Deviation of R) × √(Number of
                Trades)
              </p>
            </div>
          </Card>

          {/* Kelly Criterion */}
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Kelly Criterion
                </p>
                <p className="text-3xl font-bold">
                  {edgeMetrics.kellyPercent}%
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Recommended (Half Kelly)
                </p>
                <p className="text-xl font-bold text-amber-500">
                  {edgeMetrics.optimalKelly}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Risk {edgeMetrics.optimalKelly}% of capital per trade for
                optimal growth with reduced volatility.
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* SQN Trend */}
          <Card className="p-4 bg-card/50 border-border/50">
            <h3 className="text-lg font-semibold mb-1">SQN Progression</h3>
            <p className="text-xs text-muted-foreground mb-4">
              System quality over time
            </p>
            <div className="h-50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sqnTrendData}>
                  <defs>
                    <linearGradient
                      id="sqnGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.01 260)"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="oklch(0.65 0 0)"
                    fontSize={11}
                  />
                  <YAxis
                    domain={[1.5, 3.5]}
                    stroke="oklch(0.65 0 0)"
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.008 260)",
                      border: "1px solid oklch(0.28 0.01 260)",
                      borderRadius: "8px",
                    }}
                  />
                  <ReferenceLine
                    y={2.5}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label="Good"
                  />
                  <Area
                    type="monotone"
                    dataKey="sqn"
                    stroke="#3b82f6"
                    fill="url(#sqnGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Edge Summary */}
          <Card className="p-4 bg-card/50 border-border/50">
            <h3 className="text-lg font-semibold mb-1">Edge Summary</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Key edge indicators
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">
                    Profit Factor
                  </p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {edgeMetrics.profitFactor}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">
                    Payoff Ratio
                  </p>
                  <p className="text-2xl font-bold">
                    {edgeMetrics.payoffRatio}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-400/5 border border-emerald-400/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Your Win Rate</span>
                  <span className="font-bold text-emerald-400">
                    {edgeMetrics.actualWinRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Break-Even Win Rate
                  </span>
                  <span className="font-medium">
                    {edgeMetrics.breakEvenWinRate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${edgeMetrics.actualWinRate}%` }}
                  />
                  <div
                    className="absolute top-0 w-0.5 h-full bg-foreground"
                    style={{ left: `${edgeMetrics.breakEvenWinRate}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You&apos;re{" "}
                  {(
                    edgeMetrics.actualWinRate - edgeMetrics.breakEvenWinRate
                  ).toFixed(1)}
                  % above break-even - solid edge!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
