"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/form/input/Checkbox';
import serverCallFuction from '@/lib/constantFunction';
import { States } from '@/types/static-content';

export default function SignUpStepForm() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [states, setStates] = useState<States[]>([]);
    const [cities, setCities] = useState<States[]>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Applicant Details 6]
        fullName: '', // 7]
        aadhaarNo: '', // 8]
        dob: '', // 9]
        gender: '', // Added for profile completeness
        panNo: '', // 3]
        email: '', // 7]
        whatsappNo: '', // 2]
        phone: '',
        address: '', // 0]
        city: '', // 1]
        state: '', // 5]
        pin: '', // 6]

        // Step 2: Bank Details 8]
        username: '',
        password: '',
        bankName: '', // 2]
        accountHolderName: '', // 0]
        accountNo: '', // 0]
        ifscCode: '', // 1]
        branch: '', // 1]

        // Step 3: Referral & Nominee 3, 26]
        referralCode: '', // 4]
        referrer_id:'',
        referrerName: '', // 4]
        referrerContact: '', // 5]
        nomineeName: '', // 7]
        nomineeRelationship: '', // 8]
        nomineeAge: '', // 8]
        nomineeContact: '', // 9]
        nomineeAadhaar: '', // 0]

        // Step 4: Business Level 5]
        businessLevel: '', // 6]
        agreedToTerms: false // 1]
    });


    // 1. Load data from localStorage on mount + auto-fill referral from ?ref=
    useEffect(() => {
        const urlStepStr = searchParams?.get('step');
        const refCode = searchParams?.get('ref');
        const savedData = localStorage.getItem('sakhi_registration_draft');
        const savedStepStr = localStorage.getItem('sakhi_registration_step');

        const savedObj = savedData ? JSON.parse(savedData) : null;
        setFormData(savedObj || formData);

        // Auto-fill referral code from URL param if empty (after loading saved)
        if (refCode && !savedObj?.referralCode && !formData.referralCode) {
            const updatedData = { ... (savedObj || formData), referralCode: refCode };
            setFormData(updatedData);
            localStorage.setItem('sakhi_registration_draft', JSON.stringify(updatedData));
        }

        let initialStep = 1;
        if (urlStepStr && !isNaN(parseInt(urlStepStr as string))) {
            initialStep = parseInt(urlStepStr as string, 10);
        } else if (savedStepStr && !isNaN(parseInt(savedStepStr))) {
            initialStep = parseInt(savedStepStr, 10);
        }
        setStep(Math.max(1, Math.min(4, initialStep)));
    }, [searchParams]);

    // 2. Save data to localStorage whenever formData or step changes
    useEffect(() => {
        localStorage.setItem('sakhi_registration_draft', JSON.stringify(formData));
        localStorage.setItem('sakhi_registration_step', step.toString());
    }, [formData, step]);

    const fetchReferral = async () => {

        const res = await serverCallFuction('GET', 'api/users/profile-by-referral?referral_code=' + formData.referralCode)
        if (res.status) {
            const data = res.user;
            setFormData({ ...formData, referrer_id:data.id, referrerName: data.name })
        }
    }

    const fetchStates = async () => {
        try {
            setIsLoadingStates(true);
            const res = await serverCallFuction('GET', 'api/static/states');
            if (res.status && Array.isArray(res.data)) {
                setStates(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch states:', error);
        } finally {
            setIsLoadingStates(false);
        }
    };

    const fetchCities = async (stateId) => {
        if (!stateId) {
            setCities([]);
            return;
        }
        try {
            setIsLoadingCities(true);
            const res = await serverCallFuction('GET', `api/static/cities/${stateId}`);
            if (res.status && Array.isArray(res.data)) {
                setCities(res.data);
                setFormData(prev => ({ ...prev, city: '' })); // Reset city on state change
            }
        } catch (error) {
            console.error('Failed to fetch cities:', error);
            setCities([]);
        } finally {
            setIsLoadingCities(false);
        }
    };

    // Fetch states on component mount
    useEffect(() => {
        fetchStates();
    }, []);

    // Fetch cities when formData.state changes
    useEffect(() => {
        fetchCities(formData.state);
    }, [formData.state]);

    useEffect(() => {
        fetchReferral()
    }, [formData.referralCode])

    // Function to check if user reached the bottom of terms 
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // Using a 5px buffer to ensure it triggers correctly on all browsers
        if (scrollHeight - scrollTop <= clientHeight + 5) {
            setHasScrolledToBottom(true);
        }
    };



    // Validation Logic: Check if all required fields in current step are filled
    const isStepValid = () => {
        const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

        if (step === 1) {
            return (
                // formData.referralCode
                formData.fullName.trim().length > 2 &&
                // aadhaarRegex.test(formData.aadhaarNo) &&
                panRegex.test(formData.panNo.toUpperCase()) &&
                phoneRegex.test(formData.whatsappNo) &&
                emailRegex.test(formData.email) &&
                formData.dob &&
                formData.city &&
                formData.pin.length === 6
            );
        }
        if (step === 2) {
            return (
                formData.accountHolderName &&
                formData.accountNo.length >= 9 &&
                ifscRegex.test(formData.ifscCode.toUpperCase())
            );
        }
        if (step === 3) {
            return formData.nomineeName && formData.nomineeRelationship;
        }
        return formData.agreedToTerms && hasScrolledToBottom;
    };

    const handleNext = () => {
        if (isStepValid()) {
            const newStep = step + 1;
            setStep(newStep);
            localStorage.setItem('sakhi_registration_step', newStep.toString());
            router.push(`/signup?step=${newStep}`);
        } else {
            setError('Please fill in all required fields marked with * to proceed Or Valiate the format Fields');
            // alert("Please fill in all required fields marked with * to proceed.");
        }
    };

    const prevStep = () => {
        const newStep = Math.max(1, step - 1);
        setStep(newStep);
        localStorage.setItem('sakhi_registration_step', newStep.toString());
        router.push(`/signup?step=${newStep}`);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStepValid()) return;

        setIsSubmitting(true);
        try {
            console.log("register data - ", formData);

            const response = await serverCallFuction(
                'POST',
                'api/users/create',
                formData
            );

            if (response.status == true) {
                alert("Application submitted successfully! Please login again to complete your KYC and access dashboard.");
                localStorage.removeItem('sakhi_registration_draft');
                localStorage.removeItem('sakhi_registration_step');
                router.push('/signin');
            } else {
                const errorData = response;
                setError(`Submission failed: ${errorData.message || 'Unknown error'}`);
            }

            // if (response.ok) {
            //     alert("Application submitted successfully!");
            //     // Clear storage on success
            //     localStorage.removeItem('sakhi_registration_draft');
            //     localStorage.removeItem('sakhi_registration_step');
            //     // Redirect user or reset state
            // } else {
            //     const errorData = await response.json();
            //     alert(`Submission failed: ${errorData.message || 'Unknown error'}`);
            // }
        } catch (error) {
            console.error("API Error:", error);
            setError("There was a network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-white">SAKHI DISTRIBUTOR APPLICATION</h2>
            <p className="text-center text-sm text-gray-500 mb-6">(Independent Representative Agreement) </p>

            {/* Progress Indicator */}
            <div className="flex justify-between mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-1/4 h-2 rounded-full mx-1 ${step >= i ? 'bg-brand-500' : 'bg-gray-200'}`} />
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* STEP 1: ALL APPLICANT DETAILS 6] */}
                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">1. Applicant Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* <h3 className="font-semibold text-lg border-b pb-2">3. Referral & Nominee Details</h3> */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:col-span-2">
                                <div>
                                    <Label>Referral Code / ID{formData.referralCode && searchParams?.get("ref") === formData.referralCode ? " (Auto-filled from link)" : ""}</Label>
                                    <Input
                                        placeholder="Referral Code / ID"
                                        defaultValue={formData.referralCode || ""}
                                        onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                                        className={searchParams?.get("ref") === formData.referralCode ? "ring-2 ring-brand-200 bg-brand-50" : ""}
                                        disabled={searchParams?.get("ref") === formData.referralCode}
                                    />
                                    {searchParams?.get("ref") === formData.referralCode && (
                                        <p className="text-xs text-brand-600 mt-1 font-medium"> Referral code &#39;{formData.referralCode}&#39; loaded from share link!</p>
                                    )}
                                </div>
                                <div>
                                    <Label>Referral Name</Label>
                                    <Input
                                        placeholder="Referrer Name" defaultValue={formData.referrerName} onChange={(e) => setFormData({ ...formData, referrerName: e.target.value })}
                                        disabled={searchParams?.get("ref") === formData.referralCode} />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <Label>Full Name* </Label>
                                <Input defaultValue={formData.fullName} placeholder="Legal Name" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                            </div>
                            <div>
                                <Label>Aadhaar No* </Label>
                                <Input defaultValue={formData.aadhaarNo} placeholder="12-digit Number" onChange={(e) => setFormData({ ...formData, aadhaarNo: e.target.value })} />
                            </div>
                            <div>
                                <Label>PAN No* </Label>
                                <Input defaultValue={formData.panNo} placeholder="Permanent Account Number" onChange={(e) => setFormData({ ...formData, panNo: e.target.value })} />
                            </div>
                            <div>
                                <Label>Date of Birth* </Label>
                                <Input type="date" defaultValue={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                                <p className="text-[10px] text-gray-400 mt-1">Minimum 21 years required </p>
                            </div>
                            <div>
                                <Label>Gender*</Label>
                                <select
                                    className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                                    defaultValue={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option defaultValue="">Select Gender</option>
                                    <option defaultValue="Female">Female</option>
                                    <option defaultValue="Male">Male</option>
                                    <option defaultValue="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <Label>Phone* </Label>
                                <Input placeholder='Enter Phone no.' defaultValue={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div>
                                <Label>Password* </Label>
                                <Input placeholder='Enter Password' defaultValue={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div>
                                <Label>WhatsApp No* </Label>
                                <Input defaultValue={formData.whatsappNo} placeholder="For updates" onChange={(e) => setFormData({ ...formData, whatsappNo: e.target.value })} />
                            </div>
                            <div>
                                <Label>Email* </Label>
                                <Input type="email" defaultValue={formData.email} placeholder="example@mail.com" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Full Address* </Label>
                                <Input defaultValue={formData.address} placeholder="House No, Street, Landmark" onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-3 gap-2 md:col-span-2">
                                <div>
                                    <Label>State* </Label>
                                    <select
                                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        disabled={isLoadingStates}
                                    >
                                        <option value="">Select State</option>
                                        {isLoadingStates ? (
                                            <option disabled>Loading states...</option>
                                        ) : states.map((state) => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label>City* </Label>
                                    <select
                                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        disabled={isLoadingCities || !formData.state}
                                    >
                                        <option value="">Select City</option>
                                        {isLoadingCities ? (
                                            <option disabled>Loading cities...</option>
                                        ) : cities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <Label>PIN* </Label>
                                    <Input placeholder='Enter PIN' defaultValue={formData.pin} onChange={(e) => setFormData({ ...formData, pin: e.target.value })} />
                                </div>
                            </div>

                        </div>
                        <Button onClick={handleNext} className="w-full mt-4">Next: Bank Details</Button>
                    </div>
                )}

                {/* STEP 2: BANK DETAILS 8] */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">2. Bank Account Details (KYC)</h3>
                        <p className="text-xs text-brand-600 mb-4 font-medium">Mandatory for Commission Payouts </p>
                        <Label>Account Holder Name* </Label>
                        <Input placeholder="Account Holder Name*" defaultValue={formData.accountHolderName}
                            onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })} />
                        <Label>Account Number* </Label>
                        <Input placeholder='Enter Account Number' defaultValue={formData.accountNo} onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>IFSC Code* </Label>
                                <Input placeholder='Enter IFSC code' defaultValue={formData.ifscCode} onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })} />
                            </div>
                            <div>
                                <Label>Bank Name* </Label>
                                <Input placeholder='Enter Bank Name' defaultValue={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
                            </div>
                        </div>
                        <Label>Branch</Label>
                        <Input placeholder='Enter Branch' defaultValue={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
                        <div className="flex gap-4 pt-4">
                            <Button variant="outline" onClick={prevStep} className="w-1/2">Back</Button>
                            <Button onClick={handleNext} className="w-1/2">Next: Referrals</Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: REFERRAL & NOMINEE 3, 26] */}
                {step === 3 && (
                    <div className="space-y-4">

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                            <h4 className="text-sm font-bold mb-4 uppercase text-gray-600 dark:text-gray-400">Nominee Details </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Nominee Name*</Label>
                                    <Input placeholder="Nominee Name" defaultValue={formData.nomineeName} onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Nominee Relationship*</Label>
                                    <select
                                        className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                                        value={formData.nomineeRelationship}
                                        onChange={(e) => setFormData({ ...formData, nomineeRelationship: e.target.value })}
                                    >
                                        <option value="">Select Relationship</option>
                                        <option value="Brother">Brother</option>
                                        <option value="Sister">Sister</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">Daughter</option>
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <Label>Nominee Age*</Label>
                                    <Input placeholder="Nominee Age" defaultValue={formData.nomineeAge} onChange={(e) => setFormData({ ...formData, nomineeAge: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Nominee Aadhaar*</Label>
                                    <Input placeholder="Nominee Aadhaar" defaultValue={formData.nomineeAadhaar} onChange={(e) => setFormData({ ...formData, nomineeAadhaar: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button variant="outline" onClick={prevStep} className="w-1/2">Back</Button>
                            <Button onClick={handleNext} className="w-1/2">Next: Business Level</Button>
                        </div>
                    </div>
                )}

                {/* STEP 4: BUSINESS LEVEL & AGREEMENT 5] */}
                {step === 4 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">4. Business Entry & Selection</h3>

                        {/* <div className="space-y-3">
                            {[
                                { id: '1', name: 'Level 1: Basic Sakhi', detail: 'Initial start - Min order ₹2,000' }, // [cite: 97]
                                { id: '2', name: 'Level 2: Professional Sakhi', detail: 'Small business stock ₹25,000' }, // [cite: 98]
                                { id: '3', name: 'Level 3: Master Sakhi / Distributor', detail: 'Large-scale/Stockist ₹1,00,000' } // [cite: 99]
                            ].map((lvl) => (
                                <label key={lvl.id} className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition ${formData.businessLevel === lvl.id ? 'border-brand-500 bg-brand-50/50' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="bizLevel" checked={formData.businessLevel === lvl.id} onChange={() => setFormData({ ...formData, businessLevel: lvl.id })} />
                                    <div>
                                        <p className="font-bold text-sm">{lvl.name}</p>
                                        <p className="text-xs text-gray-500">{lvl.detail}</p>
                                    </div>
                                </label>
                            ))}
                        </div> */}

                        <Label className="mt-4 block">Terms and Conditions (Scroll to bottom to enable submit)*</Label>
                        {/* <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded text-[12px] leading-relaxed border dark:border-gray-700 h-48 overflow-y-auto no-scrollbar border-gray-300"
            >
              
            </div> */}
                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded text-[12px] leading-relaxed border dark:border-gray-700 h-64 overflow-y-auto no-scrollbar border-gray-300"
                        >
                            <div className="space-y-4">
                                {/* I. LEGAL STATUS & COMPLIANCE */}
                                <div>
                                    <p className="font-bold underline uppercase">I. Legal Status & Compliance</p>
                                    <p>1. <b>Independent Status:</b> I acknowledge that I am an Independent Representative (IR) of Feel Safe Co. I am not an employee, agent, or legal representative of the company. I am solely responsible for filing my own income tax and statutory obligations.</p>
                                    <p>2. <b>Compliance with Consumer Protection Rules:</b> I acknowledge that Feel Safe Co. strictly adheres to the "Consumer Protection (Direct Selling) Rules, 2021" issued by the Government of India. I commit to conducting my business in full compliance with these regulations.</p>
                                    <p>3. <b>No Investment Policy:</b> I confirm that there is no joining fee to partner with the company. Any payment made by me is strictly for the purchase of products under the brand name FEEL & SAFE.</p>
                                    <p>4. <b>Statutory Obligations:</b> I agree to fulfill all statutory requirements, including ethical marketing and tax compliance. Any breach of government guidelines will result in immediate termination.</p>
                                </div>

                                {/* II. BUSINESS CONDUCT & MARKETING */}
                                <div>
                                    <p className="font-bold underline uppercase text-gray-700 dark:text-gray-300">II. Business Conduct & Marketing</p>
                                    <p>5. <b>Prohibition of Misrepresentation:</b> I shall not make any false or exaggerated claims regarding product benefits, ingredients, or lab reports. I will use only company-authorized materials.</p>
                                    <p>6. <b>Non-Compete Clause:</b> While serving as a distributor, I shall not engage in the promotion, sale, or marketing of any competing sanitary napkin brands.</p>
                                    <p>7. <b>Marketing Discipline:</b> Selling products on e-commerce platforms (Amazon, Flipkart, etc.) without prior written consent is strictly prohibited.</p>
                                    <p>8. <b>Earnings Disclaimer:</b> Income is based solely on actual sales performance. The company makes no guarantees of "get-rich-quick" schemes or passive income.</p>
                                    <p>9. <b>Anti-Pyramid Rule:</b> I shall not lure any individual with the promise of money for recruitment. My primary role is health awareness and product distribution.</p>
                                </div>

                                {/* III. PAYOUTS, RETURNS & INVENTORY */}
                                <div>
                                    <p className="font-bold underline uppercase text-gray-700 dark:text-gray-300">III. Payouts, Returns & Inventory</p>
                                    <p>10. <b>Commission Disbursement:</b> I acknowledge a 30-day Cooling-off Period for all purchases. Commissions will be processed in the first week (1st Week) of the following month, only after the 30-day window is complete.</p>
                                    <p>11. <b>Refund Adjustments:</b> No commission shall be payable on orders that are returned, cancelled, or refunded within the 30-day cooling-off period.</p>
                                    <p>12. <b>Buy-Back Policy:</b> If I terminate within 30 days, the company will buy back unsold stock in marketable condition. Post-30 days, refunds are subject to stock condition and expiry audits.</p>
                                    <p>13. <b>Inventory Loading Prohibition:</b> I am advised to purchase only the amount of stock I can reasonably sell or consume within 30 days.</p>
                                </div>

                                {/* IV. OPERATIONAL PROTOCOLS */}
                                <div>
                                    <p className="font-bold underline uppercase text-gray-700 dark:text-gray-300">IV. Operational Protocols (Field Work & Hygiene)</p>
                                    <p>14. <b>Awareness & Distribution:</b> My primary role is to raise health awareness among women and conduct door-to-door sales.</p>
                                    <p>15. <b>Identification & Credentials:</b> It is mandatory to carry and display my Official ID Card and Authorization Letter during every field visit.</p>
                                    <p>16. <b>Standardized Demonstration:</b> I shall use only the Authorized Demo Kit provided by the company.</p>
                                    <p>17. <b>Hygiene Standards:</b> To maintain product hygiene, I agree to wear Hand Gloves while handling or delivering products to customers.</p>
                                    <p>18. <b>Product Integrity & Storage:</b> I agree to store products in a clean, dry, and hygienic environment and will not tamper with packaging or MRP.</p>
                                </div>

                                {/* V. SAFETY, ETHICS & LIABILITY */}
                                <div>
                                    <p className="font-bold underline uppercase text-gray-700 dark:text-gray-300">V. Safety, Ethics & Liability</p>
                                    <p>19. <b>Safety & Conduct:</b> I shall prioritize ethical conduct and respect the privacy of customers. No harassment or unprofessional behavior will be tolerated.</p>
                                    <p>20. <b>Personal Safety & Vigilance:</b> My personal safety is my primary responsibility. I will operate in safe, well-populated areas and avoid isolated locations or late hours.</p>
                                    <p>21. <b>Risk Mitigation:</b> I am advised to keep family or team leaders informed of my real-time location during field work.</p>
                                    <p>22. <b>Non-Compulsion:</b> The company does not mandate working in conditions that compromise my safety. I am authorized to stop work and report any threats to authorities and the company.</p>
                                    <p>23. <b>Indemnity:</b> I hold myself personally liable for any legal consequences or losses incurred by the company due to my misconduct.</p>
                                </div>

                                {/* VI. ADMINISTRATIVE RIGHTS */}
                                <div>
                                    <p className="font-bold underline uppercase text-gray-700 dark:text-gray-300">VI. Administrative Rights</p>
                                    <p>24. <b>Modification Rights:</b> The company reserves the right to change the business plan, prices, or commission structure at any time via official communication.</p>
                                    <p>25. <b>Digital Consent:</b> I consent to receive business updates and payout alerts via WhatsApp, SMS, and Email.</p>
                                    <p>26. <b>Zero Tolerance for Poaching:</b> Enticing or recruiting Feel Safe Co. distributors into other businesses will lead to immediate legal action.</p>
                                    <p>27. <b>Force Majeure & Liability:</b> The company is not liable for delays caused by natural disasters or government restrictions. Total liability is limited to the price of products purchased.</p>
                                    <p>28. <b>Survival Clause:</b> Confidentiality and non-compete obligations survive even after the termination of this agreement.</p>
                                    <p>29. <b>Referral Integrity:</b> I confirm that I am joining under the aforementioned Referrer. I understand that the Referral Code cannot be changed once the application is processed.</p>
                                </div>

                                {/* VII. BUSINESS ENTRY & STOCK */}
                                <div>
                                    <p className="font-bold underline uppercase text-gray-700 dark:text-gray-300">VII. Business Entry & Stock</p>
                                    <p>30. <b>Business Level Selection:</b> I acknowledge that I have been informed about the different operational levels of the company.</p>
                                    <p>31. <b>Level 1:</b> Basic Sakhi (Initial start – Minimum order ₹2,000).</p>
                                    <p>32. <b>Level 2:</b> Professional Sakhi (Small business stock – ₹25,000).</p>
                                    <p>33. <b>Level 3:</b> Master Sakhi / Distributor (Large-scale/Stockist – ₹1,00,000).</p>
                                    <p>34. <b>Voluntary Choice:</b> I confirm that the selection of the above level is entirely my own decision. The company has not imposed any mandatory targets or pressure to choose a higher level.</p>
                                    <p>35. <b>Upgradation:</b> I understand that I have the right to upgrade my level in the future based on my performance and financial capacity.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <Checkbox
                                checked={formData.agreedToTerms}
                                onChange={(val) => setFormData({ ...formData, agreedToTerms: val })}
                            />
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                                I certify that I have chosen my business level based on my own financial capacity and have read and understood all 35 clauses mentioned above[cite: 110, 111].
                            </p>
                        </div>

                        <div className="flex gap-4 pt-2">
                            {/* <Button variant="outline" className="w-1/2">Back</Button> */}
                            <Button variant="outline" onClick={prevStep} className="w-1/2">Back</Button>
                            <Button
                                type="submit"
                                disabled={!isStepValid()}
                                className={`w-1/2 transition-all ${isStepValid() ? 'bg-brand-500 hover:bg-brand-600 opacity-100' : 'bg-gray-300 cursor-not-allowed opacity-50'}`}
                            >
                                {!hasScrolledToBottom ? 'Scroll to Read Terms' : 'Submit Application'}
                            </Button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-3 mt-4 text-sm text-error-500 bg-error-50 border border-error-200 rounded-md dark:bg-error-900/20 dark:border-error-800">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}