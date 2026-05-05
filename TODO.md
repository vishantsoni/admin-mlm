# Support Ticket System Frontend Implementation
Current Step: 1/8

## Plan Steps
1. [x] Create `src/types/ticket.ts` - Ticket, Reply, Status types per API spec
2. [x] Create `src/lib/serverCallFunction.ts` - API client (fetch wrapper w/ token, base '/api/support')
3. [x] Create `src/hooks/useSupportTickets.ts` - Hooks for raise, list, detail, reply, admin list, update status
4. [x] Edit `src/lib/auth.ts` - Add 'support-tickets', 'my-tickets' permissions
5. [x] Create `src/components/support/` dir w/ TicketTable.tsx, TicketForm.tsx, TicketDetail.tsx, ReplyForm.tsx, StatusSelect.tsx
6. [x] Create `src/app/(admin)/support/page.tsx` - Admin ticket list w/ pagination/filter
7. [x] Create `src/app/(admin)/my-tickets/page.tsx` - User my tickets list/detail
8. [ ] Add sidebar nav links via SettingContext/SidebarContext, test all flows
