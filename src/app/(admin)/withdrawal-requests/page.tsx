"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import serverCallFuction from '@/lib/constantFunction';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import { formatDate } from '@fullcalendar/core/index.js';
import { Modal } from '@/components/ui/modal';
import { ListIcon } from '@/icons';

type WithdrawRequestStatus =
    | 'pending_approval'
    | 'approved'
    | 'rejected'
    | 'processing';

type WithdrawRequest = {
    id: number;
    user_id: number;
    username: string;
    full_name: string;
    amount: string;
    remarks: string;
    status: WithdrawRequestStatus;
    created_at: string;
};

type WithdrawRequestsListResponse = {
    success: boolean;
    data: WithdrawRequest[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    adminUserId?: number;
};

type ApproveResponse = {
    success?: boolean;
    status?: boolean;
    message?: string;
};


type ApprovePayload = {
    adminRemark: string;
};

export default function WithdrawalRequestsPage() {
    const { hasPermission } = useAuth();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const [requests, setRequests] = useState<WithdrawRequest[]>([]);

    // approve modal
    const [approveOpen, setApproveOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [adminRemark, setAdminRemark] = useState('');
    const [approveLoading, setApproveLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);


    useEffect(() => {
        if (!hasPermission('withdrawal-requests')) return;

        const fetchRequests = async () => {
            setLoading(true);
            setError('');

            try {
                const res = await serverCallFuction<WithdrawRequestsListResponse>(
                    'GET',
                    'api/transactions/withdraw-requests'
                );

                const success =
                    typeof (res as WithdrawRequestsListResponse | undefined)?.success === 'boolean'
                        ? (res as WithdrawRequestsListResponse).success
                        : Boolean((res as Partial<WithdrawRequestsListResponse> | undefined)?.success);

                const data = (res as Partial<WithdrawRequestsListResponse> | undefined)?.data;
                if (success && Array.isArray(data)) {
                    setRequests(data as WithdrawRequest[]);
                } else {
                    setError('Failed to load withdrawal requests');
                }
            } catch (e: unknown) {
                setError(
                    e instanceof Error
                        ? e.message
                        : 'Network error while loading withdrawal requests'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [hasPermission]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return requests;

        return requests.filter((r) => {
            return (
                String(r.id).includes(q) ||
                r.username.toLowerCase().includes(q) ||
                r.full_name.toLowerCase().includes(q) ||
                r.status.toLowerCase().includes(q) ||
                r.remarks.toLowerCase().includes(q)
            );
        });
    }, [requests, search]);

    const statusBadge = (status: WithdrawRequestStatus) => {
        if (status === 'pending_approval') return { color: 'warning' as const };
        if (status === 'approved') return { color: 'success' as const };
        if (status === 'rejected') return { color: 'error' as const };
        return { color: 'info' as const };
    };

    const openApprove = (id: number) => {
        setSelectedId(id);
        setAdminRemark('');
        setApproveOpen(true);
    };

    const openReject = (id: number) => {
        setSelectedId(id);
        setAdminRemark('');
        setRejectOpen(true);
    };


    const handleApprove = async () => {
        if (!selectedId) return;
        setApproveLoading(true);

        try {
            const payload: ApprovePayload = { adminRemark };

            const res = await serverCallFuction<ApproveResponse>(
                'POST',
                `api/transactions/withdraw-requests/${selectedId}/approve`,
                payload
            );

            if (res?.success || res?.status) {
                setRequests((prev) =>
                    prev.map((r) =>
                        r.id === selectedId
                            ? { ...r, status: 'approved' as WithdrawRequestStatus }
                            : r
                    )
                );
                setApproveOpen(false);
            } else {
                alert(res?.message || 'Approve failed');
            }
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : 'Approve error');
        } finally {
            setApproveLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedId) return;
        setRejectLoading(true);

        try {
            const payload: ApprovePayload = { adminRemark };

            const res = await serverCallFuction<ApproveResponse>(
                'POST',
                `api/transactions/withdraw-requests/${selectedId}/reject`,
                payload
            );


            if (res?.success || res?.status) {
                setRequests((prev) =>
                    prev.map((r) =>
                        r.id === selectedId
                            ? { ...r, status: 'rejected' as WithdrawRequestStatus }
                            : r
                    )
                );
                setRejectOpen(false);
            } else {
                alert(res?.message || 'Reject failed');
            }
        } catch (e: unknown) {
            alert(e instanceof Error ? e.message : 'Reject error');
        } finally {
            setRejectLoading(false);
        }
    };



    if (!hasPermission('withdrawal-requests')) {
        return (
            <div className="p-8 text-center">Access denied. No permission for withdrawal requests.</div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                        <ListIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Withdrawal Requests
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Approve user withdrawal requests
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search by id / username / name / status / remarks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-md"
                    />
                </div>
            </div>

            {error ? (
                <div className="p-4 rounded-xl bg-error-50 border border-error-200 text-error-700 text-sm">
                    {error}
                </div>
            ) : null}

            <div className="rounded-xl border bg-card overflow-hidden bg-white dark:bg-gray-900">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-6 py-4 text-left text-gray-100">ID</TableCell>
                                <TableCell isHeader className="px-6 py-4 text-left text-gray-100">User</TableCell>
                                <TableCell isHeader className="px-6 py-4 text-left text-gray-100">Amount</TableCell>
                                <TableCell isHeader className="px-6 py-4 text-left text-gray-100">Remarks</TableCell>
                                <TableCell isHeader className="px-6 py-4 text-left text-gray-100">Status</TableCell>
                                <TableCell isHeader className="px-6 py-4 text-left text-gray-100">Created</TableCell>
                                <TableCell isHeader className="px-6 py-4 text-left text-gray-100">Actions</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-6 py-6 text-gray-600 dark:text-gray-300">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-6 py-6 text-gray-600 dark:text-gray-300">
                                        No withdrawal requests found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((r) => {
                                    const badge = statusBadge(r.status);
                                    return (
                                        <TableRow key={r.id}>
                                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                #{r.id}
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                <div className="font-medium">{r.full_name}</div>
                                                <div className="text-sm text-gray-500">{r.username}</div>
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                                                ₹{r.amount}
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                                                {r.remarks}
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                <Badge color={badge.color} variant="solid">
                                                    {r.status}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {r.created_at ? formatDate(r.created_at) : '-'}
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {r.status === 'pending_approval' ? (
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" onClick={() => openApprove(r.id)}>
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openReject(r.id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">—</span>
                                                )}
                                            </TableCell>

                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Modal isOpen={approveOpen} onClose={() => setApproveOpen(false)} className="max-w-2xl">
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg text-brand-600">
                            <ListIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Approve Withdrawal Request
                            </h2>
                            <p className="text-sm text-gray-500">
                                Admin remark is required by backend payload (adminRemark)
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin remark</label>
                        <Input
                            placeholder="Enter admin remark"
                            value={adminRemark}
                            onChange={(e) => setAdminRemark(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setApproveOpen(false)} disabled={approveLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleApprove} disabled={approveLoading || !selectedId}>
                            {approveLoading ? 'Approving...' : 'Approve'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={rejectOpen} onClose={() => setRejectOpen(false)} className="max-w-2xl">
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-error-50 dark:bg-error-900/20 rounded-lg text-error-600">
                            <ListIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Reject Withdrawal Request
                            </h2>
                            <p className="text-sm text-gray-500">
                                Admin remark is required by backend payload (adminRemark)
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin remark</label>
                        <Input
                            placeholder="Enter admin remark"
                            value={adminRemark}
                            onChange={(e) => setAdminRemark(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={rejectLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleReject} disabled={rejectLoading || !selectedId}>
                            {rejectLoading ? 'Rejecting...' : 'Reject'}
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}

