// ==================== PERFORMANCE DATA ====================
export const setupData = [
  { setup: "Breakout", winRate: 62, pnl: 3200 },
  { setup: "Pullback", winRate: 71, pnl: 4100 },
  { setup: "Reversal", winRate: 48, pnl: 890 },
  { setup: "Trend", winRate: 68, pnl: 2900 },
  { setup: "Range", winRate: 55, pnl: 1200 },
];

export const symbolData = [
  { name: "EURUSD", value: 35, pnl: 4200 },
  { name: "GBPUSD", value: 25, pnl: 2800 },
  { name: "USDJPY", value: 20, pnl: 1900 },
  { name: "GBPJPY", value: 12, pnl: 1500 },
  { name: "Other", value: 8, pnl: 890 },
];

export const monthlyData = [
  { month: "Jul", pnl: 1250, winRate: 58 },
  { month: "Aug", pnl: 890, winRate: 52 },
  { month: "Sep", pnl: 2100, winRate: 64 },
  { month: "Oct", pnl: 1680, winRate: 61 },
  { month: "Nov", pnl: 2450, winRate: 68 },
  { month: "Dec", pnl: 1920, winRate: 59 },
];

export const skillData = [
  { skill: "Entry", value: 78 },
  { skill: "Exit", value: 65 },
  { skill: "Risk Mgmt", value: 82 },
  { skill: "Patience", value: 58 },
  { skill: "Discipline", value: 72 },
  { skill: "Analysis", value: 85 },
];

export const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// ==================== TIME ANALYSIS DATA ====================
export const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  pnl: Math.floor(Math.random() * 600 - 200),
  trades: Math.floor(Math.random() * 15),
}));

export const sessionData = [
  {
    session: "Asian",
    time: "00:00 - 09:00 UTC",
    winRate: 52,
    trades: 34,
    pnl: 840,
    best: "USDJPY",
  },
  {
    session: "London",
    time: "08:00 - 17:00 UTC",
    winRate: 64,
    trades: 89,
    pnl: 4250,
    best: "EURUSD",
  },
  {
    session: "New York",
    time: "13:00 - 22:00 UTC",
    winRate: 58,
    trades: 124,
    pnl: 3180,
    best: "GBPJPY",
  },
];

// ==================== PSYCHOLOGY DATA ====================
export const emotionData = [
  { emotion: "Confident", winRate: 72, avgPnl: 185, trades: 45 },
  { emotion: "Calm", winRate: 68, avgPnl: 145, trades: 62 },
  { emotion: "Neutral", winRate: 58, avgPnl: 65, trades: 38 },
  { emotion: "Anxious", winRate: 42, avgPnl: -45, trades: 28 },
  { emotion: "FOMO", winRate: 35, avgPnl: -85, trades: 22 },
  { emotion: "Revenge", winRate: 22, avgPnl: -165, trades: 12 },
];

// ==================== DISTRIBUTION DATA ====================
export const rMultipleData = [
  { r: "-3R", count: 2 },
  { r: "-2R", count: 8 },
  { r: "-1R", count: 28 },
  { r: "B/E", count: 12 },
  { r: "+1R", count: 35 },
  { r: "+2R", count: 42 },
  { r: "+3R", count: 18 },
  { r: "+4R", count: 8 },
];

// ==================== EDGE METRICS DATA ====================
export const executionMetricsData = {
  avgRMultiple: 1.42,
  medianRMultiple: 1.15,
  efficiencyRatio: 0.68, // 68% of MFE captured
  maeRatio: 0.32, // Uses 32% of stop distance on avg
  edgeRatio: 2.13, // MFE/MAE
};

export const maeMfeScatterData = [
  { mae: 0.3, mfe: 2.1, pnl: 1.8, symbol: "EURUSD" },
  { mae: 0.5, mfe: 1.8, pnl: 1.3, symbol: "GBPUSD" },
  { mae: 0.8, mfe: 0.6, pnl: -0.8, symbol: "USDJPY" },
  { mae: 0.2, mfe: 3.2, pnl: 2.8, symbol: "GBPJPY" },
  { mae: 1.0, mfe: 0.4, pnl: -1.0, symbol: "AUDUSD" },
  { mae: 0.4, mfe: 2.5, pnl: 2.1, symbol: "EURUSD" },
  { mae: 0.6, mfe: 1.5, pnl: 0.9, symbol: "NZDUSD" },
  { mae: 0.9, mfe: 0.8, pnl: -0.9, symbol: "USDCAD" },
  { mae: 0.3, mfe: 4.1, pnl: 3.8, symbol: "GBPJPY" },
  { mae: 0.7, mfe: 1.2, pnl: 0.5, symbol: "EURJPY" },
];

