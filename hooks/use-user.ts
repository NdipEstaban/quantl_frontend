import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // or your toast library
import { useUserStore } from "@/lib/store/user-store";
import { authService } from "@/lib/services/auth-service";
import {
  LoginDto,
  RegisterDto,
  User,
  VerifyEmailDto,
} from "@/lib/types/auth-types";
import useSWR from "swr";
import Cookies from "js-cookie";
import { userService } from "@/lib/services/user-service";

export function useUser() {
  const { user, setUser, isAuthenticated, setAuth, clearAuth, setLoading } =
    useUserStore();
  const { data, error, isLoading, mutate, isValidating } = useSWR<
    BackendResponse<User>
  >(
    "/user/profile",
    user && user.id ? () => userService.getProfile(user.id) : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      onError: (error) => {
        toast.error("Failed to fetch user profile  ");
        console.error("Fetch user profile error:", error);
      },
      onSuccess: (data) => { 
        console.log("Fetched user profile:", data);
        setUser(data.data);
        toast.success("Successfully fetched user profile");
      }
    },
  );

  return {
    user: data?.data ?? null,
    isLoading,
    isError: error,
    isValidating,
    mutate,
    error,
  };
}
