# TODO

- [ ] Implement frontend wiring for ID card generation using existing `serverCallFunction` helper.
- [ ] Confirm the backend endpoint path expected by `serverCallFunction` (it prefixes with `process.env.NEXT_PUBLIC_API_URL`).
- [ ] Update `src/components/idCard/IDCardCompo.tsx` to call `POST /api/id-cards/generate` when images are missing.
- [ ] Do not add/modify backend route handlers inside this repo (separate backend exists).
- [ ] Manually test:
  - POST request triggers generation when missing
  - Repeated POST does not regenerate if files exist