export const adherenceData = {
  overall: 74,
  components: [
    { name: "Valid Setup", score: 82 },
    { name: "Correct Entry", score: 76 },
    { name: "Stop Placed", score: 91 },
    { name: "Target Set", score: 68 },
    { name: "Position Size", score: 85 },
    { name: "Risk Limit", score: 78 },
  ],
  mistakeTax: 2840,
  mistakeBreakdown: [
    { mistake: "Early Entry", cost: 890, count: 12 },
    { mistake: "No Stop Loss", cost: 1240, count: 6 },
    { mistake: "Oversized Position", cost: 540, count: 8 },
    { mistake: "Revenge Trade", cost: 170, count: 3 },
  ],
};

export const adherenceTrendData = [
  { week: "W1", score: 68, trades: 24 },
  { week: "W2", score: 71, trades: 28 },
  { week: "W3", score: 74, trades: 22 },
  { week: "W4", score: 76, trades: 31 },
  { week: "W5", score: 73, trades: 26 },
  { week: "W6", score: 78, trades: 29 },
];

export const edgeMetrics = {
  sqn: 2.84, // System Quality Number
  expectancy: 0.42, // Expected R per trade
  kellyPercent: 18.5, // Optimal position size %
  optimalKelly: 9.25,
  profitFactor: 2.14,
  payoffRatio: 1.92, // Avg win / Avg loss
  breakEvenWinRate: 34.2, // % needed to break even
  actualWinRate: 58.5,
};

export const sqnTrendData = [
  { month: "Jul", sqn: 2.1 },
  { month: "Aug", sqn: 2.3 },
  { month: "Sep", sqn: 2.6 },
  { month: "Oct", sqn: 2.5 },
  { month: "Nov", sqn: 2.9 },
  { month: "Dec", sqn: 2.84 },
];

export function getSQNRating(sqn: number): {
  label: string;
  color: string;
  description: string;
} {
  if (sqn >= 5)
    return {
      label: "Superb",
      color: "text-success",
      description: "Holy Grail territory",
    };
  if (sqn >= 3)
    return {
      label: "Excellent",
      color: "text-success",
      description: "Highly profitable system",
    };
  if (sqn >= 2.5)
    return {
      label: "Very Good",
      color: "text-blue-400",
      description: "Strong edge present",
    };
  if (sqn >= 2)
    return {
      label: "Good",
      color: "text-blue-400",
      description: "Tradeable system",
    };
  if (sqn >= 1.5)
    return {
      label: "Below Average",
      color: "text-amber-500",
      description: "Needs improvement",
    };
  return {
    label: "Poor",
    color: "text-destructive",
    description: "Not ready for live trading",
  };
}

// ==================== STOP-OUTS DATA ====================
export const stopOutAnalysisData = {
  // Overall metrics
  totalTrades: 247,
  totalStopOuts: 68,
  stopOutRate: 27.5,
  avgLossPerStopOut: -312,
  totalStopOutLoss: -21216,

  // Premature stop-out analysis
  prematureStopOuts: 24,
  prematureRate: 35.3,
  avgRecoveryAfterPremature: 1.8, // R-multiple price moved after stop
  potentialLostProfit: 8640,

  // Stop placement quality
  avgStopDistance: 1.2, // R
  optimalStopDistance: 1.5, // R (based on MAE analysis)
  tooTightStops: 31,
  appropriateStops: 28,
  tooWideStops: 9,

  // Time-based analysis
  stopOutsBySession: [
    { session: "Asian", stopOuts: 12, total: 45, rate: 26.7 },
    { session: "London", stopOuts: 28, total: 98, rate: 28.6 },
    { session: "New York", stopOuts: 28, total: 104, rate: 26.9 },
  ],
  stopOutsByDay: [
    { day: "Monday", stopOuts: 14, total: 42, rate: 33.3 },
    { day: "Tuesday", stopOuts: 11, total: 48, rate: 22.9 },
    { day: "Wednesday", stopOuts: 12, total: 52, rate: 23.1 },
    { day: "Thursday", stopOuts: 18, total: 56, rate: 32.1 },
    { day: "Friday", stopOuts: 13, total: 49, rate: 26.5 },
  ],
  stopOutsByHour: [
    { hour: "08:00", stopOuts: 4, total: 18, rate: 22.2 },
    { hour: "09:00", stopOuts: 8, total: 24, rate: 33.3 },
    { hour: "10:00", stopOuts: 6, total: 28, rate: 21.4 },
    { hour: "11:00", stopOuts: 5, total: 22, rate: 22.7 },
    { hour: "12:00", stopOuts: 3, total: 15, rate: 20.0 },
    { hour: "13:00", stopOuts: 7, total: 26, rate: 26.9 },
    { hour: "14:00", stopOuts: 9, total: 28, rate: 32.1 },
    { hour: "15:00", stopOuts: 11, total: 32, rate: 34.4 },
    { hour: "16:00", stopOuts: 8, total: 26, rate: 30.8 },
    { hour: "17:00", stopOuts: 7, total: 28, rate: 25.0 },
  ],

  // Setup-based analysis
  stopOutsBySetup: [
    { setup: "Breakout", stopOuts: 18, total: 52, rate: 34.6, avgLoss: -345 },
    { setup: "Pullback", stopOuts: 12, total: 58, rate: 20.7, avgLoss: -278 },
    { setup: "Reversal", stopOuts: 22, total: 48, rate: 45.8, avgLoss: -398 },
    {
      setup: "Trend Cont.",
      stopOuts: 10,
      total: 54,
      rate: 18.5,
      avgLoss: -245,
    },
    { setup: "Range", stopOuts: 6, total: 35, rate: 17.1, avgLoss: -212 },
  ],

  // Consecutive analysis
  maxConsecutiveStopOuts: 5,
  avgConsecutiveStopOuts: 1.8,
  recoveryAfterStreak: 68, // % win rate after 3+ consecutive stops

  // Stop hunt analysis
  suspectedStopHunts: 15,
  stopHuntRecoveryRate: 73, // % that would have been winners
  avgStopHuntOvershoot: 0.3, // R beyond stop level
};

