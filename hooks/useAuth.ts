"use client";

import { useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/supabase/user";

export interface AuthState {
  user: User | null;
  profile: ProfileRow | null;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthState & {
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isAdmin: false,
    isLoading: true,
  });

  const supabase = createBrowserClient();

  const fetchProfile = useCallback(
    async (currentUser: User | null) => {
      if (!currentUser) {
        setState({
          user: null,
          profile: null,
          isAdmin: false,
          isLoading: false,
        });
        return;
      }

      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        const profile = data as ProfileRow | null;

        setState({
          user: currentUser,
          profile: profile || null,
          isAdmin: profile?.role === "admin" && profile?.status === "active",
          isLoading: false,
        });
      } catch {
        setState({
          user: currentUser,
          profile: null,
          isAdmin: false,
          isLoading: false,
        });
      }
    },
    [supabase]
  );

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await fetchProfile(user);
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      profile: null,
      isAdmin: false,
      isLoading: false,
    });
    window.location.href = "/login";
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      fetchProfile(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  return {
    ...state,
    refresh,
    signOut,
  };
}
