"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Shield,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const advancedMetrics = [
  {
    icon: Brain,
    label: "Strategy Consistency",
    value: "87%",
    status: "excellent",
    insight: "Following rules well",
  },
  {
    icon: Shield,
    label: "Risk Score",
    value: "B+",
    status: "good",
    insight: "Within parameters",
  },
  {
    icon: Zap,
    label: "Trade Frequency",
    value: "8.2/day",
    status: "optimal",
    insight: "Balanced activity",
  },
  {
    icon: TrendingUp,
    label: "Edge Utilization",
    value: "72%",
    status: "good",
    insight: "Room to improve",
  },
];

const alerts = [
  { type: "warning", message: "Overtrading detected on Fridays" },
  { type: "success", message: "London session performing 15% above average" },
  { type: "warning", message: "Position sizing inconsistent this week" },
];

export function AdvancedSection() {
  return (
    <Card className="p-4 bg-card/50 border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Advanced Analytics</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Pro Insights
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {advancedMetrics.map((metric) => (
          <div
            key={metric.label}
            className="p-3 rounded-lg bg-secondary/30 border border-border/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                {metric.label}
              </span>
            </div>
            <p className="text-xl font-bold mb-1">{metric.value}</p>
            <Badge
              variant="secondary"
              className={cn(
                "text-[10px]",
                metric.status === "excellent" && "bg-success/10 text-success",
                metric.status === "good" && "bg-primary/10 text-primary",
                metric.status === "optimal" && "bg-warning/10 text-warning"
              )}
            >
              {metric.insight}
            </Badge>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Insights & Alerts</p>
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-2 p-2 rounded-md text-xs",
                alert.type === "warning" &&
                  "bg-warning/5 border border-warning/20",
                alert.type === "success" &&
                  "bg-success/5 border border-success/20"
              )}
            >
              {alert.type === "warning" ? (
                <AlertTriangle className="w-3 h-3 text-warning mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 className="w-3 h-3 text-success mt-0.5 shrink-0" />
              )}
              <span className="text-muted-foreground">{alert.message}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default AdvancedSection;