"use client";

import React, { useState, useEffect, useCallback } from 'react';
import serverCallFuction from '@/lib/constantFunction';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import { InventoryItem, InventoryResponse } from '@/types/inventory';
import Image from 'next/image';

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  const fetchInventory = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = (await serverCallFuction(
        'GET',
        `api/inventory/my?page=${page}&limit=20`
      )) as InventoryResponse;

      if (response.success && response.data) {
        setInventory(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Failed to fetch inventory');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVariantLabel = (item: InventoryItem) => {
    if (!item.variant) return '-';
    const attrs = item.variant.attr_combinations
      .map((a) => a.value)
      .join(', ');
    return attrs || '-';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-gray-300">
            My Inventory
          </h1>
          <p className="text-muted-foreground dark:text-gray-500">
            View your current stock levels
          </p>
        </div>
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          Loading inventory...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-gray-300">
            My Inventory
          </h1>
          <p className="text-muted-foreground dark:text-gray-500">
            View your current stock levels — auto-generated and adjusted by
            system
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-900">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left"
                  >
                    Product
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left"
                  >
                    Variant
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left"
                  >
                    SKU
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left"
                  >
                    Base Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left"
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left"
                  >
                    Last Updated
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {inventory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  inventory.map((item) => (
                    <TableRow key={item.id}>
                      {/* Product Info */}
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shrink-0">
                            {item.product.f_image ? (
                              <Image
                                width={48}
                                height={48}
                                src={item.product.f_image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                                No Img
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="block font-medium text-gray-900 dark:text-white">
                              {item.product.name}
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">
                              {item.product.slug}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Variant */}
                      <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {getVariantLabel(item)}
                      </TableCell>

                      {/* SKU */}
                      <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-sm">
                        {item.variant?.sku?.trim() || '-'}
                      </TableCell>

                      {/* Base Price */}
                      <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        <span className="text-emerald-600 font-semibold">
                          ₹{item.product.base_price}
                        </span>
                      </TableCell>

                      {/* Quantity */}
                      <TableCell className="px-6 py-4">
                        <Badge
                          color={
                            item.quantity > 100
                              ? 'success'
                              : item.quantity > 20
                              ? 'warning'
                              : 'error'
                          }
                          variant="solid"
                          size="sm"
                        >
                          {item.quantity}
                        </Badge>
                      </TableCell>

                      {/* Last Updated */}
                      <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                        {formatDate(item.updated_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination Info */}
      {inventory.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {inventory.length} of {pagination.total} items
          </span>
          <span>
            Page {pagination.page} of {pagination.pages}
          </span>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;

