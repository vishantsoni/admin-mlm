"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import  serverCallFuction  from '@/lib/constantFunction';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import  Badge  from '@/components/ui/badge/Badge';
import  Button  from '@/components/ui/button/Button';
import  Input  from '@/components/form/input/InputField';
import { WithdrawalRequest, CappingType, WithdrawalStatus } from '@/types/wallet-type';
import { ListIcon } from '@/icons';
import { formatDate } from '@fullcalendar/core/index.js';
import { Modal } from '@/components/ui/modal';
import WithdrawalForm from '@/components/withdraw/WithdrawalForm';
import { Wallet } from 'lucide-react';

// import { format, parseISO } from 'date-fns';

// Mock data (replace with real API)
const mockWithdrawals: WithdrawalRequest[] = [
  
  // Add more
];

export default function WithdrawalsPage() {
  const { hasPermission } = useAuth();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [cappings, setCappings] = useState<CappingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<WithdrawalRequest[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    userSearch: '',
    users: [] as WithdrawalRequest[],
    selectedUser: null as WithdrawalRequest | null,
    uvAmount: 0,
    rsAmount: 0,
    bankName: '',
    accountNo: '',
    ifsc: '',
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {

    if (!hasPermission('withdrawals')) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch withdrawals
        const withdrawalsRes = await serverCallFuction('GET', 'api/admin/withdrawals') || { data: [] };
        const wData = withdrawalsRes.data || mockWithdrawals;

        // Fetch cappings
        const cappingRes = await serverCallFuction('GET', 'api/settings/capping/list');
        const cData = cappingRes.data || [];

        setWithdrawals(wData);
        setCappings(cData);
      } catch (error) {
        console.error('Fetch error:', error);
        setWithdrawals(mockWithdrawals);
        setCappings([]); // use mock cappings if needed
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = withdrawals.filter(w => 
      w.userName.toLowerCase().includes(search.toLowerCase()) ||
      w.status.includes(search.toLowerCase())
    );
    setFilteredWithdrawals(filtered);
  }, [search, withdrawals]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (formData.userSearch.length < 2) {
        setFormData(fd => ({...fd, users: []}));
        return;
      }
      try {
        const res = await serverCallFuction('GET', `api/admin/users?search=${formData.userSearch}`) || {data: []};
        setFormData(fd => ({...fd, users: res.data || [] as WithdrawalRequest[]} ));
      } catch (error) {
        console.error('User search error', error);
        setFormData(fd => ({...fd, users: []}));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.userSearch]);

  const handleApprove = async (withdrawal: WithdrawalRequest) => {
    // Find capping for level
    const capping = cappings.find(c => c.level_no === withdrawal.levelNo);
    if (!capping) {
      alert('Capping not found for level');
      return;
    }

    const dayLimit = parseFloat(capping.day_limit || '0');
    const weekLimit = parseFloat(capping.week_limit || '0');
    const monthLimit = parseFloat(capping.monthly_limit || '0');

    if (withdrawal.balance! < withdrawal.rsAmount) {
      alert('Insufficient balance');
      return;
    }
    if (withdrawal.dayUsed >= dayLimit) {
      alert('Day limit exceeded');
      return;
    }
    if (withdrawal.weekUsed >= weekLimit) {
      alert('Week limit exceeded');
      return;
    }
    if (withdrawal.monthUsed >= monthLimit) {
      alert('Month limit exceeded');
      return;
    }

    try {
      // API call
      const res = await serverCallFuction('POST', `api/admin/withdrawals/${withdrawal.id}/approve`);
      if (res.status) {
        // Update local
        setWithdrawals(prev => prev.map(w => 
          w.id === withdrawal.id ? { ...w, status: 'approved' as WithdrawalStatus } : w
        ));
        alert('Approved successfully');
      } else {
        alert(res.message || 'Approve failed');
      }
    } catch (error) {
      alert('Approve error');
    }
  };

  const handleReject = async (withdrawal: WithdrawalRequest) => {
    try {
      const res = await serverCallFuction('POST', `api/admin/withdrawals/${withdrawal.id}/reject`, { reason: 'Admin rejected' });
      if (res.status) {
        setWithdrawals(prev => prev.map(w => 
          w.id === withdrawal.id ? { ...w, status: 'rejected' as WithdrawalStatus } : w
        ));
        alert('Rejected successfully');
      }
    } catch (error) {
      alert('Reject error');
    }
  };

  if (!hasPermission('withdrawals')) {
    return <div className="p-8 text-center">Access denied. No permission for withdrawals.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <ListIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Withdrawals (1 UV = 10 RS)</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage user withdrawal requests</p>
          </div>
        </div>
        <Input
          placeholder="Search by user or status..."
          defaultValue={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => setIsCreateOpen(true)}>
          Raise New Request
        </Button>
      </div>

      {loading ? (

        <div className="flex items-center justify-center py-12">
          <p>Loading withdrawals...</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden bg-white dark:bg-gray-900">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">ID</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">User</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Level</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">UV / RS</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Balance</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Day/Week/Month Used</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Status</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Requested</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">#{withdrawal.id}</TableCell>
  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">

                    {withdrawal.userName}
                    <p className="text-sm text-gray-500">{withdrawal.email}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{withdrawal.levelName} (Lv {withdrawal.levelNo})</TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    <div>{withdrawal.uvAmount} UV</div>
                    <div className="font-semibold">₹{withdrawal.rsAmount}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">₹{withdrawal.balance || 0}</TableCell>
  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 text-xs">

                    <div>Day: {withdrawal.dayUsed}</div>
                    <div>Week: {withdrawal.weekUsed}</div>
                    <div>Month: {withdrawal.monthUsed}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    <Badge 
                    // variant={withdrawal.status === 'pending' ? 'default' : withdrawal.status === 'approved' ? 'success' : 'destructive'}
                    >
                      {withdrawal.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatDate(withdrawal.requestedAt)}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {withdrawal.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(withdrawal)}>
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleReject(withdrawal)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredWithdrawals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 h-32">
                    No withdrawals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} className="max-w-4xl">
        <div className="p-6 space-y-4 ">
          <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Withdraw Funds</h2>
          <p className="text-sm text-gray-500">Convert your UV to INR instantly</p>
        </div>
      </div>

          {/* <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Select Distributor</p>
              <Input 
                placeholder="Search distributors by name..." 
                defaultValue={formData.userSearch} 
                onChange={(e) => setFormData(fd => ({...fd, userSearch: e.target.value, selectedUser: null}))} 

              />
              <div className="max-h-40 overflow-y-auto mt-2 space-y-1 border rounded-lg p-2">
                {formData.users.slice(0,5).map((user: WithdrawalRequest) => (
                  <Button 
                    key={user.id} 
                    variant="ghost" 
                    className="justify-start w-full h-auto py-2 px-3 text-left hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setFormData(fd => ({...fd, selectedUser: user}))}
                  >
                    <div>
                      <div className="font-medium">{user.userName}</div>
                      <div className="text-xs text-muted-foreground">{user.email} • Lv {user.levelNo} ({user.levelName})</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            {formData.selectedUser && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                <p className="font-semibold text-sm mb-1">Selected: {formData.selectedUser.userName}</p>
                <p className="text-xs text-muted-foreground mb-1">Lv {formData.selectedUser.levelNo} • Balance: ₹{formData.selectedUser.balance || 0}</p>
              </div>
            )}
          </div> */}
          <WithdrawalForm  />
          
        </div>
      </Modal>
    </div>
  );
}
