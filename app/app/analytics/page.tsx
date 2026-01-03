"use client";

import DistributionTab from "@/components/app/analytics/Distribution";
import EdgeMetricsTab from "@/components/app/analytics/Edge";
import PerformanceTab from "@/components/app/analytics/Peformance";
import PsychologyTab from "@/components/app/analytics/Psychology";
import StopOutsTab from "@/components/app/analytics/StopOuts";
import TimeAnalysisTab from "@/components/app/analytics/Time";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
          <TabsTrigger value="psychology">Psychology</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="edge">Edge Metrics</TabsTrigger>
          <TabsTrigger value="stopouts">Stop-Outs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <PerformanceTab />
        </TabsContent>

        <TabsContent value="time">
          <TimeAnalysisTab />
        </TabsContent>

        <TabsContent value="psychology">
          <PsychologyTab />
        </TabsContent>

        <TabsContent value="distribution">
          <DistributionTab />
        </TabsContent>

        <TabsContent value="edge">
          <EdgeMetricsTab />
        </TabsContent>

        <TabsContent value="stopouts">
          <StopOutsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
