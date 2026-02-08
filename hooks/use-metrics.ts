"use client";

// hooks/use-metrics.ts
import { toast } from "sonner";
import {
  metricsService,
  MetricsQueryParams,
  Vitals,
  EquityGrowthPoint,
  DailyTradeStats,
  AdvancedMetrics,
  DailyProfit,
  SessionMetrics,
  StreakAnalysis,
  TradeFrequency,
  HoldingTimeAnalysis,
  ProfitDistribution,
  ConsistencyMetrics,
  TradingSummary,
} from "@/lib/services/metrics-service";
import useSWR from "swr";

// Helper function to create cache key
function createMetricsCacheKey(
  endpoint: string,
  params:
    | MetricsQueryParams
    | { tradingAccountId: string; year: number; month: number },
) {
  return `${endpoint}-${JSON.stringify(params)}`;
}

/**
 * Hook to fetch trading account vitals
 */
export function useVitals(params: MetricsQueryParams, enabled = true) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<Vitals>
  >(
    enabled ? createMetricsCacheKey("/metrics/vitals", params) : null,
    () => metricsService.getVitals(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch vitals");
        console.error("Fetch vitals error:", error);
      },
    },
  );

  return {
    vitals: data?.data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch equity growth
 */
export function useEquityGrowth(params: MetricsQueryParams, enabled = true) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<EquityGrowthPoint[]>
  >(
    enabled ? createMetricsCacheKey("/metrics/equity-growth", params) : null,
    () => metricsService.getEquityGrowth(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch equity growth");
        console.error("Fetch equity growth error:", error);
      },
    },
  );

  return {
    equityGrowth: data?.data ?? [],
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch daily trades for a specific month
 */
export function useDailyTradesForMonth(
  tradingAccountId: string,
  year: number,
  month: number,
  enabled = true,
) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<DailyTradeStats[]>
  >(
    enabled
      ? createMetricsCacheKey("/metrics/daily-trades", {
          tradingAccountId,
          year,
          month,
        })
      : null,
    () => metricsService.getDailyTradesForMonth(tradingAccountId, year, month),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch daily trades");
        console.error("Fetch daily trades error:", error);
      },
    },
  );

  return {
    dailyTrades: data?.data ?? [],
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch advanced metrics
 */
export function useAdvancedMetrics(params: MetricsQueryParams, enabled = true) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<AdvancedMetrics>
  >(
    enabled ? createMetricsCacheKey("/metrics/advanced-metrics", params) : null,
    () => metricsService.getAdvancedMetrics(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch advanced metrics");
        console.error("Fetch advanced metrics error:", error);
      },
    },
  );

  return {
    advancedMetrics: data?.data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch profit by day of week
 */
export function useProfitByDayOfWeek(
  params: MetricsQueryParams,
  enabled = true,
) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<DailyProfit[]>
  >(
    enabled ? createMetricsCacheKey("/metrics/profit-by-day", params) : null,
    () => metricsService.getProfitByDayOfWeek(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch profit by day");
        console.error("Fetch profit by day error:", error);
      },
    },
  );

  return {
    profitByDay: data?.data ?? [],
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch session metrics
 */
export function useSessionMetrics(params: MetricsQueryParams, enabled = true) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<SessionMetrics[]>
  >(
    enabled ? createMetricsCacheKey("/metrics/session-metrics", params) : null,
    () => metricsService.getSessionMetrics(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch session metrics");
        console.error("Fetch session metrics error:", error);
      },
    },
  );

  return {
    sessionMetrics: data?.data ?? [],
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch streak analysis
 */
export function useStreakAnalysis(params: MetricsQueryParams, enabled = true) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<StreakAnalysis>
  >(
    enabled ? createMetricsCacheKey("/metrics/streak-analysis", params) : null,
    () => metricsService.getStreakAnalysis(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch streak analysis");
        console.error("Fetch streak analysis error:", error);
      },
    },
  );

  return {
    streakAnalysis: data?.data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch trade frequency
 */
export function useTradeFrequency(params: MetricsQueryParams, enabled = true) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<TradeFrequency>
  >(
    enabled ? createMetricsCacheKey("/metrics/trade-frequency", params) : null,
    () => metricsService.getTradeFrequency(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch trade frequency");
        console.error("Fetch trade frequency error:", error);
      },
    },
  );

  return {
    tradeFrequency: data?.data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch holding time analysis
 */
export function useHoldingTimeAnalysis(
  params: MetricsQueryParams,
  enabled = true,
) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<HoldingTimeAnalysis>
  >(
    enabled ? createMetricsCacheKey("/metrics/holding-time", params) : null,
    () => metricsService.getHoldingTimeAnalysis(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch holding time analysis");
        console.error("Fetch holding time analysis error:", error);
      },
    },
  );

  return {
    holdingTime: data?.data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch profit distribution
 */
export function useProfitDistribution(
  params: MetricsQueryParams,
  enabled = true,
) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<ProfitDistribution>
  >(
    enabled
      ? createMetricsCacheKey("/metrics/profit-distribution", params)
      : null,
    () => metricsService.getProfitDistribution(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch profit distribution");
        console.error("Fetch profit distribution error:", error);
      },
    },
  );

  return {
    profitDistribution: data?.data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch consistency metrics
 */
export function useConsistencyMetrics(
  params: MetricsQueryParams,
  enabled = true,
) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<ConsistencyMetrics>
  >(
    enabled
      ? createMetricsCacheKey("/metrics/consistency-metrics", params)
      : null,
    () => metricsService.getConsistencyMetrics(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        toast.error("Failed to fetch consistency metrics");
        console.error("Fetch consistency metrics error:", error);
      },
    },
  );

  return {
    consistencyMetrics: data?.data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Hook to fetch comprehensive trading summary
 * This is the most efficient way to get all metrics at once
 */
export function useTradingSummary(params: MetricsQueryParams, enabled = true) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<TradingSummary>
  >(
    enabled ? createMetricsCacheKey("/metrics/summary", params) : null,
    () => metricsService.getTradingSummary(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Cache for 1 minute
      onError: (error) => {
        toast.error("Failed to fetch trading summary");
        console.error("Fetch trading summary error:", error);
      },
    },
  );

  return {
    summary: data?.data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate,
    error,
  };
}

