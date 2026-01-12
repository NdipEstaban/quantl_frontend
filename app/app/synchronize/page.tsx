"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Link as LinkIcon,
  Shield,
  RefreshCw,
  Database,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  Key,
  Lock,
  Globe,
  Search,
  Filter,
  ExternalLink,
  Eye,
  EyeOff,
  Settings,
  Unlink,
  TrendingUp,
  BarChart3,
  Wallet,
  Cpu,
  Zap,
  Smartphone,
  Cloud,
  AlertTriangle,
  Activity,
  FileText,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  name: string;
  icon: string;
  status: "popular" | "new" | "available" | "coming-soon";
  method: "oauth" | "api" | "manual" | "webhook";
  description: string;
  available: boolean;
  color: string;
}

interface ConnectedAccount {
  id: string;
  platform: string;
  platformId: string;
  nickname: string;
  status: "connected" | "error" | "syncing" | "warning";
  lastSync: string;
  syncFrequency: string;
  totalTrades: number;
  connectionMethod: string;
  autoSync: boolean;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  currency: string;
  leverage: number;
  isDemo: boolean;
  isPaperTrade: boolean;
  syncError?: string;
}

const platforms: Platform[] = [
  {
    id: "mt4",
    name: "MetaTrader 4/5",
    icon: "TrendingUp",
    status: "popular",
    method: "api",
    description: "Automatically sync trades from MT4/MT5 via API connection",
    available: true,
    color: "bg-blue-500",
  },
  {
    id: "ibkr",
    name: "Interactive Brokers",
    icon: "BarChart3",
    status: "popular",
    method: "oauth",
    description: "Secure connection via IBKR API for real-time trade sync",
    available: true,
    color: "bg-green-500",
  },
  {
    id: "tradingview",
    name: "TradingView",
    icon: "Globe",
    status: "popular",
    method: "webhook",
    description: "Connect your TradingView strategies and paper trading",
    available: true,
    color: "bg-purple-500",
  },
  {
    id: "ctrader",
    name: "cTrader",
    icon: "Cpu",
    status: "available",
    method: "api",
    description: "Sync trades from cTrader accounts via API key",
    available: true,
    color: "bg-cyan-500",
  },
  {
    id: "binance",
    name: "Binance",
    icon: "Wallet",
    status: "popular",
    method: "api",
    description: "Connect cryptocurrency trading accounts via API",
    available: true,
    color: "bg-yellow-500",
  },
  {
    id: "manual",
    name: "Manual Import",
    icon: "Upload",
    status: "available",
    method: "manual",
    description: "Upload trade history from any broker via CSV file",
    available: true,
    color: "bg-gray-500",
  },
];

const iconComponents: Record<string, any> = {
  TrendingUp,
  BarChart3,
  Globe,
  Cpu,
  Zap,
  Smartphone,
  Wallet,
  Upload,
  Cloud,
};

const methodIcons = {
  oauth: Lock,
  api: Key,
  manual: Upload,
  webhook: Globe,
};

