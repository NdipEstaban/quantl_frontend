// types/auth.types.ts

/**
 * User entity matching backend Prisma schema
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  imageUrl?: string;
  emailVerified?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  PREMIUM = "PREMIUM",
}

/**
 * Auth DTOs
 */
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface VerifyEmailDto {
  email: string;
  verificationCode?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * Auth Response from API
 */
export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

/**
 * JWT Payload structure
 */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * OAuth Provider types
 */
export enum AuthProvider {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, any>;
}

/**
 * Auth Result type for hook responses
 */
export interface AuthResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// types/api.types.ts

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// types/user.types.ts

/**
 * User statistics
 */
export interface UserStats {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
}

/**
 * User activity item
 */
export interface UserActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: ActivityType;
}

export enum ActivityType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  TRADE_CREATED = "TRADE_CREATED",
  TRADE_UPDATED = "TRADE_UPDATED",
  PROFILE_UPDATED = "PROFILE_UPDATED",
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    trading: boolean;
  };
  privacy: {
    showProfile: boolean;
    showStats: boolean;
  };
}

// types/form.types.ts

/**
 * Form field error
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * Form state
 */
export interface FormState<T = any> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Example usage in components:

// import { User, AuthResponse, ApiError } from '@/types/auth.types';
//
// const handleLogin = async (data: LoginDto): Promise<AuthResult<AuthResponse>> => {
//   try {
//     const response = await authService.login(data);
//     return { success: true, data: response };
//   } catch (error) {
//     const apiError = error as ApiError;
//     return { success: false, error: apiError.message };
//   }
// };
