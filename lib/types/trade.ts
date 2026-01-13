export default interface TradeData {
  /* =====================
     Identity & Linking
     ===================== */
  id: number; // frontend/internal ID
  ticket: number; // broker trade ticket
  orderTicket?: number; // MT order ticket
  magicNumber?: number; // EA identifier (0 = manual)

  /* =====================
     Instrument & Direction
     ===================== */
  symbol: string;
  direction: "long" | "short";

  /* =====================
     Execution Details
     ===================== */
  entry: number; // average entry price
  exit: number; // average exit price
  positionSize: number; // lots
  volumeInitial?: number;
  volumeCurrent?: number;

  stopLoss: number;
  takeProfit: number;

  /* =====================
     Time
     ===================== */
  openTime: string;
  closeTime?: string;

  /* =====================
     Performance
     ===================== */
  pnl: number; // net PnL (after costs)
  pnlPercent: number;
  rr: string;

  /* =====================
     Costs (BROKER-SOURCE)
     ===================== */
  commission?: number;
  swap?: number;

  /* =====================
     Trade State & Lifecycle
     ===================== */
  tradeType?: number; // MT type (buy/sell/etc)
  tradeState?: number; // MT order state
  isPartial?: boolean;
  isOpen?: boolean;

  /* =====================
     Strategy & Context
     ===================== */
  setup: string;
  tags: string[];
  comment?: string; // broker comment

  /* =====================
     Psychology & Review
     ===================== */
  emotion: string;
  rating: number;
  notes: string;
  screenshots: string[];

  /* =====================
     Rule Tracking
     ===================== */
  hitStopLoss: boolean;
  followedPlan: boolean;
}
