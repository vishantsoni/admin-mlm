# Withdrawal Request Modal TODO

## Approved Plan Summary
Add "Raise New Request" button to withdrawals page. Opens Modal with form: search/select distributor user, UV amount (auto RS=UV*10), bank details (name/ac/ifsc). POST to `api/admin/withdrawals`, refetch list. Use direct Modal component + useState. Assume user search API `api/admin/users?search=term`.

## Steps (to be checked off)
- [x] Step 1: Update src/app/(admin)/withdrawals/page.tsx - Add imports, states, "Raise New Request" button, empty Modal skeleton.

- [x] Step 2: Implement user search in modal (fetch API, list/select).
- [ ] Step 3: Add form fields (UV/RS compute, bank inputs), fetch user details/balance on select.
- [ ] Step 4: Implement submit handler (validate, POST create, refetch list).
- [ ] Step 5: Polish UI (labels, loading, errors), test form.
- [ ] Complete: Run `npm run dev`, test end-to-end.

**Current Progress**: Step 2 complete (user search + list). Proceeding to Step 3.

