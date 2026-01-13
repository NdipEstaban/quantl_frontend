// components/TradingSync/ConnectionDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConnectionForm } from "./connection-form";
import { Platform } from "@/lib/store/trading-sync-store";

interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlatform: Platform | null;
  onConnect: (data: any) => void;
}

export function ConnectionDialog({
  open,
  onOpenChange,
  selectedPlatform,
  onConnect,
}: ConnectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {selectedPlatform
              ? `Connect ${selectedPlatform.name}`
              : "Select Platform"}
          </DialogTitle>
          <DialogDescription>
            {selectedPlatform?.description || "Choose a platform to connect"}
          </DialogDescription>
        </DialogHeader>

        {selectedPlatform && (
          <ConnectionForm
            platform={selectedPlatform}
            onConnect={onConnect}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
