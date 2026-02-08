"use client";
import { VitalsSection } from "@/components/app/overview/vitals-section";
import { RefinementSection } from "@/components/app/overview/refinement-section";
import { BehavioralSection } from "@/components/app/overview/behavioral-section";
import { EquityCurve } from "@/components/app/overview/equity-curve";
import { RecentTrades } from "@/components/app/overview/recent-trades";
import { TradeManagementSection } from "@/components/app/overview/trade-management-section";
import { RiskMetricsSection } from "@/components/app/overview/risk-metrics-section";
import { StopOutSection } from "@/components/app/overview/stopout-section";
import AdvancedSection from "@/components/app/overview/advanced-section";
import { useTradingSummary } from "@/hooks/use-metrics";
import { useHeaderStore } from "@/lib/store/header-store";
import { useSynchronisationStore } from "@/lib/store/synchronisation-store";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUserStore } from "@/lib/store/user-store";
import { useConnectedAccounts } from "@/hooks/use-synchronisation";

function Page() {
  const { startDate, endDate } = useHeaderStore();
  const {
    accounts,
    mutate: mutateAccounts,
    isLoading: accountsLoading,
  } = useConnectedAccounts();
  const { selectedAccount } = useSynchronisationStore();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const { summary, isLoading, isValidating, mutate } = useTradingSummary(
    {
      tradingAccountId: selectedAccount?.id || accounts[0]?.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    true,
  );

  console.log(summary);

  const handleMonthYear = (month: number, year: number) => {};
  isLoading && <div>Loading...</div>;
  if (!summary) return <div>No data</div>;
  return (
    <div className="space-y-6">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column - Main Metrics */}
        <div className="lg:col-span-8 space-y-4">
          <VitalsSection
            current={summary?.vitals.current!}
            previous={summary?.vitals.previous!}
          />
          {/* <EquityCurve
            month={month}
            year={year}
            setMonthYear={}
            equityGrowth={summary?.equityGrowth}
            profitByDay={summary?.profitByDay}
          />  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RefinementSection />
            <BehavioralSection />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TradeManagementSection />
            <RiskMetricsSection />
          </div>
        </div>

        {/* Right Column - Advanced & Trades */}
        <div className="lg:col-span-4 space-y-4">
          <AdvancedSection />
          <StopOutSection />
          <RecentTrades />
        </div>
      </div>
    </div>
  );
}

export default Page;
