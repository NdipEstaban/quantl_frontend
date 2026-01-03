import { Card } from "@/components/ui/card";
import {
  COLORS,
  monthlyData,
  setupData,
  skillData,
  symbolData,
} from "@/lib/analyticsData";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define types for our data
interface MonthlyDataItem {
  month: string;
  pnl: number;
  winRate: number;
}

interface SetupDataItem {
  setup: string;
  winRate: number;
  pnl: number;
}

interface SymbolDataItem {
  name: string;
  value: number;
  pnl: number;
}

interface SkillDataItem {
  skill: string;
  value: number;
}

export default function PerformanceTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Performance */}
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Monthly Performance</h3>
          <p className="text-xs text-muted-foreground mb-4">
            P&L and win rate over time
          </p>
          <div className="h-70">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.01 260)"
                />
                <XAxis dataKey="month" stroke="oklch(0.65 0 0)" fontSize={11} />
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
                <Area
                  type="monotone"
                  dataKey="pnl"
                  stroke="#10b981"
                  fill="url(#pnlGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Setup Performance */}
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Performance by Setup</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Win rate and P&L by strategy
          </p>
          <div className="h-70">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={setupData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.28 0.01 260)"
                />
                <XAxis type="number" stroke="oklch(0.65 0 0)" fontSize={11} />
                <YAxis
                  dataKey="setup"
                  type="category"
                  stroke="oklch(0.65 0 0)"
                  fontSize={11}
                  width={80}
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
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Symbol Distribution */}
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Symbol Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Trade allocation by instrument
          </p>
          <div className="h-70 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={symbolData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {symbolData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string, entry: any) => {
                    // entry is the payload from the pie slice
                    const pnl = entry.payload?.pnl || 0;
                    return [`${value}% (P&L: $${pnl})`, name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Skill Radar */}
        <Card className="p-4 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-1">Trading Skills</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Self-assessment radar
          </p>
          <div className="h-70">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData}>
                <PolarGrid stroke="oklch(0.28 0.01 260)" />
                <PolarAngleAxis
                  dataKey="skill"
                  stroke="oklch(0.65 0 0)"
                  fontSize={11}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="oklch(0.65 0 0)"
                  fontSize={10}
                />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0.008 260)",
                    border: "1px solid oklch(0.28 0.01 260)",
                    borderRadius: "8px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
