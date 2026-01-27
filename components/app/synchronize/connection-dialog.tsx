// components/TradingSync/ConnectionDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConnectionForm } from "./connection-form";
import { Platform } from "@/lib/types/trading-account-types";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useSynchronisationStore } from "@/lib/store/synchronisation-store";
import { getPlatformsList } from "@/lib/constants/platform-config";
import { useConnectAccount, useConnectedAccounts } from "@/hooks/use-synchronisation";

export function ConnectionDialog() {
  const {
    selectedPlatform,
    setSelectedPlatform,
    setConnectionDialogOpen,
    connectionDialogOpen,
  } = useSynchronisationStore();
  const platforms = getPlatformsList();

  const handleOpenChange = (open:boolean) => {
    if (!open) {
      setSelectedPlatform(null);
    }
    setConnectionDialogOpen(open);
  };

  const handleBack = () => {
    setSelectedPlatform(null);
  };

  const handlePlatformSelect = (platform: Platform) => {
    if (platform.available) {
      setSelectedPlatform(platform);
    }
  };

  return (
    <Dialog open={connectionDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-135">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {selectedPlatform && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1">
              <DialogTitle>
                {selectedPlatform
                  ? `Connect ${selectedPlatform.name}`
                  : "Select Trading Platform"}
              </DialogTitle>
              <DialogDescription>
                {selectedPlatform
                  ? selectedPlatform.description
                  : "Choose a platform to sync your trading data"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!selectedPlatform ? (
          <div className="grid gap-3 py-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handlePlatformSelect(platform)}
                disabled={!platform.available}
                className={`
                  group relative flex items-center gap-4 p-4 rounded-lg border-2 
                  transition-all text-left
                  ${
                    platform.available
                      ? "hover:border-primary hover:bg-accent cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }
                `}
              >
                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-secondary">
                  <Image
                    src={platform.logoUrl}
                    alt={platform.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base">{platform.name}</h3>
                    {!platform.available && (
                      <Badge variant="secondary" className="text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {platform.description}
                  </p>
                </div>

                {platform.available && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <ConnectionForm
            platform={selectedPlatform}
            onCancel={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
