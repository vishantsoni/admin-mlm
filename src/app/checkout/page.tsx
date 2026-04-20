"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import serverCallFuction from '@/lib/constantFunction';
import { PurchasePackage } from '@/types/purchase';
import AppHeader from '@/layout/AppHeader';
import CheckoutForm from '../../components/checkout-compo/CheckoutForm'; // Will create next
import { useAuth } from '@/context/AuthContext';

interface CheckoutPageProps {}

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PurchasePackage | null>(null);

  const { user } = useAuth();

  const packageId = searchParams.get('packageId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!packageId || !amount) {
      setError('Missing package information');
      setLoading(false);
      return;
    }

    const fetchPackage = async () => {
      try {
        const res = await serverCallFuction('GET', `api/plan/detail/${packageId}`);
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

    fetchPackage();
  }, [packageId]);

  if (loading) return <div className="container mx-auto p-6">Loading...</div>;
  if (error || !selectedPackage || !user) return <div className="container mx-auto p-6 text-red-500">{error || 'User not authenticated'}</div>;

  return (
    <>
      <AppHeader />
      <div className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <p className="text-muted-foreground mb-8">Complete your purchase for {selectedPackage.name} - ₹{parseInt(amount || '0').toLocaleString()}</p>
        <CheckoutForm 
          selectedPackage={selectedPackage} 
          user={user}
          amount={parseInt(amount || '0')}
          onSuccess={() => router.replace('/')} // or success page
        />
      </div>
    </>
  );
};

export default CheckoutPage;
