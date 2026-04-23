"use client"
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,  
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';
import serverCallFuction, { formattedAmount } from '@/lib/constantFunction';
import { formatDate } from '@fullcalendar/core/index.js';
// const transactions = [
//   {
//     id: 1,
//     date: "2024-10-15",
//     type: "Commission",
//     amount: "+$450.00",
//     customer: { image: "/images/user/user-1.jpg", name: "John Doe" },
//     daysHeld: "25/30",
//     status: "Pending"
//   },
//   {
//     id: 2,
//     date: "2024-10-10",
//     type: "Commission",
//     amount: "+$1,200.00",
//     customer: { image: "/images/user/user-2.jpg", name: "Jane Smith" },
//     daysHeld: "Mature",
//     status: "Mature"
//   },
//   {
//     id: 3,
//     date: "2024-10-08",
//     type: "Deposit",
//     amount: "+$5,000.00",
//     customer: null,
//     daysHeld: "-",
//     status: "Completed"
//   },
//   {
//     id: 4,
//     date: "2024-10-05",
//     type: "Commission Return",
//     amount: "-$150.00",
//     customer: { image: "/images/user/user-3.jpg", name: "Bob Wilson" },
//     daysHeld: "Declined",
//     status: "Declined"
//   },
//   {
//     id: 5,
//     date: "2024-10-01",
//     type: "Commission",
//     amount: "+$800.00",
//     customer: { image: "/images/user/user-4.jpg", name: "Alice Brown" },
//     daysHeld: "Mature",
//     status: "Mature"
//   }
// ];
const Transaction = () => {


    const [transactions, settransactions] = useState<TransactionType[]>([])

    useEffect(() => {

        const fetchMetrics = async () => {
            // Simulate API call
            const res = await serverCallFuction('GET', 'api/wallet/history');
            if (res.success) {
                settransactions(res.data)
            }
        }

        fetchMetrics()

    }, []);


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-900">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-gray-100 text-left">Date</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-gray-100 text-left">Type</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-gray-100 text-left">UV Points</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-gray-100 text-left">Category</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-gray-100 text-left">Remarks</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-gray-100 text-left">Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatDate(tx.created_at)}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    <Badge color={tx.type === "credit" ? "success" : "error"} variant='solid'>
                    {tx.type?.toUpperCase()}
                    </Badge>
                    </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 font-bold text-emerald-600 "> {formattedAmount(tx.amount)}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300  text-emerald-600"> {tx.category}</TableCell>
                  {/* <TableCell className="px-6 py-4">
                    {tx.customer ? (
                      <div className="flex items-center gap-3">
                        <Image src={tx.customer.image} alt="" width={32} height={32} className="rounded-full" />
                        <span>{tx.customer.name}</span>
                      </div>
                    ) : "Direct"}
                  </TableCell> */}
                  <TableCell>{tx.remarks}</TableCell>
                  <TableCell>
                    <Badge color={tx.status === "mature" || tx.status === "completed" ? "success" : tx.status === "pending" ? "warning" : "error"}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Transaction
