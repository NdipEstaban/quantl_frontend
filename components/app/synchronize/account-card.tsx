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
import { ConnectedAccount } from "@/lib/store/trading-sync-store";
import { platformConfig } from "@/lib/constants/platorm-config";

interface AccountCardProps {
  account: ConnectedAccount;
  onClick: () => void;
}

export function AccountCard({ account, onClick }: AccountCardProps) {
  const platform = platformConfig[account.platform];
  const PlatformIcon = platform?.icon;
  const platformColor = platform?.color || "bg-primary";

  const equityChange = account.equity - account.balance;
  const equityChangePercent = ((equityChange / account.balance) * 100).toFixed(
    2
  );

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-secondary/30 border hover:border-primary/30 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4 p-4">
        <div className={cn("p-2.5 rounded-lg shrink-0", platformColor)}>
          {PlatformIcon && <PlatformIcon className="w-5 h-5 text-white" />}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-medium truncate">{account.nickname}</p>

                {account.isDemo && (
                  <Badge variant="outline" className="text-xs">
                    Demo
                  </Badge>
                )}

                {account.isPaperTrade && (
                  <Badge variant="outline" className="text-xs">
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
                <span>{account.totalTrades.toLocaleString()} trades</span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>

          {account.status === "error" && account.syncError && (
            <div className="flex items-start gap-2 p-2 rounded bg-destructive/10 text-destructive text-xs">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              <span>{account.syncError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Balance</p>
              <p className="font-semibold text-sm">
                {account.balance.toLocaleString()} {account.currency}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Equity</p>
              <div className="flex items-center gap-1">
                <p className="font-semibold text-sm">
                  {account.equity.toLocaleString()}
                </p>
                {equityChange !== 0 && (
                  <span
                    className={cn(
                      "text-xs flex items-center",
                      equityChange > 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {equityChange > 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(parseFloat(equityChangePercent))}%
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
              <p className="text-xs text-muted-foreground mb-0.5">Leverage</p>
              <p className="font-semibold text-sm">1:{account.leverage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
