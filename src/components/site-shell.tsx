"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { Icon, Logo } from "./ui";

type AppNotification = {
  id: string;
  notification_type: "exam_result" | "announcement";
  title: string;
  body: string;
  href: string | null;
  created_at: string;
  read_at: string | null;
};

type NotificationResponse = {
  unread_count: number;
  notifications: AppNotification[];
};

const publicLinks = [
  ["Daily Challenge", "/practice"],
  ["Mock Tests", "/mock-tests"],
  ["Resources", "/resources"],
  ["Merit Calculator", "/merit-calculator"],
  ["Pricing", "/pricing"],
  ["Contact us", "/contact-us"],
];

const studentLinks = [
  { label: "Overview", href: "/dashboard", icon: "home" },
  { label: "My preparation", href: "/preparation", icon: "book" },
  { label: "Daily Challenge", href: "/practice", icon: "practice" },
  { label: "Mock tests", href: "/mock-tests", icon: "clock" },
  { label: "Plans & payments", href: "/payments", icon: "briefcase" },
  { label: "Past papers", href: "/past-papers", icon: "book" },
  { label: "Formula sheets", href: "/resources/formula-sheets", icon: "function" },
  { label: "Merit Calculator", href: "/merit-calculator", icon: "chart" },
  { label: "Bookmarks", href: "/bookmarks", icon: "bookmark" },
  { label: "Analytics", href: "/analytics", icon: "chart" },
  { label: "Leaderboard", href: "/leaderboard", icon: "trophy" },
];

function isActive(pathname: string, href: string) {
  const cleanHref = href.split("?")[0];
  return (
    pathname === cleanHref ||
    (cleanHref !== "/dashboard" && pathname.startsWith(`${cleanHref}/`))
  );
}

