# TODO

## Pagination: KYC Requests
- [ ] Update `src/app/(admin)/kyc-requests/page.tsx` to use server-side pagination (page/limit) and show pagination UI
- [ ] Add pagination state (page, limit, total, pagesCount) and reset page on search/status/limit changes
- [ ] Update fetch endpoint to include pagination query params (and search if supported)
- [ ] Replace client-side `filteredRequests` rendering with paginated `requests` (or keep fallback if backend doesn’t support search)
- [ ] Verify approve/reject/doc modal actions still work with the new state

