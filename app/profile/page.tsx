"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ROLE_LABEL, useProfile } from "@/lib/useProfile";

const input =
  "w-full rounded-xl border border-navy/15 bg-white px-4 py-3.5 text-navy outline-none transition placeholder:text-navy/30 focus:border-navy";

export default function ProfilePage() {
  const { user, profile, role, loading, reload } = useProfile();
  const router = useRouter();
  const [welcome, setWelcome] = useState(false);
  const [form, setForm] = useState({ full_name: "", gender: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setWelcome(new URLSearchParams(window.location.search).has("welcome"));
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (profile)
      setForm({
        full_name: profile.full_name ?? "",
        gender: profile.gender ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
  }, [profile]);

  async function save(e?: React.FormEvent, skip = false) {
    e?.preventDefault();
    if (!user) return;
    setSaving(true);
    setMsg(null);
    const patch = skip
      ? { onboarded_at: new Date().toISOString() }
      : {
          full_name: form.full_name.trim() || null,
          gender: form.gender || null,
          phone: form.phone.trim() || null,
          address: form.address.trim() || null,
          onboarded_at: profile?.onboarded_at ?? new Date().toISOString(),
        };
    const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
    setSaving(false);
    if (error) return setMsg({ ok: false, text: `저장하지 못했습니다: ${error.message}` });
    await reload();
    if (welcome) return router.push("/");
    setMsg({ ok: true, text: "저장했습니다." });
  }

  if (loading || !user) return <p className="py-40 text-center text-navy/40">불러오는 중…</p>;

  if (!profile)
    return (
      <p className="mx-auto max-w-md px-5 py-40 text-center text-navy/60">
        회원 정보 테이블이 아직 준비되지 않았습니다. 관리자에게 문의해주세요.
      </p>
    );

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_-30px_rgba(22,56,79,0.3)]">
        <div className="bg-[#c4e38f] px-8 pb-5 pt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-black/60">{welcome ? "Welcome" : "My Profile"}</p>
          <h1 className="mt-1 text-4xl text-black">{welcome ? "환영합니다!" : "내 프로필"}</h1>
          <p className="mt-1 text-sm text-black/70">
            {welcome ? "아래 정보를 입력해 주시면 교회 소식을 더 잘 전해드릴 수 있어요. 모두 선택 사항입니다." : "모든 항목은 선택 사항입니다."}
          </p>
        </div>

        <form onSubmit={save} className="space-y-4 p-8">
          <div className="flex items-center justify-between rounded-xl bg-cream px-4 py-3 text-sm">
            <span className="text-navy/60">{user.email}</span>
            <span className="rounded-full bg-white px-3 py-1 text-gold">{ROLE_LABEL[role]}</span>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm text-navy/60">이름</span>
            <input className={input} value={form.full_name} onChange={set("full_name")} placeholder="홍길동" maxLength={30} />
          </label>

          <div className="block">
            <span className="mb-1.5 block text-sm text-navy/60">성별</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["", "선택 안 함"],
                ["남", "남"],
                ["여", "여"],
              ].map(([v, l]) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gender: v }))}
                  className={`rounded-xl border py-3 transition ${
                    form.gender === v ? "border-navy bg-navy text-white" : "border-navy/15 text-navy hover:bg-cream"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm text-navy/60">전화번호</span>
            <input className={input} type="tel" value={form.phone} onChange={set("phone")} placeholder="010-0000-0000" maxLength={20} />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-navy/60">주소</span>
            <input className={input} value={form.address} onChange={set("address")} placeholder="경북 고령군 다산면 …" maxLength={120} />
          </label>

          {msg && (
            <p className={`rounded-lg px-4 py-3 text-sm ${msg.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{msg.text}</p>
          )}

          <button disabled={saving} className="btn w-full rounded-xl bg-navy py-3 text-white transition hover:bg-black disabled:opacity-50">
            {saving ? "저장 중…" : "저장하기"}
          </button>
          {welcome ? (
            <button type="button" onClick={() => save(undefined, true)} className="btn w-full py-2 text-navy/50 hover:text-navy">
              나중에 입력할게요
            </button>
          ) : (
            <Link href="/" className="btn block py-2 text-center text-navy/50 hover:text-navy">
              홈으로
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
