"use client";
import React, { useState, useCallback } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { User } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { CopyIcon, PencilIcon } from "@/icons";

interface UserMetaCardProps {
  user: User | null;
}

export default function UserMetaCard() {
  const { updateUserProfile, user } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    whatsapp_no: user?.whatsappNo || "",
    email: user?.email || "",
    gender: user?.gender || "",
    dob: user?.dob || "",
    business_level: user?.businessLevel?.toString() || "",
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }, [formData]);

  const handleSave = useCallback(() => {
    updateUserProfile({
      fullName: formData.full_name,
      phone: formData.phone,
      whatsappNo: formData.whatsapp_no,
      email: formData.email,
      gender: formData.gender,
      dob: formData.dob,
      businessLevel: parseInt(formData.business_level) || 0,
    });
    closeModal();
  }, [formData, updateUserProfile, closeModal]);

  if (!user) return null;

  const getProfilePic = () => {
    return user.profile_pic ? user.profile_pic : "/images/user/owner.jpg";
  };

  const maskPhone = (phone: string) => {
    if (phone.length < 5) return phone;
    return "*** " + phone.slice(-4);
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={getProfilePic()}
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.full_name || user.username || "User"}
              </h4>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Username : {user.username || "N/A"}
                </p>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {user.role} - Level {user.businessLevel || 0}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.city}, {user.state}
                </p>
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              {/* Referral Code Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(user.referral_code || "").then(() => {
                    // Optional toast
                  });
                }}                
                className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                Referral Code - {user.referral_code || ''}<CopyIcon />
              </Button>
              
              {/* <p className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {user.referral_code ? user.referral_code.slice(0,6) + '...' : 'No Code'}
              </p> */}
            </div>
          </div>
          <Button
            onClick={openModal}
            size="sm"            
            variant="outline"
            startIcon={<PencilIcon />}
          >            
            <span style={{textWrap:'nowrap'}}>Edit Profile</span>
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your profile details.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Details
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Full Name</Label>
                    <Input 
                      name="full_name" 
                      value={formData.full_name}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>WhatsApp</Label>
                    <Input 
                      name="whatsapp_no" 
                      value={formData.whatsapp_no}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email</Label>
                    <Input 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Gender</Label>
                    <Input 
                      name="gender" 
                      value={formData.gender}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>DOB</Label>
                    <Input 
                      type="date" 
                      name="dob" 
                      value={formData.dob}
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Business Level</Label>
                    <Input 
                      type="number" 
                      name="business_level" 
                      value={formData.business_level}
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
