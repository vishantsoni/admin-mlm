"use client"
import React from 'react'
import { EcommerceMetrics } from './ecommerce/EcommerceMetrics'
import QuickActionDash from './ecommerce/QuickActionDash'
import MonthlySalesChart from './ecommerce/MonthlySalesChart'
import StatisticsChart from './ecommerce/StatisticsChart'
import RecentOrders from './ecommerce/RecentOrders'
import { useDashboard } from '@/hooks/useDashboard'

const DashboardCompo = () => {
    const { data, loading, error } = useDashboard();
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-12">
                <EcommerceMetrics data={data} loading={loading} />
                <QuickActionDash />
            </div>

            <div className="col-span-12 space-y-6 xl:col-span-12">
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6'>
                    <div className="">
                        <MonthlySalesChart data={data?.charts?.daily_sales} loading={loading} />
                    </div>
                    <div className="">
                        <StatisticsChart data={data?.charts?.daily_registrations} loading={loading} />
                    </div>
                </div>
            </div>


            <div className="col-span-12">
                <RecentOrders data={data?.recent?.orders} loading={loading} />
            </div>
        </div>
    )
}

export default DashboardCompo
