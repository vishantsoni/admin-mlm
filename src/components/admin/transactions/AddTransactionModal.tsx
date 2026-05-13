"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Modal as UiModal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Badge from '@/components/ui/badge/Badge';
import serverCallFuction from '@/lib/constantFunction';

import type { ChangeEvent } from 'react';

type TxType = 'credit' | 'debit';

type AddTransactionPayload = {
    user_id: number;
    type: TxType;
    amount: string | number;
    category: string;
    remarks: string;
};

const DEFAULT_CATEGORIES = ['Commission', 'Withdrawal', 'Bonus', 'Other'];

export default function AddTransactionModal({
    isOpen,
    onClose,
    onSuccess,
    prefillUserId,
    selectedUser
}: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    prefillUserId?: number | null;
    selectedUser?: { name: string; email: string } | null;
}) {
    const [userId, setUserId] = useState<string>('');
    const [type, setType] = useState<TxType>('credit');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<string>('Commission');
    const [remarks, setRemarks] = useState<string>('');

    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!isOpen) return;
        setError('');
        setSubmitLoading(false);

        if (prefillUserId) {
            setUserId(String(prefillUserId));
        } else {
            setUserId('');
        }

        setType('credit');
        setAmount('');
        setCategory('Commission');
        setRemarks('');
    }, [isOpen, prefillUserId]);

    const categories = useMemo(() => DEFAULT_CATEGORIES, []);

    const validate = () => {
        const uid = Number(userId);
        if (!uid || Number.isNaN(uid)) return 'User ID is required.';
        if (!amount || Number(amount) <= 0) return 'Amount must be greater than 0.';
        if (!category.trim()) return 'Category is required.';
        if (!remarks.trim()) return 'Remarks are required.';
        return '';
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        // allow digits + decimal
        const v = e.target.value.replace(/[^0-9.]/g, '');
        setAmount(v);
    };

    const handleSubmit = async () => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        const payload: AddTransactionPayload = {
            user_id: Number(userId),
            type,
            amount: amount,
            category: category.trim(),
            remarks: remarks.trim(),
        };

        setSubmitLoading(true);
        setError('');
        try {
            // Endpoint must match backend implementation.
            // Based on existing listing endpoint: api/transactions/transactions
            const res = await serverCallFuction('POST', 'api/transactions/transactions', payload);
            const success = (res as { success?: boolean })?.success;

            if (success === false) {
                setError((res as { message?: string })?.message || 'Failed to add transaction');
                return;
            }

            onClose();
            onSuccess();
        } catch (e: unknown) {
            setError((e as Error)?.message || 'Network error while adding transaction');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <UiModal isOpen={isOpen} onClose={onClose} className="max-w-2xl mx-auto">
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Transaction</h2>
                        <p className="text-sm text-gray-500">Company fund uses.</p>
                    </div>
                    <Badge color="info" variant="solid">
                        Admin
                    </Badge>
                </div>

                {error ? (
                    <div className="mb-4 p-3 rounded-xl bg-error-50 border border-error-200 text-error-700 text-sm">
                        {error}
                    </div>
                ) : null}



                <div className='mb-5'>
                    <Badge>Transaction add for - {selectedUser?.name}</Badge>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            User ID
                        </label>
                        <Input
                            placeholder="Enter user id"
                            value={userId}
                            disabled
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Type
                        </label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setType('credit')}
                            >
                                Credit
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => setType('debit')}
                            >
                                Debit
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Amount (UV)
                        </label>
                        <Input
                            placeholder="0.00"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Remarks
                    </label>
                    <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter remarks"
                        className="w-full min-h-[110px] resize-y rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <Button onClick={handleSubmit} disabled={submitLoading} className="flex-1">
                        {submitLoading ? 'Adding...' : 'Add Transaction'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={submitLoading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </UiModal>
    );
}

