// app/auth/callback/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { useUserStore } from "@/lib/store/user-store";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useUserStore();

  useEffect(() => {
    // 1. Get user data from URL (passed by backend)
    const userParam = searchParams.get("user");

    // 2. Grab the tokens that the backend just set in the cookies
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (accessToken && refreshToken && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));

        // 3. Update Zustand Store
        // This ensures your UI knows who is logged in and Axios has the Bearer token
        setAuth(user, accessToken, refreshToken);

        // 4. Persist user info for instant UI hydration on refresh
        localStorage.setItem("user_profile", JSON.stringify(user));

        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to parse user data:", error);
        router.push("/login?error=invalid_user_data");
      }
    } else {
      // If cookies or userParam are missing, the OAuth flow failed
      console.error("Auth components missing: ", {
        hasAccess: !!accessToken,
        hasRefresh: !!refreshToken,
        hasUser: !!userParam,
      });
      router.push("/login?error=oauth_failed");
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
        <p className="text-muted-foreground text-lg">
          Finishing your secure login...
        </p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
