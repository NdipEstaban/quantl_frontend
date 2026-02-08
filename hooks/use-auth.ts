"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // or your toast library
import { useUserStore } from "@/lib/store/user-store";
import { authService } from "@/lib/services/auth-service";
import { LoginDto, RegisterDto, VerifyEmailDto } from "@/lib/types/auth-types";
import useSWR from "swr";
import Cookies from "js-cookie";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, clearAuth, setLoading } =
    useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStep, setResetStep] = useState<"request" | "verify" | "reset">(
    "request",
  );
  const [resetEmail, setResetEmail] = useState("");

  /**
   * Register a new user
   */
  const register = async (data: RegisterDto) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await authService.register(data);

      toast.success(
        "Registration successful! Please check your email for verification code.",
      );

      return { success: true, data: response };
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  /**
   * Verify email with code
   */
  const verifyEmail = async (data: VerifyEmailDto) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await authService.verifyEmail(data);

      const tokens = response.tokens || {
        accessToken: response.accessToken!,
        refreshToken: response.refreshToken!,
      };

      setAuth(response.user, tokens.accessToken, tokens.refreshToken);

      toast.success("Email verified successfully!");
      router.push("/dashboard");

      return { success: true, data: response };
    } catch (error: any) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  // const login = async (data: LoginDto) => {
  //   setIsSubmitting(true);
  //   setLoading(true);

  //   try {
  //     const response = await authService.login(data);

  //     setAuth(response.user, response.accessToken!, response.refreshToken!);

  //     toast.success("Login successful!");
  //     router.push("/app");

  //     return { success: true, data: response };
  //   } catch (error: any) {
  //     const message = error.response?.data?.message || "Login failed";
  //     toast.error(message);
  //     return { success: false, error: message };
  //   } finally {
  //     setIsSubmitting(false);
  //     setLoading(false);
  //   }
  // };

  const login = async (data: LoginDto) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await authService.login(data);

      // Extract tokens regardless of which structure the backend used
      const access = response.accessToken || response.tokens?.accessToken;
      const refresh = response.refreshToken || response.tokens?.refreshToken;

      if (refresh && access) {
        // 1. Set Access Token Cookie (Short lived, e.g., 15 mins matching JWT exp)
        Cookies.set("accessToken", access, {
          secure: true,
          sameSite: "strict",
          path: "/", // Critical so it's available on all routes
        });

        // 2. Set Refresh Token Cookie
        Cookies.set("refreshToken", refresh, {
          expires: data.rememberMe ? 30 : undefined,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      }

      // Update your global state (Zustand, Redux, or Context)
      setAuth(response.user, access!, refresh!);

      // PERSIST USER: Save minimal profile info to local storage for instant UI loading
      localStorage.setItem("user_profile", JSON.stringify(response.user));

      toast.success("Login successful!");
      router.push("/app");

      return { success: true, data: response };
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    setLoading(true);

    try {
      await authService.logout();
      clearAuth();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      // Clear auth even if API call fails
      clearAuth();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with Google OAuth
   */
  const loginWithGoogle = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  /**
   * Login with Facebook OAuth
   */
  const loginWithFacebook = () => {
    window.location.href = authService.getFacebookAuthUrl();
  };

  /**
   * Request password reset
   */
  const requestPasswordReset = async (email: string) => {
    setIsSubmitting(true);

    try {
      const response = await authService.requestPasswordReset(email);
      setResetEmail(email);
      setResetStep("verify");
      toast.success("Reset code sent to your email");
      return { success: true, data: response };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to send reset code";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Verify reset code
   */
  const verifyResetCode = async (code: string) => {
    setIsSubmitting(true);

    try {
      const response = await authService.verifyResetCode(resetEmail, code);
      if (response.isValid) {
        setResetStep("reset");
        toast.success("Code verified successfully");
        return { success: true, data: response };
      } else {
        toast.error("Invalid verification code");
        return { success: false, error: "Invalid verification code" };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to verify code";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (code: string, newPassword: string) => {
    setIsSubmitting(true);

    try {
      const response = await authService.resetPassword(
        resetEmail,
        code,
        newPassword,
      );
      toast.success("Password reset successful");

      // Reset the flow
      setResetStep("request");
      setResetEmail("");

      return { success: true, data: response };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to reset password";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsSubmitting(false);
    }
  };

  /*const refreshToken = async () => {
    setLoading(true);
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) {
      const currentPath = window.location.pathname;
      router.replace(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      toast.info("Session expired, please log in again.");
      return;
    }

    const response = await authService.refreshToken(refreshToken!);
    if (response.accessToken && response.refreshToken) {
      setAuth(response.user, response.accessToken, response.refreshToken);
      Cookies.set("refresh_token", response.refreshToken, {
        expires: 30,
        secure: false, //TODO: set to true if in production,
        sameSite: "strict",
      });
      return { success: true };
    } else {
      const currentPath = window.location.pathname;
      router.replace(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      toast.info("Session expired, please log in again.");
    }
    setLoading(false);
    return { success: false };
  };*/

  return {
    user,
    isAuthenticated,
    isLoading: useUserStore.getState().isLoading,
    isSubmitting,
    register,
    verifyEmail,
    login,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    resetStep,
    resetEmail,
    setResetStep,
  };
}
