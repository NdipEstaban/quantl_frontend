"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  BookOpen,
  Target,
  BarChart3,
  CheckCircle2,
  XCircle,
  Edit2,
  Copy,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Condition {
  name: string;
  value: string;
}

interface Playbook {
  id: number;
  name: string;
  description: string;
  status: "active" | "testing" | "paused";
  winRate: number;
  trades: number;
  avgRR: number;
  pnl: number;
  rules: string[];
  conditions: Condition[];
  bestPairs: string[];
  lastUsed: string;
}

const initialPlaybooks: Playbook[] = [
  {
    id: 1,
    name: "London Breakout",
    description:
      "Trade breakouts during London session open with momentum confirmation",
    status: "active",
    winRate: 64,
    trades: 89,
    avgRR: 2.1,
    pnl: 4250,
    rules: [
      "Wait for 8:00-9:00 UTC consolidation",
      "Enter on break of range with volume",
      "Stop loss below/above range",
      "Target 1.5-2x range size",
    ],
    conditions: [
      { name: "Session", value: "London Open" },
      { name: "Setup", value: "Breakout" },
      { name: "Timeframe", value: "15M" },
      { name: "Risk", value: "1%" },
    ],
    bestPairs: ["EURUSD", "GBPUSD", "EURGBP"],
    lastUsed: "2 hours ago",
  },
  {
    id: 2,
    name: "Trend Continuation",
    description:
      "Enter pullbacks in established trends using EMA support/resistance",
    status: "active",
    winRate: 71,
    trades: 52,
    avgRR: 2.4,
    pnl: 4850,
    rules: [
      "Identify clear trend on H4/Daily",
      "Wait for pullback to 21 EMA",
      "Confirm with candlestick pattern",
      "Trail stop using 21 EMA",
    ],
    conditions: [
      { name: "Session", value: "Any" },
      { name: "Setup", value: "Pullback" },
      { name: "Timeframe", value: "H1" },
      { name: "Risk", value: "1.5%" },
    ],
    bestPairs: ["USDJPY", "AUDUSD", "XAUUSD"],
    lastUsed: "Yesterday",
  },
  {
    id: 3,
    name: "Reversal at Key Levels",
    description:
      "Counter-trend trades at major support/resistance with confirmation",
    status: "testing",
    winRate: 58,
    trades: 38,
    avgRR: 1.8,
    pnl: 2180,
    rules: [
      "Identify major S/R on D1/W1",
      "Wait for rejection candle",
      "Enter on confirmation candle",
      "Target previous swing",
    ],
    conditions: [
      { name: "Session", value: "London/NY" },
      { name: "Setup", value: "Reversal" },
      { name: "Timeframe", value: "H4" },
      { name: "Risk", value: "0.75%" },
    ],
    bestPairs: ["GBPJPY", "EURJPY", "XAUUSD"],
    lastUsed: "3 days ago",
  },
  {
    id: 4,
    name: "Range Scalping",
    description: "Quick scalps in ranging markets during quiet sessions",
    status: "paused",
    winRate: 45,
    trades: 22,
    avgRR: 1.2,
    pnl: -340,
    rules: [
      "Identify clear range on M15",
      "Fade extremes of range",
      "Quick exits at mid-range",
      "Max 3 trades per range",
    ],
    conditions: [
      { name: "Session", value: "Asian" },
      { name: "Setup", value: "Range" },
      { name: "Timeframe", value: "M15" },
      { name: "Risk", value: "0.5%" },
    ],
    bestPairs: ["EURUSD", "USDJPY"],
    lastUsed: "1 week ago",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  testing: "bg-warning/10 text-warning",
  paused: "bg-muted text-muted-foreground",
};

const sessionOptions = ["London Open", "NY Open", "Asian", "London/NY", "Any"];
const setupOptions = [
  "Breakout",
  "Pullback",
  "Reversal",
  "Range",
  "Trend",
  "Scalp",
];
const timeframeOptions = ["M1", "M5", "M15", "M30", "H1", "H4", "D1"];
const riskOptions = ["0.25%", "0.5%", "0.75%", "1%", "1.5%", "2%"];
const pairOptions = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "GBPJPY",
  "EURJPY",
  "AUDUSD",
  "XAUUSD",
  "BTCUSD",
  "EURGBP",
  "USDCHF",
];

const emptyPlaybook: Omit<Playbook, "id"> = {
  name: "",
  description: "",
  status: "testing",
  winRate: 0,
  trades: 0,
  avgRR: 0,
  pnl: 0,
  rules: [""],
  conditions: [
    { name: "Session", value: "" },
    { name: "Setup", value: "" },
    { name: "Timeframe", value: "" },
    { name: "Risk", value: "" },
  ],
  bestPairs: [],
  lastUsed: "Never",
};

