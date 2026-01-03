import type React from "react";
import { TradeFormWizard } from "@/components/app/overview/trade-form-wizard";
import { Header } from "@/components/app/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TradeFormWizard />
      <Header />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </>
  );
}
