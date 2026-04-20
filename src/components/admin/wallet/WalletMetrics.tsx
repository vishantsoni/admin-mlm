"use client";
import React, { useEffect, useState } from 'react'
import { DollarLineIcon, TimeIcon, CheckCircleIcon, GroupIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import serverCallFuction from '@/lib/constantFunction';
const WalletMetrics = () => {

    const [walletData, setWalletData] = useState<WalletType>({
        total_balance:"0.00",
        available_balance:"0"
    })

    useEffect(() => {

        const fetchMetrics = async () => {
            // Simulate API call
            const res = await serverCallFuction('GET', 'api/wallet/balance');
            if (res.success) {
                setWalletData(res.data)
            }

        }

        fetchMetrics()

    }, []);



    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {/* Total Balance */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl dark:bg-emerald-900/30">
                    <DollarLineIcon className="text-emerald-600 size-6 dark:text-emerald-400" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Balance</span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">₹{walletData?.total_balance}</h4>
                    </div>
                    <Badge color="success">+2.4%</Badge>
                </div>
            </div>

            {/* Pending Commissions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl dark:bg-amber-900/30">
                    <TimeIcon className="text-amber-600 size-6 dark:text-amber-400" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Pending Commissions (30-day hold)</span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">₹{walletData?.pending_balance}</h4>
                    </div>
                    <Badge color="warning">25/30 days</Badge>
                </div>
            </div>

            {/* Mature Commissions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl dark:bg-emerald-900/30">
                    <CheckCircleIcon className="text-emerald-600 size-6 dark:text-emerald-400" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Mature Commissions</span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">₹{walletData?.available_balance}</h4>
                    </div>
                    <Badge color="success">Available</Badge>
                </div>
            </div>

            {/* Total Transactions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/30">
                    <GroupIcon className="text-blue-600 size-6 dark:text-blue-400" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white">{walletData?.total_transactions}</h4>
                    </div>
                    <Badge color="success">+11%</Badge>
                </div>
            </div>
        </div>
    );
};

export default WalletMetrics