export function Page() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(initialPlaybooks);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook>(
    playbooks[0]
  );

  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPlaybook, setEditingPlaybook] = useState<Playbook | null>(null);
  const [formData, setFormData] = useState<Omit<Playbook, "id">>(emptyPlaybook);

  const handleAddPlaybook = () => {
    setEditingPlaybook(null);
    setFormData({
      ...emptyPlaybook,
      rules: [""],
      conditions: [...emptyPlaybook.conditions],
    });
    setIsAddEditDialogOpen(true);
  };

  const handleEditPlaybook = (playbook: Playbook) => {
    setEditingPlaybook(playbook);
    setFormData({
      name: playbook.name,
      description: playbook.description,
      status: playbook.status,
      winRate: playbook.winRate,
      trades: playbook.trades,
      avgRR: playbook.avgRR,
      pnl: playbook.pnl,
      rules: [...playbook.rules],
      conditions: playbook.conditions.map((c) => ({ ...c })),
      bestPairs: [...playbook.bestPairs],
      lastUsed: playbook.lastUsed,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleDuplicatePlaybook = (playbook: Playbook) => {
    const newPlaybook: Playbook = {
      ...playbook,
      id: Math.max(...playbooks.map((p) => p.id), 0) + 1,
      name: `${playbook.name} (Copy)`,
      status: "testing",
      trades: 0,
      pnl: 0,
      lastUsed: "Never",
    };
    setPlaybooks((prev) => [...prev, newPlaybook]);
    setSelectedPlaybook(newPlaybook);
  };

  const handleSavePlaybook = () => {
    if (editingPlaybook) {
      // Update existing playbook
      setPlaybooks((prev) =>
        prev.map((p) =>
          p.id === editingPlaybook.id
            ? { ...formData, id: editingPlaybook.id }
            : p
        )
      );
      setSelectedPlaybook({ ...formData, id: editingPlaybook.id });
    } else {
      // Add new playbook
      const newPlaybook: Playbook = {
        ...formData,
        id: Math.max(...playbooks.map((p) => p.id), 0) + 1,
      };
      setPlaybooks((prev) => [...prev, newPlaybook]);
      setSelectedPlaybook(newPlaybook);
    }
    setIsAddEditDialogOpen(false);
    setEditingPlaybook(null);
  };

  const handleDeletePlaybook = () => {
    setPlaybooks((prev) => prev.filter((p) => p.id !== selectedPlaybook.id));
    setIsDeleteDialogOpen(false);
    if (playbooks.length > 1) {
      const remaining = playbooks.filter((p) => p.id !== selectedPlaybook.id);
      setSelectedPlaybook(remaining[0]);
    }
  };

  const handleAddRule = () => {
    setFormData((prev) => ({ ...prev, rules: [...prev.rules, ""] }));
  };

  const handleUpdateRule = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.map((r, i) => (i === index ? value : r)),
    }));
  };

  const handleRemoveRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateCondition = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.map((c) =>
        c.name === name ? { ...c, value } : c
      ),
    }));
  };

  const handleTogglePair = (pair: string) => {
    setFormData((prev) => ({
      ...prev,
      bestPairs: prev.bestPairs.includes(pair)
        ? prev.bestPairs.filter((p) => p !== pair)
        : [...prev.bestPairs, pair],
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategy Playbooks</h2>
          <p className="text-sm text-muted-foreground">
            Define, track, and optimize your trading strategies
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddPlaybook}>
          <Plus className="w-4 h-4" />
          New Playbook
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Playbook List */}
        <div className="lg:col-span-4 space-y-3">
          {playbooks.map((playbook) => (
            <Card
              key={playbook.id}
              onClick={() => setSelectedPlaybook(playbook)}
              className={cn(
                "p-4 cursor-pointer transition-all border",
                selectedPlaybook.id === playbook.id
                  ? "bg-primary/5 border-primary/30"
                  : "bg-card/50 border-border/50 hover:bg-secondary/30"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">{playbook.name}</h3>
                </div>
                <Badge
                  className={cn("text-[10px]", statusColors[playbook.status])}
                >
                  {playbook.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {playbook.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {playbook.winRate}%
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    {playbook.trades}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-semibold",
                    playbook.pnl >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {playbook.pnl >= 0 ? "+" : ""}${playbook.pnl.toLocaleString()}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Playbook Detail */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-6 bg-card/50 border-border/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">
                    {selectedPlaybook.name}
                  </h2>
                  <Badge className={cn(statusColors[selectedPlaybook.status])}>
                    {selectedPlaybook.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {selectedPlaybook.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditPlaybook(selectedPlaybook)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDuplicatePlaybook(selectedPlaybook)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive bg-transparent"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                <p className="text-2xl font-bold">
                  {selectedPlaybook.winRate}%
                </p>
                <Progress
                  value={selectedPlaybook.winRate}
                  className="h-1 mt-2"
                />
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Trades
                </p>
                <p className="text-2xl font-bold">{selectedPlaybook.trades}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last: {selectedPlaybook.lastUsed}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground mb-1">Avg R:R</p>
                <p className="text-2xl font-bold">1:{selectedPlaybook.avgRR}</p>
                <p className="text-xs text-muted-foreground mt-1">Target met</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground mb-1">Net P&L</p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    selectedPlaybook.pnl >= 0
                      ? "text-success"
                      : "text-destructive"
                  )}
                >
                  {selectedPlaybook.pnl >= 0 ? "+" : ""}$
                  {selectedPlaybook.pnl.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
            </div>

            {/* Conditions */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Trade Conditions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedPlaybook.conditions.map((condition) => (
                  <div
                    key={condition.name}
                    className="p-3 rounded-lg bg-secondary/20 border border-border/30"
                  >
                    <p className="text-[10px] text-muted-foreground mb-1">
                      {condition.name}
                    </p>
                    <p className="font-medium">{condition.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Entry Rules</h3>
              <div className="space-y-2">
                {selectedPlaybook.rules.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm">{rule}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Pairs */}
            <div>
              <h3 className="font-semibold mb-3">Best Performing Pairs</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlaybook.bestPairs.map((pair) => (
                  <Badge key={pair} variant="secondary" className="text-sm">
                    {pair}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent Trades with this Playbook */}
          <Card className="p-4 bg-card/50 border-border/50">
            <h3 className="font-semibold mb-3">
              Recent Trades Using This Playbook
            </h3>
            <div className="space-y-2">
              {[
                {
                  symbol: "EURUSD",
                  result: "win",
                  pnl: 245,
                  rr: "1:2.1",
                  date: "Today 09:32",
                },
                {
                  symbol: "GBPUSD",
                  result: "win",
                  pnl: 189,
                  rr: "1:1.8",
                  date: "Today 08:15",
                },
                {
                  symbol: "EURUSD",
                  result: "loss",
                  pnl: -124,
                  rr: "-1R",
                  date: "Yesterday 14:22",
                },
                {
                  symbol: "EURGBP",
                  result: "win",
                  pnl: 156,
                  rr: "1:1.6",
                  date: "Yesterday 09:45",
                },
              ].map((trade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/20"
                >
                  <div className="flex items-center gap-3">
                    {trade.result === "win" ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                    <div>
                      <span className="font-medium">{trade.symbol}</span>
                      <p className="text-xs text-muted-foreground">
                        {trade.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "font-semibold",
                        trade.result === "win"
                          ? "text-success"
                          : "text-destructive"
                      )}
                    >
                      {trade.pnl >= 0 ? "+" : ""}${trade.pnl}
                    </p>
                    <p className="text-xs text-muted-foreground">{trade.rr}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlaybook ? "Edit Playbook" : "Create New Playbook"}
            </DialogTitle>
            <DialogDescription>
              {editingPlaybook
                ? "Update your trading strategy."
                : "Define a new trading strategy with clear rules and conditions."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">Playbook Name</Label>
                <Input
                  id="name"
                  placeholder="London Breakout"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "testing" | "paused") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your trading strategy..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={2}
              />
            </div>

            {/* Trade Conditions */}
            <div className="space-y-3">
              <Label>Trade Conditions</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Session</p>
                  <Select
                    value={
                      formData.conditions.find((c) => c.name === "Session")
                        ?.value || ""
                    }
                    onValueChange={(value) =>
                      handleUpdateCondition("Session", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Setup</p>
                  <Select
                    value={
                      formData.conditions.find((c) => c.name === "Setup")
                        ?.value || ""
                    }
                    onValueChange={(value) =>
                      handleUpdateCondition("Setup", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {setupOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Timeframe</p>
                  <Select
                    value={
                      formData.conditions.find((c) => c.name === "Timeframe")
                        ?.value || ""
                    }
                    onValueChange={(value) =>
                      handleUpdateCondition("Timeframe", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframeOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Risk per Trade
                  </p>
                  <Select
                    value={
                      formData.conditions.find((c) => c.name === "Risk")
                        ?.value || ""
                    }
                    onValueChange={(value) =>
                      handleUpdateCondition("Risk", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {riskOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Entry Rules */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Entry Rules</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRule}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Rule
                </Button>
              </div>
              <div className="space-y-2">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <Input
                      placeholder={`Rule ${index + 1}...`}
                      value={rule}
                      onChange={(e) => handleUpdateRule(index, e.target.value)}
                      className="flex-1"
                    />
                    {formData.rules.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRule(index)}
                        className="shrink-0 h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Best Pairs */}
            <div className="space-y-2">
              <Label>Best Performing Pairs</Label>
              <div className="flex flex-wrap gap-2">
                {pairOptions.map((pair) => (
                  <Badge
                    key={pair}
                    variant={
                      formData.bestPairs.includes(pair) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleTogglePair(pair)}
                  >
                    {pair}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePlaybook} disabled={!formData.name}>
              {editingPlaybook ? "Save Changes" : "Create Playbook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Playbook</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedPlaybook.name}"? This
              will remove all associated rules and statistics. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlaybook}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Page;