export default function TradingSyncPage() {
  const [selectedAccount, setSelectedAccount] =
    useState<ConnectedAccount | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<
    ConnectedAccount[]
  >([
    {
      id: "1",
      platform: "mt4",
      platformId: "MT4-12345",
      nickname: "Main MT4 Account",
      status: "connected",
      lastSync: "2 minutes ago",
      syncFrequency: "5",
      totalTrades: 1245,
      connectionMethod: "API Key",
      autoSync: true,
      balance: 45230.5,
      equity: 46150.25,
      margin: 2500.0,
      freeMargin: 43650.25,
      currency: "USD",
      leverage: 100,
      isDemo: false,
      isPaperTrade: false,
    },
    {
      id: "2",
      platform: "binance",
      platformId: "BINANCE-67890",
      nickname: "Crypto Futures",
      status: "connected",
      lastSync: "5 minutes ago",
      syncFrequency: "15",
      totalTrades: 456,
      connectionMethod: "API Key",
      autoSync: true,
      balance: 28750.0,
      equity: 29100.5,
      margin: 1200.0,
      freeMargin: 27900.5,
      currency: "USDT",
      leverage: 20,
      isDemo: false,
      isPaperTrade: false,
    },
    {
      id: "3",
      platform: "tradingview",
      platformId: "TV-54321",
      nickname: "Strategy Backtester",
      status: "error",
      lastSync: "2 hours ago",
      syncFrequency: "30",
      totalTrades: 89,
      connectionMethod: "Webhook",
      autoSync: false,
      balance: 10000.0,
      equity: 10000.0,
      margin: 0,
      freeMargin: 10000.0,
      currency: "USD",
      leverage: 1,
      isDemo: false,
      isPaperTrade: true,
      syncError: "Webhook connection timeout",
    },
  ]);

  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [syncingAll, setSyncingAll] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [accountNickname, setAccountNickname] = useState("");
  const [server, setServer] = useState("live");
  const [readOnly, setReadOnly] = useState(true);

  const handleConnect = (platform: Platform) => {
    setSelectedPlatform(platform);
    setConnectionDialogOpen(true);
    setApiKey("");
    setApiSecret("");
    setAccountNickname(`My ${platform.name} Account`);
  };

  const handleApiConnect = () => {
    if (!apiKey || !apiSecret || !selectedPlatform) return;

    const newAccount: ConnectedAccount = {
      id: Date.now().toString(),
      platform: selectedPlatform.id,
      platformId: `${selectedPlatform.id.toUpperCase()}-${Math.random()
        .toString()
        .slice(2, 7)}`,
      nickname: accountNickname,
      status: "connected",
      lastSync: "Just now",
      syncFrequency: "15",
      totalTrades: 0,
      connectionMethod: "API Key",
      autoSync: true,
      balance: 10000,
      equity: 10000,
      margin: 0,
      freeMargin: 10000,
      currency: "USD",
      leverage: 50,
      isDemo: server === "demo",
      isPaperTrade: false,
    };
    setConnectedAccounts([...connectedAccounts, newAccount]);
    setConnectionDialogOpen(false);
    setSelectedAccount(newAccount);
  };

  const handleDisconnect = (accountId: string) => {
    setConnectedAccounts(
      connectedAccounts.filter((acc) => acc.id !== accountId)
    );
    if (selectedAccount?.id === accountId) {
      setSelectedAccount(connectedAccounts[0] || null);
    }
  };

  const handleSyncNow = (accountId: string) => {
    setConnectedAccounts(
      connectedAccounts.map((acc) =>
        acc.id === accountId
          ? { ...acc, status: "syncing", lastSync: "Syncing..." }
          : acc
      )
    );

    setTimeout(() => {
      setConnectedAccounts(
        connectedAccounts.map((acc) =>
          acc.id === accountId
            ? {
                ...acc,
                status: "connected",
                lastSync: "Just now",
                syncError: undefined,
              }
            : acc
        )
      );
    }, 2000);
  };

  const handleSyncAll = () => {
    setSyncingAll(true);
    const activeAccounts = connectedAccounts.filter(
      (a) => a.status !== "error"
    );

    setConnectedAccounts(
      connectedAccounts.map((acc) =>
        activeAccounts.some((a) => a.id === acc.id)
          ? { ...acc, status: "syncing", lastSync: "Syncing..." }
          : acc
      )
    );

    setTimeout(() => {
      setConnectedAccounts(
        connectedAccounts.map((acc) =>
          activeAccounts.some((a) => a.id === acc.id)
            ? {
                ...acc,
                status: "connected",
                lastSync: "Just now",
                syncError: undefined,
              }
            : acc
        )
      );
      setSyncingAll(false);
    }, 3000);
  };

  const handleToggleAutoSync = (accountId: string) => {
    setConnectedAccounts(
      connectedAccounts.map((acc) =>
        acc.id === accountId ? { ...acc, autoSync: !acc.autoSync } : acc
      )
    );
  };

  const handleUpdateSyncFrequency = (accountId: string, frequency: string) => {
    setConnectedAccounts(
      connectedAccounts.map((acc) =>
        acc.id === accountId ? { ...acc, syncFrequency: frequency } : acc
      )
    );
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform) return TrendingUp;
    return iconComponents[platform.icon] || TrendingUp;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    return platform?.color || "bg-primary";
  };

  const filteredPlatforms = platforms.filter((platform) => {
    if (searchQuery) {
      return (
        platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        platform.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterStatus === "available") return platform.available;
    if (filterStatus === "coming-soon") return !platform.available;
    return true;
  });

  const activeAccountsCount = connectedAccounts.filter(
    (a) => a.status === "connected"
  ).length;
  const syncingAccountsCount = connectedAccounts.filter(
    (a) => a.status === "syncing"
  ).length;
  const errorAccountsCount = connectedAccounts.filter(
    (a) => a.status === "error"
  ).length;

  // Calculate total portfolio value
  const totalPortfolioValue = connectedAccounts.reduce((sum, acc) => {
    // Convert all to USD equivalent (simplified - in real app would need exchange rates)
    return sum + acc.equity;
  }, 0);

  const totalBalance = connectedAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );
  const totalPnL = totalPortfolioValue - totalBalance;
  const totalPnLPercent =
    totalBalance > 0 ? ((totalPnL / totalBalance) * 100).toFixed(2) : "0.00";

  const renderConnectionForm = () => {
    if (!selectedPlatform) return null;

    if (selectedPlatform.method === "oauth") {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary/30 border">
            <h4 className="font-medium mb-3">Permissions Required</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Read-only access to your account
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                View trade history and positions
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-muted-foreground" />
                Cannot place or modify orders
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-muted-foreground" />
                Cannot withdraw funds
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Account Nickname</Label>
            <Input
              id="nickname"
              placeholder="My Trading Account"
              value={accountNickname}
              onChange={(e) => setAccountNickname(e.target.value)}
            />
          </div>

          <Button onClick={() => {}} className="w-full gap-2" size="lg">
            <Lock className="w-4 h-4" />
            Continue to {selectedPlatform.name}
          </Button>
        </div>
      );
    }

    if (selectedPlatform.method === "api") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-secret">API Secret</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1"
                onClick={() => setShowApiSecret(!showApiSecret)}
              >
                {showApiSecret ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    Show
                  </>
                )}
              </Button>
            </div>
            <Input
              id="api-secret"
              type={showApiSecret ? "text" : "password"}
              placeholder="Enter your API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="server">Server/Environment</Label>
            <Select value={server} onValueChange={setServer}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live Trading</SelectItem>
                <SelectItem value="demo">Demo/Paper Trading</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Account Nickname</Label>
            <Input
              id="nickname"
              placeholder="My Trading Account"
              value={accountNickname}
              onChange={(e) => setAccountNickname(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border">
            <Switch checked={readOnly} onCheckedChange={setReadOnly} />
            <div className="flex-1">
              <p className="text-sm font-medium">Enable read-only access</p>
              <p className="text-xs text-muted-foreground">
                Recommended. We'll never place trades on your behalf
              </p>
            </div>
          </div>

          <Button
            onClick={handleApiConnect}
            className="w-full"
            disabled={!apiKey || !apiSecret || !accountNickname}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Connect Account
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Account Sync</h1>
          <p className="text-sm text-muted-foreground">
            Connect your trading accounts to automatically import and track
            trades
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setSelectedPlatform(null);
            setConnectionDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Connect Account
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">
            Accounts
            {connectedAccounts.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {connectedAccounts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="browse">Browse</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 bg-card/50 border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-success/10">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {activeAccountsCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Active Connections
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-card/50 border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {connectedAccounts
                          .reduce((sum, acc) => sum + acc.totalTrades, 0)
                          .toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Trades Synced
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-card/50 border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <RefreshCw className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {connectedAccounts.filter((a) => a.autoSync).length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Auto-Sync Enabled
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {connectedAccounts.length > 0 ? (
                <>
                  <Card className="p-6 bg-card/50 border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Connected Accounts</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleSyncAll}
                        disabled={syncingAll || activeAccountsCount === 0}
                      >
                        <RefreshCw
                          className={cn(
                            "w-3 h-3",
                            syncingAll && "animate-spin"
                          )}
                        />
                        {syncingAll ? "Syncing..." : "Sync All"}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {connectedAccounts.map((account) => {
                        const PlatformIcon = getPlatformIcon(account.platform);
                        const platformColor = getPlatformColor(
                          account.platform
                        );
                        const platform = platforms.find(
                          (p) => p.id === account.platform
                        );
                        const equityChange = account.equity - account.balance;
                        const equityChangePercent = (
                          (equityChange / account.balance) *
                          100
                        ).toFixed(2);

                        return (
                          <div
                            key={account.id}
                            className="group relative overflow-hidden rounded-lg bg-secondary/30 border hover:border-primary/30 transition-all cursor-pointer"
                            onClick={() => {
                              setSelectedAccount(account);
                              setActiveTab("accounts");
                            }}
                          >
                            <div className="flex items-start gap-4 p-4">
                              <div
                                className={cn(
                                  "p-2.5 rounded-lg shrink-0",
                                  platformColor
                                )}
                              >
                                <PlatformIcon className="w-5 h-5 text-white" />
                              </div>

                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <p className="font-medium truncate">
                                        {account.nickname}
                                      </p>
                                      {account.isDemo && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Demo
                                        </Badge>
                                      )}
                                      {account.isPaperTrade && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Paper
                                        </Badge>
                                      )}
                                      {account.status === "connected" && (
                                        <Badge className="bg-success/10 text-success text-xs">
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                          Connected
                                        </Badge>
                                      )}
                                      {account.status === "syncing" && (
                                        <Badge className="bg-warning/10 text-warning text-xs">
                                          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                          Syncing
                                        </Badge>
                                      )}
                                      {account.status === "error" && (
                                        <Badge className="bg-destructive/10 text-destructive text-xs">
                                          <XCircle className="w-3 h-3 mr-1" />
                                          Error
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                      <span>{platform?.name}</span>
                                      <span>•</span>
                                      <span>Last sync: {account.lastSync}</span>
                                      <span>•</span>
                                      <span>
                                        {account.totalTrades.toLocaleString()}{" "}
                                        trades
                                      </span>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
                                </div>

                                {account.status === "error" &&
                                  account.syncError && (
                                    <div className="flex items-start gap-2 p-2 rounded bg-destructive/10 text-destructive text-xs">
                                      <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                      <span>{account.syncError}</span>
                                    </div>
                                  )}

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">
                                      Balance
                                    </p>
                                    <p className="font-semibold text-sm">
                                      {account.balance.toLocaleString()}{" "}
                                      {account.currency}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">
                                      Equity
                                    </p>
                                    <div className="flex items-center gap-1">
                                      <p className="font-semibold text-sm">
                                        {account.equity.toLocaleString()}
                                      </p>
                                      {equityChange !== 0 && (
                                        <span
                                          className={cn(
                                            "text-xs flex items-center",
                                            equityChange > 0
                                              ? "text-success"
                                              : "text-destructive"
                                          )}
                                        >
                                          {equityChange > 0 ? (
                                            <ArrowUpRight className="w-3 h-3" />
                                          ) : (
                                            <ArrowDownRight className="w-3 h-3" />
                                          )}
                                          {Math.abs(
                                            parseFloat(equityChangePercent)
                                          )}
                                          %
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">
                                      Free Margin
                                    </p>
                                    <p className="font-semibold text-sm">
                                      {account.freeMargin.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">
                                      Leverage
                                    </p>
                                    <p className="font-semibold text-sm">
                                      1:{account.leverage}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Portfolio Summary Card */}
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold mb-1">
                          Total Portfolio Value
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Across all connected accounts
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-primary/10">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-3xl font-bold mb-1">
                          $
                          {totalPortfolioValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm font-medium flex items-center gap-1",
                              totalPnL >= 0
                                ? "text-success"
                                : "text-destructive"
                            )}
                          >
                            {totalPnL >= 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            $
                            {Math.abs(totalPnL).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            ({totalPnL >= 0 ? "+" : ""}
                            {totalPnLPercent}%)
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Total P&L
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Total Balance
                          </p>
                          <p className="font-semibold">
                            $
                            {totalBalance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Live Accounts
                          </p>
                          <p className="font-semibold">
                            {
                              connectedAccounts.filter(
                                (a) => !a.isDemo && !a.isPaperTrade
                              ).length
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Demo Accounts
                          </p>
                          <p className="font-semibold">
                            {
                              connectedAccounts.filter(
                                (a) => a.isDemo || a.isPaperTrade
                              ).length
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="p-12 text-center bg-card/50 border-border/50 border-dashed">
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <LinkIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No accounts connected</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                    Connect your first trading account to start automatically
                    importing trades
                  </p>
                  <Button
                    onClick={() => setActiveTab("browse")}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Browse Platforms
                  </Button>
                </Card>
              )}
            </div>

            {/* Sync Status Sidebar */}
            <div className="space-y-4">
              <Card className="p-5 bg-card/50 border-border/50">
                <h3 className="font-semibold mb-4">Sync Status</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Accounts</span>
                    <span className="text-xl font-bold">
                      {activeAccountsCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Currently Syncing</span>
                    <span className="text-xl font-bold">
                      {syncingAccountsCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Requires Attention</span>
                    <span className="text-xl font-bold text-destructive">
                      {errorAccountsCount}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-card/50 border-border/50">
                <h3 className="font-semibold mb-4">Sync Limits</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Accounts Connected</span>
                      <span className="font-medium">
                        {connectedAccounts.length}/5
                      </span>
                    </div>
                    <Progress
                      value={(connectedAccounts.length / 5) * 100}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Daily Syncs</span>
                      <span className="font-medium">Unlimited</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Historical Data</span>
                      <span className="font-medium">90 days</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Security & Privacy</h3>
                </div>

                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Read-only access to your trading history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>Bank-level 256-bit encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>No withdrawal permissions</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          {selectedAccount ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-4 bg-card/50 border-border/50 lg:col-span-1">
                <h3 className="font-semibold mb-4">Your Accounts</h3>
                <div className="space-y-2">
                  {connectedAccounts.map((account) => {
                    const PlatformIcon = getPlatformIcon(account.platform);
                    const platformColor = getPlatformColor(account.platform);

                    return (
                      <div
                        key={account.id}
                        onClick={() => setSelectedAccount(account)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                          selectedAccount.id === account.id
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-secondary/30 hover:bg-secondary/50"
                        )}
                      >
                        <div className={cn("p-2 rounded-lg", platformColor)}>
                          <PlatformIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {account.nickname}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {account.totalTrades.toLocaleString()} trades
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6 bg-card/50 border-border/50">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "p-3 rounded-lg",
                          getPlatformColor(selectedAccount.platform)
                        )}
                      >
                        {(() => {
                          const Icon = getPlatformIcon(
                            selectedAccount.platform
                          );
                          return <Icon className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h2 className="text-xl font-bold">
                            {selectedAccount.nickname}
                          </h2>
                          <Badge className="bg-success/10 text-success">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                          {selectedAccount.isDemo && (
                            <Badge variant="outline">Demo</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {
                            platforms.find(
                              (p) => p.id === selectedAccount.platform
                            )?.name
                          }{" "}
                          • Last sync: {selectedAccount.lastSync}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Balance
                      </p>
                      <p className="text-lg font-bold">
                        {selectedAccount.balance.toLocaleString()}{" "}
                        {selectedAccount.currency}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Equity
                      </p>
                      <p className="text-lg font-bold">
                        {selectedAccount.equity.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Trades
                      </p>
                      <p className="text-lg font-bold">
                        {selectedAccount.totalTrades.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Leverage
                      </p>
                      <p className="text-lg font-bold">
                        1:{selectedAccount.leverage}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 border-border/50">
                  <h3 className="text-lg font-semibold mb-4">
                    Connection Settings
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Manage your connection and sync preferences
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border">
                      <div className="flex items-center gap-4 flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSyncNow(selectedAccount.id)}
                          disabled={selectedAccount.status === "syncing"}
                          className="gap-2"
                        >
                          {selectedAccount.status === "syncing" ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Sync Now
                            </>
                          )}
                        </Button>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={selectedAccount.autoSync}
                            onCheckedChange={() =>
                              handleToggleAutoSync(selectedAccount.id)
                            }
                          />
                          <div>
                            <p className="text-sm font-medium">
                              Auto-sync every {selectedAccount.syncFrequency}{" "}
                              min
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedAccount.autoSync
                                ? "Enabled"
                                : "Disabled"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                        onClick={() => handleDisconnect(selectedAccount.id)}
                      >
                        <Unlink className="w-4 h-4" />
                        Disconnect
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Label>Sync Frequency</Label>
                      <Select
                        value={selectedAccount.syncFrequency}
                        onValueChange={(val) =>
                          handleUpdateSyncFrequency(selectedAccount.id, val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Every 5 minutes</SelectItem>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="60">Every hour</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        How often to check for new trades
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Account Nickname</Label>
                      <div className="flex gap-2">
                        <Input value={selectedAccount.nickname} readOnly />
                        <Button variant="outline" size="icon">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-warning/5 border-warning/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm mb-1">
                        Security Notice
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Always use your{" "}
                        <span className="font-medium text-warning">
                          investor password
                        </span>{" "}
                        (read-only) when connecting third-party applications.
                        Never share your master trading password.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recent Sync Activity</h3>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        time: "2 minutes ago",
                        status: "success",
                        message: "Synced 3 new trades",
                      },
                      {
                        time: "17 minutes ago",
                        status: "success",
                        message: "Synced 1 new trade",
                      },
                      {
                        time: "32 minutes ago",
                        status: "success",
                        message: "No new trades",
                      },
                    ].map((log, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20"
                      >
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <div className="flex-1">
                          <p className="text-sm">{log.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center bg-card/50 border-border/50">
              <p className="text-muted-foreground">
                Select an account to view details
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search platforms..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="coming-soon">Coming Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlatforms.map((platform) => {
              const Icon = iconComponents[platform.icon] || TrendingUp;
              const MethodIcon = methodIcons[platform.method];

              return (
                <Card
                  key={platform.id}
                  className={cn(
                    "p-4 transition-all",
                    platform.available
                      ? "bg-card/50 border-border/50 hover:border-primary/30 hover:shadow-md cursor-pointer"
                      : "bg-muted/30 border-border/20 cursor-not-allowed opacity-60"
                  )}
                  onClick={() => platform.available && handleConnect(platform)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", platform.color)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{platform.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {platform.status === "popular" && (
                            <Badge className="bg-primary/10 text-primary text-xs">
                              Popular
                            </Badge>
                          )}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MethodIcon className="w-3 h-3" />
                            {platform.method === "oauth"
                              ? "OAuth"
                              : platform.method === "api"
                              ? "API"
                              : platform.method === "manual"
                              ? "Import"
                              : "Webhook"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {platform.description}
                  </p>

                  <Button
                    variant={platform.available ? "default" : "outline"}
                    className="w-full"
                    disabled={!platform.available}
                  >
                    {platform.available ? "Connect" : "Coming Soon"}
                  </Button>
                </Card>
              );
            })}
          </div>

          <Card className="p-6 bg-card/50 border-border/50">
            <div className="flex items-start gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold mb-1">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Get help with setup, troubleshooting, and best practices
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button variant="outline" className="justify-start gap-2">
                <FileText className="w-4 h-4" />
                Setup Guides
              </Button>
              <Button variant="outline" className="justify-start gap-2">
                <ExternalLink className="w-4 h-4" />
                Video Tutorials
              </Button>
              <Button className="gap-2">
                <Shield className="w-4 h-4" />
                Contact Support
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={connectionDialogOpen}
        onOpenChange={setConnectionDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            {selectedPlatform ? (
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", selectedPlatform.color)}>
                  {(() => {
                    const Icon = iconComponents[selectedPlatform.icon];
                    return <Icon className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div>
                  <DialogTitle>Connect to {selectedPlatform.name}</DialogTitle>
                  <DialogDescription>
                    {selectedPlatform.description}
                  </DialogDescription>
                </div>
              </div>
            ) : (
              <>
                <DialogTitle>Choose a Platform</DialogTitle>
                <DialogDescription>
                  Select a trading platform to connect your account
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          <div className="py-4">
            {selectedPlatform ? (
              renderConnectionForm()
            ) : (
              <div className="space-y-2">
                {platforms
                  .filter((p) => p.available)
                  .slice(0, 6)
                  .map((platform) => {
                    const Icon = iconComponents[platform.icon];
                    return (
                      <Button
                        key={platform.id}
                        variant="outline"
                        className="w-full justify-start gap-3 h-auto py-3"
                        onClick={() => {
                          setSelectedPlatform(platform);
                          setAccountNickname(`My ${platform.name} Account`);
                        }}
                      >
                        <div className={cn("p-2 rounded-lg", platform.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{platform.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {platform.description.slice(0, 50)}...
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setConnectionDialogOpen(false);
                    setActiveTab("browse");
                  }}
                >
                  View All Platforms
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

//synchronize mt5(credentials) => test connectivity => check if investor password => create trade account => download trade & deals data
