'use client';

import { useEffect, useState } from 'react';
import { hasPermission } from '@/lib/auth';
import { useSupportTickets } from '@/hooks/useSupportTickets';
import { TicketTable } from '@/components/support/TicketTable';

import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { TicketStatus } from '@/types/ticket';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/ui/badge/Badge';
import { useAuth } from '@/context/AuthContext';

export default function SupportPage() {
    const { getAdminTickets, loading } = useSupportTickets();
    const [tickets, setTickets] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [filterStatus, setFilterStatus] = useState<TicketStatus | ''>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const { user } = useAuth()

    const loadTickets = async () => {
        const params = {
            page: currentPage,
            limit: 10,
            ...(filterStatus && { status: filterStatus }),
        };
        const res = await getAdminTickets(params);
        if (res.success) {
            setTickets(res.tickets);
            setPagination(res.pagination);
        }
    };

    useEffect(() => {
        loadTickets();
    }, [currentPage, filterStatus]);

    const handleStatusChange = async (id: number, status: TicketStatus) => {
        // Update via API
        const res = await useSupportTickets().updateTicketStatus(id, { status });
        if (res.success) {
            loadTickets(); // Refresh
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (!hasPermission(user?.role || '', 'support-tickets')) {
        return <div className="p-8 text-center">Access denied</div>;
    }

    return (
        <div>
            <PageBreadcrumb title="Support Tickets" items={[
                { title: "Dashboard", href: "/dashboard" },
                { title: "Support" }
            ]} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ComponentCard title="Tickets List" className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        {/* <Select value={filterStatus} onValueChange={setFilterStatus as any}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Status</SelectItem>
                                <SelectItem value="OPEN">Open</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select> */}
                        <Button onClick={loadTickets} disabled={loading}>
                            Refresh
                        </Button>
                    </div>
                    <TicketTable
                        tickets={tickets}
                        pagination={pagination}
                        isAdmin
                        loading={loading}
                        onStatusChange={handleStatusChange}
                        onView={(caseId) => setSelectedTicket(caseId)}
                    />
                </ComponentCard>

                {/* Stats cards */}
                <div className="space-y-6">
                    <ComponentCard title="Quick Stats">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Open</span>
                                <Badge>12</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>In Progress</span>
                                <Badge variant="light">5</Badge>
                            </div>
                        </div>
                    </ComponentCard>
                </div>
            </div>

            {selectedTicket && (
                <div className="mt-8">
                    {/* TicketDetail modal or page */}
                    <p>Viewing {selectedTicket}</p>
                </div>
            )}
        </div>
    );
}

