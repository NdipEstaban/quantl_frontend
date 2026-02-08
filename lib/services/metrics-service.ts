// lib/services/metrics-service.ts
import { apiClient } from "@/lib/api-client";

// Type definitions for metrics responses
export interface Vitals {
  winRate: number;
  profitFactor: number;
  averageRiskToReward: number;
  netProfit: number;
  percentageDrawdown: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdownDurationInDays:number;
}

export interface EquityGrowthPoint {
  period: string;
  equity: number;
}

export interface DailyTradeStats {
  date: string;
  tradeCount: number;
  profitLoss: number;
}

export interface AdvancedMetrics {
  expectancy: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
}

export interface DailyProfit {
  day: string;
  profit: number;
}

export interface SessionMetrics {
  session: string;
  trades: number;
  winRate: number;
  percentageOfTotal: number;
}

export interface StreakAnalysis {
  maxWinningStreak: number;
  maxLosingStreak: number;
  currentStreak: number;
  currentStreakType: "winning" | "losing" | "none";
  averageWinningStreak: number;
  averageLosingStreak: number;
}

export interface TradeFrequency {
  averageTradesPerDay: number;
  totalTradingDays: number;
  totalTrades: number;
  busiestDay: string;
  busiestDayTrades: number;
  slowestDay: string;
  slowestDayTrades: number;
}

export interface HoldingTimeAnalysis {
  averageHoldingTimeMinutes: number;
  shortestTradeMinutes: number;
  longestTradeMinutes: number;
  averageWinningTradeMinutes: number;
  averageLosingTradeMinutes: number;
}

export interface ProfitDistribution {
  largestWin: number;
  largestLoss: number;
  medianWin: number;
  medianLoss: number;
  winningTradesCount: number;
  losingTradesCount: number;
  breakEvenTradesCount: number;
}

export interface ConsistencyMetrics {
  profitableMonths: number;
  totalMonths: number;
  consistencyScore: number;
  bestMonth: {
    month: string;
    profit: number;
  };
  worstMonth: {
    month: string;
    profit: number;
  };
}

export interface TradingSummary {
  vitals: Record<string, Vitals>;
  equityGrowth: EquityGrowthPoint[];
  advancedMetrics: AdvancedMetrics;
  profitByDay: DailyProfit[];
  sessionMetrics: SessionMetrics[];
  streakAnalysis: StreakAnalysis;
  tradeFrequency: TradeFrequency;
  holdingTime: HoldingTimeAnalysis;
  profitDistribution: ProfitDistribution;
  consistencyMetrics: ConsistencyMetrics;
  monthlyComparison: {
    currentMonth: DailyTradeStats[];
    previousMonth: DailyTradeStats[];
  };
  dateRange: {
    start: string | null;
    end: string | null;
  };
  timestamp: string;
}

export interface MetricsQueryParams {
  tradingAccountId: string;
  startDate?: string;
  endDate?: string;
}

const METRICS_BASE_URL = "/metrics";

export const metricsService = {
  /**
   * Get trading account vitals
   */
  async getVitals(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<Vitals>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<Vitals>>(
      `${METRICS_BASE_URL}/vitals?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get equity growth over time
   */
  async getEquityGrowth(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<EquityGrowthPoint[]>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<EquityGrowthPoint[]>>(
      `${METRICS_BASE_URL}/equity-growth?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get daily trades for a specific month
   */
  async getDailyTradesForMonth(
    tradingAccountId: string,
    year: number,
    month: number,
  ): Promise<BackendResponse<DailyTradeStats[]>> {
    const queryParams = new URLSearchParams({
      tradingAccountId,
    });

    const response = await apiClient.get<BackendResponse<DailyTradeStats[]>>(
      `${METRICS_BASE_URL}/daily-trades/${year}/${month}?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get advanced trading metrics
   */
  async getAdvancedMetrics(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<AdvancedMetrics>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<AdvancedMetrics>>(
      `${METRICS_BASE_URL}/advanced-metrics?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get profit by day of week
   */
  async getProfitByDayOfWeek(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<DailyProfit[]>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<DailyProfit[]>>(
      `${METRICS_BASE_URL}/profit-by-day?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get trading session metrics
   */
  async getSessionMetrics(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<SessionMetrics[]>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<SessionMetrics[]>>(
      `${METRICS_BASE_URL}/session-metrics?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get streak analysis
   */
  async getStreakAnalysis(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<StreakAnalysis>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<StreakAnalysis>>(
      `${METRICS_BASE_URL}/streak-analysis?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get trade frequency analysis
   */
  async getTradeFrequency(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<TradeFrequency>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<TradeFrequency>>(
      `${METRICS_BASE_URL}/trade-frequency?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get holding time analysis
   */
  async getHoldingTimeAnalysis(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<HoldingTimeAnalysis>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<HoldingTimeAnalysis>>(
      `${METRICS_BASE_URL}/holding-time?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get profit distribution analysis
   */
  async getProfitDistribution(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<ProfitDistribution>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<ProfitDistribution>>(
      `${METRICS_BASE_URL}/profit-distribution?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get consistency metrics
   */
  async getConsistencyMetrics(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<ConsistencyMetrics>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<ConsistencyMetrics>>(
      `${METRICS_BASE_URL}/consistency-metrics?${queryParams}`,
    );
    return response.data;
  },

  /**
   * Get comprehensive trading summary
   */
  async getTradingSummary(
    params: MetricsQueryParams,
  ): Promise<BackendResponse<TradingSummary>> {
    const queryParams = new URLSearchParams({
      tradingAccountId: params.tradingAccountId,
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
    });

    const response = await apiClient.get<BackendResponse<TradingSummary>>(
      `${METRICS_BASE_URL}/summary?${queryParams}`,
    );
    return response.data;
  },
};
