"use client";
import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { BackendCartItem } from '@/types/cart';
import { formattedAmount, getCurrencyIcon } from '@/lib/constantFunction';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, X } from 'lucide-react';
import Button from '@/components/ui/button/Button';

import Link from 'next/link';
import Image from 'next/image';
import Badge from '../ui/badge/Badge';

const Cart = () => {
  const { items, totalItems, totalAmount, loading, updateQuantity, removeItem, clearCart } = useCart();
  const [localLoading, setLocalLoading] = useState<{ [key: string]: boolean }>({});

  const currency = getCurrencyIcon('INR');

  if (loading && totalItems === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-lg text-gray-500 dark:text-gray-400">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex  justify-between items-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl">
              <ShoppingCart className="w-8 h-8 text-brand-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Shopping Cart</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {totalItems === 0 ? 'No items' : `${totalItems} item${totalItems > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <div className="p-3 bg-brand-500/10 dark:bg-brand-500/20 rounded-xl" onClick={() => {
            const confirmed = confirm("Are you sure you want to clear the cart?");
            if (confirmed) {
              clearCart();
            }
          }}>
            <X className="w-8 h-8 text-brand-500" />
          </div>
        </div>

        {totalItems === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Your cart is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Add some products to get started.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition">
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
                      <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                      <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity</th>
                      <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                      {/* <th className="px-6 py-5 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                              <Image
                                src={item.product?.f_image || item.f_image || '/images/product/placeholder.jpg'}
                                alt={item.product?.name || item.product_name || ''}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-white line-clamp-1 max-w-xs">
                                {item.product?.name || item.product_name || ''}
                              </h4>
                              {item.is_variation_null == false ? <div className='flex gap-2'>{item.variant_details.attributes.map((attr, index) => {
                                return <Badge key={index}>{attr.attribute_name} - {attr.value}</Badge>
                              })}</div> : ""}
                              {item.variant && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  SKU: {item.variant.sku}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-lg font-bold text-gray-800 dark:text-white">
                            {currency}{formattedAmount(item.price)}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                if (confirm('Remove this item?')) {
                                  await removeItem(item.id);
                                }

                              }}

                            >
                              <Trash2 size={16} color='red' />

                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                if (item.quantity < 1) {
                                  if (confirm('Remove this item?')) {
                                    await removeItem(item.id);
                                  }
                                } else {
                                  setLocalLoading(prev => ({ ...prev, [String(item.id)]: true }));
                                  await updateQuantity(item.id, Math.max(1, item.quantity - 1));
                                  setLocalLoading(prev => ({ ...prev, [String(item.id)]: false }));
                                }
                              }}
                              disabled={localLoading[String(item.id)] || item.quantity <= 1}
                            >
                              {item.quantity < 1 ? <Trash2 size={16} /> :
                                <Minus size={16} />}
                            </Button>
                            <span className="w-12 text-center font-semibold text-lg text-gray-800 dark:text-white">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                setLocalLoading(prev => ({ ...prev, [String(item.id)]: true }));
                                await updateQuantity(item.id, item.quantity + 1);
                                setLocalLoading(prev => ({ ...prev, [String(item.id)]: false }));
                              }}
                              disabled={localLoading[String(item.id)]}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-lg font-bold text-gray-800 dark:text-white">
                            {currency}{formattedAmount(item.subtotal || (item.quantity * item.price))}
                          </span>
                        </td>
                        {/* <td className="px-6 py-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (confirm('Remove this item?')) {
                                await removeItem(item.id);
                              }
                            }}
                            className="text-error-500 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="lg:order-2">
                <Link
                  href="/checkout"
                  className="w-full block bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 px-8 rounded-2xl text-lg text-center shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </Link>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl lg:order-1">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                    <span className="font-semibold">{currency}{formattedAmount(totalAmount)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center text-2xl font-black text-gray-800 dark:text-white">
                    <span>Total:</span>
                    <span>{currency}{formattedAmount(totalAmount)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={clearCart}
                  disabled={loading}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
