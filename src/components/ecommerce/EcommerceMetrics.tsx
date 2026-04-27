"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { ClipboardClock, Contact, IndianRupee, Package, Bell, Wallet } from "lucide-react";
import type { DashboardData } from "@/types/dashboard";
import { formattedAmount, formattedAmountPoints } from "@/lib/constantFunction";

interface EcommerceMetricsProps {
  data: DashboardData | null;
  loading: boolean;
}

export const EcommerceMetrics = ({ data, loading }: EcommerceMetricsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 md:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6 animate-pulse">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
            <div className="mt-5 space-y-2">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Total Users */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.users?.total_users ?? 0}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {data?.users?.new_users_this_month ?? 0} this month
          </Badge>
        </div>
      </div>

      {/* Total Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.orders?.total_orders ?? 0}
            </h4>
          </div>
          <Badge color="warning">
            {data?.orders?.pending_orders ?? 0} pending
          </Badge>
        </div>
      </div>

      {/* KYC Approved */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Contact className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              KYC Approved
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.kyc?.approved_kyc ?? 0}
            </h4>
          </div>
          <Badge color="error">
            {data?.kyc?.pending_kyc ?? 0} pending
          </Badge>
        </div>
      </div>

      {/* Pending KYC */}
      <div className="rounded-2xl border border-warning-200 bg-white p-5 dark:border-warning-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-xl dark:bg-gray-800">
          <ClipboardClock className="text-warning-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-warning-500 dark:text-warning-400">
              Pending KYC
            </span>
            <h4 className="mt-2 font-bold text-warning-800 text-title-sm dark:text-white/90">
              {data?.kyc?.pending_kyc ?? 0}
            </h4>
          </div>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <IndianRupee className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Revenue
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              ₹{formattedAmount(data?.orders?.total_revenue ?? "0.00")}
            </h4>
          </div>
          <Badge color="success" size="sm">
            <ArrowUpIcon className="text-success-500 whitespace-nowrap" />
            {formattedAmountPoints(data?.orders?.avg_order_value ?? "0.00")} avg
          </Badge>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="rounded-2xl border border-error-200 bg-white p-5 dark:border-error-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-error-100 rounded-xl dark:bg-gray-800">
          <Wallet className="text-error-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-error-500 dark:text-error-400">
              Wallet Balance
            </span>
            <h4 className="mt-2 font-bold text-error-800 text-title-sm dark:text-white/90">
              ₹{data?.wallet?.total_wallet_balance ?? "0.00"}
            </h4>
          </div>
          <Badge color="error">
            {data?.wallet?.total_pending_amount ?? "0.00"} pending
          </Badge>
        </div>
      </div>
    </div>
  );
};

