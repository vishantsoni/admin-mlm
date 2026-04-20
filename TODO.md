# Fix: Products Edit Page Not Opening for Super Admin

## Steps:
- [x] 1. Create this TODO.md
- [x] 2. Add debug logging to middleware.ts  
- [ ] 3. Test: Run dev server, login super admin, navigate to /products/8/edit, check server terminal console logs and share DEBUG lines
- [ ] 4. Analyze logs (exact role value, permission, why hasPermission false)
- [ ] 5. Fix rolePermissions/hasPermission casing mismatch
- [ ] 6. Test fix, remove debug logs
- [ ] 7. Complete task

## Root cause: Chrome DevTools corrupting pathname → 'com.chrome.devtools.json' instead of 'products/edit'. Role='Super Admin' → 'super admin' OK.

## Steps:
- [x] 1. Create this TODO.md
- [x] 2. Add debug logging to middleware.ts  
- [x] 3. Test: Run dev server, login super admin, navigate to /products/8/edit, check server terminal console logs and share DEBUG lines
- [ ] 4. Fix pathname sanitization in middleware.ts for [id]/edit patterns (handle devtools noise)
- [ ] 5. Test fix
- [ ] 6. Remove all debug logs
- [ ] 7. Complete task

Current: Step 4 next.


