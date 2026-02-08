"use client";

import { useAuth } from "@/hooks/use-auth";
import { useConnectedAccounts } from "@/hooks/use-synchronisation";
import { useHeaderStore } from "@/lib/store/header-store";
import { redirect } from "next/navigation";

export default function Page() {
  const {user} = useAuth();
  const {accounts} = useConnectedAccounts()
  redirect("/app/overview");
}
