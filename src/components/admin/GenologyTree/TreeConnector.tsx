"use client";
import serverCallFuction from '@/lib/constantFunction';
import { TreeUser } from '@/types/network-tree';
import React, { useEffect, useState } from 'react'
import GenealogyTree from './GenealogyTree';
import { Calendar, CopyIcon, Mail, Phone, RefreshCw, X } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
const TreeConnector = () => {

    const [treeData, setTreeData] = React.useState<TreeUser[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [selectedNode, setSelectedNode] = React.useState<TreeUser | null>(null);

    const handleNodeSelect = (user: TreeUser) => {
        setSelectedNode(user);
    };

    const closeModal = () => setSelectedNode(null);
    useEffect(() => {

        fetchTreeData()
    }, []);

    const fetchTreeData = async () => {
        try {
            setLoading(true);
            const res = await serverCallFuction('GET', 'api/users/tree');
            setLoading(false);
            if (res.status) {
                setTreeData(res.data);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error fetching tree data:', error);
        }
    }

    const handleRefresh = () => {
        fetchTreeData()
    }

    const [copied, setCopied] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const referralLink = `${baseUrl.replace(/\/$/, '')}/signup?ref=${selectedNode?.referral_code}`;
    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <div className="p-6  mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-brand-600 to-indigo-700 dark:from-gray-300 bg-clip-text text-transparent mb-1 drop-shadow-lg">
                            Network Tree
                        </h1>
                        <p className=" text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                            View your complete binary genealogy tree.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh Tree
                        </button>
                    </div>
                </div>


                <GenealogyTree data={treeData} onSelect={handleNodeSelect} />
                {selectedNode &&
                    <Modal
                        // className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in zoom-in duration-200"
                        isOpen={!!selectedNode}
                        onClose={closeModal}
                        className='max-w-xl mx-auto'
                    >

                        <div
                            className='p-6'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className='mb-6'>
                                <h2 className="text-lg font-bold ">
                                    Member Profile
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Click node to view details</p>
                            </div>


                            <div className="space-y-8">
                                <div className="flex items-start gap-6 p-8 bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-500/10 dark:to-indigo-500/10 rounded-3xl border-2 border-brand-100 dark:border-brand-800/50">
                                    <div className="w-24 h-24 bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl flex-shrink-0 ring-4 ring-white/50 -rotate-6">
                                        {selectedNode.username.slice(-4)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{selectedNode.username}</h3>
                                            <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-full text-xs font-semibold uppercase tracking-wide">
                                                Active
                                            </div>
                                        </div>
                                        <p className="text-3xl font-mono font-bold text-brand-600 mb-6 tracking-tight">{selectedNode.phone} 
                                            <span className='text-lg'> ( {selectedNode.full_name} )</span>
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <span className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-2 block">Node Path</span>
                                                <code className="font-mono text-sm bg-gray-100 dark:bg-gray-400 px-3 py-2 rounded-xl block truncate">
                                                    {selectedNode.node_path}
                                                </code>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-2 block">Referrer</span>
                                                <span className="font-semibold text-lg dark:text-gray-300">{selectedNode.referrer_id}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-2 block">Referral Code</span>
                                                <div className="flex items-center gap-3 bg-gray-100 rounded-xl dark:bg-gray-300/50 px-2">
                                                    <span className="font-semibold text-lg">{selectedNode.referral_code}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleCopy}
                                                        className="h-9 px-3"
                                                    >
                                                        <CopyIcon className="size-4 mr-1" />
                                                        {copied ? "Copied!" : "Copy"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                            Contact Info
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                                <Mail className="w-5 h-5 text-brand-500 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">{selectedNode.email || 'Not provided'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                                <Phone className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                    {/* {new Date(selectedNode.created_at).toLocaleString('en-GB', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} */}
                                                    {selectedNode.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                            Network Stats
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                                                    {selectedNode.children?.length || 0}
                                                </div>
                                                <div className="text-xs uppercase text-emerald-700 dark:text-emerald-300 font-semibold tracking-wide">
                                                    Direct Children
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">
                                                    {/* Lv. {levelFromPath(selectedNode.node_path)} */}
                                                    Lv. {getRelativeLevel(selectedNode.node_path, treeData[0].node_path)}
                                                </div>
                                                <div className="text-xs uppercase text-blue-700 dark:text-blue-300 font-semibold tracking-wide">
                                                    Depth Level
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </Modal>}
            </div >
        </>
    )
}
function levelFromPath(path: string): number {
    return (path.match(/\./g) || []).length + 1;
}

function getRelativeLevel(nodePath: string, rootPath: string): number {
    const nodeDepth = (nodePath.match(/\./g) || []).length + 1;
    const rootDepth = (rootPath.match(/\./g) || []).length + 1;

    // Result: Root is Level 1, children are Level 2, etc.
    return (nodeDepth - rootDepth) + 1;
}
export default TreeConnector
