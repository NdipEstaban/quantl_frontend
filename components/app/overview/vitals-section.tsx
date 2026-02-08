"use client";

import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Percent,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVitals } from "@/hooks/use-metrics";
import { Vitals } from "@/lib/services/metrics-service";

interface VitalsProps {
  current: Vitals;
  previous: Vitals;
}

export function VitalsSection({ current, previous }: VitalsProps) {
  console.log("current vitals", current);

  const vitalsData = [
    {
      label: "Win Rate",
      value: `${current.winRate}%`,
      change: `${current.winRate - previous.winRate}%`,
      isPositive: true,
      icon: Target,
      description: "vs last period",
    },
    {
      label: "Max Drawdown duration",
      value: `${current.maxDrawdownDurationInDays} days`,
      change: `${current.maxDrawdownDurationInDays - previous.maxDrawdownDurationInDays}`,
      isPositive: true,
      icon: BarChart3,
      description: "How long was account in drawdown",
    },
    {
      label: "Risk/Reward",
      value: `${current.averageRiskToReward}`,
      change: `${current.averageRiskToReward - previous.averageRiskToReward}`,
      isPositive: true,
      icon: Percent,
      description: "Avg RRR",
    },
    {
      label: "Net P&L",
      value: `${current.netProfit}`,
      change: `+${current.netProfit - previous.netProfit}`,
      isPositive: true,
      icon: DollarSign,
      description: "This period",
    },
    {
      label: "Max Drawdown",
      value: `${current.percentageDrawdown}`,
      change: `${current.percentageDrawdown - previous.percentageDrawdown}`,
      isPositive: true,
      icon: TrendingDown,
      description: "Peak to trough",
    },
    {
      label: "Avg Win/Loss",
      value: `${current.averageWin} / ${current.averageLoss}`,
      change: `${current.averageWin - previous.averageWin} / ${current.averageLoss - previous.averageLoss}`,
      isPositive: true,
      icon: TrendingUp,
      description: "Ratio",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">The Vitals</h2>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          Level 1 Metrics
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {vitalsData.map((metric, index) => (
          <Card
            key={metric.label}
            className={cn(
              "relative overflow-hidden p-4 bg-card/50 border-border/50",
            )}
          >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-2">
              <metric.icon className="w-4 h-4 text-muted-foreground" />
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  metric.isPositive
                    ? "text-success bg-success/10"
                    : "text-destructive bg-destructive/10",
                )}
              >
                {metric.change}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {metric.value}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                {metric.label}
              </p>
              <p className="text-[10px] text-muted-foreground/60">
                {metric.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