export const stopOutTrendData = [
  { month: "Jul", rate: 32, count: 12, avgLoss: -340 },
  { month: "Aug", rate: 29, count: 10, avgLoss: -315 },
  { month: "Sep", rate: 26, count: 9, avgLoss: -298 },
  { month: "Oct", rate: 28, count: 11, avgLoss: -320 },
  { month: "Nov", rate: 25, count: 14, avgLoss: -285 },
  { month: "Dec", rate: 24, count: 12, avgLoss: -275 },
];

export const stopDistributionData = [
  { range: "0-0.5R", count: 8, cumulative: 12 },
  { range: "0.5-1R", count: 23, cumulative: 46 },
  { range: "1-1.5R", count: 28, cumulative: 87 },
  { range: "1.5-2R", count: 7, cumulative: 97 },
  { range: ">2R", count: 2, cumulative: 100 },
];

export const maeVsStopData = [
  { mae: 0.2, stopDistance: 1.0, result: "win", symbol: "EURUSD" },
  { mae: 0.5, stopDistance: 1.0, result: "win", symbol: "GBPUSD" },
  { mae: 1.0, stopDistance: 1.0, result: "stop", symbol: "USDJPY" },
  { mae: 0.3, stopDistance: 1.2, result: "win", symbol: "AUDUSD" },
  { mae: 0.8, stopDistance: 1.5, result: "win", symbol: "EURUSD" },
  { mae: 1.5, stopDistance: 1.5, result: "stop", symbol: "GBPJPY" },
  { mae: 0.4, stopDistance: 0.8, result: "stop", symbol: "EURJPY" },
  { mae: 0.6, stopDistance: 1.2, result: "win", symbol: "USDCAD" },
  { mae: 1.2, stopDistance: 1.0, result: "stop", symbol: "NZDUSD" },
  { mae: 0.9, stopDistance: 1.3, result: "win", symbol: "EURGBP" },
  { mae: 0.7, stopDistance: 1.1, result: "win", symbol: "GBPUSD" },
  { mae: 1.1, stopDistance: 1.0, result: "stop", symbol: "EURUSD" },
  { mae: 0.5, stopDistance: 1.4, result: "win", symbol: "USDJPY" },
  { mae: 1.4, stopDistance: 1.2, result: "stop", symbol: "AUDUSD" },
  { mae: 0.3, stopDistance: 0.9, result: "win", symbol: "GBPJPY" },
];

// ==================== UTILITY DATA ====================
export const insightData = {
  whatsWorking: [
    'Best performance when feeling "Confident"',
    "68% win rate with proper emotional state",
    "Patient entries yield +$145/trade avg",
  ],
  areasToImprove: [
    "FOMO trades losing -$85/trade average",
    "Revenge trading has 22% win rate",
    "Avoid trading when anxious",
  ],
  recommendations: [
    "Take 5-min break after 2 consecutive losses",
    "Review checklist before each trade",
    "Set daily loss limit at -3%",
  ],
};

export const stopoutInsights = {
  problemAreas: [
    "Reversal setups have 45.8% stop-out rate - review entry criteria",
    "Monday & Thursday have highest stop-out rates (32-33%)",
    "15:00-16:00 UTC shows elevated stop-out activity (34%)",
  ],
  whatsWorking: [
    "Range trades have lowest stop-out rate (17.1%)",
    "Strong recovery after losing streaks (68% WR)",
    "Stop-out rate trending down (32% → 24%)",
  ],
  stopoutRecommendations: [
    "Widen stops to 1.5R for reversal setups",
    "Avoid trading 15:00-16:00 UTC or use wider stops",
    "Reduce position size on Mondays & Thursdays",
  ],
};
