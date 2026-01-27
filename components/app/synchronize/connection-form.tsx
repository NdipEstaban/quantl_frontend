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
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { useConnectAccount } from "@/hooks/use-synchronisation";
import {
  Platform,
  platformBackendIds,
} from "@/lib/types/trading-account-types";
import {
  getPlatformAuthConfig,
  platformConfig,
} from "@/lib/constants/platform-config";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/auth-store";

interface ConnectionFormProps {
  platform: Platform;
  onCancel: () => void;
}

export function ConnectionForm({ platform, onCancel }: ConnectionFormProps) {
  const { connectAccount, isConnecting, error } = useConnectAccount();
  const authConfig = getPlatformAuthConfig(platform.id);
  const { user } = useAuthStore();

  // Dynamic form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [nickname, setNickname] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {},
  );

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setShowPasswords((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const validateForm = (): boolean => {
    if (!authConfig) return false;

    // Check if all required fields are filled
    for (const field of authConfig.fields) {
      if (field.required && !formData[field.name]) {
        return false;
      }
    }

    // Check nickname if required
    if (authConfig.requiresNickname && !nickname) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (user) {
        await connectAccount({
          platformId: platform.id.toString(),
          credentials: { ...formData, userId: user.id },
          nickname: nickname,
          userId: user.id,
        });
      }
    } catch (err) {
      console.error("Failed to connect account:", err);
    }
  };

  // OAuth flow
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

        {authConfig?.requiresNickname && (
          <div className="space-y-2">
            <Label htmlFor="nickname">Account Nickname</Label>
            <Input
              id="nickname"
              placeholder="My Trading Account"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full gap-2" size="lg">
          <Lock className="w-4 h-4" />
          Continue to {platform.name}
        </Button>
      </div>
    );
  }

  // Webhook flow
  if (platform.method === "webhook") {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-blue-700 dark:text-blue-400">
                How Webhook Integration Works
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                After setup, you'll receive a unique webhook URL to use in your
                TradingView alerts. Whenever an alert fires, TradingView will
                send the signal to this URL.
              </p>
            </div>
          </div>
        </div>

        {authConfig?.requiresNickname && (
          <div className="space-y-2">
            <Label htmlFor="nickname">Integration Name</Label>
            <Input
              id="nickname"
              placeholder="My TradingView Signals"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={!nickname || isConnecting}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            {isConnecting ? "Creating..." : "Generate Webhook URL"}
          </Button>
        </div>
      </div>
    );
  }

  // API/Manual flow
  if (platform.method === "api" || platform.method === "manual") {
    if (!authConfig) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          Configuration not available for this platform.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Dynamic form fields based on platform */}
        {authConfig.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>

              {field.type === "password" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1"
                  onClick={() => togglePasswordVisibility(field.name)}
                >
                  {showPasswords[field.name] ? (
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
              )}
            </div>

            {field.type === "select" ? (
              <Select
                value={formData[field.name] || ""}
                onValueChange={(value) => handleFieldChange(field.name, value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={field.placeholder || "Select an option"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.name}
                type={
                  field.type === "password" && !showPasswords[field.name]
                    ? "password"
                    : "text"
                }
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              />
            )}

            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        ))}

        {/* Nickname field */}
        {authConfig.requiresNickname && (
          <div className="space-y-2">
            <Label htmlFor="nickname">
              Account Nickname
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="nickname"
              placeholder="My Trading Account"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        )}

        {/* Read-only toggle */}
        {authConfig.securityNotice && (
          <Card className="p-3 sm:p-4 bg-warning/5 border-warning/20">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-xs sm:text-sm mb-1">
                  Security Notice
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {authConfig.securityNotice}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Error display */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error.message}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={!validateForm() || isConnecting}
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
