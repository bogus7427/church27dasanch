"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type Role = "guest" | "member" | "admin";
export const ROLE_LABEL: Record<Role, string> = {
  guest: "일반사용자",
  member: "로그인사용자",
  admin: "관리자",
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  gender: "남" | "여" | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  role: Role;
  onboarded_at: string | null;
};

/** 로그인 사용자 + 프로필(역할 포함). 로그인 안 했으면 role = guest */
export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (u: User | null) => {
    setUser(u);
    if (!u) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id,email,full_name,gender,phone,address,avatar_url,role,onboarded_at")
      .eq("id", u.id)
      .maybeSingle();
    setProfile((data as Profile) ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => load(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [load]);

  const role: Role = profile?.role ?? "guest";
  return {
    user,
    profile,
    role,
    loading,
    isAdmin: role === "admin",
    canComment: !!user && (role === "member" || role === "admin"),
    reload: () => load(user),
  };
}
