export interface User {
  id: number | string;
  username?: string;
  email?: string;
  phone?: string;
  role: string;
  role_id?:number;
  role_name?:string;
  permissions?: string[];
  node_path?: string;
  // Profile fields
  profile_pic?: string;
  full_name?: string;
  aadhaarNo?: string;
  dob?: string;
  gender?: string;
  panNo?: string;
  whatsappNo?: string;
  address?: string;
  city?: string;
  state?: string;
  pin?: string;
  bankName?: string;
  accountHolderName?: string;
  accountNo?: string;
  ifscCode?: string;
  branch?: string;
  referral_code?: string;
  referrer_id?: number;
  referrerName?: string;
  referrerContact?: string;
  nominee_name?: string;
  nominee_relationship?: string;
  nominee_age?: string;
  nominee_contact?: string;
  nominee_aadhaar?: string;
  businessLevel?: string;
  agreedToTerms?: boolean;
  kyc_status?: boolean;
  is_active?: boolean;
  is_kyc_completed?: boolean;
  transaction_pin_hash?: string;
}

export const fakeUsers: Record<string, User> = {
  'admin@test.com': {
    id: '1',
    email: 'admin@test.com',
    role: 'admin'
  },
  'super@test.com': {
    id: '2',
    email: 'super@test.com',
    role: 'super admin'
  },
  'dist@test.com': {
    id: '3',
    email: 'dist@test.com',
    role: 'DISTRIBUTOR'
  },
  'staff@test.com': {
    id: '4',
    email: 'staff@test.com',
    role: 'staff'
  }
};

// export const rolePermissions: Record<User['role'], string[]> = {
//   'super admin': ['*'],
//   'admin': ['dashboard', 'calendar', 'profile', 'forms', 'tables', 'pages', 'charts', 'ui-elements', 'auth'],
//   'distributor': ['*'],
//   'DISTRIBUTOR': ['*'], // API uppercase
//   'staff': ['dashboard']
// };

export const rolePermissions: Record<string, string[]> = {
  'super admin': [
    'dashboard',
    'analytics',
    'members',
    'network-tree',
    'kyc-requests',
    'products',
    'products/add',
    'products/edit',
    'product-list',
    'add-product',
    'products/category',
    'pro-category',
    'attributes',
    'coupons',    
    'orders',
    'commissions',
    'level-capping',
    'level-milestone',
    'p-transactions',
    'transactions',
    'withdrawals',
    'gst-tds',
    'reports',
    'settings',
    'tax-setting',
    'staff-header',
    'roles',
    'staff',
    'ranks',
    'notifications',
    'cms',
    'static-content',
    'state-city',
    'wallet',
    'withdrawals'

  ], // Has access to everything
  'admin': ['dashboard', 'analytics', 'members', 'kyc-requests', 'products', 'orders', 'commissions', 'withdrawals', 'gst-tds', 'reports', 'plan-settings', 'ranks'],
  'distributor': [
    'dashboard',
    'referral',    
    'profile',
    'wallet',
    'withdrawals',
    'network-tree',
    'members', // for "My Team"
    'products', // for "Shop"
    'product-list',
    'inventory',
    'purchase',
    'shop',
    'cart',
    'distributor-orders',
    'orders',
    'placed_order',
    'recieved_order',
    'commissions',
    'level-capping',
    'level-milestone',
    'simulator',
    'gst-tds',
    'ranks',
    'kyc',
    'reports', // for "News & Alerts"
    'checkout',
    'activation']
};

// export function hasPermission(userRole: User['role'] | null, permission: string): boolean {
//   if (!userRole) return false;
//   const roleKey = userRole.toLowerCase();
//   const perms = rolePermissions[roleKey as keyof typeof rolePermissions] || [];
//   return perms.includes('*') || perms.includes(permission);
// }

export function hasPermission(userRole: string | null, permission: string): boolean {
  if (!userRole) return false;


  // Normalize to lowercase to match the keys in rolePermissions
  const roleKey = userRole.toLowerCase();
  const perms = rolePermissions[roleKey] || [];

  console.log("DEBUG hasPermission - roleKey:", roleKey, "perms:", perms, "permission:", permission, "result:", perms.includes('*') || perms.includes(permission));

  // Check for the wildcard '*' or the specific permission string
  return perms.includes('*') || perms.includes(permission);
}