export function SiteShell({
  children,
  isPublic = false,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isPublic?: boolean;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [notificationActionId, setNotificationActionId] = useState<string | null>(null);
  const notificationRequestId = useRef(0);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const { profile, user, role, session, loading: authLoading, logout } = useAuth();
  const notificationUserId = user?.id;
  const accountHref = role === "admin" ? "/admin" : "/dashboard";
  const displayName = isAdmin
    ? "Admin account"
    : profile?.full_name || user?.email?.split("@")[0] || "Student";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const nav = isAdmin
    ? [
        { label: "Overview", href: "/admin", icon: "home" },
        { label: "Students", href: "/admin/students", icon: "user" },
        { label: "Subjects", href: "/admin/subjects", icon: "book" },
        { label: "Chapters", href: "/admin/chapters", icon: "book" },
        { label: "Question bank", href: "/admin/questions", icon: "practice" },
        { label: "Resources", href: "/admin/resources", icon: "function" },
        { label: "Mock tests", href: "/admin/tests", icon: "clock" },
        { label: "Payments", href: "/admin/payments", icon: "briefcase" },
        { label: "Contact details", href: "/admin/contact", icon: "mail" },
        { label: "Notifications", href: "/admin/notifications", icon: "bell" },
        { label: "Analytics", href: "/admin/analytics", icon: "chart" },
      ]
    : studentLinks;

  const loadNotifications = useCallback(async () => {
    const request = ++notificationRequestId.current;
    if (
      isPublic ||
      authLoading ||
      !notificationUserId ||
      session?.user.id !== notificationUserId
    ) {
      setNotifications([]);
      setUnreadNotifications(0);
      setNotificationsLoading(false);
      return;
    }

    setNotificationsLoading(true);
    setNotificationsError("");
    try {
      const { data, error } = await createClient().rpc("student_notifications", {
        p_limit: 20,
      });
      if (error) throw error;
      if (!data || typeof data !== "object") {
        throw new Error("The notification response was empty.");
      }
      const result = data as NotificationResponse;
      if (request === notificationRequestId.current) {
        setNotifications(result.notifications);
        setUnreadNotifications(result.unread_count);
      }
    } catch (error) {
      const fields =
        error !== null && typeof error === "object"
          ? (error as Record<string, unknown>)
          : {};
      console.error(
        `Could not load notifications: ${JSON.stringify({
          code: fields.code ?? null,
          message:
            fields.message ?? (error instanceof Error ? error.message : String(error)),
        })}`,
      );
      if (request === notificationRequestId.current) {
        setNotificationsError("Notifications could not be loaded. Please try again.");
      }
    } finally {
      if (request === notificationRequestId.current) setNotificationsLoading(false);
    }
  }, [authLoading, isPublic, notificationUserId, session?.user.id]);

  useEffect(() => {
    if (authLoading) return;
    if (isPublic || !notificationUserId || session?.user.id !== notificationUserId) {
      setNotifications([]);
      setUnreadNotifications(0);
      return;
    }
    void loadNotifications();
  }, [authLoading, isPublic, loadNotifications, notificationUserId, session?.user.id]);

  useEffect(() => {
    if (isPublic || !notificationUserId) return;
    const refresh = () => void loadNotifications();
    window.addEventListener("meritlab-notifications-refresh", refresh);
    window.addEventListener("focus", refresh);
    const intervalId = window.setInterval(refresh, 60_000);
    return () => {
      window.removeEventListener("meritlab-notifications-refresh", refresh);
      window.removeEventListener("focus", refresh);
      window.clearInterval(intervalId);
    };
  }, [isPublic, loadNotifications, notificationUserId]);

  useEffect(() => {
    if (!notificationsOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !notificationMenuRef.current?.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
        notificationMenuRef.current?.querySelector("button")?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notificationsOpen]);

  async function markNotificationRead(notification: AppNotification) {
    setNotificationActionId(notification.id);
    try {
      const { error } = await createClient().rpc("mark_notification_read", {
        p_notification_id: notification.id,
      });
      if (error) throw error;
      if (!notification.read_at) {
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, read_at: new Date().toISOString() }
              : item,
          ),
        );
        setUnreadNotifications((current) => Math.max(0, current - 1));
      }
      setNotificationsOpen(false);
      if (notification.href) router.push(notification.href);
    } catch (error) {
      console.error("Could not mark notification as read.", error);
      setNotificationsError("That notification could not be updated. Try again.");
    } finally {
      setNotificationActionId(null);
    }
  }

  async function markAllNotificationsRead() {
    setNotificationActionId("all");
    try {
      const { error } = await createClient().rpc("mark_all_notifications_read");
      if (error) throw error;
      const readAt = new Date().toISOString();
      setNotifications((current) =>
        current.map((item) => ({ ...item, read_at: item.read_at ?? readAt })),
      );
      setUnreadNotifications(0);
    } catch (error) {
      console.error("Could not mark all notifications as read.", error);
      setNotificationsError("Notifications could not be updated. Try again.");
    } finally {
      setNotificationActionId(null);
    }
  }

  async function handleLogout() {
    if (loggingOut) return;
    setLogoutError("");
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Could not log out.", error);
      setLogoutError("Could not log out. Check your connection and try again.");
      setLoggingOut(false);
    }
  }

  if (isPublic) {
    return (
      <>
        <header className="public-header">
          <div className="public-nav wrap">
            <Logo />
            <nav className="public-links" aria-label="Main navigation">
              {publicLinks.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className={isActive(pathname, href) ? "public-link-active" : ""}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="public-actions">
              {user ? (
                <>
                  <a className="login-link" href={accountHref}>
                    Dashboard
                  </a>
                  <button
                    type="button"
                    className="button button-outline button-small"
                    onClick={() => void handleLogout()}
                    disabled={loggingOut}
                  >
                    <Icon name="logout" size={15} />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </>
              ) : (
                <>
                  <a className="login-link" href="/login">
                    Log in
                  </a>
                  <a className="button button-primary button-small" href="/register">
                    Get started <Icon name="arrow" size={16} />
                  </a>
                </>
              )}
            </div>
            <button
              type="button"
              className="icon-button mobile-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
          {menuOpen && (
            <nav className="mobile-public-menu">
              {publicLinks.map(([label, href]) => (
                <a
                  href={href}
                  key={href}
                  className={isActive(pathname, href) ? "public-link-active" : ""}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
              {user ? (
                <>
                  <a href={accountHref}>Dashboard</a>
                  <button
                    type="button"
                    className="mobile-public-logout"
                    onClick={() => {
                      setMenuOpen(false);
                      void handleLogout();
                    }}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </>
              ) : (
                <>
                  <a href="/login">Log in</a>
                  <a href="/register">Get started</a>
                </>
              )}
            </nav>
          )}
        </header>
        {logoutError && (
          <p className="shell-logout-error" role="alert">
            {logoutError}
          </p>
        )}
        {children}
      </>
    );
  }

  return (
    <div className={`workspace ${isAdmin ? "workspace-admin" : ""}`}>
      {menuOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Logo />
          <button
            type="button"
            className="icon-button sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="side-label">{isAdmin ? "WORKSPACE" : "LEARNING SPACE"}</div>
        <nav
          className="side-links"
          aria-label={isAdmin ? "Admin navigation" : "Student navigation"}
        >
          {nav.map((item) => (
            <a
              key={item.href}
              className={`side-link ${isActive(pathname, item.href) ? "side-link-active" : ""}`}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.href === "/bookmarks" && <span className="side-count">8</span>}
            </a>
          ))}

          {!isAdmin && (
            <a className="side-link" href="/profile">
              <Icon name="user" size={19} />
              <span>My profile</span>
            </a>
          )}
          <a className="side-link" href="/settings">
            <Icon name="settings" size={19} />
            <span>Settings</span>
          </a>
          <button
            type="button"
            className="side-link"
            onClick={() => void handleLogout()}
            disabled={loggingOut}
          >
            <Icon name="logout" size={19} />
            <span>{loggingOut ? "Logging out..." : "Log out"}</span>
          </button>
          {logoutError && <p className="field-hint">{logoutError}</p>}

          {!isAdmin && (
            <div className="sidebar-goal">
              <span className="goal-icon">
                <Icon name="spark" size={18} />
              </span>
              <strong>Weekly goal</strong>
              <span className="muted small">4 of 5 study days</span>
              <div
                className="goal-bars"
                role="img"
                aria-label="Weekly goal: four out of five days complete"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <i className={n <= 4 ? "goal-complete" : ""} key={n} />
                ))}
              </div>
              <a href="/challenges">
                View your challenge <Icon name="arrow" size={14} />
              </a>
            </div>
          )}
        </nav>

        <div className="side-profile">
          <span className="avatar avatar-navy">{initials}</span>
          <span className="profile-name">
            <strong>{displayName}</strong>
            <small>
              {isAdmin ? "Administrator" : profile?.target_net_category || user?.email}
            </small>
          </span>
          <a
            className="icon-button tiny"
            href={isAdmin ? "/admin" : "/profile"}
            aria-label="Open account"
          >
            <Icon name="chevronRight" size={18} />
          </a>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <button
            type="button"
            className="icon-button app-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumb">
            <span>{isAdmin ? "Admin" : "Workspace"}</span>
            <Icon name="chevron" size={14} />
            <strong>{getPageLabel(pathname)}</strong>
          </div>
          <div className="topbar-actions">
            <div className={`top-search ${searchOpen ? "top-search-open" : ""}`}>
              <Icon name="search" size={18} />
              <input
                aria-label="Search"
                placeholder="Search anything..."
                onKeyDown={(event) => {
                  if (event.key === "Enter")
                    window.location.href = `/resources?q=${encodeURIComponent(event.currentTarget.value)}`;
                }}
              />
              <kbd>⌘ K</kbd>
            </div>
            <button
              type="button"
              className="icon-button top-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Toggle search"
            >
              <Icon name="search" />
            </button>
            <div className="notification-menu" ref={notificationMenuRef}>
              <button
                type="button"
                className={`icon-button notification-button ${notificationsOpen ? "notification-button-active" : ""}`}
                aria-label={
                  unreadNotifications
                    ? `Notifications, ${unreadNotifications} unread`
                    : "Notifications"
                }
                aria-expanded={notificationsOpen}
                aria-controls="notification-popover"
                onClick={() => {
                  const nextOpen = !notificationsOpen;
                  setNotificationsOpen(nextOpen);
                  if (nextOpen) void loadNotifications();
                }}
              >
                <Icon name="bell" />
                {unreadNotifications > 0 && <i />}
              </button>
              {notificationsOpen && (
                <section
                  className="notification-popover"
                  id="notification-popover"
                  aria-label="Notifications"
                >
                  <div className="notification-popover-heading">
                    <div>
                      <strong>Notifications</strong>
                      <span>
                        {unreadNotifications
                          ? `${unreadNotifications} unread`
                          : "You're all caught up"}
                      </span>
                    </div>
                    {unreadNotifications > 0 && (
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => void markAllNotificationsRead()}
                        disabled={notificationActionId !== null}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notificationsError && (
                    <div className="notification-error" role="alert">
                      {notificationsError}{" "}
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => void loadNotifications()}
                      >
                        Retry
                      </button>
                    </div>
                  )}
                  {notificationsLoading ? (
                    <p className="notification-empty">Loading notifications...</p>
                  ) : notifications.length ? (
                    <div className="notification-list">
                      {notifications.map((notification) => (
                        <button
                          type="button"
                          className={`notification-item ${notification.read_at ? "" : "notification-item-unread"}`}
                          key={notification.id}
                          onClick={() => void markNotificationRead(notification)}
                          disabled={notificationActionId !== null}
                        >
                          <span className="notification-item-icon">
                            <Icon
                              name={
                                notification.notification_type === "exam_result"
                                  ? "trophy"
                                  : "spark"
                              }
                              size={17}
                            />
                          </span>
                          <span className="notification-item-content">
                            <strong>{notification.title}</strong>
                            <span>{notification.body}</span>
                            <small>
                              {new Date(notification.created_at).toLocaleString(
                                undefined,
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                },
                              )}
                            </small>
                          </span>
                          {!notification.read_at && (
                            <i className="notification-unread-dot" aria-hidden="true" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="notification-empty">
                      You’ll see exam results and MeritLab announcements here.
                    </p>
                  )}
                </section>
              )}
            </div>
            <a
              className="avatar avatar-soft top-avatar"
              href="/profile"
              aria-label="Your profile"
            >
              {initials}
            </a>
            <button
              type="button"
              className="topbar-logout"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
            >
              <Icon name="logout" size={16} />
              <span>{loggingOut ? "Logging out..." : "Log out"}</span>
            </button>
          </div>
        </header>
        {logoutError && (
          <p className="shell-logout-error" role="alert">
            {logoutError}
          </p>
        )}
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}

function getPageLabel(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments.at(-1) ?? "Dashboard";
  if (last === "app") return "Dashboard";
  if (segments[0] === "practice" || segments[0] === "challenges") {
    return "Daily Challenge";
  }
  return last
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
