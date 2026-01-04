// hooks/use-auth.ts
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // or your toast library
import { useAuthStore } from "@/lib/store/auth-store";
import { authService } from "@/lib/services/auth-service";
import { LoginDto, RegisterDto, VerifyEmailDto } from "@/types/auth.types";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth, clearAuth, setLoading } =
    useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStep, setResetStep] = useState<"request" | "verify" | "reset">(
    "request"
  );
  const [resetEmail, setResetEmail] = useState("");

  // Fetch user profile using SWR (only if authenticated)
  const {
    data: profile,
    error: profileError,
    mutate: mutateProfile,
    isLoading: isLoadingProfile,
  } = useSWR(
    isAuthenticated ? "/auth/profile" : null,
    () => authService.getProfile(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      onSuccess: (data) => {
        if (data) {
          useAuthStore.getState().setUser(data);
        }
      },
      onError: () => {
        clearAuth();
      },
    }
  );

  /**
   * Register a new user
   */
  const register = async (data: RegisterDto) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await authService.register(data);

      toast.success(
        "Registration successful! Please check your email for verification code."
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
  const login = async (data: LoginDto) => {
    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await authService.login(data);

      setAuth(response.user, response.accessToken!, response.refreshToken!);

      toast.success("Login successful!");
      router.push("/dashboard");

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
        newPassword
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

  return {
    user: profile || user,
    isAuthenticated,
    isLoading: isLoadingProfile || useAuthStore.getState().isLoading,
    isSubmitting,
    register,
    verifyEmail,
    login,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    mutateProfile,
    requestPasswordReset,
    verifyResetCode,
    resetPassword,
    resetStep,
    resetEmail,
    setResetStep,
  };
}