/**
 * Main hook that provides access to all metrics
 * Use this when you need multiple metrics on a single page
 */
export function useMetrics(params: MetricsQueryParams, enabled = true) {
  const vitals = useVitals(params, enabled);
  const equityGrowth = useEquityGrowth(params, enabled);
  const advancedMetrics = useAdvancedMetrics(params, enabled);
  const profitByDay = useProfitByDayOfWeek(params, enabled);
  const sessionMetrics = useSessionMetrics(params, enabled);
  const streakAnalysis = useStreakAnalysis(params, enabled);
  const tradeFrequency = useTradeFrequency(params, enabled);
  const holdingTime = useHoldingTimeAnalysis(params, enabled);
  const profitDistribution = useProfitDistribution(params, enabled);
  const consistencyMetrics = useConsistencyMetrics(params, enabled);

  const isLoading =
    vitals.isLoading ||
    equityGrowth.isLoading ||
    advancedMetrics.isLoading ||
    profitByDay.isLoading ||
    sessionMetrics.isLoading ||
    streakAnalysis.isLoading ||
    tradeFrequency.isLoading ||
    holdingTime.isLoading ||
    profitDistribution.isLoading ||
    consistencyMetrics.isLoading;

  const isError =
    vitals.isError ||
    equityGrowth.isError ||
    advancedMetrics.isError ||
    profitByDay.isError ||
    sessionMetrics.isError ||
    streakAnalysis.isError ||
    tradeFrequency.isError ||
    holdingTime.isError ||
    profitDistribution.isError ||
    consistencyMetrics.isError;

  return {
    // Data
    vitals: vitals.vitals,
    equityGrowth: equityGrowth.equityGrowth,
    advancedMetrics: advancedMetrics.advancedMetrics,
    profitByDay: profitByDay.profitByDay,
    sessionMetrics: sessionMetrics.sessionMetrics,
    streakAnalysis: streakAnalysis.streakAnalysis,
    tradeFrequency: tradeFrequency.tradeFrequency,
    holdingTime: holdingTime.holdingTime,
    profitDistribution: profitDistribution.profitDistribution,
    consistencyMetrics: consistencyMetrics.consistencyMetrics,

    // Loading states
    isLoading,
    isValidating:
      vitals.isValidating ||
      equityGrowth.isValidating ||
      advancedMetrics.isValidating ||
      profitByDay.isValidating ||
      sessionMetrics.isValidating ||
      streakAnalysis.isValidating ||
      tradeFrequency.isValidating ||
      holdingTime.isValidating ||
      profitDistribution.isValidating ||
      consistencyMetrics.isValidating,

    // Error states
    isError,

    // Mutate functions for manual revalidation
    mutate: () => {
      vitals.mutate();
      equityGrowth.mutate();
      advancedMetrics.mutate();
      profitByDay.mutate();
      sessionMetrics.mutate();
      streakAnalysis.mutate();
      tradeFrequency.mutate();
      holdingTime.mutate();
      profitDistribution.mutate();
      consistencyMetrics.mutate();
    },
  };
}
