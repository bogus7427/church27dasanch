"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ROLE_LABEL, useProfile } from "@/lib/useProfile";

export default function UserMenu({ mobile, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { user, profile, role, isAdmin, loading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();

  // 첫 로그인(프로필 미입력) → 프로필 페이지로
  useEffect(() => {
    if (!mobile && !loading && user && profile && !profile.onboarded_at && pathname !== "/profile") {
      router.push("/profile?welcome=1");
    }
  }, [mobile, loading, user, profile, pathname, router]);

  const logout = async () => {
    await supabase.auth.signOut();
    onNavigate?.();
    router.push("/");
  };

  const name =
    profile?.full_name || (user?.user_metadata?.full_name as string) || (user?.user_metadata?.name as string) || user?.email?.split("@")[0];

  if (user) {
    return (
      <div className={mobile ? "mt-6 flex flex-wrap items-center gap-3" : "flex items-center gap-3"}>
        <Link href="/profile" onClick={onNavigate} className="text-sm text-navy/70 hover:text-gold" title="내 프로필">
          <b className="text-navy">{name}</b>님
          <span className="ml-1.5 rounded-full bg-cream px-2 py-0.5 text-[11px] text-gold">{ROLE_LABEL[role]}</span>
        </Link>
        {isAdmin && (
          <Link href="/admin" onClick={onNavigate} className="btn rounded-full bg-gold px-4 py-1.5 text-white hover:bg-navy">
            관리자
          </Link>
        )}
        <button onClick={logout} className="btn rounded-full border border-navy/20 px-4 py-1.5 text-navy hover:bg-cream">
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className={mobile ? "mt-6 grid grid-cols-2 gap-3" : "flex items-center gap-3"}>
      <Link
        href="/login"
        onClick={onNavigate}
        className={mobile ? "btn rounded-full border border-navy/20 py-3 text-center text-navy" : "btn text-navy hover:text-gold"}
      >
        로그인
      </Link>
      <Link
        href="/signup"
        onClick={onNavigate}
        className={mobile ? "btn rounded-full bg-navy py-3 text-center text-white" : "btn rounded-full bg-navy px-5 py-2 text-white hover:bg-gold"}
      >
        회원가입
      </Link>
    </div>
  );
}
