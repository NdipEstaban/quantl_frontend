// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, Mail, Shield, Lock, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    resetStep,
    resetEmail,
    isSubmitting,
    setResetStep,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Request Reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }

    await requestPasswordReset(email);
  };

  // Step 2: Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setErrors({ code: "Verification code is required" });
      return;
    }

    if (code.length < 4) {
      setErrors({ code: "Code must be 4 digits" });
      return;
    }

    await verifyResetCode(code);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await resetPassword(code, newPassword);
    if (result.success) {
      router.push("/login");
    }
  };

  const handleBack = () => {
    if (resetStep === "verify") {
      setResetStep("request");
      setEmail("");
    } else if (resetStep === "reset") {
      setResetStep("verify");
    } else {
      router.push("/login");
    }
  };

  // Step 1: Request Reset Form
  const renderRequestForm = () => (
    <form onSubmit={handleRequestReset} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="trader@example.com"
            className={cn(
              "pl-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
              errors.email && "border-red-500 focus-visible:ring-red-500"
            )}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            required
          />
        </div>
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
        <p className="text-xs text-muted-foreground mt-2">
          We'll send a verification code to this email address.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Code...
          </>
        ) : (
          "Send Reset Code"
        )}
      </Button>
    </form>
  );

  // Step 2: Verify Code Form
  const renderVerifyForm = () => (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 mb-3">
          <Mail className="h-6 w-6 text-emerald-500" />
        </div>
        <h3 className="font-medium">Check Your Email</h3>
        <p className="text-sm text-muted-foreground mt-1">
          We sent a verification code to <strong>{resetEmail}</strong>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Verification Code</Label>
        <div className="relative">
          <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="code"
            placeholder="Enter 4-digit code"
            className={cn(
              "pl-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
              errors.code && "border-red-500 focus-visible:ring-red-500"
            )}
            value={code}
            onChange={(e) => {
              // Allow only numbers
              const value = e.target.value.replace(/\D/g, "");
              setCode(value);
              if (errors.code) setErrors({ ...errors, code: "" });
            }}
            maxLength={4}
            required
          />
        </div>
        {errors.code && <p className="text-xs text-red-400">{errors.code}</p>}
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
          "Verify Code"
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <button
          type="button"
          className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
          onClick={() => requestPasswordReset(resetEmail)}
        >
          Resend code
        </button>
      </div>
    </form>
  );

  // Step 3: Reset Password Form
  const renderResetForm = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 mb-3">
          <KeyRound className="h-6 w-6 text-emerald-500" />
        </div>
        <h3 className="font-medium">Set New Password</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create a strong new password for your account
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            className={cn(
              "pl-9 pr-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
              errors.newPassword && "border-red-500 focus-visible:ring-red-500"
            )}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors({ ...errors, newPassword: "" });
            }}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </Button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-red-400">{errors.newPassword}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className={cn(
              "pl-9 pr-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
              errors.confirmPassword &&
                "border-red-500 focus-visible:ring-red-500"
            )}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors({ ...errors, confirmPassword: "" });
            }}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting Password...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );

  // Progress Steps
  const steps = [
    { key: "request", label: "Request Reset" },
    { key: "verify", label: "Verify Code" },
    { key: "reset", label: "New Password" },
  ];

  return (
    <div className="w-full min-h-screen flex text-foreground bg-background">
      {/* Left Side - Visual Hero */}
      <div className="hidden lg:flex w-1/2 bg-secondary/20 border-r border-border relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none" />

        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Recover Your Account.
            </h1>
            <p className="text-muted-foreground">
              Secure access to your trading journal and continue your profitable
              journey.
            </p>
          </div>

          {/* Security Tips Card */}
          <Card className="p-6 bg-card border-border/60 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold">Security Tips</h3>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                <span>Use a strong, unique password</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                <span>
                  Check your email spam folder if you don't receive the code
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                <span>The verification code expires after 15 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                <span>Contact support if you continue to have issues</span>
              </li>
            </ul>
          </Card>

          {/* Stats Card */}
          <Card className="p-6 bg-card border-border/60 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Account Recovery Success
                </div>
                <div className="text-2xl font-bold font-mono mt-1">99.8%</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-muted-foreground">
                  Average Time
                </div>
                <div className="text-2xl font-bold font-mono mt-1">2.4m</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="p-0 h-auto text-muted-foreground hover:text-foreground"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight">
              {resetStep === "request" && "Forgot Password"}
              {resetStep === "verify" && "Verify Your Identity"}
              {resetStep === "reset" && "Set New Password"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {resetStep === "request" &&
                "Enter your email to receive a reset code"}
              {resetStep === "verify" && "Enter the code sent to your email"}
              {resetStep === "reset" &&
                "Create a new password for your account"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div
                key={stepItem.key}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    stepItem.key === resetStep
                      ? "bg-emerald-600 text-white"
                      : index < steps.findIndex((s) => s.key === resetStep)
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-2 text-center">
                  {stepItem.label}
                </span>
              </div>
            ))}
          </div>

          {/* Form Steps */}
          {resetStep === "request" && renderRequestForm()}
          {resetStep === "verify" && renderVerifyForm()}
          {resetStep === "reset" && renderResetForm()}

          {/* Links */}
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Sign in
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
