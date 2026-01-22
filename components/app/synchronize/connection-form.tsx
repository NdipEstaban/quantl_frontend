// components/TradingSync/ConnectionForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  XCircle,
  Lock,
  LinkIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { useConnectAccount } from "@/hooks/use-trading-account";
import {
  useTradingSyncStore,
} from "@/lib/store/trading-account-store";
import { Platform } from "@/lib/types/trading-account-types";

interface ConnectionFormProps {
  platform: Platform;
  onConnect: (data: any) => void;
  onCancel: () => void;
}

export function ConnectionForm({
  platform,
  onConnect,
  onCancel,
}: ConnectionFormProps) {
  const { connectionForm, updateConnectionForm } = useTradingSyncStore();
  const { connectAccount, isConnecting, error } = useConnectAccount();

  const handleSubmit = async () => {
    if (platform.method === "api") {
      if (
        !connectionForm.apiKey ||
        !connectionForm.apiSecret ||
        !connectionForm.accountNickname
      ) {
        return;
      }

      try {
        const result = await connectAccount({
          platformId: platform.id,
          apiKey: connectionForm.apiKey,
          apiSecret: connectionForm.apiSecret,
          nickname: connectionForm.accountNickname,
          server: connectionForm.server,
          readOnly: connectionForm.readOnly,
        });
        onConnect(result);
      } catch (err) {
        console.error("Failed to connect account:", err);
      }
    }
  };

  if (platform.method === "oauth") {
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
            value={connectionForm.accountNickname}
            onChange={(e) =>
              updateConnectionForm({ accountNickname: e.target.value })
            }
          />
        </div>

        <Button onClick={handleSubmit} className="w-full gap-2" size="lg">
          <Lock className="w-4 h-4" />
          Continue to {platform.name}
        </Button>
      </div>
    );
  }

  if (platform.method === "api") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            placeholder="Enter your API Key"
            value={connectionForm.apiKey}
            onChange={(e) => updateConnectionForm({ apiKey: e.target.value })}
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
              onClick={() =>
                updateConnectionForm({
                  showApiSecret: !connectionForm.showApiSecret,
                })
              }
            >
              {connectionForm.showApiSecret ? (
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
            type={connectionForm.showApiSecret ? "text" : "password"}
            placeholder="Enter your API Secret"
            value={connectionForm.apiSecret}
            onChange={(e) =>
              updateConnectionForm({ apiSecret: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="server">Server/Environment</Label>
          <Select
            value={connectionForm.server}
            onValueChange={(value) => updateConnectionForm({ server: value })}
          >
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
            value={connectionForm.accountNickname}
            onChange={(e) =>
              updateConnectionForm({ accountNickname: e.target.value })
            }
          />
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border">
          <Switch
            checked={connectionForm.readOnly}
            onCheckedChange={(checked) =>
              updateConnectionForm({ readOnly: checked })
            }
          />
          <div className="flex-1">
            <p className="text-sm font-medium">Enable read-only access</p>
            <p className="text-xs text-muted-foreground">
              Recommended. We'll never place trades on your behalf
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error.message}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={
              !connectionForm.apiKey ||
              !connectionForm.apiSecret ||
              !connectionForm.accountNickname ||
              isConnecting
            }
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            {isConnecting ? "Connecting..." : "Connect Account"}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
