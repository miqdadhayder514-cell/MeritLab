# Contact page configuration

Apply `migrations/20261126020003_contact_details.sql` after the existing MeritLab migrations. It creates a singleton contact-settings row with public read access for configured channels and admin-only updates.

Sign in with an administrator account and open `/admin/contact` to set the support email, WhatsApp number, or both. Include the WhatsApp country code (for example `+923001234567`). The public page at `/contact-us` displays a mail link and a WhatsApp chat link using the saved details.

No secrets or additional environment variables are required. If no contact details are configured, the public page displays a neutral availability message.
