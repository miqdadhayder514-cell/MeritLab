"use client";

import type { AuthChangeEvent, AuthError, Session, User } from "@supabase/supabase-js";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AppRole = "student" | "admin";

export type StudentProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  target_net_category: string | null;
  created_at: string;
  updated_at: string;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: StudentProfile | null;
  role: AppRole | null;
  loading: boolean;
  identityError: string | null;
  login: (email: string, password: string) => Promise<AppRole | null>;
  register: (input: {
    fullName: string;
    email: string;
    password: string;
    targetNetCategory: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (
    updates: Pick<StudentProfile, "full_name" | "phone" | "target_net_category">,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getIdentityError(error: unknown) {
  return error instanceof Error ? error.message : "Unable to load your account.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [identityError, setIdentityError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const identityUserId = useRef<string | null>(null);
  const identityRequest = useRef<Promise<AppRole | null> | null>(null);

  const loadIdentity = useCallback(
    async (nextUser: User | null, force = false): Promise<AppRole | null> => {
      setUser(nextUser);
      if (!nextUser) {
        identityUserId.current = null;
        identityRequest.current = null;
        setProfile(null);
        setRole(null);
        setIdentityError(null);
        return null;
      }

      if (!force && identityUserId.current === nextUser.id && identityRequest.current) {
        return identityRequest.current;
      }

      identityUserId.current = nextUser.id;
      setIdentityError(null);
      const request = (async (): Promise<AppRole | null> => {
        const supabase = createClient();
        const [profileResult, roleResult] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", nextUser.id).maybeSingle(),
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", nextUser.id)
            .maybeSingle(),
        ]);

        if (profileResult.error) throw profileResult.error;
        if (roleResult.error) throw roleResult.error;
        if (identityUserId.current !== nextUser.id) return null;
        setProfile(profileResult.data as StudentProfile | null);
        const savedRole = roleResult.data?.role;
        const nextRole =
          savedRole === "student" || savedRole === "admin" ? savedRole : null;
        setRole(nextRole);
        return nextRole;
      })();

      identityRequest.current = request;
      try {
        return await request;
      } catch (error) {
        if (identityUserId.current === nextUser.id) {
          identityUserId.current = null;
          identityRequest.current = null;
          setIdentityError(getIdentityError(error));
        }
        throw error;
      }
    },
    [],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, nextSession: Session | null) => {
        if (!active) return;
        setSession(nextSession);

        if (event === "SIGNED_OUT") {
          void loadIdentity(null);
          setLoading(false);
          return;
        }

        if (nextSession?.user) {
          void loadIdentity(nextSession.user)
            .catch(() => undefined)
            .finally(() => {
              if (active) setLoading(false);
            });
        } else {
          void loadIdentity(null);
          setLoading(false);
        }
      },
    );

    void supabase.auth
      .getSession()
      .then(
        ({
          data,
          error,
        }: {
          data: { session: Session | null };
          error: AuthError | null;
        }) => {
          if (!active) return;
          if (error) {
            setIdentityError(getIdentityError(error));
            setLoading(false);
            return;
          }
          setSession(data.session);
          void loadIdentity(data.session?.user ?? null)
            .catch(() => undefined)
            .finally(() => {
              if (active) setLoading(false);
            });
        },
      );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadIdentity]);

  const login = useCallback(
    async (email: string, password: string) => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user.email_confirmed_at) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        throw new Error("Verify your email address before logging in.");
      }
      const role = await loadIdentity(data.user);
      if (!role) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        throw new Error("Account permissions are unavailable.");
      }
      return role;
    },
    [loadIdentity],
  );

  const register = useCallback(
    async (input: {
      fullName: string;
      email: string;
      password: string;
      targetNetCategory: string;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          data: {
            full_name: input.fullName,
            target_net_category: input.targetNetCategory,
          },
        },
      });
      if (error) throw error;
      return Boolean(data.session);
    },
    [],
  );

  const logout = useCallback(async () => {
    const { error } = await createClient().auth.signOut();
    if (error) throw error;
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    if (error) throw error;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const supabase = createClient();
    const {
      data: { session: currentSession },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!currentSession) {
      throw new Error("This password reset link has expired. Request a new one.");
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  const updateProfile = useCallback(
    async (
      updates: Pick<StudentProfile, "full_name" | "phone" | "target_net_category">,
    ) => {
      if (!user) throw new Error("Log in to update your profile.");
      const { data, error } = await createClient()
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select("*")
        .single();
      if (error) throw error;
      setProfile(data as StudentProfile);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      role,
      loading,
      identityError,
      login,
      register,
      logout,
      requestPasswordReset,
      updatePassword,
      updateProfile,
    }),
    [
      user,
      session,
      profile,
      role,
      loading,
      identityError,
      login,
      register,
      logout,
      requestPasswordReset,
      updatePassword,
      updateProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
