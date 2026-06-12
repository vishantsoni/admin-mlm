- [ ] Implement modal-based Return Reason flow in OrderDetail.tsx
  - [ ] Add modal state + returnReason state
  - [ ] Replace distributor button submit logic to open modal
  - [ ] Add Modal UI with required reason input
  - [ ] Submit POST api/orders/return/{order.id}/request with requested_at + reason
  - [ ] Validate reason not empty; set actionError
  - [ ] Refresh order and close modal on success
  - [ ] Verify no TS/ESLint errors

