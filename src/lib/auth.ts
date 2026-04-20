export interface User {
  id: number | string;
  username?: string;
  email?: string;
  phone?: string;
  role: string;
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
  referrer_id?:number;
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
  is_active?:boolean;
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
    'distributor-orders',
    'orders',
    'commissions',
    'level-capping',
    'level-milestone',
    'transactions',
    'withdrawals',
    'gst-tds',
    'reports',
    'settings',
    'ranks',
    'nofications',
    'cms',
    'static-content',
    'state-city',    
    'wallet'

  ], // Has access to everything
  'admin': ['dashboard', 'analytics', 'members', 'kyc-requests', 'products', 'orders', 'commissions', 'withdrawals', 'gst-tds', 'reports', 'plan-settings', 'ranks'],
  'distributor': [
    'dashboard', 
    'referral', 
    'my-profile', 
    'wallet', 
    'network-tree', 
    'members', // for "My Team"
    'products', // for "Shop"
    'product-list',
    'purchase',
    'distributor-orders',
    'orders', 
    'commissions', 
    'level-capping',
    'level-milestone',
    'simulator', 
    'gst-tds', 
    'ranks', 
    'reports' // for "News & Alerts"
  ],
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

export function generateToken(user: User): string {
  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24h
  }));
  const signature = btoa('fake-signature'); // Demo only
  return `${header}.${payload}.${signature}`;
}

