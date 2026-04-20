"use client";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowUpIcon, GroupIcon, DollarLineIcon } from "@/icons";

const ReferralMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Total Referrals */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/30">
          <GroupIcon className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">1,247</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            15.2%
          </Badge>
        </div>
      </div>

      {/* Active Downline */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl dark:bg-emerald-900/30">
          <GroupIcon className="text-emerald-600 size-6 dark:text-emerald-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Active Downline</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">892</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            8.7%
          </Badge>
        </div>
      </div>

      {/* Commissions Earned */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/30">
          <DollarLineIcon className="text-purple-600 size-6 dark:text-purple-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Commissions</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">$12,450</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            22.1%
          </Badge>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/30">
          <GroupIcon className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">34.5%</h4>
          </div>
          <Badge color="warning">
            <ArrowUpIcon />
            3.2%
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ReferralMetrics;

