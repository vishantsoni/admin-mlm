# TODO

## Completed/Planned: Return -> Warehouse Receive flow
- [ ] Update `src/components/admin/orders/OrderDetail.tsx` to call `POST api/orders/returns/:returnId/receive` after successful return **approve**.
- [ ] Add UI loading + error state for warehouse receiving.
- [ ] Re-fetch order after both calls so the UI shows whether the return is now marked `received`.
- [ ] Verify logic: trigger receive only after approve success (not after reject).

