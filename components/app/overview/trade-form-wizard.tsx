"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Clock,
  Brain,
  Star,
  Tag,
  FileText,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Calendar,
  X,
  Image as ImageIcon,
  Upload,
  Trash2,
  Eye,
  Maximize2,
  Plus,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import TradeData from "@/types/TradeData";
import { useHeaderStore } from "@/lib/store/useHeaderStore";
import { format } from "date-fns";

interface TradeFormWizardProps {
  initialData?: Partial<TradeData>;
}

const SETUPS = [
  "Breakout",
  "Pullback",
  "Reversal",
  "Trend Continuation",
  "Range Trade",
  "News Event",
  "Supply/Demand",
  "Order Block",
  "Fair Value Gap",
  "Liquidity Sweep",
  "Other",
] as const;

const EMOTIONS = [
  { value: "Confident", icon: "😎", color: "text-emerald-400" },
  { value: "Calm", icon: "😌", color: "text-blue-400" },
  { value: "Neutral", icon: "😐", color: "text-zinc-400" },
  { value: "Anxious", icon: "😰", color: "text-amber-400" },
  { value: "FOMO", icon: "🤑", color: "text-orange-400" },
  { value: "Revenge", icon: "😤", color: "text-red-400" },
  { value: "Fearful", icon: "😨", color: "text-purple-400" },
  { value: "Excited", icon: "🤩", color: "text-pink-400" },
] as const;

const AVAILABLE_TAGS = [
  "Clean Entry",
  "Early Exit",
  "Late Entry",
  "Overtraded",
  "News Impact",
  "Session Open",
  "Trend Day",
  "Range Day",
  "Stop Hunt",
  "Hit Full TP",
  "Partial Exit",
  "Moved SL",
  "Break Even",
  "A+ Setup",
  "B Setup",
  "C Setup",
  "High Volume",
  "Low Volume",
  "Slippage",
  "Perfect Execution",
] as const;

// Helper function to generate a simple ID (in production, this would come from backend)
const generateId = () => Math.floor(Math.random() * 1000000);

const defaultFormData: TradeData = {
  id: generateId(),
  ticket: 0,
  symbol: "",
  direction: "long",
  setup: "",
  entry: 0,
  exit: 0,
  positionSize: 0,
  stopLoss: 0,
  takeProfit: 0,
  openTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
  closeTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
  pnl: 0,
  pnlPercent: 0,
  rr: "",
  emotion: "Neutral",
  rating: 3,
  tags: [],
  notes: "",
  hitStopLoss: false,
  followedPlan: true,
  screenshots: [],
};

