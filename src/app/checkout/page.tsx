"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/layout/AppHeader';
import CheckoutForm from '../../components/checkout-compo/CheckoutForm';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalItems, totalAmount, loading, clearCart } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div>Loading cart...</div>
      </div>
    );
  }

  if (totalItems === 0 || !user) {
    return (
      <div className="container mx-auto p-6 max-w-2xl text-center py-20">
        <AppHeader />
        <h2 className="text-2xl font-bold mb-4">No items in cart</h2>
        <p className="text-muted-foreground mb-8">Your cart is empty. Add some products first.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <div className=" bg-gray-50 dark:bg-gray-900 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl">
                <ShoppingCart className="w-8 h-8 text-brand-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Checkout</h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Review your order - {totalItems === 0 ? 'No items' : `${totalItems} item${totalItems > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>
          <CheckoutForm
            cartItems={items}
            totalAmount={totalAmount}
            user={user}
            onSuccess={() => {
              clearCart();
              router.replace('/shop');
            }}
          />
        </div></div>
      {/* <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="text-xl mb-8">
          Review your order (Total: ₹{totalAmount.toLocaleString()})
        </div>
        <CheckoutForm 
          cartItems={items}
          totalAmount={totalAmount}
          user={user}
          onSuccess={() => {
            clearCart();
            router.replace('/shop');
          }}
        />
      </div> */}
    </>
  );
};

export default CheckoutPage;


