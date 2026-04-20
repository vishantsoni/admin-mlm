"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';

interface Variant {
  id?: string;
  sku: string;
  price: string;
  bv_point: number;
  stock: number;
  attr_mappings: Array<{ attr_id: string; value_id: string }>;
}

interface VariantsAccordionProps {
  variants: Variant[];
  onEdit: () => void;
  onVariantChange: (index: number, field: keyof Variant, value: string | number) => void;
  onDelete: (index: number) => void;
}

const VariantsAccordion: React.FC<VariantsAccordionProps> = ({
  variants,
  onEdit,
  onVariantChange,
  onDelete
}) => {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="border rounded-lg">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <ChevronDown className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
          <div>
            <h4 className="font-semibold text-lg">Variants ({variants.length})</h4>
            <p className="text-sm text-gray-600">Manage product variants</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}>
          Edit
        </Button>
      </div>
      {open && (
        <div className="p-4 border-t ">
          {variants.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No variants created yet. Create from attributes.</p>
          ) : (
            <div className="grid gap-3">
              {variants.map((variant, index) => (
                <div key={variant.id || index} className="p-4 border rounded-lg bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="font-semibold text-lg min-w-0 flex-1 truncate">{variant.sku}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(index)}
                      className="shrink-0"
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">SKU</label>
                      <Input 
                        defaultValue={variant.sku} 
                        onChange={(e) => onVariantChange(index, 'sku', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Price</label>
                      <Input 
                        type="number"
                        defaultValue={variant.price} 
                        onChange={(e) => onVariantChange(index, 'price', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">BV Point</label>
                      <Input 
                        type="number"
                        defaultValue={variant.bv_point} 
                        onChange={(e) => onVariantChange(index, 'bv_point', parseFloat(e.target.value) || 0)} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Stock</label>
                      <Input 
                        type="number"
                        defaultValue={variant.stock} 
                        onChange={(e) => onVariantChange(index, 'stock', parseInt(e.target.value) || 0)} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantsAccordion;

