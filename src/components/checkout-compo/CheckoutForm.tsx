"use client";

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import Button from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { PurchasePackage, CheckoutFormProps, RazorpayOrderResponse, RazorpayPaymentResponse } from '@/types/purchase';
import serverCallFuction from '@/lib/constantFunction';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


const CheckoutForm: React.FC<CheckoutFormProps> = ({ selectedPackage, user, amount, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: user.full_name || user.username || '',
    email: user.email || '',
    phone: user.phone || user.whatsappNo || '',
  });
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const router = useRouter();
  const { updateUserProfile } = useAuth();


  console.log("formdata - ", formData);



  // useEffect(() => {
  //   const script = document.querySelector('script[src=\"https://checkout.razorpay.com/v1/checkout.js\"]');
  //   if (script) setRazorpayLoaded(true);    

  // }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createRazorpayOrder = async (pkgId: number, amt: number) => {
    try {
      const res = await serverCallFuction('POST', 'api/payment/create-order', {
        amount: amt, // paise
        currency: 'INR',
        packageId: pkgId,
        receipt: `receipt_${Date.now()}`,
      });
      if (!res.status) throw new Error(res.message || 'Order creation failed');
      return res.order;
    } catch (error) {
      throw new Error('Failed to create order');
    }
  };

  const verifyPayment = async (paymentData: RazorpayPaymentResponse) => {
    try {
      const res = await serverCallFuction('POST', 'api/payment/verify', paymentData);
      if (!res.success) throw new Error(res.message || 'Payment verification failed');
      return res.data;
    } catch (error) {
      throw new Error('Payment verification failed');
    }
  };
  console.log("selectedPackage - ", selectedPackage);

  const placePurchaseOrder = async (razorpayOrderId: string, paymentMethod = 'razorpay') => {
    try {
      const res = await serverCallFuction('POST', 'api/plan/place-po', {
        packageId: selectedPackage.id,
        amount,
        paymentMethod,
        razorpay_order_id: razorpayOrderId, // pass for backend record
        packageId: selectedPackage.id
      });
      if (res.success) {
        await updateUserProfile(res.user || {});
        alert('Purchase successful!')
        onSuccess();
      } else {
        throw new Error(res.message || 'Purchase failed');
      }
    } catch (error) {
      throw new Error('Purchase order failed');
    }
  };

  

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone || formData.phone.length !== 10) {
      alert('Please fill valid name and 10-digit phone');
      return;
    }

    if (!window.Razorpay || !razorpayLoaded) {
      alert('Razorpay loading... Please wait');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Razorpay order
      const order = await createRazorpayOrder(selectedPackage.id, amount);

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Sfdk41BOifNjN9', // Frontend key
        amount: order.amount,
        currency: order.currency,
        name: 'Feel Safe Co.',
        description: `Purchase ${selectedPackage.name}`,
        order_id: order.id,
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#3399cc' },
        handler: async function (response: any) {
          try {
            // 3. Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 4. Place purchase order
            await placePurchaseOrder(response.razorpay_order_id);

          } catch (err) {
            alert(`Payment failed: ${(err as Error).message}`);
            router.push('/purchase');
          }
        },
      };

      const paymentObject = new (window.Razorpay as any)(options);
      paymentObject.open();
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" /> */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onReady={() => setRazorpayLoaded(true)}
      />
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Package</Label>
            <h3 className="font-bold text-xl">{selectedPackage.name}</h3>
            <p className="text-2xl font-bold text-primary">₹{amount.toLocaleString()}.00</p>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={formData.phone}
                onChange={handleInputChange}
                max={"10"}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()} with Razorpay`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default CheckoutForm;
