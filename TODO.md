# TODO

- [ ] Update `src/app/(admin)/my-profile/page.tsx` to call `PUT api/users/me/profile`.
- [ ] Expand form state to include all required backend fields (snake_case keys).
- [ ] Map existing `AuthContext.user` (camelCase) into formData (snake_case).
- [ ] Convert `dob` to ISO string for API payload.
- [ ] On success, update AuthContext `user` with response (or merged fallback).
- [ ] Add missing UI input fields for address/city/state/pin/bank details.
- [ ] Run lint/build checks.
