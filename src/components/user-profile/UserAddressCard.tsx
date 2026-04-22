"use client";
import React, { useState, useEffect } from 'react';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { useAuth } from '@/context/AuthContext';
import serverCallFuction from '@/lib/constantFunction';
import { Address, CreateAddressPayload } from '@/types/address';
import { ChevronDown, Edit3, Plus } from 'lucide-react';

export default function UserAddressCard() {
  const { user } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreateAddressPayload>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    landmark: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await serverCallFuction('GET', 'api/ecom/d_addresses?type=distributor');
      if (res.status) {
        setAddresses(Array.isArray(res.data) ? res.data : res.address ? [res.address] : []);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name as keyof CreateAddressPayload]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...formData };
      const endpoint = editingId 
        ? `api/ecom/d_addresses/${editingId}?type=distributor` 
        : 'api/ecom/d_addresses?type=distributor';
      const method = editingId ? 'PUT' : 'POST' as any;
      const res = await serverCallFuction(method, endpoint, payload);
      if (res.status) {
        fetchAddresses();
        closeModal();
        setFormData({
          full_name: '',
          phone: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          country: '',
          pincode: '',
          landmark: ''
        });
        setEditingId(null);
      } else {
        alert(res.message || 'Failed to save address');
      }
    } catch (error) {
      alert('Error saving address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2,
      city: address.city,
      state: address.state,
      country: address.country,
      pincode: address.pincode,
      landmark: address.landmark
    });
    setEditingId(address.id);
    openModal();
  };

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <p>Loading addresses...</p>
      </div>
    );
  }

  const hasAddresses = addresses.length > 0;

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
              Addresses ({addresses.length})
            </h4>
            {!hasAddresses && user?.address && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Primary: {user.address}, {user.city || 'N/A'}, {user.pin || 'N/A'}
              </p>
            )}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {addresses.map((address) => (
                <div key={address.id} className="border border-gray-200 rounded-xl p-4 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-gray-800 dark:text-white">{address.full_name}</h5>
                        {address.is_default && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900/50 dark:text-green-200">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">📞 {address.phone}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{address.address_line1}</p>
                      {address.address_line2 && <p className="text-sm text-gray-600 dark:text-gray-400">{address.address_line2}</p>}
                      <p className="text-xs text-gray-500 mt-1">{address.city}, {address.state} - {address.pincode}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(address);
                        }} 
                        className="p-2 hover:bg-gray-200 rounded-lg dark:hover:bg-gray-700 transition-colors" 
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 lg:w-auto self-start"
          >
            <Plus className="w-4 h-4" />
            {editingId ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-2xl m-4">
        <div className="p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input 
                  id="full_name"
                  name="full_name" 
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input 
                  id="phone"
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel"
                  required 
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="address_line1">Address Line 1 *</Label>
                <Input 
                  id="address_line1"
                  name="address_line1" 
                  value={formData.address_line1}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input 
                  id="address_line2"
                  name="address_line2" 
                  value={formData.address_line2}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city"
                  name="city" 
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state"
                  name="state" 
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country"
                  name="country" 
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input 
                  id="pincode"
                  name="pincode" 
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input 
                  id="landmark"
                  name="landmark" 
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeModal} 
                disabled={submitting}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="flex-1 sm:flex-none"
              >
                {submitting ? 'Saving...' : 'Save Address'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

