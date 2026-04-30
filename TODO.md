# TODO - Dashboard Role-Based Implementation

## Task
Implement role-based dashboard:
- Super Admin/Admin: Show existing admin dashboard
- Distributor: Show distributor-specific dashboard with data from `api/dashboard/me`

## Steps

- [x] 1. Modify `src/hooks/useDashboard.ts` - Add DistributorDashboardData type support
- [x] 2. Create `src/components/DistributorDashboard.tsx` - New distributor dashboard component
- [x] 3. Modify `src/components/DashboardCompo.tsx` - Add role-based conditional rendering

## Notes
- `useDashboard` hook already calls `api/dashboard/me` when user role is "Distributor"
- Types for DistributorDashboardData are already defined in `src/types/dashboard.ts`
- Need to get user role from AuthContext to conditionally render components

## Implementation Summary
1. Updated `useDashboard` hook to:
   - Check user role and set `isDistributor` flag
   - Call `api/dashboard/me` for Distributor role
   - Return proper data types based on role

2. Created `DistributorDashboard` component with:
   - Profile card showing user info
   - Wallet cards (Total, Pending, Available balance)
   - Orders summary
   - Transactions summary
   - Team section with direct referrals & downline
   - Recent orders and transactions lists

3. Updated `DashboardCompo` to:
   - Check `isDistributor` flag from hook
   - Render `DistributorDashboard` for Distributor role
   - Render original admin dashboard for other roles
