"use client";

import { Users, Building2, FileText, Receipt, DollarSign } from "lucide-react";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";

import RevenueChart from "../../components/dashboard/RevenueChart";
import SalesOverview from "../../components/dashboard/SalesOverview";

import RecentInvoices from "../../components/dashboard/RecentInvoices";
import RecentPayments from "../../components/dashboard/RecentPayments";
import RecentQuotations from "../../components/dashboard/RecentQuotations";
import RecentActivity from "../../components/dashboard/RecentActivity";

import useDashboard from "@/hooks/useDashboard";

export default function SuperAdminDashboard() {
  const { data, loading, error } = useDashboard("super-admin");

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <DashboardHeader
        title="Super Admin Dashboard"
        description="Manage system users, companies and accounting operations."
        userName="Super Admin"
      />

      {/* Statistics */}

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-5
        "
      >
        <StatCard
          title="Total Users"
          value={data?.stats?.users}
          icon={Users}
          change="+12%"
        />

        <StatCard
          title="Companies"
          value={data?.stats?.companies}
          icon={Building2}
          change="+5%"
        />

        <StatCard
          title="Invoices"
          value={data?.stats?.invoices}
          icon={Receipt}
          change="+18%"
        />

        <StatCard
          title="Quotations"
          value={data?.stats?.quotations}
          icon={FileText}
          change="+9%"
        />

        <StatCard
          title="Revenue"
          value={data?.stats?.revenue}
          icon={DollarSign}
          change="+22%"
        />
      </div>

      {/* Quick Actions */}

      <QuickActions />

      {/* Charts */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >
        <RevenueChart />

        <SalesOverview />
      </div>

      {/* Tables */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >
        <RecentInvoices invoices={data.recentInvoices} />

        <RecentPayments payments={data.recentPayments} />
      </div>

      {/* Quotations + Activity */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >
        <RecentQuotations quotations={data.recentQuotations} />

        <RecentActivity activities={data.recentActivity} />
      </div>
    </div>
  );
}
