"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/lib/auth';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Checkbox from '@/components/form/input/Checkbox';

const ProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    // Step 1: Applicant Details
    fullName: '',
    aadhaarNo: '',
    dob: '',
    gender: '',
    panNo: '',
    email: '',
    whatsappNo: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pin: '',

    // Step 2: Bank Details
    username: '',
    password: '',
    bankName: '',
    accountHolderName: '',
    accountNo: '',
    ifscCode: '',
    branch: '',

    // Step 3: Referral & Nominee
    referralCode: '',
    referrerName: '',
    referrerContact: '',
    nomineeName: '',
    nomineeRelationship: '',
    nomineeAge: '',
    nomineeContact: '',
    nomineeAadhaar: '',

    // Step 4: Business Level
    businessLevel: '',
    agreedToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: (user.fullName || user.username || '') as string,
        email: user.email || '',
        phone: user.phone || '',
        // Add more prefill as available
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreedToTerms: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Profile updated successfully!');
        // Refresh user in context would be ideal, but mock for now
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (title: string, fields: {name: string, label: string, type?: string}[]) => (
    <div className="border border-gray-200 rounded-2xl p-6 dark:border-gray-800">
      <h4 className="text-lg font-semibold mb-6 text-gray-800 dark:text-white/90">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(field => (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            {field.type === 'textarea' ? (
              <textarea
                name={field.name}
                defaultValue={formData[field.name as keyof typeof formData] || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                rows={3}
              />
            ) : field.type === 'select' ? (
              <select name={field.name} defaultValue={formData[field.name as keyof typeof formData] || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select {field.label}</option>
                {field.name === 'gender' && (
                  <>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </>
                )}
                {field.name === 'businessLevel' && (
                  <>
                    <option value="starter">Starter</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </>
                )}
              </select>
            ) : (
              <Input
                name={field.name}
                type={field.type || 'text'}
                defaultValue={formData[field.name as keyof typeof formData] || ''}
                onChange={handleInputChange}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="border border-gray-200 rounded-2xl bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
          My Profile
        </h3>
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Applicant Details */}
          {renderSection('Applicant Details', [
            {name: 'fullName', label: 'Full Name'},
            {name: 'aadhaarNo', label: 'Aadhaar Number'},
            {name: 'dob', label: 'Date of Birth', type: 'date'},
            {name: 'gender', label: 'Gender', type: 'select'},
            {name: 'panNo', label: 'PAN Number'},
            {name: 'email', label: 'Email'},
            {name: 'whatsappNo', label: 'WhatsApp Number'},
            {name: 'phone', label: 'Phone'},
            {name: 'address', label: 'Address', type: 'textarea'},
            {name: 'city', label: 'City'},
            {name: 'state', label: 'State'},
            {name: 'pin', label: 'PIN Code'}
          ])}

          {/* Bank Details */}
          {renderSection('Bank Details', [
            {name: 'username', label: 'Username'},
            {name: 'password', label: 'Password', type: 'password'},
            {name: 'bankName', label: 'Bank Name'},
            {name: 'accountHolderName', label: 'Account Holder Name'},
            {name: 'accountNo', label: 'Account Number'},
            {name: 'ifscCode', label: 'IFSC Code'},
            {name: 'branch', label: 'Branch'}
          ])}

          {/* Referral & Nominee */}
          {renderSection('Referral & Nominee', [
            {name: 'referralCode', label: 'Referral Code'},
            {name: 'referrerName', label: 'Referrer Name'},
            {name: 'referrerContact', label: 'Referrer Contact'},
            {name: 'nomineeName', label: 'Nominee Name'},
            {name: 'nomineeRelationship', label: 'Nominee Relationship'},
            {name: 'nomineeAge', label: 'Nominee Age'},
            {name: 'nomineeContact', label: 'Nominee Contact'},
            {name: 'nomineeAadhaar', label: 'Nominee Aadhaar'}
          ])}

          {/* Business Level */}
          {renderSection('Business Level', [
            {name: 'businessLevel', label: 'Business Level', type: 'select'}
          ])}

          <div className="flex items-center space-x-4 pt-4">
            <label className="flex items-center space-x-3">
              <Checkbox
                id="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleCheckboxChange}
              />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                I agree to terms and conditions
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button disabled={loading} className="flex-1" onClick={handleSubmit}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setFormData({
              fullName: '',
              aadhaarNo: '',
              dob: '',
              gender: '',
              panNo: '',
              email: '',
              whatsappNo: '',
              phone: '',
              address: '',
              city: '',
              state: '',
              pin: '',
              username: '',
              password: '',
              bankName: '',
              accountHolderName: '',
              accountNo: '',
              ifscCode: '',
              branch: '',
              referralCode: '',
              referrerName: '',
              referrerContact: '',
              nomineeName: '',
              nomineeRelationship: '',
              nomineeAge: '',
              nomineeContact: '',
              nomineeAadhaar: '',
              businessLevel: '',
              agreedToTerms: false
            })}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