export function TradeFormWizard({ initialData }: TradeFormWizardProps) {
  const { isTradeFormOpen, setIsTradeFormOpen } = useHeaderStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TradeData>({
    ...defaultFormData,
    ...initialData,
  });
  const [tagInput, setTagInput] = useState("");
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isTradeClosed, setIsTradeClosed] = useState(true); // New state for trade status

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;
  const steps = [
    { number: 1, title: "Trade Details", icon: Target },
    { number: 2, title: "Prices & Risk", icon: DollarSign },
    { number: 3, title: "Psychology", icon: Brain },
    { number: 4, title: "Screenshots", icon: ImageIcon },
    { number: 5, title: "Review", icon: FileText },
  ];

  // Split openTime into date and time for input fields
  const openDate = formData.openTime
    ? formData.openTime.split("T")[0]
    : format(new Date(), "yyyy-MM-dd");
  const openTime = formData.openTime
    ? formData.openTime.split("T")[1]?.substring(0, 5)
    : format(new Date(), "HH:mm");

  // Split closeTime into date and time for input fields
  const closeDate = formData.closeTime
    ? formData.closeTime.split("T")[0]
    : format(new Date(), "yyyy-MM-dd");
  const closeTime = formData.closeTime
    ? formData.closeTime.split("T")[1]?.substring(0, 5)
    : format(new Date(), "HH:mm");

  // Calculate R:R, PnL, and PnL percentage automatically
  const calculatedValues = useMemo(() => {
    const values = {
      rr: "—",
      pnl: 0,
      pnlPercent: 0,
    };

    // Only calculate R:R and PnL if trade is closed and we have necessary values
    if (isTradeClosed && formData.entry && formData.stopLoss && formData.exit) {
      const risk = Math.abs(formData.entry - formData.stopLoss);
      const reward = Math.abs(formData.exit - formData.entry);
      if (risk > 0) {
        values.rr = `1:${(reward / risk).toFixed(2)}`;
      }
    }

    // Calculate PnL based on direction, position size, and price difference
    if (
      isTradeClosed &&
      formData.entry &&
      formData.exit &&
      formData.positionSize
    ) {
      const priceDiff = formData.exit - formData.entry;
      const multiplier = formData.direction === "long" ? 1 : -1;

      // Simple PnL calculation (adjust based on your broker's lot size)
      // Assuming 1 lot = 100,000 units (standard for Forex)
      const lotSize = 100000;
      const pips = priceDiff * (formData.symbol.includes("JPY") ? 100 : 10000);
      values.pnl = pips * 10 * formData.positionSize * multiplier; // $10 per pip per lot

      if (formData.entry > 0) {
        values.pnlPercent =
          (values.pnl / (formData.entry * formData.positionSize * lotSize)) *
          100;
      }
    }

    return values;
  }, [
    formData.entry,
    formData.stopLoss,
    formData.exit,
    formData.direction,
    formData.positionSize,
    formData.symbol,
    isTradeClosed,
  ]);

  // Update formData with calculated values
  useEffect(() => {
    setFormData((prev: TradeData) => ({
      ...prev,
      rr: calculatedValues.rr,
      pnl: calculatedValues.pnl,
      pnlPercent: calculatedValues.pnlPercent,
      // If trade is not closed, clear the exit and closeTime
      ...(!isTradeClosed && {
        exit: 0,
        closeTime: undefined,
      }),
    }));
  }, [calculatedValues, isTradeClosed]);

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev: TradeData) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev: TradeData) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploadingScreenshots(true);

    const newScreenshots: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        newScreenshots.push(objectUrl);
      }
    });

    setFormData((prev: TradeData) => ({
      ...prev,
      screenshots: [...prev.screenshots, ...newScreenshots],
    }));

    setUploadingScreenshots(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveScreenshot = (index: number) => {
    URL.revokeObjectURL(formData.screenshots[index]);
    setFormData((prev: TradeData) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const handleViewScreenshot = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleSaveTrade = () => {
    console.log("Saving trade:", formData);

    // TODO: Send trade data to server
    // await fetch('/api/trades', { method: 'POST', body: JSON.stringify(formData) });

    // Clean up object URLs
    formData.screenshots.forEach((url: string) => URL.revokeObjectURL(url));

    setIsTradeFormOpen(false);
    setFormData(defaultFormData);
    setStep(1);
    setIsTradeClosed(true); // Reset to default
  };

  const handleClose = () => {
    formData.screenshots.forEach((url: string) => URL.revokeObjectURL(url));

    setIsTradeFormOpen(false);
    setFormData(defaultFormData);
    setStep(1);
    setSelectedImageIndex(null);
    setIsTradeClosed(true); // Reset to default
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.symbol && formData.setup;
      case 2:
        // For closed trades, require exit price; for open trades, only require entry and position size
        if (isTradeClosed) {
          return (
            formData.entry > 0 && formData.positionSize > 0 && formData.exit > 0
          );
        } else {
          return formData.entry > 0 && formData.positionSize > 0;
        }
      case 3:
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };

  // Update openTime when date or time changes
  const updateOpenTime = (date: string, time: string) => {
    setFormData((prev: TradeData) => ({
      ...prev,
      openTime: `${date}T${time}:00`,
    }));
  };

  // Update closeTime when date or time changes
  const updateCloseTime = (date: string, time: string) => {
    setFormData((prev: TradeData) => ({
      ...prev,
      closeTime: `${date}T${time}:00`,
    }));
  };

  // Handle trade status toggle
  const handleTradeStatusToggle = () => {
    const newStatus = !isTradeClosed;
    setIsTradeClosed(newStatus);

    if (newStatus) {
      // When closing trade, set closeTime to current time
      setFormData((prev: TradeData) => ({
        ...prev,
        closeTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      }));
    } else {
      // When opening trade, clear exit price and closeTime
      setFormData((prev: TradeData) => ({
        ...prev,
        exit: 0,
        closeTime: undefined,
      }));
    }
  };

  return (
    <>
      <Dialog open={isTradeFormOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden bg-background border-border max-h-[90vh] flex flex-col">
          {/* Header with progress */}
          <div className="bg-secondary/30 border-b border-border px-6 py-4">
            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">
                  Log New Trade
                </DialogTitle>
                <Badge variant="outline" className="font-mono">
                  Step {step} of {totalSteps}
                </Badge>
              </div>

              {/* Progress steps */}
              <div className="flex items-center gap-2">
                {steps.map((s, idx) => (
                  <div key={s.number} className="flex items-center flex-1">
                    <button
                      onClick={() => step > s.number && setStep(s.number)}
                      disabled={step < s.number}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-full",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        step === s.number
                          ? "bg-primary text-primary-foreground"
                          : step > s.number
                          ? "bg-emerald-500/20 text-emerald-400 cursor-pointer hover:bg-emerald-500/30"
                          : "bg-secondary/50 text-muted-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          step > s.number
                            ? "bg-emerald-500 text-white"
                            : "bg-background/50"
                        )}
                      >
                        {step > s.number ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          s.number
                        )}
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">
                        {s.title}
                      </span>
                    </button>
                    {idx < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground mx-1 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </DialogHeader>
          </div>

          {/* Form content */}
          <div className="p-6 overflow-y-auto flex-1">
            {/* Step 1: Trade Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Symbol
                  </Label>
                  <Input
                    placeholder="e.g., EURUSD, BTCUSD, AAPL"
                    value={formData.symbol}
                    onChange={(e) =>
                      setFormData((prev: TradeData) => ({
                        ...prev,
                        symbol: e.target.value.toUpperCase(),
                      }))
                    }
                    className="h-12 text-lg font-mono"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Direction</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev: TradeData) => ({
                          ...prev,
                          direction: "long",
                        }))
                      }
                      className={cn(
                        "flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-emerald-500",
                        formData.direction === "long"
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : "border-border hover:border-emerald-500/50 hover:bg-emerald-500/5"
                      )}
                    >
                      <TrendingUp className="w-6 h-6" />
                      <span className="text-lg font-semibold">Long</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev: TradeData) => ({
                          ...prev,
                          direction: "short",
                        }))
                      }
                      className={cn(
                        "flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-red-500",
                        formData.direction === "short"
                          ? "border-red-500 bg-red-500/10 text-red-400"
                          : "border-border hover:border-red-500/50 hover:bg-red-500/5"
                      )}
                    >
                      <TrendingDown className="w-6 h-6" />
                      <span className="text-lg font-semibold">Short</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Setup Type</Label>
                  <Select
                    value={formData.setup}
                    onValueChange={(value) =>
                      setFormData((prev: TradeData) => ({
                        ...prev,
                        setup: value,
                      }))
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your setup..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SETUPS.map((setup) => (
                        <SelectItem key={setup} value={setup} className="py-3">
                          {setup}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trade Status Toggle */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Trade Status</Label>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                    <button
                      type="button"
                      onClick={handleTradeStatusToggle}
                      className={cn(
                        "w-14 h-7 rounded-full p-1 transition-all duration-300",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        isTradeClosed ? "bg-emerald-500" : "bg-gray-300"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 bg-white rounded-full transition-transform duration-300",
                          isTradeClosed ? "translate-x-7" : "translate-x-0"
                        )}
                      />
                    </button>
                    <div>
                      <p className="font-medium">
                        {isTradeClosed ? "Trade is Closed" : "Trade is Open"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isTradeClosed
                          ? "This trade has been completed"
                          : "This trade is still active"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Open Time Fields (Always shown) */}
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Open Time
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={openDate}
                        onChange={(e) =>
                          updateOpenTime(e.target.value, openTime)
                        }
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={openTime}
                        onChange={(e) =>
                          updateOpenTime(openDate, e.target.value)
                        }
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Close Time Fields (Only shown when trade is closed) */}
                {isTradeClosed && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      Close Time
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={closeDate}
                          onChange={(e) =>
                            updateCloseTime(e.target.value, closeTime)
                          }
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={closeTime}
                          onChange={(e) =>
                            updateCloseTime(closeDate, e.target.value)
                          }
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional broker fields */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Optional Broker Information
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Ticket #</Label>
                      <Input
                        type="number"
                        placeholder="Optional"
                        value={formData.ticket || ""}
                        onChange={(e) =>
                          setFormData((prev: TradeData) => ({
                            ...prev,
                            ticket: Number.parseInt(e.target.value) || 0,
                          }))
                        }
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Magic Number</Label>
                      <Input
                        type="number"
                        placeholder="Optional"
                        value={formData.magicNumber || ""}
                        onChange={(e) =>
                          setFormData((prev: TradeData) => ({
                            ...prev,
                            magicNumber: Number.parseInt(e.target.value),
                          }))
                        }
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Prices & Risk */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-emerald-400">
                      Entry Price
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="1.0842"
                      value={formData.entry || ""}
                      onChange={(e) =>
                        setFormData((prev: TradeData) => ({
                          ...prev,
                          entry: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="h-12 text-lg font-mono"
                    />
                  </div>
                  {isTradeClosed && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium text-blue-400">
                        Exit Price
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="1.0891"
                        value={formData.exit || ""}
                        onChange={(e) =>
                          setFormData((prev: TradeData) => ({
                            ...prev,
                            exit: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="h-12 text-lg font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Stop Loss
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="1.0800"
                      value={formData.stopLoss || ""}
                      onChange={(e) =>
                        setFormData((prev: TradeData) => ({
                          ...prev,
                          stopLoss: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="h-12 text-lg font-mono border-red-500/30 focus:border-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium text-emerald-400 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Take Profit
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="1.0920"
                      value={formData.takeProfit || ""}
                      onChange={(e) =>
                        setFormData((prev: TradeData) => ({
                          ...prev,
                          takeProfit: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="h-12 text-lg font-mono border-emerald-500/30 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    Position Size (Lots)
                  </Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="1.00"
                    value={formData.positionSize || ""}
                    onChange={(e) =>
                      setFormData((prev: TradeData) => ({
                        ...prev,
                        positionSize: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="h-12 text-lg font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    1.00 lot = 100,000 units (standard for Forex)
                  </p>
                </div>

                {/* Calculated R:R and PnL display - Only show for closed trades */}
                {isTradeClosed && (
                  <div className="bg-secondary/50 rounded-xl p-4 border border-border">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Calculated Risk:Reward
                        </span>
                        <span className="text-2xl font-bold font-mono text-primary">
                          {calculatedValues.rr}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">P&L</span>
                        <span
                          className={cn(
                            "text-xl font-bold font-mono",
                            calculatedValues.pnl > 0
                              ? "text-emerald-400"
                              : calculatedValues.pnl < 0
                              ? "text-red-400"
                              : ""
                          )}
                        >
                          ${calculatedValues.pnl.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">P&L %</span>
                        <span
                          className={cn(
                            "text-lg font-bold font-mono",
                            calculatedValues.pnlPercent > 0
                              ? "text-emerald-400"
                              : calculatedValues.pnlPercent < 0
                              ? "text-red-400"
                              : ""
                          )}
                        >
                          {calculatedValues.pnlPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hit Stop Loss - Only relevant for closed trades */}
                {isTradeClosed && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev: TradeData) => ({
                          ...prev,
                          hitStopLoss: !prev.hitStopLoss,
                        }))
                      }
                      className={cn(
                        "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-red-500",
                        formData.hitStopLoss
                          ? "bg-red-500 border-red-500"
                          : "border-red-500/50 hover:border-red-500"
                      )}
                    >
                      {formData.hitStopLoss && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <div>
                      <p className="font-medium text-red-400">Hit Stop Loss?</p>
                      <p className="text-sm text-muted-foreground">
                        Mark if this trade was stopped out
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Psychology - Remains the same */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    Emotional State
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {EMOTIONS.map((emotion) => (
                      <button
                        key={emotion.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev: TradeData) => ({
                            ...prev,
                            emotion: emotion.value,
                          }))
                        }
                        className={cn(
                          "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                          "focus:outline-none focus:ring-2 focus:ring-primary",
                          formData.emotion === emotion.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-secondary/50"
                        )}
                      >
                        <span className="text-2xl">{emotion.icon}</span>
                        <span
                          className={cn("text-xs font-medium", emotion.color)}
                        >
                          {emotion.value}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    Trade Quality Rating
                  </Label>
                  <div className="flex items-center justify-center gap-3 p-4 bg-secondary/30 rounded-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setFormData((prev: TradeData) => ({
                            ...prev,
                            rating: star,
                          }))
                        }
                        className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full"
                      >
                        <Star
                          className={cn(
                            "w-10 h-10 transition-colors",
                            star <= formData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground hover:text-amber-400/50"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {formData.rating === 1 && "Poor execution"}
                    {formData.rating === 2 && "Below average"}
                    {formData.rating === 3 && "Average trade"}
                    {formData.rating === 4 && "Good execution"}
                    {formData.rating === 5 && "Perfect execution"}
                  </p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev: TradeData) => ({
                        ...prev,
                        followedPlan: !prev.followedPlan,
                      }))
                    }
                    className={cn(
                      "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                      "focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      formData.followedPlan
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-emerald-500/50 hover:border-emerald-500"
                    )}
                  >
                    {formData.followedPlan && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <div>
                    <p className="font-medium text-emerald-400">
                      Followed Trading Plan?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Did you stick to your rules?
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-xl min-h-15">
                    {formData.tags.length === 0 && (
                      <span className="text-muted-foreground text-sm">
                        No tags selected
                      </span>
                    )}
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-primary/30 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Select value={tagInput} onValueChange={handleAddTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add a tag..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_TAGS.filter(
                        (t) => !formData.tags.includes(t)
                      ).map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Trade Notes
                  </Label>
                  <Textarea
                    placeholder="What went well? What could be improved? Why did you take this trade? What lessons did you learn?"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev: TradeData) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={4}
                    className="resize-none min-h-30"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Screenshots - Remains the same */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Attach Screenshots
                  </h3>
                  <p className="text-muted-foreground">
                    Upload chart screenshots or trade setup images (max 5
                    images)
                  </p>
                </div>

                {/* Upload Area */}
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                      "hover:border-primary hover:bg-primary/5",
                      "border-border bg-secondary/20"
                    )}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-12 h-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium mb-1">Click to upload</p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG, or GIF files (max 5MB each)
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  {uploadingScreenshots && (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Uploading screenshots...
                        </span>
                      </div>
                    </div>
                  )}

                  {formData.screenshots.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                          Uploaded Screenshots ({formData.screenshots.length})
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          Click to view • Click remove to delete
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.screenshots.map(
                          (screenshot: string, index: number) => (
                            <div
                              key={index}
                              className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-secondary/30"
                            >
                              <div
                                className="w-full h-full cursor-pointer bg-black/5"
                                onClick={() => handleViewScreenshot(index)}
                              >
                                <img
                                  src={screenshot}
                                  alt={`Trade screenshot ${index + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleViewScreenshot(index)}
                                className="absolute top-2 left-2 w-8 h-8 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveScreenshot(index)}
                                className="absolute top-2 right-2 w-8 h-8 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="truncate">
                                  Screenshot {index + 1}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {formData.screenshots.length < 5 && (
                        <div className="text-center pt-4">
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add More Screenshots
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            {5 - formData.screenshots.length} more can be added
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Tips for great screenshots
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 pl-1">
                      <li>• Include entry and exit points on the chart</li>
                      <li>• Show multiple timeframes for context</li>
                      <li>• Mark key support/resistance levels</li>
                      <li>• Include volume profile if available</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review - Updated to show trade status */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center pb-4">
                  <h3 className="text-lg font-semibold">Review Your Trade</h3>
                  <p className="text-muted-foreground text-sm">
                    Confirm the details before saving
                  </p>
                </div>

                {/* Trade summary card */}
                <div className="bg-secondary/30 rounded-xl border border-border overflow-hidden">
                  {/* Header */}
                  <div
                    className={cn(
                      "p-4 flex items-center justify-between",
                      isTradeClosed && formData.pnl >= 0
                        ? "bg-emerald-500/10"
                        : isTradeClosed && formData.pnl < 0
                        ? "bg-red-500/10"
                        : "bg-blue-500/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          formData.direction === "long"
                            ? "bg-emerald-500/20"
                            : "bg-red-500/20"
                        )}
                      >
                        {formData.direction === "long" ? (
                          <TrendingUp className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xl font-bold font-mono">
                          {formData.symbol || "—"}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {formData.direction} • {formData.setup || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {isTradeClosed ? (
                        <>
                          <p
                            className={cn(
                              "text-2xl font-bold font-mono",
                              formData.pnl >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            )}
                          >
                            {formData.pnl >= 0 ? "+" : ""}$
                            {formData.pnl.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formData.rr} R:R
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold font-mono text-blue-400">
                            OPEN
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Active Position
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entry</span>
                        <span className="font-mono">
                          {formData.entry || "—"}
                        </span>
                      </div>
                      {isTradeClosed && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Exit</span>
                          <span className="font-mono">
                            {formData.exit || "—"}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stop Loss</span>
                        <span className="font-mono text-red-400">
                          {formData.stopLoss || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Position Size
                        </span>
                        <span className="font-mono">
                          {formData.positionSize} lots
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Open Time</span>
                        <span>
                          {format(
                            new Date(formData.openTime),
                            "MMM d, yyyy HH:mm"
                          )}
                        </span>
                      </div>
                      {isTradeClosed && formData.closeTime && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Close Time
                          </span>
                          <span>
                            {format(
                              new Date(formData.closeTime),
                              "MMM d, yyyy HH:mm"
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Take Profit
                        </span>
                        <span className="font-mono text-emerald-400">
                          {formData.takeProfit || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emotion</span>
                        <span>
                          {
                            EMOTIONS.find((e) => e.value === formData.emotion)
                              ?.icon
                          }{" "}
                          {formData.emotion}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isTradeClosed && (
                    <div className="px-4 pb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">P&L %</span>
                        <span
                          className={cn(
                            formData.pnlPercent >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          )}
                        >
                          {formData.pnlPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {formData.ticket && (
                    <div className="px-4 pb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ticket #</span>
                        <span className="font-mono">{formData.ticket}</span>
                      </div>
                    </div>
                  )}

                  {(formData.tags.length > 0 || formData.notes) && (
                    <div className="p-4 border-t border-border space-y-3">
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {formData.notes && (
                        <p className="text-sm text-muted-foreground">
                          {formData.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {formData.screenshots.length > 0 && (
                    <div className="p-4 border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">
                          Screenshots
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {formData.screenshots.length} attached
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {formData.screenshots
                          .slice(0, 3)
                          .map((screenshot: string, index: number) => (
                            <div
                              key={index}
                              className="relative aspect-video rounded bg-secondary/50 border border-border overflow-hidden group cursor-pointer"
                              onClick={() => handleViewScreenshot(index)}
                            >
                              <img
                                src={screenshot}
                                alt={`Trade screenshot ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        {formData.screenshots.length > 3 && (
                          <div
                            className="aspect-video rounded bg-secondary/50 border border-border flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors"
                            onClick={() => handleViewScreenshot(3)}
                          >
                            <div className="text-center">
                              <span className="text-xs font-medium text-muted-foreground">
                                +{formData.screenshots.length - 3} more
                              </span>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                Click to view
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Trade Rating
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-5 h-5",
                            star <= formData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t border-border flex gap-4 flex-wrap">
                    <Badge
                      className={cn(
                        "gap-1",
                        isTradeClosed
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      )}
                    >
                      {isTradeClosed ? "Closed" : "Open"}
                    </Badge>

                    {isTradeClosed && formData.hitStopLoss && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Stopped Out
                      </Badge>
                    )}

                    {formData.followedPlan && (
                      <Badge className="gap-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <Check className="w-3 h-3" />
                        Followed Plan
                      </Badge>
                    )}

                    {formData.screenshots.length > 0 && (
                      <Badge className="gap-1 bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <ImageIcon className="w-3 h-3" />
                        {formData.screenshots.length} Screenshots
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with navigation */}
          <div className="border-t border-border px-6 py-4 bg-secondary/20 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={step === 1 ? handleClose : () => setStep(step - 1)}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSaveTrade}
                className={cn(
                  "gap-2",
                  isTradeClosed
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                <Check className="w-4 h-4" />
                {isTradeClosed ? "Save Trade" : "Save Open Position"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal */}
      {selectedImageIndex !== null && (
        <Dialog
          open={selectedImageIndex !== null}
          onOpenChange={() => setSelectedImageIndex(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black border-0">
            <div className="relative w-full h-full">
              {formData.screenshots[selectedImageIndex] && (
                <>
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="secondary">
                      Screenshot {selectedImageIndex + 1} of{" "}
                      {formData.screenshots.length}
                    </Badge>
                  </div>
                  <button
                    onClick={() => setSelectedImageIndex(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center justify-center h-[80vh] p-4">
                    <img
                      src={formData.screenshots[selectedImageIndex]}
                      alt={`Trade screenshot ${selectedImageIndex + 1}`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedImageIndex(
                          Math.max(0, selectedImageIndex - 1)
                        )
                      }
                      disabled={selectedImageIndex === 0}
                      className="bg-black/50 text-white border-white/30 hover:bg-black/70"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedImageIndex(
                          Math.min(
                            formData.screenshots.length - 1,
                            selectedImageIndex + 1
                          )
                        )
                      }
                      disabled={
                        selectedImageIndex === formData.screenshots.length - 1
                      }
                      className="bg-black/50 text-white border-white/30 hover:bg-black/70"
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
