import { notFound, redirect } from "next/navigation";
import { AdminPage } from "@/components/admin-pages";
import { AuthPage } from "@/components/auth-pages";
import { ContactUsPage } from "@/components/contact-pages";
import { ExamPage, PastPaperPage } from "@/components/exam-pages";
import { PricingPage } from "@/components/pricing-page";
import { SiteShell } from "@/components/site-shell";
import { StudentPage } from "@/components/student-pages";
import { isSupabaseConfigured } from "@/lib/supabase/config";
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
  if (root === "mock-tests" && rest[1] === "exam") {
    const identity = isSupabaseConfigured ? await getServerIdentity() : null;
    if (!identity?.role)
      redirect(`/login?next=${encodeURIComponent(`/${slug.join("/")}`)}`);
    return <ExamPage path={rest} />;
  }
  if (root === "past-papers" && rest[1] === "exam") {
    const identity = isSupabaseConfigured ? await getServerIdentity() : null;
    if (!identity?.role)
      redirect(`/login?next=${encodeURIComponent(`/${slug.join("/")}`)}`);
    return <PastPaperPage path={rest} />;
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
        <StudentPage path={slug} />
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
  if (root === "mock-tests") {
    return (
      <SiteShell>
        <ExamPage path={rest} />
      </SiteShell>
    );
  }
  if (root === "past-papers") {
    return (
      <SiteShell>
        <PastPaperPage path={rest} />
      </SiteShell>
    );
  }
  return (
    <SiteShell>
      <StudentPage path={slug} />
    </SiteShell>
  );
}
