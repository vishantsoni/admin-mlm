"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import serverCallFuction, { formattedAmountCommas } from '@/lib/constantFunction';
import { Order } from '@/types/orders';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { Loader2, ArrowLeft, Printer, Edit3 } from 'lucide-react';
import { formattedAmount } from '@/lib/constantFunction';
import { date_formate } from '@/lib/constantFunction';
import Input from '@/components/form/input/InputField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/Card';
import Image from 'next/image';

const OrderDetail = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params['order-id'] as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrder = async () => {
        if (!orderId) return;
        setLoading(true);
        setError('');
        try {
            const res = await serverCallFuction('GET', `api/orders/details/${orderId}`);
            if (res.status !== false && res.data) {
                const item = res.data;
                setOrder({
                    ...item
                });
            } else {
                setError('Order not found');
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setError('Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const getStatusColor = (status: Order['order_status'] | Order['payment_status']) => {
        switch (status) {
            case 'confirmed':
            case 'shipped':
            case 'delivered':
            case 'paid':
                return 'success';
            case 'pending':
            case 'unpaid':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'light';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading order...</span>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-12 space-y-4">
                <h2 className="text-xl font-bold text-destructive">{error || 'Order not found'}</h2>
                <Button onClick={fetchOrder} variant="outline">
                    Try Again
                </Button>
                <Button onClick={() => router.push('/orders')} variant="link">
                    Back to Orders
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6  mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight dark:text-gray-300">Order #{order.order_id}</h1>
                        <p className="text-sm text-muted-foreground">Placed on {date_formate(order.created_at)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="solid" color={getStatusColor(order.order_status)} className="text-sm">
                        {order.order_status.toUpperCase()}
                    </Badge>
                    <Badge variant="solid" color={getStatusColor(order.payment_status)} className="text-sm">
                        {order.payment_status.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                        <CardDescription>Contact details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <p className="font-semibold mt-1">{order.user_name || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                            <p>{order.user_phone || "N/A"}</p>
                        </div>
                        {/* <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p>{order.user_email}</p>
                        </div> */}
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal:</span>
                            <span>₹{formattedAmountCommas(order.sub_total || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax:</span>
                            <span>₹{formattedAmount(order.tax_amount || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Shipping Charges:</span>
                            <span>₹{formattedAmount(order.shipping_charges || 0)}</span>
                        </div>

                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Total:</span>
                            <span>₹{formattedAmountCommas(order.total_amount)}</span>
                        </div>
                        {order.payment_method && (
                            <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t">
                                <span>Payment Method:</span>
                                <span>{order.payment_method}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>


                {/* Shipping Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Address Line</label>
                            <p className="font-semibold mt-1">{order.shipping_address?.address_line1}, {order.shipping_address?.address_line2}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">City</label>
                            <p className="font-semibold mt-1">{order.shipping_address?.city}, {order.shipping_address?.state}, {order.shipping_address?.pincode}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                            <p className='font-semibold'>{order.user_phone}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Button className="w-full" variant="outline">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Update Status
                        </Button>
                        <Button className="w-full">
                            <Printer className="h-4 w-4 mr-2" />
                            Print Invoice
                        </Button>
                    </CardContent>
                </Card>



            </div>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items ({order.items?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {order.items && order.items.length > 0 ? (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-800 dark:text-white text-left">Product</TableCell>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-800 dark:text-white text-left">Qty</TableCell>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-800 dark:text-white text-left">Price</TableCell>
                                    <TableCell isHeader className="px-6 py-4 font-semibold text-gray-800 dark:text-white text-left">Subtotal</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {order.items.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="px-6 py-4 font-bold">
                                            <div className='flex gap-3 items-center'>
                                                <Image
                                                    src={product.product_image?.startsWith('http') ? product.product_image : '/images/user/user-01.jpg'}
                                                    alt={product.product_name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded object-cover"
                                                    priority={false}
                                                    onError={(e) => {

                                                    }}
                                                    onLoad={() => console.log('Product image loaded:', product.product_name)}
                                                />
                                                <div>
                                                    <div>{product.product_name}</div>
                                                    {product.variant_details && (
                                                        <div className='flex gap-2'>
                                                            {product.variant_details.attributes.map((attr, index) => <Badge color='primary' key={index}>{attr.value}</Badge>)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 font-bold">{product.qty}</TableCell>
                                        <TableCell className="px-6 py-4 font-bold">₹{formattedAmount(product.unit_price)}</TableCell>
                                        <TableCell className="px-6 py-4 font-bold">₹{formattedAmount(product.unit_price * product.qty)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No products in this order.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderDetail;

