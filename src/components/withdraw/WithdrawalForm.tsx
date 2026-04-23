"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Wallet, Landmark, ShieldCheck, AlertCircle } from "lucide-react";

const WithdrawalForm = () => {
  const { user } = useAuth();
  const [uvAmount, setUvAmount] = useState<number>(0);
  const [transactionPin, setTransactionPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const UV_RATE = 10;
  const inrAmount = uvAmount * UV_RATE;
  const tdsDeduction = inrAmount * 0.05; // Example 5% TDS
  const finalAmount = inrAmount - tdsDeduction;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.is_kyc_completed) {
      alert("Please complete your KYC before withdrawing.");
      return;
    }
    setIsSubmitting(true);
    // Logic to call your serverCallFunction goes here
    console.log("Raising Request:", { uvAmount, inrAmount, transactionPin });
    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      
      {!user?.kyc_status && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-amber-700 text-sm">
          <AlertCircle className="shrink-0" size={18} />
          <p>Your KYC is pending. Please complete KYC to enable bank withdrawals.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* UV Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount to Withdraw (UV)
          </label>
          <div className="relative">
            <input
              type="number"
              value={uvAmount || ""}
              onChange={(e) => setUvAmount(Number(e.target.value))}
              placeholder="Enter UV amount"
              className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              required
            />
            <span className="absolute right-4 top-3.5 text-gray-400 font-medium">UV</span>
          </div>
        </div>

        {/* Real-time Calculation Card */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 uppercase">Gross Amount</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">₹{inrAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase text-red-500">TDS (5%)</p>
            <p className="text-lg font-semibold text-red-500">- ₹{tdsDeduction.toLocaleString()}</p>
          </div>
          <div className="col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
            <p className="text-xs text-gray-500 uppercase">Net Payable to Bank</p>
            <p className="text-2xl font-bold text-brand-600">₹{finalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Bank Preview Section */}
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center gap-4">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Landmark size={20} className="text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.bank_name || "No Bank Linked"}</p>
            <p className="text-xs text-gray-500">Acc: •••• {user?.account_no?.slice(-4) || "0000"}</p>
            <p className="text-xs text-gray-500">Holder: •••• {user?.account_holder_name || "N/A"}</p>
            <p className="text-xs text-gray-500">IFSC: •••• {user?.ifsc_code || "N/A"}</p>
          </div>
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase">Verified</span>
        </div>

        {/* Security Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction PIN
          </label>
          <div className="relative">
            <input
              type="password"
              maxLength={6}
              value={transactionPin}
              onChange={(e) => setTransactionPin(e.target.value)}
              placeholder="••••••"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all tracking-widest"
              required
            />
            <ShieldCheck className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !uvAmount || !user?.kyc_status}
          className="w-full py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all transform active:scale-[0.98]"
        >
          {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
        </button>
      </form>
    </div>
  );
};

export default WithdrawalForm;