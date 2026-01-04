"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const { verifyEmail, isSubmitting } = useAuth();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Verification code is required");
      return;
    }

    if (code.length !== 4) {
      setError("Verification code must be 4 digits");
      return;
    }

    await verifyEmail({ email, verificationCode: code });
  };

  const handleResendCode = async () => {
    setError("");

    await verifyEmail({ email });
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-full">
              <Mail className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Verify your email
          </h2>
          <p className="text-sm text-muted-foreground">
            We sent a verification code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 4-digit code"
              maxLength={4}
              className="text-center text-2xl tracking-widest bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setCode(value);
                if (error) setError("");
              }}
              required
              autoFocus
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
              onClick={() => handleResendCode()}
            >
              Resend code
            </button>
          </p>

          <Link
            href="/register"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to registration
          </Link>
        </div>
      </div>
    </div>
  );
}
