import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Octagon,
  AlertTriangle,
  Shield,
  TrendingUp,
  CheckCircle,
  XCircle,
  Target,
  Clock,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  stopOutAnalysisData,
  stopOutTrendData,
  stopDistributionData,
  maeVsStopData,
} from "@/lib/constants/analytics";

export default function StopOutsTab() {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 border-border/50">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Stop-Out Rate
              </p>
              <p className="text-3xl font-bold text-red-400">
                {stopOutAnalysisData.stopOutRate}%
              </p>
            </div>
            <div className="p-2 rounded-lg bg-red-400/10">
              <Octagon className="h-5 w-5 text-red-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {stopOutAnalysisData.totalStopOuts} of{" "}
            {stopOutAnalysisData.totalTrades} trades
          </p>
        </Card>

        <Card className="p-4 bg-card/50 border-border/50">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Premature Stops
              </p>
              <p className="text-3xl font-bold text-amber-500">
                {stopOutAnalysisData.prematureRate}%
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {stopOutAnalysisData.prematureStopOuts} trades would have won
          </p>
        </Card>

        <Card className="p-4 bg-card/50 border-border/50">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Total Stop-Out Cost
              </p>
              <p className="text-3xl font-bold text-red-400">
                $
                {Math.abs(
                  stopOutAnalysisData.totalStopOutLoss
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-red-400/10">
              <Shield className="h-5 w-5 text-red-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: ${Math.abs(stopOutAnalysisData.avgLossPerStopOut)}/stop
          </p>
        </Card>

        <Card className="p-4 bg-card/50 border-border/50">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Potential Lost Profit
              </p>
              <p className="text-3xl font-bold text-amber-500">
                ${stopOutAnalysisData.potentialLostProfit.toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            From premature stop-outs
          </p>
        </Card>
      </div>

      {/* Stop Placement Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Stop Placement Quality</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Analysis of your stop-loss placement
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 text-center">
              <p className="text-2xl font-bold text-red-400">
                {stopOutAnalysisData.tooTightStops}
              </p>
              <p className="text-xs text-muted-foreground">Too Tight</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {stopOutAnalysisData.appropriateStops}
              </p>
              <p className="text-xs text-muted-foreground">Appropriate</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-2xl font-bold text-amber-500">
                {stopOutAnalysisData.tooWideStops}
              </p>
              <p className="text-xs text-muted-foreground">Too Wide</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <span className="text-sm">Your Avg Stop Distance</span>
              <span className="font-bold">
                {stopOutAnalysisData.avgStopDistance}R
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
              <span className="text-sm">
                Optimal Stop Distance (based on MAE)
              </span>
              <span className="font-bold text-emerald-400">
                {stopOutAnalysisData.optimalStopDistance}R
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Consider widening stops by{" "}
              {(
                (stopOutAnalysisData.optimalStopDistance -
                  stopOutAnalysisData.avgStopDistance) *
                100
              ).toFixed(0)}
              % to reduce premature stop-outs.
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">MAE vs Stop Distance</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Comparing actual drawdown to stop placement
          </p>
          <div className="h-70">
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
                  dataKey="stopDistance"
                  name="Stop"
                  stroke="oklch(0.65 0 0)"
                  fontSize={11}
                  label={{
                    value: "Stop Distance (R)",
                    angle: -90,
                    position: "left",
                    fill: "oklch(0.65 0 0)",
                    fontSize: 10,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}R`,
                    name,
                  ]}
                />
                <ReferenceLine
                  segment={[
                    { x: 0, y: 0 },
                    { x: 2, y: 2 },
                  ]}
                  stroke="#6b7280"
                  strokeDasharray="3 3"
                />
                <Scatter name="Trades" data={maeVsStopData}>
                  {maeVsStopData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.result === "win" ? "#10b981" : "#ef4444"}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Trades below the diagonal line had stops triggered before reaching
            MAE - consider tighter placement.
          </p>
        </Card>
      </div>

      {/* Time-Based Stop-Out Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Stop-Outs by Day</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Which days have the highest stop-out rates
          </p>
          <div className="h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stopOutAnalysisData.stopOutsByDay}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.01 260)"
                />
                <XAxis dataKey="day" stroke="oklch(0.65 0 0)" fontSize={11} />
                <YAxis
                  stroke="oklch(0.65 0 0)"
                  fontSize={11}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Stop-Out Rate"]}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {stopOutAnalysisData.stopOutsByDay.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.rate > 30
                          ? "#ef4444"
                          : entry.rate > 25
                          ? "#f59e0b"
                          : "#10b981"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Stop-Outs by Hour</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Hourly stop-out distribution
          </p>
          <div className="h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stopOutAnalysisData.stopOutsByHour}>
                <defs>
                  <linearGradient
                    id="stopOutGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.01 260)"
                />
                <XAxis dataKey="hour" stroke="oklch(0.65 0 0)" fontSize={10} />
                <YAxis
                  stroke="oklch(0.65 0 0)"
                  fontSize={11}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Stop-Out Rate"]}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#ef4444"
                  fill="url(#stopOutGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Setup-Based Analysis */}
      <Card className="p-4 bg-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-1">Stop-Out Rate by Setup</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Which strategies have the highest stop-out rates
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stopOutAnalysisData.stopOutsBySetup.map((setup) => (
            <div
              key={setup.setup}
              className={cn(
                "p-4 rounded-lg border",
                setup.rate > 35
                  ? "bg-red-400/10 border-red-400/20"
                  : setup.rate > 25
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-emerald-400/10 border-emerald-400/20"
              )}
            >
              <h4 className="font-medium mb-2">{setup.setup}</h4>
              <p
                className={cn(
                  "text-2xl font-bold mb-1",
                  setup.rate > 35
                    ? "text-red-400"
                    : setup.rate > 25
                    ? "text-amber-500"
                    : "text-emerald-400"
                )}
              >
                {setup.rate}%
              </p>
              <p className="text-xs text-muted-foreground">
                {setup.stopOuts}/{setup.total} trades
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Avg loss: ${Math.abs(setup.avgLoss)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Stop-Out Trend & Consecutive Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Stop-Out Rate Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Monthly improvement in stop-out management
          </p>
          <div className="h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stopOutTrendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.01 260)"
                />
                <XAxis dataKey="month" stroke="oklch(0.65 0 0)" fontSize={11} />
                <YAxis
                  stroke="oklch(0.65 0 0)"
                  fontSize={11}
                  tickFormatter={(v) => `${v}%`}
                  domain={[20, 35]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                  }}
                />
                <ReferenceLine
                  y={25}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label="Target"
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Consecutive Stop-Outs</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Streak analysis and recovery patterns
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Max Consecutive Stops
                </p>
                <p className="text-2xl font-bold text-red-400">
                  {stopOutAnalysisData.maxConsecutiveStopOuts}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground mb-1">
                  Avg Consecutive Stops
                </p>
                <p className="text-2xl font-bold">
                  {stopOutAnalysisData.avgConsecutiveStopOuts}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-emerald-400/5 border border-emerald-400/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="font-medium">Recovery After 3+ Stops</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">
                {stopOutAnalysisData.recoveryAfterStreak}% Win Rate
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You recover well after losing streaks - good mental resilience
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Suspected Stop Hunts</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-amber-500">
                    {stopOutAnalysisData.suspectedStopHunts}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Trades stopped then reversed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">
                    {stopOutAnalysisData.stopHuntRecoveryRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Would have been winners
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Stop-Out Insights */}
      <Card className="p-4 bg-card/50 border-border/50">
        <h3 className="text-lg font-semibold mb-3">
          Stop-Out Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-red-400/5 border border-red-400/20">
            <h4 className="font-medium text-red-400 mb-2">Problem Areas</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <span>
                  Reversal setups have 45.8% stop-out rate - review entry
                  criteria
                </span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <span>
                  Monday & Thursday have highest stop-out rates (32-33%)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <span>
                  15:00-16:00 UTC shows elevated stop-out activity (34%)
                </span>
              </li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-emerald-400/5 border border-emerald-400/20">
            <h4 className="font-medium text-emerald-400 mb-2">
              What&apos;s Working
            </h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Range trades have lowest stop-out rate (17.1%)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Strong recovery after losing streaks (68% WR)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Stop-out rate trending down (32% → 24%)</span>
              </li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-medium text-primary mb-2">Recommendations</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Target className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Widen stops to 1.5R for reversal setups</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Avoid trading 15:00-16:00 UTC or use wider stops</span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Reduce position size on Mondays & Thursdays</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
