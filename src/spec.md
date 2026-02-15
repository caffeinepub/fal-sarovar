# Specification

## Summary
**Goal:** Add customer login/logout entry points in the storefront navigation and provide a customer Account page for viewing/editing profile data.

**Planned changes:**
- Update storefront header and mobile navigation to show authentication-aware Account/Login and Logout actions using the existing Internet Identity auth hook.
- Add a new `/account` storefront route that prompts signed-out users to log in and lets signed-in users view/edit profile fields (name, mobile, address) via existing profile APIs with success/error feedback (English text).
- Ensure React Query customer-profile data is invalidated/refetched correctly on login/logout and identity switching so cached profile data does not leak between users.
- Update backend authorization so authenticated non-admin customers can access `getCallerUserProfile` and `saveCallerUserProfile`, while keeping admin-only APIs restricted.

**User-visible outcome:** Customers can log in/out from the storefront navigation, open an Account page, and view/update their profile (name, mobile, address) with UI that stays in sync across auth state changes.
