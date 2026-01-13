"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ImageIcon,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  Plus,
  Calendar,
  Clock,
  Target,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TradeData from "@/lib/types/trade";
import { TradeFormWizard } from "@/components/app/overview/trade-form-wizard";
import { useHeaderStore } from "@/lib/store/header-store";
import { format } from "date-fns";

// Mock trades with new TradeData interface structure
const initialTrades: TradeData[] = [
  {
    id: 1,
    ticket: 123456,
    symbol: "EURUSD",
    direction: "long",
    entry: 1.0842,
    exit: 1.0891,
    positionSize: 1.0,
    stopLoss: 1.08,
    takeProfit: 1.092,
    openTime: "2024-01-15T09:32:00",
    closeTime: "2024-01-15T10:45:00",
    pnl: 245.5,
    pnlPercent: 2.1,
    rr: "1:2.4",
    setup: "Breakout",
    tags: ["Clean Entry", "Perfect Execution"],
    emotion: "Confident",
    rating: 4,
    notes: "Clean breakout above resistance after NFP. Held through pullback.",
    screenshots: [],
    hitStopLoss: false,
    followedPlan: true,
  },
  {
    id: 2,
    ticket: 123457,
    symbol: "GBPJPY",
    direction: "short",
    entry: 188.42,
    exit: 187.85,
    positionSize: 0.8,
    stopLoss: 189.0,
    takeProfit: 186.5,
    openTime: "2024-01-15T14:15:00",
    closeTime: "2024-01-15T15:30:00",
    pnl: 178.2,
    pnlPercent: 1.5,
    rr: "1:1.8",
    setup: "Reversal",
    tags: ["Stop Hunt", "Perfect Execution"],
    emotion: "Calm",
    rating: 5,
    notes: "Perfect reversal at daily resistance. Followed plan exactly.",
    screenshots: [],
    hitStopLoss: false,
    followedPlan: true,
  },
  {
    id: 3,
    ticket: 123458,
    symbol: "XAUUSD",
    direction: "long",
    entry: 2024.5,
    exit: 2018.3,
    positionSize: 0.5,
    stopLoss: 2010.0,
    takeProfit: 2050.0,
    openTime: "2024-01-14T11:45:00",
    closeTime: "2024-01-14T13:20:00",
    pnl: -186.0,
    pnlPercent: -1.2,
    rr: "1:0.8",
    setup: "Support Bounce",
    tags: ["Late Entry", "Overtraded"],
    emotion: "FOMO",
    rating: 2,
    notes: "Entered too early. Didn't wait for confirmation candle.",
    screenshots: [],
    hitStopLoss: false,
    followedPlan: false,
  },
];

const emotionColors: Record<string, string> = {
  Confident: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Calm: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Neutral: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  Anxious: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  FOMO: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  Revenge: "bg-red-500/10 text-red-400 border-red-500/30",
  Fearful: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Excited: "bg-pink-500/10 text-pink-400 border-pink-500/30",
};

