"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import serverCallFuction from '@/lib/constantFunction';
import { PurchasePackage } from '@/types/purchase';
import AppHeader from '@/layout/AppHeader';
import CheckoutForm from '../../components/checkout-compo/CheckoutForm';
import { useAuth } from '@/context/AuthContext';

const CheckoutPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PurchasePackage | null>(null);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);

  const { user } = useAuth();

  useEffect(() => {
    // Parse from URL without useSearchParams for static prerender
    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('packageId');
    const amt = urlParams.get('amount');
    
    if (pid && amt) {
      setPackageId(pid);
      setAmount(parseInt(amt));
      fetchPackage(pid);
    } else {
      setError('Missing package information');
      setLoading(false);
    }
  }, []);

  const fetchPackage = async (pid: string) => {
    try {
      const res = await serverCallFuction('GET', `api/plan/detail/${pid}`);
      if (res.success) {
        setSelectedPackage(res.data);
      } else {
        setError('Failed to load package');
      }
    } catch (err) {
      setError('Failed to load package');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto p-6">Loading...</div>;
  if (error || !selectedPackage || !user) return <div className="container mx-auto p-6 text-red-500">{error || 'User not authenticated'}</div>;

  return (
    <>
      <AppHeader />
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <p className="text-muted-foreground mb-8">Complete your purchase for {selectedPackage.name} - ₹{amount.toLocaleString()}</p>
        <CheckoutForm 
          selectedPackage={selectedPackage} 
          user={user}
          amount={amount}
          onSuccess={() => router.replace('/')}
        />
      </div>
    </>
  );
};

export default CheckoutPage;

