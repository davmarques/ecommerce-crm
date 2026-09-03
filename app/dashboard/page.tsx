"use client";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { DashboardShell } from "@/components/features/dashboard/DashboardShell";
import { DashboardOverview } from "@/components/features/dashboard/DashboardOverview";

export default function DashboardPage() {
  const {
    user,
    isLoading,
    error,
    handleLogout,
    cardStats,
    recentOrders,
    recentActivities,
    ordersStatusSummary,
    chartPoints,
    targetPoints,
    monthLabels,
    formatCurrency,
  } = useDashboard();

  if (!user) return null;

  return (
    <DashboardShell user={user} onLogout={handleLogout}>
      <DashboardOverview
        user={user}
        cardStats={cardStats}
        recentOrders={recentOrders}
        recentActivities={recentActivities}
        ordersStatusSummary={ordersStatusSummary}
        chartPoints={chartPoints}
        targetPoints={targetPoints}
        monthLabels={monthLabels}
        isLoading={isLoading}
        error={error}
        formatCurrency={formatCurrency}
      />
    </DashboardShell>
  );
}


