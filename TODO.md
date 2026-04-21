# Fix React Too Many Re-renders in SignUpStepForm

## Approved Plan Steps:

### 1. [ ] Create TODO.md (Current - Done)
### 2. [✅] Update SignUpStepForm.tsx to fix re-render loop
   - Move initial load to useEffect([])
   - Fix useEffect deps and add useCallback for functions
   - Make all Inputs controlled with value/onChange
   - Use useTransition for router.push
   - Debounce/condition API calls

### 3. [ ] Test changes
   - Restart dev server
   - Test /signup navigation, ref param, localStorage persistence

### 4. [ ] attempt_completion

✅ Step 1 completed

