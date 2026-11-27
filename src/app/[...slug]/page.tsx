import { notFound, redirect } from "next/navigation";
import { AdminPage } from "@/components/admin-pages";
import { AuthPage } from "@/components/auth-pages";
import { ContactUsPage } from "@/components/contact-pages";
import { ExamPage, PastPaperPage } from "@/components/exam-pages";
import { FormulaSheetPage } from "@/components/formula-sheet-page";
import { PricingPage } from "@/components/pricing-page";
import { SiteShell } from "@/components/site-shell";
import { StudentPage } from "@/components/student-pages";
import {
  mockTestListings,
  mockTests,
  pastPaperListings,
  pastPaperTests,
} from "@/lib/exam-catalog";
import { formulaSheets } from "@/lib/formula-sheet-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { hasPlusAccess } from "@/lib/supabase/entitlements";
import { getServerIdentity } from "@/lib/supabase/server-auth";

const authRoutes = new Set(["login", "register", "forgot-password", "reset-password"]);
const publicRoutes = new Set(["about", "contact-us", "faq", "privacy", "terms"]);

export default async function RoutedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ error?: string; reset?: string }>;
}) {
  const { slug } = await params;
  const { error: authError, reset } = await searchParams;
  const [root, ...rest] = slug;

  if (!root) notFound();
  if (authRoutes.has(root)) {
    if (root !== "reset-password" && isSupabaseConfigured) {
      const identity = await getServerIdentity();
      if (identity?.role) {
        redirect(identity.role === "admin" ? "/admin" : "/dashboard");
      }
    }
    return (
      <AuthPage
        type={root as "login" | "register" | "forgot-password" | "reset-password"}
        initialError={
          !isSupabaseConfigured
            ? "Authentication is not configured. Add the Supabase project URL and publishable key to .env.local."
            : authError === "configuration"
              ? "Authentication is not configured. Contact the site administrator."
              : authError === "callback"
                ? "This link is invalid or has expired. Please request a new one."
                : authError === "verification"
                  ? "Email verification could not be completed. Request a new verification email."
                  : undefined
        }
        initialMessage={
          root === "login" && reset === "success"
            ? "Your password was updated. Log in with your new password."
            : undefined
        }
      />
    );
  }
  if (root === "mock-tests" || root === "past-papers") {
    const identity = isSupabaseConfigured ? await getServerIdentity() : null;
    if (!identity?.role)
      redirect(`/login?next=${encodeURIComponent(`/${slug.join("/")}`)}`);
    const entitled = identity.role === "admin" || (await hasPlusAccess());
    const paidExam =
      rest.length > 0 && (root === "past-papers" || rest[0] !== "net-engineering");
    if (paidExam && !entitled) redirect("/pricing");
    const exams = root === "past-papers" ? pastPaperTests : mockTests;
    const test = rest[0] ? exams.find((item) => item.slug === rest[0]) : undefined;
    return (
      <SiteShell>
        {root === "past-papers" ? (
          <PastPaperPage
            path={rest}
            test={test}
            tests={pastPaperListings}
            hasPlusAccess={entitled}
          />
        ) : (
          <ExamPage
            path={rest}
            test={test}
            tests={mockTestListings}
            hasPlusAccess={entitled}
          />
        )}
      </SiteShell>
    );
  }
  if (root === "admin") {
    const identity = isSupabaseConfigured ? await getServerIdentity() : null;
    if (!identity) redirect(`/login?next=${encodeURIComponent(`/${slug.join("/")}`)}`);
    if (identity.role !== "admin") redirect("/dashboard");
    return (
      <SiteShell isAdmin>
        <AdminPage path={slug} />
      </SiteShell>
    );
  }
  if (root === "pricing") {
    return (
      <SiteShell isPublic>
        <PricingPage />
      </SiteShell>
    );
  }
  if (root === "contact-us") {
    return (
      <SiteShell isPublic>
        <ContactUsPage />
      </SiteShell>
    );
  }
  if (publicRoutes.has(root)) {
    return (
      <SiteShell isPublic>
        <StudentPage path={slug} hasPlusAccess={false} />
      </SiteShell>
    );
  }
  const validRoutes = new Set([
    "dashboard",
    "app",
    "preparation",
    "practice",
    "mock-tests",
    "analytics",
    "resources",
    "past-papers",
    "bookmarks",
    "leaderboard",
    "challenges",
    "profile",
    "settings",
    "payments",
  ]);
  if (!validRoutes.has(root)) notFound();
  const identity = isSupabaseConfigured ? await getServerIdentity() : null;
  if (!identity?.role) {
    redirect(`/login?next=${encodeURIComponent(`/${slug.join("/")}`)}`);
  }
  if (root === "payments" && identity.role !== "student") {
    redirect("/admin/payments");
  }
  const formulaSheetSlug =
    root === "resources" && rest[0] === "formula-sheets" ? rest[1] : undefined;
  if (formulaSheetSlug && formulaSheetSlug !== "conic-sections") {
    const entitled =
      identity.role === "admin" ||
      (identity.role === "student" && (await hasPlusAccess()));
    if (!entitled) redirect("/pricing");
    if (!formulaSheets.some((sheet) => sheet.slug === formulaSheetSlug)) notFound();
    return (
      <SiteShell>
        <FormulaSheetPage slug={formulaSheetSlug} />
      </SiteShell>
    );
  }
  return (
    <SiteShell>
      <StudentPage
        path={slug}
        hasPlusAccess={
          identity.role === "admin" ||
          (identity.role === "student" && (await hasPlusAccess()))
        }
      />
    </SiteShell>
  );
}
