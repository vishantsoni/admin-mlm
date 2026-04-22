# Fix placePurchaseOrder function in CheckoutForm.tsx

Status: In Progress

## Steps:
1. [x] Update CheckoutForm.tsx:
   - Add selectedAddress state
   - Remap cartItems to backend items format
   - Use selectedAddress object in placePurchaseOrder payload
   - Update payment_method='razorpay'
   - Fix response handling for backend shape {success, data: {order, items}}
   - Clear cart after success

2. [x] Update src/types/orders.ts for backend response

3. [ ] Test full checkout flow: cart -> checkout -> Razorpay test pay -> order created, cart cleared

## Backend Notes:
- Ensure /api/orders/d_p_o handles payment_method='razorpay'
- Implement generateOrderId()
- Add fields to orders table if missing

