"use client";

import React, { useState, useEffect, useCallback } from 'react';
import serverCallFuction from '@/lib/constantFunction';
import { KycRequest, ApiResponse, KycDocument } from '@/types/kyc';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Avatar from '@/components/ui/avatar/Avatar';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { Search, Eye, CheckCircle, XCircle, Download, TicketIcon, Check } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import Alert from '@/components/ui/alert/Alert';

const KycRequestsPage = () => {
  const [requests, setRequests] = useState<KycRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<KycRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'under_review' | 'approved' | 'rejected'>('all');

  const [documentsModalOpen, setDocumentsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<KycRequest | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<KycDocument[]>([]);

  const fetchRequests = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      setError('');
      const endpoint = status !== 'all' ? `api/users/admin/kyc-requests?status=${status}` : 'api/users/admin/kyc-requests';
      const res = await serverCallFuction('GET', endpoint) as ApiResponse<KycRequest[]>;
      if (res.status !== false && res.data) {
        setRequests(res.data);
      } else {
        setError(res.message || 'Failed to fetch KYC requests');
      }
    } catch (err) {
      setError('Error fetching KYC requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests(statusFilter === 'all' ? 'all' : statusFilter);
  }, [fetchRequests, statusFilter]);

  useEffect(() => {
    const filtered = requests.filter(request => {
      const name = (request.full_name || '').toLowerCase();
      const email = (request.email || '').toLowerCase();
      const username = (request.username || '').toLowerCase();
      return name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        username.includes(searchTerm.toLowerCase());
    });
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  const openDocumentsModal = useCallback((request: KycRequest) => {
    setSelectedRequest(request);
    setSelectedDocuments(request.documents || []);
    setDocumentsModalOpen(true);
  }, []);

  const updateStatus = async (id: number, newStatus: 'approved' | 'rejected') => {


    const action = newStatus.toLowerCase();
    const message = `This will ${action} the KYC request and all associated documents.\nAre you sure you want to proceed?`;

    if (!confirm(message)) return;

    try {
      const res = await serverCallFuction('PUT', `api/users/admin/kyc-requests/${id}`, { status: newStatus } as any);
      if (res.status !== false) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      } else {
        alert(res.message || 'Update failed');
      }
    } catch (err) {
      alert('Update failed');
    }
  };


  const handleApproved = async (item: KycRequest, status:string) => {
    
    if(item.pending_docs !== "0"){
      alert('Please review all pending documents before approving the request.');
      return;
    }

    updateStatus(item.id, status as 'approved' | 'rejected');

  }

  const statusConfig = [
    { value: 'all' as const, label: 'All' },
    { value: 'under_review' as const, label: 'Under Review' },
    { value: 'approved' as const, label: 'Approved' },
    { value: 'rejected' as const, label: 'Rejected' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'under_review':
      default: return 'warning';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-lg">Loading KYC requests...</div>
      </div>
    );
  }


  // updateStatus
  const updateDocStatus = async (id: number, newStatus: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${newStatus} this Document?`)) return;
    try {
      const res = await serverCallFuction('PUT', `api/users/kyc/doc-update/${id}`, { status: newStatus } as any);
      if (res.status !== false) {
        // setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        setSelectedDocuments(prev => prev.map(doc => doc.doc_id === id ? { ...doc, status: newStatus } : doc));
      } else {
        alert(res.message || 'Update failed');
      }
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            KYC Requests
          </h1>
          <p className="text-muted-foreground dark:text-gray-300">
            Manage pending KYC verification requests
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-8 h-4" />
            <Input
              placeholder="Search by name or email..."
              defaultValue={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 w-full"
            />
          </div>
          <Select
            options={statusConfig}
            defaultValue={statusFilter}
            onChange={(value: string) => {
              const status = value as 'all' | 'under_review' | 'approved' | 'rejected';
              setStatusFilter(status);
            }}
            placeholder="Filter by status"
            className='w-8'
          />
        </div>
      </div>

      {error && (
        <Alert variant="error" title="Error" message={error} />
      )}

      <div className="rounded-xl border bg-card overflow-hidden bg-white dark:bg-gray-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">User</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Email</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Status</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Submitted</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Documents</TableCell>
                <TableCell isHeader className="px-6 py-4 font-semibold text-gray-100 dark:text-white text-left">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={'/images/user/user-01.jpg'}
                          alt={request.full_name}
                          size="medium"
                        />
                        <div>
                          <div className="font-medium">{request.full_name}</div>
                          <div className="text-sm text-gray-500">{request.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div>
                        <div className="font-sm">{request.email}</div>
                        <div className="text-sm text-gray-500">{request.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <Badge size="sm" color={getStatusColor(request.status)}>
                        {request.status === 'under_review' ? 'Under Review' : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">{new Date(request.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      Pending: {request.pending_docs} | Approved: {request.approved_docs}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocumentsModal(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {request.status === 'under_review' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproved(request, 'approved')}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproved(request, 'rejected')}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground dark:text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? 'No matching KYC requests found.' : 'No KYC requests yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal isOpen={documentsModalOpen} onClose={() => setDocumentsModalOpen(false)} className='max-w-lg mx-auto'>
        <div className="p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              Documents for {selectedRequest?.full_name || 'User'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDocumentsModalOpen(false)}
              className="h-8 w-8 p-0"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>

          {selectedDocuments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No documents available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDocuments.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white capitalize">{doc.document_type}</h3>
                      <Badge size="sm" color={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'error' : 'warning'}>
                        {doc.status}
                      </Badge>
                      {/* <img src={doc.file_url} width={300} height={200} alt={doc.document_type} /> */}
                    </div>
                    <div className="flex flex-col items-end gap-2 items-align-center">
                      <Badge
                        // variant="outline"
                        size="sm"
                      // asChild
                      >
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          View
                        </a>
                      </Badge>
                      {doc.status !== "approved" &&
                        <Badge size='sm' variant='solid' color='success' onClick={() => {
                          updateDocStatus(doc!.doc_id, 'approved');

                        }}><Check className="w-4 h-4" /> </Badge>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default KycRequestsPage;

