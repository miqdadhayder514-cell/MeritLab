# Manual NayaPay payments

## Database setup

Apply `migrations/20261126020000_manual_nayapay_payments.sql`, `migrations/20261126020001_payment_student_name.sql`, and then `migrations/20261126020002_remove_payment_reference.sql` to the same Supabase project used by MeritLab. They create the plan catalog, receiving-account configuration, student payment submissions, subscription history, RLS policies, review RPCs, and the private `payment-receipts` Storage bucket. Later migrations add and store the student's name and accept a transaction screenshot without requiring a transfer reference.

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

The current application records and displays active subscriptions; existing learning pages do not yet have paid-feature gates because the plan feature outlines remain proposals.

## Operational notes

- Keep the receipt bucket private. The migration checks the bucket's privacy, size limit, and permitted MIME types if it already exists.
- Do not make payment tables directly writable from the browser. The migration intentionally grants students read access only and routes submission/review mutations through guarded database functions.
- Admin actions require the existing database-backed `public.is_admin()` check; hiding or showing a UI control is not an authorization boundary.
- Supabase project behavior cannot be confirmed until this migration is applied to the user's project and tested there.
