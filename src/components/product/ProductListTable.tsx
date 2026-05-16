"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { Product } from '@/types/product';
import Image from 'next/image';
import { Eye, Edit, Trash2, ArchiveRestore, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';


interface ProductListTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  loading?: boolean;
}

const ProductListTable: React.FC<ProductListTableProps> = ({ products, onDelete, onRestore, loading = false }) => {
  if (loading) {
    return (
      <>
        {/* <TableHeader> */}
        {/* <TableRow> */}
        <div className="text-center py-8" >
          Loading products...
        </div>
        {/* </TableRow> */}
        {/* </TableHeader> */}
      </>
    );
  }


  const { hasPermission } = useAuth();




  return (
    <Table>
      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
        <TableRow>
          <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Image</TableCell>
          <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Name</TableCell>
          <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Price</TableCell>
          <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Category</TableCell>
          <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Variants</TableCell>
          <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Status</TableCell>
          <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
        {products.map((product, index) => {

          const tax_data = product.tax_data

          let total_price = parseFloat(product.base_price);
          console.log("Discounted price - ", product.discounted_price);

          if (product.discounted_price > 0) {
            total_price = parseFloat(product.discounted_price);
          }

          let tax_amount = 0;
          if (tax_data) {
            tax_amount = (total_price * Number(tax_data.percentage)) / 100
            total_price += tax_amount
          }

          return <TableRow key={index}>
            <TableCell className="px-6 py-4">
              <Image
                src={product.f_image?.startsWith('http') ? product.f_image : '/images/user/user-01.jpg'}
                alt={product.name}
                width={50}
                height={50}
                className="rounded object-cover"
                priority={false}
                onError={(e) => {

                }}
                onLoad={() => console.log('Product image loaded:', product.name)}
              />
            </TableCell>
            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{product.name}</TableCell>
            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
              <div>

                {product.discounted_price && product.discounted_price > 0 ? (
                  <>
                    <div className='font-bold'>₹{product.discounted_price}</div>
                    <div className="text-sm text-muted-foreground line-through ">MRP : ₹{product.base_price}</div>
                  </>
                ) : <div className='font-bold'>₹{product.base_price}</div>}

                {product.tax_data && <>
                  <div className="text-sm text-muted-foreground ">{product.tax_data.name} ({product.tax_data.percentage}%) - ₹{tax_amount} </div>
                  <div className="text-sm font-bold">T. Amount - ₹{total_price} </div>
                </>}

              </div>
            </TableCell>
            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{product.category_name || 'Uncategorized'}</TableCell>
            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{product.variant_count}</TableCell>
            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
              <Badge color={product.status === 'active' ? 'success' : 'secondary'}>
                {product.status}
              </Badge>
            </TableCell>
            <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
              <div className="flex gap-2">
                <Link href={`https://feel-safe-mlm-website.vercel.app/products/${product?.slug}`} target='_blank' className="p-2 hover:bg-gray-100 rounded">
                  <Eye className="h-4 w-4" />
                </Link>
                {hasPermission('products/edit') &&
                  <>
                    <Link href={`/products/${product.id}/edit`} className="p-2 hover:bg-gray-100 rounded">
                      <Edit className="h-4 w-4" />
                    </Link>

                    {product.status === 'trash' ? (
                      <Link
                        href={"#"}
                        onClick={() => {
                          if (confirm('Are you sure, you want to restore this product?')) onRestore(product.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded">
                        <RefreshCcw className="h-4 w-4" />
                      </Link>
                    ) : null}
                    <Link
                      className="p-2 hover:bg-gray-100 rounded"
                      href="#"

                      onClick={() => {
                        if (product.status == 'trash') {
                          if (confirm('Are you sure, you want to permanently delete this product?')) onDelete(product.id);
                        } else {
                          if (confirm('Are you sure, you want to delete this product?')) onDelete(product.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" color='red' />
                    </Link>
                  </>
                }


              </div>
            </TableCell>
          </TableRow>


        })}
      </TableBody>
    </Table>
  );

};

export default ProductListTable;

