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
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

// SVG Icon Components for OAuth buttons
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill="#1877F2"
    />
    <path
      d="M16.671 15.543l.532-3.47h-3.328V9.823c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.655H7.078v3.47h3.047v8.385a12.084 12.084 0 003.75 0v-8.385h2.796z"
      fill="#FFFFFF"
    />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const { register, isSubmitting, loginWithGoogle, loginWithFacebook } =
    useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("submitting");

    if (!validate()) return;

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // Redirect to verification page
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    }
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

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              onClick={loginWithGoogle}
              disabled={isSubmitting}
            >
              <GoogleIcon className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              onClick={loginWithFacebook}
              disabled={isSubmitting}
            >
              <FacebookIcon className="w-5 h-5 mr-2" />
              Continue with Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className={cn(
                    "bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
                    errors.firstName &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    if (errors.firstName)
                      setErrors({ ...errors, firstName: "" });
                  }}
                  required
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className={cn(
                    "bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
                    errors.lastName &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    if (errors.lastName) setErrors({ ...errors, lastName: "" });
                  }}
                  required
                />
                {errors.lastName && (
                  <p className="text-xs text-red-400">{errors.lastName}</p>
                )}
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
                  className={cn(
                    "pl-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
                    errors.email && "border-red-500 focus-visible:ring-red-500"
                  )}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
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
                  type={showConfirmPassword ? "text" : "password"}
                  className={cn(
                    "pl-9 pr-9 bg-secondary/20 border-zinc-500/30 focus-visible:ring-emerald-500/50",
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
