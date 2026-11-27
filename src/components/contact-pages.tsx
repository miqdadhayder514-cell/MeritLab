"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, Eyebrow, Icon } from "./ui";

type ContactDetails = {
  email: string | null;
  whatsapp_number: string | null;
};

function normalizeWhatsAppNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validWhatsAppNumber(value: string) {
  return /^\+?[0-9][0-9 ()-]{6,23}$/.test(value);
}

export function ContactUsPage() {
  const [details, setDetails] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContactDetails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: queryError } = await createClient()
        .from("contact_settings")
        .select("email,whatsapp_number")
        .eq("id", true)
        .maybeSingle();
      if (queryError) throw queryError;
      setDetails(data as ContactDetails | null);
    } catch (loadError) {
      console.error("Could not load contact details.", loadError);
      setError(
        "Contact details could not be loaded. Please try again later or contact the site administrator.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContactDetails();
  }, [loadContactDetails]);

  const email = details?.email?.trim() || null;
  const whatsapp = details?.whatsapp_number?.trim() || null;
  const whatsappLink = whatsapp
    ? `https://wa.me/${normalizeWhatsAppNumber(whatsapp)}`
    : null;

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-orb contact-hero-orb-one" aria-hidden="true" />
        <div className="contact-hero-orb contact-hero-orb-two" aria-hidden="true" />
        <div className="wrap contact-hero-inner">
          <Eyebrow>WE’RE HERE TO HELP</Eyebrow>
          <h1>
            Contact <span>MeritLab</span>
          </h1>
          <p>
            Questions about your preparation or account? Reach out through either
            contact channel below.
          </p>
        </div>
      </section>

      <section className="wrap contact-content">
        {loading ? (
          <Card className="contact-state" role="status">
            Loading contact options…
          </Card>
        ) : error ? (
          <Card className="contact-state contact-state-error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="button button-outline button-small"
              onClick={() => void loadContactDetails()}
            >
              Try again
            </button>
          </Card>
        ) : email || whatsapp ? (
          <div className="contact-channel-grid">
            {email && (
              <Card className="contact-channel-card">
                <span className="contact-channel-icon contact-email-icon">
                  <Icon name="mail" size={23} />
                </span>
                <div>
                  <Eyebrow>EMAIL US</Eyebrow>
                  <h2>Send us a message</h2>
                  <p>We’ll get back to you as soon as we can.</p>
                </div>
                <a className="contact-channel-link" href={`mailto:${email}`}>
                  {email} <Icon name="arrow" size={16} />
                </a>
              </Card>
            )}
            {whatsapp && whatsappLink && (
              <Card className="contact-channel-card">
                <span className="contact-channel-icon contact-whatsapp-icon">
                  <Icon name="chat" size={23} />
                </span>
                <div>
                  <Eyebrow>WHATSAPP</Eyebrow>
                  <h2>Chat with our team</h2>
                  <p>Message us directly for a quick question.</p>
                </div>
                <a
                  className="contact-channel-link"
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {whatsapp} <Icon name="arrow" size={16} />
                </a>
              </Card>
            )}
          </div>
        ) : (
          <Card className="contact-state">
            <span className="contact-channel-icon">
              <Icon name="mail" size={23} />
            </span>
            <h2>Contact options are being updated</h2>
            <p>
              The MeritLab team’s contact details have not been published yet. Please
              check back soon.
            </p>
          </Card>
        )}
      </section>
    </main>
  );
}

export function AdminContactPage() {
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: queryError } = await createClient()
        .from("contact_settings")
        .select("email,whatsapp_number")
        .eq("id", true)
        .single();
      if (queryError) throw queryError;
      setEmail(data.email ?? "");
      setWhatsappNumber(data.whatsapp_number ?? "");
    } catch (loadError) {
      console.error("Could not load admin contact settings.", loadError);
      setError(
        "Could not load contact settings. Confirm the contact-details migration has been applied.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim();
    const cleanWhatsApp = whatsappNumber.trim();
    if (cleanEmail && !validEmail(cleanEmail)) {
      setError("Enter a valid contact email address.");
      return;
    }
    if (cleanWhatsApp && !validWhatsAppNumber(cleanWhatsApp)) {
      setError(
        "Enter a valid WhatsApp number with its country code, such as +923001234567.",
      );
      return;
    }
    if (!cleanEmail && !cleanWhatsApp) {
      setError("Enter an email address, a WhatsApp number, or both.");
      return;
    }

    setSaving(true);
    try {
      const { error: updateError } = await createClient()
        .from("contact_settings")
        .update({
          email: cleanEmail || null,
          whatsapp_number: cleanWhatsApp || null,
        })
        .eq("id", true);
      if (updateError) throw updateError;
      setSuccess("Contact details are saved and published on the Contact Us page.");
    } catch (saveError) {
      console.error("Could not save contact details.", saveError);
      setError(
        "Contact details could not be saved. Confirm that your account is an administrator and try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <Eyebrow>MERITLAB ADMIN</Eyebrow>
          <h1>Contact details</h1>
          <p>
            Choose the email and WhatsApp channels students see on the public contact
            page.
          </p>
        </div>
      </div>
      <Card className="admin-contact-card">
        <div className="card-heading">
          <div>
            <h2>Public contact channels</h2>
            <p>
              Enter either channel or both. Changes are published immediately after
              saving.
            </p>
          </div>
          <span className="contact-channel-icon contact-email-icon">
            <Icon name="mail" size={21} />
          </span>
        </div>
        {error && (
          <p className="form-alert form-alert-error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="form-alert form-alert-success" role="status">
            {success}
          </p>
        )}
        <form
          className="admin-contact-form"
          onSubmit={(event) => void saveSettings(event)}
        >
          <label className="field-label">
            Contact email
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              placeholder="support@example.com"
              disabled={loading || saving}
            />
          </label>
          <label className="field-label">
            WhatsApp number
            <input
              className="form-input"
              type="tel"
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
              maxLength={25}
              placeholder="+923001234567"
              disabled={loading || saving}
            />
            <small>
              Include the country code so the WhatsApp link opens correctly.
            </small>
          </label>
          <button
            type="submit"
            className="button button-primary"
            disabled={loading || saving}
          >
            <Icon name="check" size={16} />
            {loading
              ? "Loading settings…"
              : saving
                ? "Saving…"
                : "Save contact details"}
          </button>
        </form>
      </Card>
    </>
  );
}
