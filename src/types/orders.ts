
export interface Order {
  id: number;
  order_id: string;
  user_id: number;
  user_name: string;
  user_phone?: string;
  user_email?: string;
  sub_total?: number;
  tax_amount?: number;
  total_amount: number;
  order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: string;
  created_at: string;
  payment_method?: string;
  products?: Array<{ name: string; qty: number; price: number }>;
  items?: Array<{ product_name: string; qty: number; unit_price: number, total_item_price: number, product_image?: string, variant_details?: { attributes: Array<{ attr_value_id: number; value: string }> } }>;
  shipping_address?: {
    city: string;
    phone: number;
    state: string;
    pincode: number;
    address_line1: string;
    address_line2: string;

  },
  product_image?: string;
  product_name?: string;
  variant_details?: {
    attributes: Array<{ attr_value_id: number; value: string }>;
  };
}

export interface OrdersApiResponse {
  status?: boolean;
  data: Order[];
  total?: number;
  page?: number;
  limit?: number;
}






