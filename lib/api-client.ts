import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { useUserStore } from "./store/user-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor variables
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Handle concurrent 401s while refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = useUserStore.getState().refreshToken;

    // If no refresh token exists, clear everything and go to login
    if (!refreshToken) {
      handleAuthError();
      return Promise.reject(error);
    }

    try {
      // Note: Use a fresh axios instance to avoid infinite loops with the interceptor
      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        { refreshToken },
        { withCredentials: true },
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // 1. UPDATE COOKIES (Critical for proxy.ts/Middleware)
      // Path '/' ensures the cookie is accessible across the entire app
      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      Cookies.set("refreshToken", newRefreshToken, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      // 2. UPDATE STORE
      useUserStore.getState().setTokens(accessToken, newRefreshToken);

      // 3. RETRY ORIGINAL REQUEST
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      processQueue(null, accessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      handleAuthError();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

/**
 * Helper to clean up state on total authentication failure
 */
function handleAuthError() {
  useUserStore.getState().clearAuth();

  // Wipe cookies for the proxy
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });

  // Wipe persistence
  localStorage.removeItem("user_profile");

  // Redirect only on the client side
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
