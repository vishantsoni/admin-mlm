"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/serverCallFunction";
import { useAuth } from "@/context/AuthContext";
import serverCallFuction from "@/lib/constantFunction";
import Badge from "../ui/badge/Badge";
import { Download } from "lucide-react";


const DEFAULT_IMG = "/images/placeholder.png";

export default function IDCardCompo() {

    const { user } = useAuth()
    const effectiveUserId = user?.id;
    // This component is intentionally frontend-only.
    // The real generation must happen in your separate backend at:
    //   POST /api/id-cards/generate
    // and outputs:
    //   /uploads/id-cards/[user-id]/front.jpg
    //   /uploads/id-cards/[user-id]/back.jpg
    //   /uploads/id-cards/[user-id]/qr.png



    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const baseUploadUrl = useMemo(() => {
        // serverCallFunction uses NEXT_PUBLIC_API_URL; for images we rely on that
        return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    }, []);

    const idCardUrls = useMemo(() => {
        if (effectiveUserId === undefined || effectiveUserId === null) {
            return {
                front: DEFAULT_IMG,
                back: DEFAULT_IMG,
                qr: DEFAULT_IMG,
            };
        }

        return {
            front: `${baseUploadUrl}/uploads/id-cards/${effectiveUserId}/front.jpg`,
            back: `${baseUploadUrl}/uploads/id-cards/${effectiveUserId}/back.jpg`,
            qr: `${baseUploadUrl}/uploads/id-cards/${effectiveUserId}/qr.png`,
        };
    }, [baseUploadUrl, effectiveUserId]);

    // If backend generates “if missing”, we can just call it.
    // Because body is empty (per your note), send an empty object.
    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            if (effectiveUserId === undefined || effectiveUserId === null) return;

            setLoading(true);
            setError(null);
            try {
                // Prefer empty body; serverCallFunction always JSON-stringifies body.
                // backend should accept empty body.
                await serverCallFuction("POST",
                    "api/id-cards/generate"
                );

                if (!cancelled) {
                    // ignore payload; backend is responsible for writing files
                    // res may contain URLs/status, but not required.
                }
            } catch (e: unknown) {
                const err = e as { message?: string };

                if (!cancelled) {
                    setError(err?.message || "Failed to generate ID card");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [effectiveUserId]);

    const downloadIdCard = (url: string, side: 'Front' | 'Back') => {
        if (!url) return;

        // Create a hidden link
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank"; // Open in new tab

        // Suggest a filename: e.g., ID_Card_Front_1715600000.jpg
        link.download = `ID_Card_${side}_${Date.now()}.jpg`;

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="w-full">
            {loading ? (
                <div className="text-sm text-gray-600">Generating ID card...</div>
            ) : null}

            {error ? (
                <div className="text-sm text-red-600 mt-2">{error}</div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="rounded-xl border p-3 bg-white dark:bg-gray-900 relative">
                    <div className="text-sm font-medium mb-2">Front</div>
                    <Image
                        src={idCardUrls.front}
                        alt="ID Card Front"
                        width={300}
                        height={200}
                        className="w-full h-auto rounded-lg object-contain"

                    />
                    <Badge
                        variant="solid"
                        className="absolute top-2 right-2 mt-0 z-999 cursor-pointer flex items-center justify-center hover:bg-opacity-90 active:scale-95 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents triggering parent clicks
                            downloadIdCard(idCardUrls.front, 'Front');
                        }}
                    >
                        <Download className="mr-1" size={16} />
                        <span>Download</span>
                    </Badge>
                </div>

                <div className="rounded-xl border p-3 bg-white dark:bg-gray-900 relative">
                    <div className="text-sm font-medium mb-2">Back</div>
                    <Image
                        src={idCardUrls.back}
                        alt="ID Card Back"
                        width={600}
                        height={380}
                        className="w-full h-auto rounded-lg object-contain"
                        unoptimized
                    />
                    <Badge
                        variant="solid"
                        className="absolute top-2 right-2 mt-0 z-999 cursor-pointer flex items-center justify-center hover:bg-opacity-90 active:scale-95 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents triggering parent clicks
                            downloadIdCard(idCardUrls.back, 'Back');
                        }}
                    >
                        <Download className="mr-1" size={16} />
                        <span>Download</span>
                    </Badge>
                </div>

                <div className="rounded-xl border p-3 bg-white dark:bg-gray-900 ">
                    <div className="text-sm font-medium mb-2">QR</div>
                    <div className="flex items-center justify-start gap-4">
                        <Image
                            src={idCardUrls.qr}
                            alt="ID Card QR"
                            width={200}
                            height={200}
                            className="w-48 h-48 rounded-lg object-contain"
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

