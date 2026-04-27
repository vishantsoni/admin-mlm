"use client";

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Image from 'next/image';
import { BackendCartItem } from '@/types/cart';
import { RazorpayPaymentResponse } from '@/types/purchase';
import serverCallFuction from '@/lib/constantFunction';
import { formattedAmount, getCurrencyIcon } from '@/lib/constantFunction';
import { useAuth } from '@/context/AuthContext';
import Badge from '../ui/badge/Badge';
import { Address } from '@/types/address';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Modal } from '@/components/ui/modal';
import { Plus } from 'lucide-react';
import Select from '@/components/form/Select';
import { CreateAddressPayload } from '@/types/address';
import { States } from '@/types/static-content';


interface CartCheckoutProps {
  cartItems: BackendCartItem[];
  totalAmount: number;
  user: any;
  onSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutForm: React.FC<CartCheckoutProps> = ({ cartItems, totalAmount, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: user.full_name || user.username || '',
    email: user.email || '',
    phone: user.phone || user.whatsappNo || '',
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedShippingId, setSelectedShippingId] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Add Address Modal State
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [addAddressForm, setAddAddressForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    landmark: '',
    is_default: false,
  } as CreateAddressPayload);

  // State/City dropdown data
  const [states, setStates] = useState<{ id: number, name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number, name: string }[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const fetchStates = async () => {
    try {
      setLoadingStates(true);
      const res = await serverCallFuction('GET', 'api/static/states');
      if (res.status && Array.isArray(res.data)) {
        setStates(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch states:', error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (stateId?: number) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      setLoadingCities(true);
      const res = await serverCallFuction('GET', `api/static/cities/${stateId}`);
      if (res.status && Array.isArray(res.data)) {
        setCities(res.data);
        // Reset city when state changes
        setAddAddressForm(prev => ({ ...prev, city: '' }));
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const resetAddAddressForm = () => {
    setAddAddressForm({
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      landmark: '',
      is_default: false,
    } as CreateAddressPayload);
  };

  const handleAddAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAddAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddNewAddress = async () => {
    // Basic validation
    if (!addAddressForm.full_name || !addAddressForm.phone || addAddressForm.phone.length !== 10 ||
      !addAddressForm.address_line1 || !addAddressForm.city || !addAddressForm.state || !addAddressForm.pincode) {
      alert('Please fill all required fields: name, phone (10 digits), address, city, state, pincode');
      return;
    }
    if (!/^\d{10}$/.test(addAddressForm.phone)) {
      alert('Phone must be 10 digits');
      return;
    }

    try {
      const res = await serverCallFuction('POST', 'api/ecom/d_addresses?type=distributor', addAddressForm);
      if (res.status) {
        setIsAddAddressModalOpen(false);
        resetAddAddressForm();
        await fetchAddresses();
        alert('Address added successfully!');
      } else {
        alert('Failed to add address: ' + (res.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to add address: ' + (error as Error).message);
    }
  };

  const router = useRouter();
  const { updateUserProfile } = useAuth();

  const currency = getCurrencyIcon('INR');

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await serverCallFuction('GET', 'api/ecom/d_addresses?type=distributor');
      if (res.status) {
        const addrList = Array.isArray(res.data) ? res.data : res.address ? [res.address] : [];
        setAddresses(addrList);
        if (addrList.length > 0) {
          const defaultAddr = addrList.find(a => a.is_default) || addrList[0];
          setSelectedShippingId(defaultAddr.id);
          setSelectedAddress(defaultAddr);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchStates();
  }, []);

  useEffect(() => {
    if (addAddressForm.state) {
      const stateId = parseInt(addAddressForm.state);
      fetchCities(stateId);
    }
  }, [addAddressForm.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createRazorpayOrder = async (amt: number, cartItems: BackendCartItem[]) => {
    try {
      if (!selectedAddress) {
        alert("Please select Shipping Address");
        return;
      }
      const res = await serverCallFuction('POST', 'api/payment/create-order', {
        amount: Math.round(amt),
        currency: 'INR',
        cart_items: cartItems.map(item => ({
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
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

  console.log("cart item - ",cartItems);
  

  const placePurchaseOrder = async (razorpayOrderId: string, paymentMethod = 'razorpay') => {
    try {
      const items = cartItems.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        qty: item.quantity,
        tax_data: item.product?.tax_data || null
      }));

      const res = await serverCallFuction('POST', 'api/orders/d_p_o', {
        items,
        shipping_address: selectedAddress,
        payment_method: paymentMethod,
      });
      if (res.success) {
        // Clear cart
        
        await serverCallFuction('DELETE', 'api/ecom/cart/d_clear');
        alert('Order placed successfully!');
        onSuccess();
        router.replace("/")
      } else {
        throw new Error(res.message || 'Order placement failed');
      }
    } catch (error) {
      console.error('Place order error:', error);
      throw new Error(`Order placement failed: ${(error as Error).message}`);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone || formData.phone.length !== 10) {
      alert('Please fill valid name and 10-digit phone');
      return;
    }
    if (!selectedAddress) {
      alert('Please select a shipping address or add one in profile');
      return;
    }

    if (!window.Razorpay || !razorpayLoaded) {
      alert('Razorpay loading... Please wait');
      return;
    }

    setLoading(true);
    try {
      const order = await createRazorpayOrder(totalAmount, cartItems);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Sfdk41BOifNjN9',
        amount: order.amount,
        currency: order.currency,
        name: 'Feel Safe Shop',
        description: `Order Total ₹${totalAmount.toLocaleString()}`,
        order_id: order.id,
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#3399cc' },
        handler: async (response: any) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await placePurchaseOrder(response.razorpay_order_id, 'razorpay');
          } catch (err) {
            alert(`Payment failed: ${(err as Error).message}`);
            router.push('/cart');
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
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onReady={() => setRazorpayLoaded(true)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 max-w-[1400px] mx-auto px-4">
        {/* Payment & Address Section */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className='grid sm:grid-cols-3 gap-2'>


                <div>
                  <Label>Full Name</Label>
                  <Input
                    name="full_name"
                    defaultValue={formData.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    type="tel"
                    defaultValue={formData.phone}
                    onChange={handleInputChange}
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* Shipping Address Section */}
              <div>
                <div className='flex items-center justify-between w-full bg-gray-200 p-2 rounded-lg mb-2'>
                  <Label className="block font-semibold">
                    Shipping Address <span className="text-red-500">*</span>
                  </Label>
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-300 rounded-full transition-colors"
                    onClick={() => setIsAddAddressModalOpen(true)}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {loadingAddresses ? (
                  <p>Loading addresses...</p>
                ) : addresses.length === 0 ? (
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 dark:border-gray-600">
                    No addresses found. <span  className="text-brand-500 hover:underline font-medium" onClick={() => setIsAddAddressModalOpen(true)}>Add address</span>
                  </div>
                ) : (
                  <RadioGroup value={selectedShippingId} onValueChange={(value) => {
                    console.log("values - ", value);

                    setSelectedShippingId(value);
                    const addr = addresses.find((a: Address) => a.id === value);
                    setSelectedAddress(addr || null);
                  }} className="space-y-2">
                    {addresses.map((address) => {
                      const isSelected = selectedShippingId === address.id;

                      return (
                        <div
                          key={address.id}
                          // CRITICAL: This ensures clicking the card updates the RadioGroup value
                          onClick={() => {
                            setSelectedShippingId(address.id);
                            setSelectedAddress(address);
                          }}
                          className={`flex items-start p-4 border-2 rounded-xl transition-all cursor-pointer mb-3 ${isSelected
                              ? 'border-brand-500 bg-brand-50 shadow-md ring-1 ring-brand-500' // Highlighted
                              : 'border-gray-100 hover:border-gray-300 bg-white' // Not selected
                            }`}
                        >
                          <div className="mt-1 mr-3">
                            {/* The Radio Item now accurately reflects the selectedShippingId state */}
                            <RadioGroupItem
                              value={address.id}
                              id={`addr-${address.id}`}
                              checked={isSelected}
                              className="h-5 w-5"
                              name="address"
                            />
                          </div>

                          <Label htmlFor={`addr-${address.id}`} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">{address.full_name}</span>
                              {address.is_default && (
                                <Badge variant="solid" color="success" className="text-[10px] px-2 py-0">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {address.address_line1}{address.address_line2 && ', ' + address.address_line2}
                            </p>
                            <p className="text-sm font-medium text-gray-500">
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p className="text-xs text-brand-600 mt-2 font-semibold">📞 {address.phone}</p>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}
              </div>

              <Button className="w-full" disabled={loading || loadingAddresses || !selectedShippingId} onClick={handlePayment}>
                {loading ? 'Processing...' : `Pay ${currency}${formattedAmount(totalAmount)} with Razorpay`}
              </Button>

              {/* Add Address Modal */}
              <Modal
                isOpen={isAddAddressModalOpen}
                onClose={() => {
                  setIsAddAddressModalOpen(false);
                  resetAddAddressForm();
                }}
                className="max-w-lg"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-center">Add New Address</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        defaultValue={addAddressForm.full_name}
                        onChange={handleAddAddressChange}
                        required
                        placeholder='Enter full name'
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={addAddressForm.phone}
                        onChange={handleAddAddressChange}
                        maxLength={10}
                        required
                        placeholder='Enter phone number'
                      />
                    </div>

                    <div>
                      <Label htmlFor="address_line1">Address Line 1 <span className="text-red-500">*</span></Label>
                      <Input
                        id="address_line1"
                        name="address_line1"
                        defaultValue={addAddressForm.address_line1}
                        onChange={handleAddAddressChange}
                        required
                        placeholder='eg.: FLoor No., Landmark etc'
                      />
                    </div>

                    <div>
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input
                        id="address_line2"
                        name="address_line2"
                        defaultValue={addAddressForm.address_line2}
                        onChange={handleAddAddressChange}
                        placeholder='eg.: Street etc'
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                        <select
                          id="state"
                          name="state"
                          value={addAddressForm.state}
                          onChange={handleAddAddressChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700"
                          disabled={loadingStates}
                          required
                        >
                          <option value="">Select State</option>
                          {loadingStates ? (
                            <option disabled>Loading...</option>
                          ) : states.map((state: States) => (
                            <option key={state.id} value={state.id.toString()}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                        <select
                          id="city"
                          name="city"
                          value={addAddressForm.city}
                          onChange={handleAddAddressChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700"
                          disabled={loadingCities || !addAddressForm.state}
                          required
                        >
                          <option value="">Select City</option>
                          {loadingCities ? (
                            <option disabled>Loading...</option>
                          ) : cities.map((city: States) => (
                            <option key={city.id} value={city.id.toString()}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={addAddressForm.country}
                          onChange={handleAddAddressChange}
                          placeholder="India"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode <span className="text-red-500">*</span></Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={addAddressForm.pincode}
                          onChange={handleAddAddressChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        name="landmark"
                        value={addAddressForm.landmark}
                        onChange={handleAddAddressChange}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        id="is_default"
                        name="is_default"
                        type="checkbox"
                        checked={addAddressForm.is_default}
                        onChange={handleAddAddressChange}
                        className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 focus:ring-2"
                      />
                      <Label htmlFor="is_default" className="text-sm font-medium">Make this default address</Label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddAddressModalOpen(false);
                        resetAddAddressForm();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddNewAddress}
                      className="flex-1"
                    >
                      Add Address
                    </Button>
                  </div>
                </div>
              </Modal>

            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 border-b border-gray-100 last:border-b-0 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.f_image || item.product?.f_image || '/placeholder.png'}
                          alt={item.product_name || item.product?.name || 'Product'}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate dark:text-white mb-1">
                          {item.product_name || item.product?.name}
                        </h4>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {item?.variant_details?.attributes?.map((attr: any, index: number) => (
                          <Badge size="sm" variant="light" color="primary" key={index}>
                            {attr.attribute_name}: {attr.value}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{currency}{formattedAmount(item.price)}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm text-gray-600">{currency}{formattedAmount(item.subtotal || (item.quantity * item.price))}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span>{currency}{formattedAmount(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;

