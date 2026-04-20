export interface TreeUser {
  id: number;
  username: string;
  email: string;
  phone: string;
  full_name:string;
  node_path: string;
  referrer_id: number;
  referral_code: string;
  created_at: string;
  children: TreeUser[];
  is_active: boolean;
}

export interface ApiTreeResponse {
  status: boolean;
  data: TreeUser[];
}

