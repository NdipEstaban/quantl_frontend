// lib/services/auth-service.ts
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  VerifyEmailDto,
} from "@/lib/types/auth";
import { apiClient } from "../api-client";

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Verify email with code
   */
  async verifyEmail(data: VerifyEmailDto): Promise<AuthResponse> {
    console.log(data);
    const response = await apiClient.post<AuthResponse>(
      "/auth/verify-email",
      data
    );
    return response.data;
  },

  /**
   * Login with email and password
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthResponse["user"]> {
    const response = await apiClient.get<AuthResponse["user"]>("/auth/profile");
    return response.data;
  },

  /**
   * Initiate Google OAuth
   */
  getGoogleAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  },

  /**
   * Initiate Facebook OAuth
   */
  getFacebookAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`;
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return response.data;
  },

  /**
   * Verify reset code
   */
  async verifyResetCode(
    email: string,
    code: string
  ): Promise<{ isValid: boolean }> {
    const response = await apiClient.post<{ isValid: boolean }>(
      "/auth/verify-reset-code",
      { email, code }
    );
    return response.data;
  },

  /**
   * Reset password with new password
   */
  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      "/auth/reset-password",
      { email, code, newPassword }
    );
    return response.data;
  },
};
