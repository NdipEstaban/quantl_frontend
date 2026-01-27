// components/TradingSync/AccountCard.tsx
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  RefreshCw,
  XCircle,
  ChevronRight,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { platformConfig } from "@/lib/constants/platform-config";
import { ConnectedAccount } from "@/lib/types/trading-account-types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface AccountCardProps {
  account: ConnectedAccount;
  onClick: () => void;
  syncing: boolean;
}

export function AccountCard({ account, onClick }: AccountCardProps) {
  const platform = platformConfig[account.platform];

  const lastSync = formatDistanceToNow(new Date(account.lastSyncAt), {
    addSuffix: true,
  });

  const profit = account.equity - account.balance;
  const profitPercentage =
    account.balance > 0 ? (profit / account.balance) * 100 : 0;

  const marginUsage = account.equity > 0 ? (account.margin / account.equity) * 100 : 0;

  console.log("Account Card Render:", account);

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-secondary/30 border hover:border-primary/30 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4 p-4">
        <Image
          className="p-1 rounded-lg shrink-0"
          width={100}
          height={100}
          src={platform.logoUrl}
          alt={platform.name + " logo"}
        />

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-medium truncate">{account.accountName}</p>

                {account.isDemo && (
                  <Badge variant="outline" className="text-xs">
                    Demo
                  </Badge>
                )}

                {account.isContest && (
                  <Badge variant="outline" className="text-xs">
                    Contest
                  </Badge>
                )}

                {account.isActive && (
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

                {account.syncError && (
                  <Badge className="bg-destructive/10 text-destructive text-xs">
                    <XCircle className="w-3 h-3 mr-1" />
                    Error
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span>{account.brokerName}</span>
                <span>•</span>
                <span>Last sync: {lastSync}</span>
                <span>•</span>
                <span>{account.numberOfTrades} trades</span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>

          {account.syncError && (
            <div className="flex items-start gap-2 p-2 rounded bg-destructive/10 text-destructive text-xs">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              <span>{account.syncError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Balance</p>
              <p className="font-semibold text-sm">
                {account.balance} {account.currency}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-0.5">P&L</p>
              <div className="flex items-center gap-1">
                <p className="font-semibold text-sm">{account.equity}</p>
                {profit !== 0 && (
                  <span
                    className={cn(
                      "text-xs flex items-center",
                      profit > 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {profit > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(profitPercentage)}%
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Margin usage
              </p>
              <p className="font-semibold text-sm">{marginUsage}%</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Leverage</p>
              <p className="font-semibold text-sm">1:{account.leverage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
