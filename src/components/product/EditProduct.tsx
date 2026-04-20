"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import serverCallFuction from '@/lib/constantFunction';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import MultiSelect from '@/components/ui/select/MultiSelect';
import DropZone from '@/components/form/DropZone';
import Button from '@/components/ui/button/Button';
import Alert from '@/components/ui/alert/Alert';
import Label from '@/components/form/Label';
import { Image as ImageIcon, X as XIcon, PlusCircle, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface Tax {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  discounted_price?: string;
  cat_id: string;
  category?: Category;
  status: string;
  tax_id: string;
  f_image: string;
  g_image: string[];
  variants: Array<any>;
}

const EditProductPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discounted_price: '',
    cat_id: '',
    status: 'active' as 'active' | 'inactive',
    tax_id: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch product data
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await serverCallFuction('GET', `api/products/products/${id}`);
        if (res.status !== false) {
          const p = res.data;
          setProduct(p);
          setFormData({
            name: p.name,
            description: p.description || '',
            price: p.price,
            discounted_price: p.discounted_price || '',
            cat_id: p.cat_id,
            status: p.status,
            tax_id: p.tax_id,
          });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, taxRes] = await Promise.all([
          serverCallFuction('GET', 'api/products/categories'),
          serverCallFuction('GET', 'api/taxes'),
        ]);
        if (catRes.status !== false) setCategories(catRes.data || []);
        if (taxRes.status !== false) setTaxes(taxRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof typeof prev]: value }));
    if (error) setError('');
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field as keyof typeof prev]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    setSubmitLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('discounted_price', formData.discounted_price);
      formDataToSend.append('cat_id', formData.cat_id);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('tax_id', formData.tax_id);

      const response = await serverCallFuction('PUT', `api/products/products/${id}`, formDataToSend, null);

      if (response.status !== false) {
        setSuccess('Product updated successfully!');
        setTimeout(() => router.push(`/products/${id}`), 1500);
      } else {
        setError(response.message || 'Failed to update product');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Update product details</p>
        </div>
      </div>

      {error && <Alert variant="error" title="Error" message={error} />}
      {success && <Alert variant="success" title="Success" message={success} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Product name"
            />
          </div>
          <div>
            <Label htmlFor="cat_id">Category</Label>
            <Select
              options={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
              value={formData.cat_id}
              onChange={(v) => handleSelectChange(v, 'cat_id')}
              placeholder="Select category"
            />
          </div>
          <div>
            <Label htmlFor="tax_id">Tax</Label>
            <Select
              options={taxes.map(tax => ({ value: tax.id.toString(), label: tax.name }))}
              value={formData.tax_id}
              onChange={(v) => handleSelectChange(v, 'tax_id')}
              placeholder="Select tax"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]}
              value={formData.status}
              onChange={(v) => handleSelectChange(v, 'status')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="discounted_price">Discounted Price</Label>
            <Input
              id="discounted_price"
              name="discounted_price"
              type="number"
              step="0.01"
              value={formData.discounted_price}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Product description"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" disabled={submitLoading}>
            {submitLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Product
              </>
            )}
          </Button>
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;

