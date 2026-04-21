# Security Specification for Firestore Rules

## 1. Data Invariants
- User Profiles: `uid` MUST match `request.auth.uid`. `plan` cannot be changed by the user (only admin). Credits cannot be negative.
- Prompt Stats: `views` must be non-negative.

## 2. The "Dirty Dozen" Payloads
1. **Identity Spoofing**: `createUser` with `uid` that is NOT `request.auth.uid`.
2. **State Shortcutting**: Update `credits` to a massive number using a non-admin account.
3. **Ghost Field Injection**: Adding `isLifetime: true` to a new `free` plan user creation.
4. **Value Poisoning**: Updating `credits` with a string instead of a number.
5. **ID Poisoning**: Attempting to create a user with a document ID that violates `isValidId()`.
6. **PiI Isolation Bypass**: Reading `users` collection as a non-owner.
7. **Permission Escalation**: Changing `plan` from `free` to `admin` without being an admin.
8. **Orphaned Write**: Creating a user document where the `email` field is not a valid email string.
9. **Resource Exhaustion**: Creating a `favorites` array with 10,000 IDs.
10. **Terminal State Bypass**: (None defined for users yet, but watch out for future extensions).
11. **System Field Override**: Attempting to update `createdAt` field after creation.
12. **Metadata Spoofing**: Changing `email_verified` claim in `request.auth` (Rules automatically block this, but we test for it).

## 3. Test Runner (firestore.rules.test.ts)
(To be implemented in the testing framework)
