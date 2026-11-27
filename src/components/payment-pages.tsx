"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { Card, Eyebrow, Icon } from "./ui";

const receiptBucket = "payment-receipts";
const maxReceiptSize = 5 * 1024 * 1024;
const receiptTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type PaymentPlan = {
  id: string;
  code: "plus" | "premium";
  name: string;
  description: string;
  amount_pkr: number | null;
  duration_days: number | null;
  is_active: boolean;
};

type PaymentSettings = {
  account_name: string | null;
  account_number: string | null;
  instructions: string;
  enabled: boolean;
};

type PaymentSubmission = {
  id: string;
  user_id: string;
  student_name: string;
  plan_code: string;
  plan_name: string;
  amount_pkr: number;
  duration_days: number;
  receipt_path: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
};

type Subscription = {
  id: string;
  plan_code: string;
  plan_name: string;
  starts_at: string;
  ends_at: string;
  status: "active" | "revoked";
};

type AdminSubmission = PaymentSubmission & {
  student_name: string;
  student_email: string;
};

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading payment-page-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function StudentPaymentsPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPayments = useCallback(async () => {
    if (!user?.id) {
      setPlans([]);
      setSettings(null);
      setSubmissions([]);
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");
    try {
      const supabase = createClient();
      const [plansResult, settingsResult, submissionsResult, subscriptionsResult] =
        await Promise.all([
          supabase
            .from("payment_plans")
            .select("id,code,name,description,amount_pkr,duration_days,is_active")
            .eq("is_active", true)
            .order("amount_pkr"),
          supabase
            .from("payment_settings")
            .select("account_name,account_number,instructions,enabled")
            .eq("id", true)
            .maybeSingle(),
          supabase
            .from("payment_submissions")
            .select(
              "id,user_id,student_name,plan_code,plan_name,amount_pkr,duration_days,receipt_path,status,rejection_reason,submitted_at,reviewed_at",
            )
            .order("submitted_at", { ascending: false }),
          supabase
            .from("user_subscriptions")
            .select("id,plan_code,plan_name,starts_at,ends_at,status")
            .eq("status", "active")
            .order("ends_at", { ascending: false }),
        ]);
      if (plansResult.error) throw plansResult.error;
      if (settingsResult.error) throw settingsResult.error;
      if (submissionsResult.error) throw submissionsResult.error;
      if (subscriptionsResult.error) throw subscriptionsResult.error;

      const nextPlans = (plansResult.data ?? []) as PaymentPlan[];
      setPlans(nextPlans);
      setSettings(settingsResult.data as PaymentSettings | null);
      setSubmissions((submissionsResult.data ?? []) as PaymentSubmission[]);
      setSubscriptions((subscriptionsResult.data ?? []) as Subscription[]);
      const requestedPlan = new URLSearchParams(window.location.search).get("plan");
      setSelectedPlanId((current) =>
        nextPlans.some((plan) => plan.id === current)
          ? current
          : (nextPlans.find((plan) => plan.code === requestedPlan)?.id ??
            nextPlans[0]?.id ??
            ""),
      );
    } catch (error) {
      console.error("Could not load student payment information.", error);
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
  const pendingSubmission = submissions.find(
    (submission) => submission.status === "pending",
  );
  const currentSubscription = useMemo(
    () =>
      subscriptions.find(
        (subscription) =>
          new Date(subscription.starts_at).getTime() <= Date.now() &&
          new Date(subscription.ends_at).getTime() > Date.now(),
      ),
    [subscriptions],
  );
  const paymentReady = Boolean(
    settings?.enabled &&
      settings.account_name &&
      settings.account_number &&
      selectedPlan,
  );

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSuccess("");

    if (!user?.id || !selectedPlan || !paymentReady) {
      setSubmitError(
        "Payments are not available until a plan and receiving account are configured.",
      );
      return;
    }
    if (studentName.trim().length < 2) {
      setSubmitError("Enter your full name to continue.");
      return;
    }
    if (!receipt) {
      setSubmitError("Choose a transaction screenshot to continue.");
      return;
    }
    if (!receiptTypes[receipt.type]) {
      setSubmitError("Upload a transaction screenshot as a JPG, PNG, or WebP image.");
      return;
    }
    if (receipt.size > maxReceiptSize) {
      setSubmitError("The receipt must be 5 MB or smaller.");
      return;
    }

    const receiptPath = `${user.id}/${crypto.randomUUID()}.${receiptTypes[receipt.type]}`;
    const supabase = createClient();
    setSubmitting(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from(receiptBucket)
        .upload(receiptPath, receipt, { contentType: receipt.type, upsert: false });
      if (uploadError) throw uploadError;

      const { error: submitError } = await supabase.rpc("submit_payment", {
        p_plan_code: selectedPlan.code,
        p_student_name: studentName,
        p_receipt_path: receiptPath,
        p_expected_amount: selectedPlan.amount_pkr,
        p_expected_duration_days: selectedPlan.duration_days,
      });
      if (submitError) {
        const { error: cleanupError } = await supabase.storage
          .from(receiptBucket)
          .remove([receiptPath]);
        if (cleanupError) {
          console.error(
            "Could not remove an unattached payment receipt.",
            cleanupError,
          );
        }
        throw submitError;
      }

      setReceipt(null);
      if (receiptInputRef.current) receiptInputRef.current.value = "";
      setSuccess(
        "Your payment proof was submitted. We’ll update its status after review.",
      );
      await loadPayments();
    } catch (error) {
      console.error("Could not submit payment proof.", error);
      setSubmitError(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="STUDENT BILLING"
        title="Plans & payments"
        description="Review configured plan details, submit your NayaPay transfer proof, and track its review."
      />

      {loadError && (
        <div className="payment-alert payment-alert-error" role="alert">
          Could not load payment information: {loadError}
          <button
            type="button"
            className="button button-outline button-small"
            onClick={() => void loadPayments()}
          >
            Try again
          </button>
        </div>
      )}

      <div className="payment-layout">
        <div className="payment-main-column">
          <Card className="payment-card">
            <div className="payment-card-heading">
              <span className="payment-icon">
                <Icon name="briefcase" size={19} />
              </span>
              <div>
                <h2>Your access</h2>
                <p>
                  Approved payments add access from the current expiry date, if any.
                </p>
              </div>
            </div>
            {currentSubscription ? (
              <div className="payment-entitlement">
                <span className="payment-status payment-status-approved">Active</span>
                <strong>{currentSubscription.plan_name}</strong>
                <span>
                  Valid until{" "}
                  {new Date(currentSubscription.ends_at).toLocaleDateString("en-PK", {
                    dateStyle: "long",
                  })}
                </span>
              </div>
            ) : (
              <div className="payment-empty-note">
                No paid plan is currently active on your account.
              </div>
            )}
          </Card>

          <Card className="payment-card">
            <div className="payment-card-heading">
              <span className="payment-icon payment-icon-blue">
                <Icon name="bolt" size={19} />
              </span>
              <div>
                <h2>Submit a NayaPay payment</h2>
                <p>Your payment is reviewed by MeritLab before access is activated.</p>
              </div>
            </div>
            {loading ? (
              <div className="payment-loading" role="status">
                Loading available plans…
              </div>
            ) : !settings?.enabled || !plans.length ? (
              <div className="payment-unavailable">
                <strong>Paid checkout is not available yet.</strong>
                <span>
                  An administrator must configure an active plan with its amount and
                  duration, then enable the NayaPay receiving account.
                </span>
              </div>
            ) : pendingSubmission ? (
              <div className="payment-pending-notice" role="status">
                <strong>You already have a payment awaiting review.</strong>
                <span>
                  We’ll finish reviewing {pendingSubmission.plan_name} before you can
                  submit another payment.
                </span>
              </div>
            ) : (
              <form
                className="payment-form"
                onSubmit={(event) => void submitPayment(event)}
              >
                <label className="payment-field">
                  <span>Choose a plan</span>
                  <select
                    value={selectedPlanId}
                    onChange={(event) => setSelectedPlanId(event.target.value)}
                    required
                  >
                    {plans.map((plan) => (
                      <option value={plan.id} key={plan.id}>
                        {plan.name} · {formatPrice(plan.amount_pkr ?? 0)} ·{" "}
                        {plan.duration_days} days
                      </option>
                    ))}
                  </select>
                </label>

                {selectedPlan && (
                  <div className="payment-plan-summary">
                    <strong>{formatPrice(selectedPlan.amount_pkr ?? 0)}</strong>
                    <span>one-time · {selectedPlan.duration_days} days of access</span>
                    {selectedPlan.description && <p>{selectedPlan.description}</p>}
                  </div>
                )}

                {settings?.account_name && settings.account_number && (
                  <div className="payment-transfer-box">
                    <div className="payment-transfer-title">Transfer to NayaPay</div>
                    <dl>
                      <div>
                        <dt>Account title</dt>
                        <dd>{settings.account_name}</dd>
                      </div>
                      <div>
                        <dt>Account number</dt>
                        <dd>{settings.account_number}</dd>
                      </div>
                      <div>
                        <dt>Exact amount</dt>
                        <dd>{formatPrice(selectedPlan?.amount_pkr ?? 0)}</dd>
                      </div>
                    </dl>
                    {settings.instructions && <p>{settings.instructions}</p>}
                    <small>Transfer only the amount shown for the selected plan.</small>
                  </div>
                )}

                <label className="payment-field">
                  <span>Your full name</span>
                  <input
                    value={studentName}
                    onChange={(event) => setStudentName(event.target.value)}
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    required
                    placeholder="Enter your full name"
                  />
                </label>
                <label className="payment-field">
                  <span>Transaction screenshot</span>
                  <input
                    ref={receiptInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setReceipt(event.target.files?.[0] ?? null)}
                    required
                  />
                  <small>JPG, PNG, or WebP image · maximum 5 MB</small>
                </label>

                {submitError && (
                  <p className="payment-inline-error" role="alert">
                    {submitError}
                  </p>
                )}
                {success && (
                  <p className="payment-inline-success" role="status">
                    {success}
                  </p>
                )}
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={submitting || !paymentReady}
                >
                  <Icon name="check" size={16} />
                  {submitting ? "Submitting payment…" : "Submit for review"}
                </button>
                <p className="payment-privacy-note">
                  Receipts are stored privately and are visible only to you and
                  authorized administrators.
                </p>
              </form>
            )}
          </Card>
        </div>

        <Card className="payment-card payment-history-card">
          <div className="payment-card-heading">
            <span className="payment-icon payment-icon-violet">
              <Icon name="clock" size={19} />
            </span>
            <div>
              <h2>Payment history</h2>
              <p>Your submitted requests and review outcomes.</p>
            </div>
          </div>
          {loading ? (
            <div className="payment-loading" role="status">
              Loading history…
            </div>
          ) : submissions.length ? (
            <div className="payment-history-list">
              {submissions.map((submission) => (
                <article className="payment-history-item" key={submission.id}>
                  <div className="payment-history-top">
                    <strong>{submission.plan_name}</strong>
                    <span
                      className={`payment-status payment-status-${submission.status}`}
                    >
                      {submission.status}
                    </span>
                  </div>
                  <span>
                    {formatPrice(submission.amount_pkr)} · {submission.duration_days}{" "}
                    days
                  </span>
                  <small>Submitted {formatDate(submission.submitted_at)}</small>
                  {submission.status === "rejected" && submission.rejection_reason && (
                    <p className="payment-rejection-reason">
                      <strong>Review note:</strong> {submission.rejection_reason}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="payment-empty-note">No payment submissions yet.</div>
          )}
        </Card>
      </div>
    </>
  );
}

type PlanDraft = {
  id: string;
  code: "plus" | "premium";
  name: string;
  amountPkr: string;
  durationDays: string;
  isActive: boolean;
};

type SettingsDraft = {
  accountName: string;
  accountNumber: string;
  instructions: string;
  enabled: boolean;
};

export function AdminPaymentsPage() {
  const [plans, setPlans] = useState<PlanDraft[]>([]);
  const [settings, setSettings] = useState<SettingsDraft>({
    accountName: "",
    accountNumber: "",
    instructions: "",
    enabled: false,
  });
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [receiptLinks, setReceiptLinks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPlan, setSavingPlan] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [pageError, setPageError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAdminPayments = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const supabase = createClient();
      const [plansResult, settingsResult, submissionsResult] = await Promise.all([
        supabase
          .from("payment_plans")
          .select("id,code,name,amount_pkr,duration_days,is_active")
          .order("code"),
        supabase
          .from("payment_settings")
          .select("account_name,account_number,instructions,enabled")
          .eq("id", true)
          .single(),
        supabase
          .from("payment_submissions")
          .select(
            "id,user_id,student_name,plan_code,plan_name,amount_pkr,duration_days,receipt_path,status,rejection_reason,submitted_at,reviewed_at",
          )
          .order("submitted_at", { ascending: false })
          .limit(100),
      ]);
      if (plansResult.error) throw plansResult.error;
      if (settingsResult.error) throw settingsResult.error;
      if (submissionsResult.error) throw submissionsResult.error;

      const nextSubmissions = (submissionsResult.data ?? []) as PaymentSubmission[];
      const userIds = [
        ...new Set(nextSubmissions.map((submission) => submission.user_id)),
      ];
      let profileMap = new Map<string, string>();
      if (userIds.length) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id,email")
          .in("id", userIds);
        if (profilesError) throw profilesError;
        const profileRows = (profiles ?? []) as Array<{
          id: string;
          email: string;
        }>;
        profileMap = new Map(profileRows.map((profile) => [profile.id, profile.email]));
      }

      setPlans(
        ((plansResult.data ?? []) as PaymentPlan[]).map((plan) => ({
          id: plan.id,
          code: plan.code,
          name: plan.name,
          amountPkr: plan.amount_pkr?.toString() ?? "",
          durationDays: plan.duration_days?.toString() ?? "",
          isActive: plan.is_active,
        })),
      );
      const settingsData = settingsResult.data as PaymentSettings;
      setSettings({
        accountName: settingsData.account_name ?? "",
        accountNumber: settingsData.account_number ?? "",
        instructions: settingsData.instructions ?? "",
        enabled: settingsData.enabled,
      });
      setSubmissions(
        nextSubmissions.map((submission) => {
          const profile = profileMap.get(submission.user_id);
          return {
            ...submission,
            student_email: profile ?? "Email unavailable",
          };
        }),
      );
    } catch (error) {
      console.error("Could not load admin payment data.", error);
      setPageError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAdminPayments();
  }, [loadAdminPayments]);

  async function savePlan(event: FormEvent<HTMLFormElement>, plan: PlanDraft) {
    event.preventDefault();
    setPageError("");
    setSuccess("");
    const amount = plan.amountPkr.trim() ? Number(plan.amountPkr) : null;
    const duration = plan.durationDays.trim() ? Number(plan.durationDays) : null;
    if (
      (amount !== null && (!Number.isSafeInteger(amount) || amount <= 0)) ||
      (duration !== null && (!Number.isSafeInteger(duration) || duration <= 0)) ||
      (amount === null) !== (duration === null) ||
      (plan.isActive && (amount === null || duration === null))
    ) {
      setPageError(
        "Enter a positive whole-number amount and duration before enabling a plan.",
      );
      return;
    }

    setSavingPlan(plan.id);
    try {
      const { error } = await createClient()
        .from("payment_plans")
        .update({
          amount_pkr: amount,
          duration_days: duration,
          is_active: plan.isActive,
        })
        .eq("id", plan.id);
      if (error) throw error;
      setSuccess(`${plan.name} settings saved.`);
      await loadAdminPayments();
    } catch (error) {
      console.error("Could not save payment plan settings.", error);
      setPageError(errorMessage(error));
    } finally {
      setSavingPlan(null);
    }
  }

  async function savePaymentSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPageError("");
    setSuccess("");
    if (
      settings.enabled &&
      (settings.accountName.trim().length < 2 ||
        settings.accountNumber.trim().length < 5)
    ) {
      setPageError(
        "Enter a valid NayaPay account title and account number before enabling payments.",
      );
      return;
    }

    setSavingSettings(true);
    try {
      const { error } = await createClient()
        .from("payment_settings")
        .update({
          account_name: settings.accountName.trim() || null,
          account_number: settings.accountNumber.trim() || null,
          instructions: settings.instructions.trim(),
          enabled: settings.enabled,
        })
        .eq("id", true);
      if (error) throw error;
      setSuccess("NayaPay receiving settings saved.");
      await loadAdminPayments();
    } catch (error) {
      console.error("Could not save NayaPay receiving settings.", error);
      setPageError(errorMessage(error));
    } finally {
      setSavingSettings(false);
    }
  }

  async function loadReceiptLink(submission: AdminSubmission) {
    setPageError("");
    try {
      const { data, error } = await createClient()
        .storage.from(receiptBucket)
        .createSignedUrl(submission.receipt_path, 60);
      if (error) throw error;
      setReceiptLinks((current) => ({ ...current, [submission.id]: data.signedUrl }));
    } catch (error) {
      console.error("Could not create a private receipt link.", error);
      setPageError(errorMessage(error));
    }
  }

  async function reviewSubmission(
    submission: AdminSubmission,
    outcome: "approved" | "rejected",
  ) {
    setPageError("");
    setSuccess("");
    const reason = rejectionReasons[submission.id]?.trim() ?? "";
    if (outcome === "rejected" && !reason) {
      setPageError("Enter a short reason before rejecting a payment.");
      return;
    }

    setReviewing(submission.id);
    try {
      const { error } = await createClient().rpc("admin_review_payment", {
        p_submission_id: submission.id,
        p_outcome: outcome,
        p_rejection_reason: outcome === "rejected" ? reason : null,
      });
      if (error) throw error;
      setSuccess(
        outcome === "approved"
          ? `${submission.student_name}’s payment was approved and access was activated.`
          : `${submission.student_name}’s payment was rejected.`,
      );
      await loadAdminPayments();
    } catch (error) {
      console.error("Could not review payment submission.", error);
      setPageError(errorMessage(error));
    } finally {
      setReviewing(null);
    }
  }

  function updatePlan(id: string, updates: Partial<PlanDraft>) {
    setPlans((current) =>
      current.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan)),
    );
  }

  const pendingCount = submissions.filter(
    (submission) => submission.status === "pending",
  ).length;
  const configuredPlans = plans.filter((plan) => plan.isActive).length;

  return (
    <>
      <PageTitle
        eyebrow="MERITLAB ADMIN"
        title="Payments & plans"
        description="Configure NayaPay and paid plan terms, then review receipt-backed student submissions."
      />

      <div className="payment-admin-stats">
        <Card>
          <small>Awaiting review</small>
          <strong>{loading ? "—" : pendingCount}</strong>
        </Card>
        <Card>
          <small>Active paid plans</small>
          <strong>{loading ? "—" : configuredPlans}</strong>
        </Card>
        <Card>
          <small>Receiving account</small>
          <strong>{settings.enabled ? "Enabled" : "Disabled"}</strong>
        </Card>
      </div>

      {pageError && (
        <div className="payment-alert payment-alert-error" role="alert">
          {pageError}
        </div>
      )}
      {success && (
        <div className="payment-alert payment-alert-success" role="status">
          {success}
        </div>
      )}

      <div className="payment-admin-config">
        <Card className="payment-card">
          <div className="payment-card-heading">
            <span className="payment-icon payment-icon-blue">
              <Icon name="settings" size={19} />
            </span>
            <div>
              <h2>NayaPay receiving account</h2>
              <p>Keep this disabled until the account details are verified.</p>
            </div>
          </div>
          <form
            className="payment-form"
            onSubmit={(event) => void savePaymentSettings(event)}
          >
            <label className="payment-field">
              <span>Account title</span>
              <input
                value={settings.accountName}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    accountName: event.target.value,
                  }))
                }
                maxLength={120}
                required={settings.enabled}
              />
            </label>
            <label className="payment-field">
              <span>NayaPay account number</span>
              <input
                value={settings.accountNumber}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    accountNumber: event.target.value,
                  }))
                }
                maxLength={64}
                required={settings.enabled}
              />
            </label>
            <label className="payment-field">
              <span>Student transfer instructions</span>
              <textarea
                value={settings.instructions}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    instructions: event.target.value,
                  }))
                }
                maxLength={1000}
                rows={3}
              />
            </label>
            <label className="payment-toggle">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    enabled: event.target.checked,
                  }))
                }
              />
              <span>Enable this receiving account for student checkout</span>
            </label>
            <button
              type="submit"
              className="button button-primary"
              disabled={savingSettings}
            >
              {savingSettings ? "Saving account…" : "Save NayaPay settings"}
            </button>
          </form>
        </Card>

        <Card className="payment-card">
          <div className="payment-card-heading">
            <span className="payment-icon payment-icon-violet">
              <Icon name="briefcase" size={19} />
            </span>
            <div>
              <h2>Paid plan configuration</h2>
              <p>
                Prices and access durations are blank and disabled until you set real
                terms.
              </p>
            </div>
          </div>
          <div className="payment-plan-admin-list">
            {plans.map((plan) => (
              <form
                className="payment-plan-admin"
                key={plan.id}
                onSubmit={(event) => void savePlan(event, plan)}
              >
                <div className="payment-plan-admin-heading">
                  <strong>{plan.name}</strong>
                  <span
                    className={`payment-status ${plan.isActive ? "payment-status-approved" : "payment-status-disabled"}`}
                  >
                    {plan.isActive ? "Checkout live" : "Disabled"}
                  </span>
                </div>
                <div className="payment-plan-admin-fields">
                  <label className="payment-field">
                    <span>Amount (PKR)</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={plan.amountPkr}
                      onChange={(event) =>
                        updatePlan(plan.id, { amountPkr: event.target.value })
                      }
                      placeholder="Set actual amount"
                    />
                  </label>
                  <label className="payment-field">
                    <span>Access duration (days)</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={plan.durationDays}
                      onChange={(event) =>
                        updatePlan(plan.id, { durationDays: event.target.value })
                      }
                      placeholder="Set actual duration"
                    />
                  </label>
                </div>
                <label className="payment-toggle">
                  <input
                    type="checkbox"
                    checked={plan.isActive}
                    onChange={(event) =>
                      updatePlan(plan.id, { isActive: event.target.checked })
                    }
                  />
                  <span>Make this plan available for checkout</span>
                </label>
                <button
                  type="submit"
                  className="button button-outline button-small"
                  disabled={savingPlan === plan.id}
                >
                  {savingPlan === plan.id ? "Saving…" : "Save plan"}
                </button>
              </form>
            ))}
            {!plans.length && !loading && (
              <div className="payment-empty-note">Plan records are not available.</div>
            )}
          </div>
        </Card>
      </div>

      <Card className="payment-card payment-admin-table-card">
        <div className="payment-card-heading">
          <span className="payment-icon payment-icon-amber">
            <Icon name="clock" size={19} />
          </span>
          <div>
            <h2>Student payment submissions</h2>
            <p>
              Latest 100 requests · approval activates the recorded plan duration
              atomically.
            </p>
          </div>
          <button
            type="button"
            className="button button-outline button-small"
            onClick={() => void loadAdminPayments()}
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="payment-loading" role="status">
            Loading payment submissions…
          </div>
        ) : submissions.length ? (
          <div className="payment-admin-submissions">
            {submissions.map((submission) => (
              <article className="payment-admin-submission" key={submission.id}>
                <div className="payment-admin-submission-main">
                  <div>
                    <div className="payment-history-top">
                      <strong>{submission.student_name}</strong>
                      <span
                        className={`payment-status payment-status-${submission.status}`}
                      >
                        {submission.status}
                      </span>
                    </div>
                    <span>{submission.student_email}</span>
                    <small>
                      {submission.plan_name} · {formatPrice(submission.amount_pkr)} ·{" "}
                      {submission.duration_days} days
                    </small>
                    <small>Submitted: {formatDate(submission.submitted_at)}</small>
                    {submission.rejection_reason && (
                      <small className="payment-rejection-reason">
                        Reason: {submission.rejection_reason}
                      </small>
                    )}
                  </div>
                  <div className="payment-receipt-actions">
                    <button
                      type="button"
                      className="button button-quiet button-small"
                      onClick={() => void loadReceiptLink(submission)}
                    >
                      View private receipt
                    </button>
                    {receiptLinks[submission.id] && (
                      <a
                        className="button button-outline button-small"
                        href={receiptLinks[submission.id]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open receipt <Icon name="arrow" size={14} />
                      </a>
                    )}
                  </div>
                </div>
                {submission.status === "pending" && (
                  <div className="payment-review-actions">
                    <label className="payment-field">
                      <span>Rejection note (required to reject)</span>
                      <input
                        value={rejectionReasons[submission.id] ?? ""}
                        onChange={(event) =>
                          setRejectionReasons((current) => ({
                            ...current,
                            [submission.id]: event.target.value,
                          }))
                        }
                        maxLength={500}
                        placeholder="Explain what needs correction"
                      />
                    </label>
                    <div>
                      <button
                        type="button"
                        className="button button-primary button-small"
                        disabled={reviewing === submission.id}
                        onClick={() => void reviewSubmission(submission, "approved")}
                      >
                        {reviewing === submission.id ? "Saving…" : "Approve & activate"}
                      </button>
                      <button
                        type="button"
                        className="button button-outline button-small"
                        disabled={reviewing === submission.id}
                        onClick={() => void reviewSubmission(submission, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="payment-empty-note">
            No student payments have been submitted.
          </div>
        )}
      </Card>
    </>
  );
}
