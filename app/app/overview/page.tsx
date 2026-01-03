import { VitalsSection } from "@/components/app/overview/vitals-section";
import { RefinementSection } from "@/components/app/overview/refinement-section";
import { BehavioralSection } from "@/components/app/overview/behavioral-section";
import { EquityCurve } from "@/components/app/overview/equity-curve";
import { RecentTrades } from "@/components/app/overview/recent-trades";
import { TradeManagementSection } from "@/components/app/overview/trade-management-section";
import { RiskMetricsSection } from "@/components/app/overview/risk-metrics-section";
import { StopOutSection } from "@/components/app/overview/stopout-section";
import AdvancedSection from "@/components/app/overview/advanced-section";

function Page() {
  return (
    <div className="space-y-6">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column - Main Metrics */}
        <div className="lg:col-span-8 space-y-4">
          <VitalsSection />
          <EquityCurve />
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