function Page() {
  const { isTradeFormOpen, setIsTradeFormOpen } = useHeaderStore();
  const [trades, setTrades] = useState<TradeData[]>(initialTrades);
  const [selectedTrade, setSelectedTrade] = useState<TradeData>(trades[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<TradeData | null>(null);

  const filteredTrades = trades.filter(
    (trade) =>
      trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.setup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trade.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      trade.emotion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTrade = () => {
    setEditingTrade(null);
    setIsTradeFormOpen(true);
  };

  const handleEditTrade = (trade: TradeData) => {
    setEditingTrade(trade);
    setIsTradeFormOpen(true);
  };

  const handleSaveTrade = (formData: TradeData) => {
    if (editingTrade) {
      // Update existing trade
      const updatedTrade: TradeData = {
        ...editingTrade,
        ...formData,
      };
      setTrades((prev) =>
        prev.map((t) => (t.id === editingTrade.id ? updatedTrade : t))
      );
      setSelectedTrade(updatedTrade);
    } else {
      // Add new trade
      const newTrade: TradeData = {
        ...formData,
        id: Math.max(...trades.map((t) => t.id), 0) + 1,
      };
      setTrades((prev) => [newTrade, ...prev]);
      setSelectedTrade(newTrade);
    }

    // Close the form via Zustand store
    setIsTradeFormOpen(false);
  };

  const handleDeleteTrade = () => {
    setTrades((prev) => prev.filter((t) => t.id !== selectedTrade.id));
    setIsDeleteDialogOpen(false);
    if (filteredTrades.length > 1) {
      const remaining = trades.filter((t) => t.id !== selectedTrade.id);
      setSelectedTrade(remaining[0] || remaining[1] || remaining[0]);
    }
  };

  // Check if trade is closed (has exit price and closeTime)
  const isTradeClosed = (trade: TradeData) => {
    return trade.exit !== 0 && trade.closeTime !== undefined;
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  // Format time from ISO string to readable format
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm");
    } catch {
      return "Invalid time";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search trades by symbol, setup, tags, or emotion..."
              className="pl-9 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 bg-background/50"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        <Button
          className="gap-2 bg-primary hover:bg-primary/90"
          onClick={handleAddTrade}
        >
          <Plus className="w-4 h-4" />
          Log Trade
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trade List */}
        <div className="lg:col-span-5 space-y-2">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Trade Journal</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredTrades.length} trades
                </span>
                <Badge variant="outline" className="text-xs">
                  {filteredTrades.filter((t) => isTradeClosed(t)).length} closed
                </Badge>
              </div>
            </div>
            <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
              {filteredTrades.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No trades found. Try a different search or log your first
                  trade!
                </div>
              ) : (
                filteredTrades.map((trade) => (
                  <div
                    key={trade.id}
                    onClick={() => setSelectedTrade(trade)}
                    className={cn(
                      "p-4 rounded-xl cursor-pointer transition-all border",
                      "hover:bg-secondary/50",
                      selectedTrade.id === trade.id
                        ? "bg-primary/5 border-primary/30"
                        : "bg-secondary/30 border-transparent"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            trade.direction === "long"
                              ? "bg-emerald-500/10"
                              : "bg-red-500/10"
                          )}
                        >
                          {trade.direction === "long" ? (
                            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base">
                              {trade.symbol}
                            </span>
                            {!isTradeClosed(trade) && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30"
                              >
                                OPEN
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground capitalize">
                            {trade.setup}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isTradeClosed(trade) ? (
                          <>
                            <p
                              className={cn(
                                "font-bold text-base",
                                trade.pnl >= 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              )}
                            >
                              {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {trade.rr} R:R
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-bold text-base text-blue-400">
                              OPEN
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {trade.positionSize} lots
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span>{formatDate(trade.openTime)}</span>
                        <span>{formatTime(trade.openTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {trade.screenshots.length > 0 && (
                          <span className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />{" "}
                            {trade.screenshots.length}
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            emotionColors[trade.emotion]
                          )}
                        >
                          {trade.emotion}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Trade Detail */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center",
                    selectedTrade.direction === "long"
                      ? "bg-emerald-500/10"
                      : "bg-red-500/10"
                  )}
                >
                  {selectedTrade.direction === "long" ? (
                    <TrendingUp className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-7 h-7 text-red-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">
                      {selectedTrade.symbol}
                    </h2>
                    {!isTradeClosed(selectedTrade) && (
                      <Badge className="bg-blue-500 text-white">OPEN</Badge>
                    )}
                    {selectedTrade.ticket > 0 && (
                      <Badge variant="outline" className="text-xs">
                        #{selectedTrade.ticket}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="capitalize font-medium">
                      {selectedTrade.direction}
                    </span>
                    <span>•</span>
                    <span>{selectedTrade.setup}</span>
                    <span>•</span>
                    <span>
                      {formatDate(selectedTrade.openTime)} at{" "}
                      {formatTime(selectedTrade.openTime)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isTradeClosed(selectedTrade) && (
                  <div className="text-right mr-4">
                    <p
                      className={cn(
                        "text-3xl font-bold",
                        selectedTrade.pnl >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      )}
                    >
                      {selectedTrade.pnl >= 0 ? "+" : ""}$
                      {selectedTrade.pnl.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTrade.pnlPercent >= 0 ? "+" : ""}
                      {selectedTrade.pnlPercent.toFixed(2)}% |{" "}
                      {selectedTrade.rr}
                    </p>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditTrade(selectedTrade)}
                  className="hover:bg-primary/10"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10 border-red-500/30"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Trade Status */}
            <div className="mb-6">
              <Badge
                className={cn(
                  "gap-2 px-4 py-2",
                  isTradeClosed(selectedTrade)
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                )}
              >
                {isTradeClosed(selectedTrade) ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Closed on {formatDate(selectedTrade.closeTime!)} at{" "}
                    {formatTime(selectedTrade.closeTime!)}
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Open Position
                  </>
                )}
              </Badge>
            </div>

            {/* Trade Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Entry Price
                </p>
                <p className="font-semibold text-lg font-mono">
                  {selectedTrade.entry}
                </p>
              </div>
              {isTradeClosed(selectedTrade) && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    Exit Price
                  </p>
                  <p className="font-semibold text-lg font-mono">
                    {selectedTrade.exit}
                  </p>
                </div>
              )}
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Stop Loss
                </p>
                <p className="font-semibold text-lg font-mono text-red-400">
                  {selectedTrade.stopLoss || "—"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  Take Profit
                </p>
                <p className="font-semibold text-lg font-mono text-emerald-400">
                  {selectedTrade.takeProfit || "—"}
                </p>
              </div>
            </div>

            {/* Position Size & P&L */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Position Size
                </p>
                <p className="font-bold text-xl font-mono">
                  {selectedTrade.positionSize} lots
                </p>
              </div>
              {isTradeClosed(selectedTrade) && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">P&L %</p>
                  <p
                    className={cn(
                      "font-bold text-xl font-mono",
                      selectedTrade.pnlPercent >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    )}
                  >
                    {selectedTrade.pnlPercent >= 0 ? "+" : ""}
                    {selectedTrade.pnlPercent.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-6">
              <Tag className="w-5 h-5 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {selectedTrade.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
                {selectedTrade.hitStopLoss && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Stopped Out
                  </Badge>
                )}
                {selectedTrade.followedPlan && (
                  <Badge className="gap-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    ✓ Followed Plan
                  </Badge>
                )}
              </div>
            </div>

            {/* Psychology & Rating */}
            <div className="flex items-center gap-6 mb-6 p-4 rounded-lg bg-secondary/20 border border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Emotional State
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm px-3 py-1",
                    emotionColors[selectedTrade.emotion]
                  )}
                >
                  {selectedTrade.emotion}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Trade Rating
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={cn(
                        "w-5 h-5 rounded-full",
                        star <= selectedTrade.rating
                          ? "bg-amber-400"
                          : "bg-secondary"
                      )}
                    />
                  ))}
                </div>
              </div>
              {selectedTrade.screenshots.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Screenshots
                  </p>
                  <span className="text-sm font-medium flex items-center gap-1">
                    <ImageIcon className="w-4 h-4" />{" "}
                    {selectedTrade.screenshots.length} attached
                  </span>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Trade Notes
              </p>
              <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                <p className="text-sm whitespace-pre-line">
                  {selectedTrade.notes}
                </p>
              </div>
            </div>
          </Card>

          {/* Screenshot Placeholder */}
          {selectedTrade.screenshots.length > 0 && (
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold mb-4">Chart Screenshots</h3>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: selectedTrade.screenshots.length }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-lg bg-secondary/30 border border-dashed border-border flex items-center justify-center"
                    >
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">
                          Screenshot {i + 1}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Trade Form Wizard */}
      <TradeFormWizard initialData={editingTrade || undefined} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trade</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {selectedTrade.symbol} trade?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTrade}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete Trade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Missing icons
const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default Page;
