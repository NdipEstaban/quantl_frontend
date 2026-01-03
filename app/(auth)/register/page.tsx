"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  Eye,
  EyeOff,
  BarChart2,
  CheckCircle2,
  User,
  Mail,
  Lock,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.password.length < 8 && formData.password.length > 0) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full min-h-screen flex text-foreground bg-background">
      {/* Left Side - Visual Hero */}
      <div className="hidden lg:flex w-1/2 bg-secondary/20 border-r border-border relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none" />

        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Start Trading Professionally.
            </h1>
            <p className="text-muted-foreground">
              Join thousands of traders who use data to remove emotion and find
              their edge.
            </p>
          </div>

          {/* Abstract Statistics Card Visual */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-card border-border/60 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <BarChart2 className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-sm font-medium">Win Rate</span>
              </div>
              <div className="text-2xl font-bold font-mono">68.5%</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +2.4% this month
              </div>
            </Card>

            <Card className="p-4 bg-card border-border/60 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm font-medium">Plan Adherence</span>
              </div>
              <div className="text-2xl font-bold font-mono">92%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Discipline score
              </div>
            </Card>

            <Card className="col-span-2 p-4 bg-card border-border/60 shadow-xl backdrop-blur-sm flex items-center justify-between">
              <div>
                <div className="text-sm font-medium mb-1">Total P&L</div>
                <div className="text-xs text-muted-foreground">
                  All time performance
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                +$14,205.00
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight">
              Create an account
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your details below to set up your journal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="trader@example.com"
                  className="pl-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "pl-9 pr-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
                    errors.password &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
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
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  className={cn(
                    "pl-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
                    errors.confirmPassword &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                  }}
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
