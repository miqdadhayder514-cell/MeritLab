"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { netCategoryOptions } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Icon, Logo } from "./ui";

type AuthType = "login" | "register" | "forgot-password" | "reset-password";

export function AuthPage({
  type,
  initialError,
  initialMessage,
}: {
  type: AuthType;
  initialError?: string;
  initialMessage?: string;
}) {
  const router = useRouter();
  const {
    login,
    register,
    logout,
    requestPasswordReset,
    updatePassword,
    session,
    loading,
  } = useAuth();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(initialMessage ?? "");
  const [error, setError] = useState(initialError ?? "");
  const [category, setCategory] = useState("NET-Engineering");
  const [submitting, setSubmitting] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const title =
    type === "login"
      ? "Welcome back"
      : type === "register"
        ? "Create your account"
        : type === "forgot-password"
          ? "Reset your password"
          : "Choose a new password";
  const description =
    type === "login"
      ? "Pick up where you left off on your NET preparation."
      : type === "register"
        ? "Start building a study routine that works for you."
        : type === "forgot-password"
          ? "Enter the email address linked to your account and we’ll help you get back in."
          : "Create a new password for your account.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") ?? "");
    const passwordValid =
      password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
    if (
      type !== "reset-password" &&
      (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      setError("Enter a valid email address to continue.");
      return;
    }
    if (type === "register") {
      const fullName = String(form.get("name") ?? "").trim();
      if (fullName.length < 2 || fullName.length > 100) {
        setError("Enter your full name (2 to 100 characters).");
        return;
      }
    }
    if ((type === "register" || type === "reset-password") && !passwordValid) {
      setError("Use at least 8 characters, including one letter and one number.");
      return;
    }
    if (type === "login" && password.length === 0) {
      setError("Enter your password to continue.");
      return;
    }
    if (
      (type === "register" || type === "reset-password") &&
      password !== form.get("confirmPassword")
    ) {
      setError("The passwords don’t match. Please try again.");
      return;
    }
    if (type === "register" && form.get("acceptTerms") !== "on") {
      setError("Accept the terms and conditions to create an account.");
      return;
    }
    if (type === "reset-password" && loading) {
      setError("Checking your password reset link. Please try again in a moment.");
      return;
    }
    if (type === "reset-password" && !session) {
      setError("This password reset link has expired. Request a new one.");
      return;
    }

    setSubmitting(true);
    try {
      if (type === "login") {
        const role = await login(email, password);
        router.replace(role === "admin" ? "/admin" : "/dashboard");
      } else if (type === "register") {
        const authenticated = await register({
          fullName: String(form.get("name") ?? "").trim(),
          email,
          password,
          targetNetCategory: category,
        });
        if (authenticated) {
          router.replace("/dashboard");
        } else {
          setVerificationPending(true);
          setMessage(
            "Your account has been created. Check your inbox for the verification link before logging in.",
          );
        }
      } else if (type === "forgot-password") {
        await requestPasswordReset(email);
        setMessage(
          "If an account exists for this address, password reset instructions will be sent.",
        );
      } else {
        await updatePassword(password);
        await logout();
        router.replace("/login?reset=success");
      }
    } catch (submitError) {
      const detail =
        submitError instanceof Error ? submitError.message.toLowerCase() : "";
      if (detail.includes("verify your email") || detail.includes("not confirmed")) {
        setError("Verify your email address using the link we sent before logging in.");
      } else if (
        detail.includes("already registered") ||
        detail.includes("already been registered") ||
        detail.includes("user already exists")
      ) {
        setError("An account already exists for this email. Try logging in instead.");
      } else if (
        detail.includes("invalid login") ||
        detail.includes("invalid credentials")
      ) {
        setError("Email or password is incorrect. Check your details and try again.");
      } else if (
        detail.includes("expired") ||
        detail.includes("invalid token") ||
        detail.includes("password reset link")
      ) {
        setError("This link has expired or is invalid. Request a new password reset.");
      } else {
        setError(
          "We couldn’t complete that request. Check your connection and try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-aside">
        <div className="auth-aside-top">
          <Logo light />
        </div>
        <div className="auth-aside-content">
          <span className="auth-art-mark">
            <Icon name="orbit" size={35} />
          </span>
          <EyebrowLight>YOUR NEXT CHAPTER STARTS HERE</EyebrowLight>
          <h2>
            Make room for
            <br />a little more <em>confidence.</em>
          </h2>
          <p>
            Build a steady study rhythm with focused practice, thoughtful feedback, and
            a clear view of your progress.
          </p>
          <div className="auth-aside-points">
            <span>
              <Icon name="check" size={15} /> A learning path built around your NET
              category
            </span>
            <span>
              <Icon name="check" size={15} /> Practice sessions with clear explanations
            </span>
            <span>
              <Icon name="check" size={15} /> Progress insights to guide your next step
            </span>
          </div>
        </div>
        <div className="auth-aside-bottom">
          MeritLab is an independent preparation platform, not affiliated with NUST.
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-mobile-logo">
          <Logo />
        </div>
        <div className="auth-card">
          <a className="auth-back" href="/">
            <Icon name="arrow" size={14} /> Back to MeritLab
          </a>
          <div className="auth-heading">
            <span className="eyebrow">
              {type === "register"
                ? "GET STARTED"
                : type === "login"
                  ? "STUDENT SPACE"
                  : "ACCOUNT SUPPORT"}
            </span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {verificationPending ? (
            <section className="auth-form" aria-live="polite">
              <div className="form-alert form-alert-success">
                <Icon name="mail" size={16} /> {message}
              </div>
              <p className="field-hint">
                Open the link in that email to verify your address. You can then log in
                and access your student dashboard.
              </p>
              <a className="button button-outline auth-submit" href="/login">
                Go to login
              </a>
            </section>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {type === "register" && (
                <label className="field-label">
                  Full name
                  <div className="input-with-icon">
                    <Icon name="user" size={17} />
                    <input
                      name="name"
                      placeholder="Your name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                </label>
              )}
              {type !== "reset-password" && (
                <label className="field-label">
                  Email address
                  <div className="input-with-icon">
                    <Icon name="mail" size={17} />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      maxLength={254}
                    />
                  </div>
                </label>
              )}
              {type !== "forgot-password" && (
                <label className="field-label">
                  {type === "reset-password" ? "New password" : "Password"}
                  <div className="input-with-icon">
                    <Icon name="lock" size={17} />
                    <input
                      type={visible ? "text" : "password"}
                      name="password"
                      placeholder="At least 8 characters"
                      autoComplete={
                        type === "login" ? "current-password" : "new-password"
                      }
                      required
                      minLength={type === "login" ? 1 : 8}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setVisible(!visible)}
                      aria-label={visible ? "Hide password" : "Show password"}
                    >
                      <Icon name={visible ? "eyeOff" : "eye"} size={17} />
                    </button>
                  </div>
                </label>
              )}
              {type === "register" && (
                <>
                  <label className="field-label">
                    Confirm password
                    <div className="input-with-icon">
                      <Icon name="lock" size={17} />
                      <input
                        type={visible ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        required
                        minLength={8}
                      />
                    </div>
                  </label>
                  <label className="field-label">
                    Preferred NET category
                    <select
                      className="form-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {netCategoryOptions.map((netCategory) => (
                        <option key={netCategory}>{netCategory}</option>
                      ))}
                    </select>
                    <small className="field-hint">
                      Category eligibility depends on your academic background and
                      programme.
                    </small>
                  </label>
                  <label className="remember-check">
                    <input type="checkbox" name="acceptTerms" required />
                    <span>
                      I accept the <a href="/terms">terms and conditions</a>.
                    </span>
                  </label>
                </>
              )}
              {type === "reset-password" && (
                <label className="field-label">
                  Confirm new password
                  <div className="input-with-icon">
                    <Icon name="lock" size={17} />
                    <input
                      type={visible ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter your new password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                  </div>
                </label>
              )}
              {type === "login" && (
                <div className="auth-form-meta">
                  <a href="/forgot-password">Forgot password?</a>
                </div>
              )}
              {error && (
                <div className="form-alert form-alert-error">
                  <Icon name="info" size={16} /> {error}
                </div>
              )}
              {message && (
                <div className="form-alert form-alert-success">
                  <Icon name="check" size={16} /> {message}
                </div>
              )}
              <button
                className="button button-primary auth-submit"
                type="submit"
                disabled={
                  !isSupabaseConfigured ||
                  submitting ||
                  (type === "reset-password" && loading)
                }
              >
                {submitting
                  ? "Please wait..."
                  : type === "login"
                    ? "Log in"
                    : type === "register"
                      ? "Create account"
                      : type === "forgot-password"
                        ? "Send reset instructions"
                        : "Update password"}{" "}
                <Icon name="arrow" size={16} />
              </button>
              {type === "forgot-password" && (
                <p className="auth-privacy">
                  If the address is registered, reset instructions will be sent.
                </p>
              )}
            </form>
          )}
          {type === "login" && (
            <p className="auth-switch">
              New to MeritLab? <a href="/register">Create an account</a>
            </p>
          )}
          {type === "register" && (
            <p className="auth-switch">
              Already have an account? <a href="/login">Log in</a>
            </p>
          )}
          {type === "forgot-password" && (
            <p className="auth-switch">
              <a href="/login">Return to login</a>
            </p>
          )}
          {type === "reset-password" && (
            <p className="auth-switch">
              <a href="/login">Return to login</a>
            </p>
          )}
        </div>
        <div className="auth-legal">
          <span>© 2026 MeritLab</span>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </main>
  );
}

function EyebrowLight({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow eyebrow-light">{children}</span>;
}
