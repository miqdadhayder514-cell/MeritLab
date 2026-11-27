# Manual NayaPay payments

## Database setup

Apply `migrations/20261126020000_manual_nayapay_payments.sql`, `migrations/20261126020001_payment_student_name.sql`, `migrations/20261126020002_remove_payment_reference.sql`, and `migrations/20261127010000_plus_feature_access.sql` in order to the same Supabase project used by MeritLab. They create the plan catalog, receiving-account configuration, student payment submissions, subscription history, RLS policies, review RPCs, the private `payment-receipts` Storage bucket, and Plus access enforcement.

No Supabase service-role key or additional environment variable is needed. The application uses the existing public Supabase URL and publishable key; payment writes and approvals are authorized by database functions and RLS.

## Enable checkout

After applying the migration:

1. Sign in with an account whose `user_roles.role` is `admin`.
2. Open `/admin/payments`.
3. Enter and verify the NayaPay account title and account number.
4. Configure the real PKR amount and access duration in days for each plan you intend to offer.
5. Enable only the plans and receiving account that are ready to accept payments.

The migration intentionally seeds Plus and Premium with no amount or duration and leaves them disabled. Public pricing and student checkout stay unavailable until the receiving account and at least one plan are enabled. Do not copy the former Rs. 3,000 / Rs. 6,000 placeholder values unless they are confirmed as the actual offers.

## Payment lifecycle

Students can submit one pending request at a time. They enter their full name and upload a transaction screenshot as a JPG, PNG, or WebP image up to 5 MB. No transfer-reference field is required. The submitted name is retained for review. Screenshots stay in a private bucket; students can read their own screenshot, while administrators can read screenshots for review.

Only `admin_review_payment` can approve or reject a submission. Approval and subscription creation occur in one database transaction. An approved plan starts immediately unless the student already has active access, in which case the new duration is appended after the existing expiry. A pending or rejected submission grants no access. Rejections require an administrator note.

An active, unexpired Plus or Premium subscription unlocks Mock Tests 2–20, all past papers, and all formula sheets except the free Conic Sections sheet. Mock Test 1 and Conic Sections remain free. The application checks each signed-in user's subscription on the server, protects formula-sheet PDF downloads, and only sends authorized exam questions to the browser. The database migration also rejects paid exam-attempt inserts without an active subscription; administrators retain access for review.

## Operational notes

- Keep the receipt bucket private. The migration checks the bucket's privacy, size limit, and permitted MIME types if it already exists.
- Keep paid formula PDFs in `private/formula-sheets`; only the authenticated `/formula-sheets/{filename}` route should serve them. The Next.js output trace includes these files for deployment.
- Do not make payment tables directly writable from the browser. The migration intentionally grants students read access only and routes submission/review mutations through guarded database functions.
- Admin actions require the existing database-backed `public.is_admin()` check; hiding or showing a UI control is not an authorization boundary.
- Supabase project behavior cannot be confirmed until this migration is applied to the user's project and tested there.
