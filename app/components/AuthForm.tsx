"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "signup";

const errKo = (m: string) => {
  if (m.includes("Invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (m.includes("Email not confirmed")) return "이메일 인증이 아직 완료되지 않았습니다. 메일함을 확인해주세요.";
  if (m.includes("User already registered")) return "이미 가입된 이메일입니다.";
  if (m.includes("Password should be")) return "비밀번호는 6자 이상이어야 합니다.";
  if (m.includes("provider is not enabled")) return "이 로그인 방식이 아직 활성화되지 않았습니다. 관리자에게 문의하세요.";
  return m;
};

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    if (isSignup && password !== password2) return setError("비밀번호가 서로 다릅니다.");
    setLoading(true);

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name }, emailRedirectTo: `${location.origin}/` },
      });
      setLoading(false);
      if (error) return setError(errKo(error.message));
      if (!data.session) return setNotice(`${email} 로 인증 메일을 보냈습니다. 메일의 링크를 눌러 가입을 완료해주세요.`);
      router.push("/");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(errKo(error.message));
      router.push("/");
    }
  }

  async function social(provider: "google") {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/` },
    });
    if (error) setError(errKo(error.message));
  }

  const input =
    "w-full rounded-xl border border-navy/15 bg-white px-4 py-3.5 text-navy outline-none transition placeholder:text-navy/30 focus:border-navy";

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-5 py-16">
      <div className="blob absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#029dca]/25" />
      <div className="blob absolute -right-16 bottom-10 h-96 w-96 rounded-full bg-[#9ec749]/35 [animation-delay:-6s]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_-30px_rgba(22,56,79,0.3)]">
        {/* 미니 페이지 스타일 헤더 */}
        <div className="flex justify-between px-6 pt-4 text-[11px] font-bold uppercase">
          <span className="underline underline-offset-2">Dasan Church</span>
          <span>{isSignup ? "Join" : "Sign in"}</span>
        </div>
        <div className="mt-3 px-6 pb-4 pt-2" style={{ background: isSignup ? "#c4e38f" : "#7fd0ea" }}>
          <h1 className="text-5xl font-black tracking-tight text-black">{isSignup ? "회원가입" : "로그인"}</h1>
          <p className="mt-1 text-sm font-bold text-black/70">
            {isSignup ? "다산교회 가족이 되어주세요" : "다시 오신 것을 환영합니다"}
          </p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          {/* 소셜 */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => social("google")}
              className="btn flex w-full items-center justify-center gap-2 rounded-xl border border-navy/15 bg-white py-3 text-navy transition hover:bg-cream"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
              </svg>
              Google로 {isSignup ? "시작하기" : "로그인"}
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-navy/40">
            <span className="h-px flex-1 bg-navy/10" />
            또는 이메일로
            <span className="h-px flex-1 bg-navy/10" />
          </div>

          {/* 이메일 */}
          <form onSubmit={onSubmit} className="space-y-3">
            {isSignup && (
              <input className={input} placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
            )}
            <input className={input} type="email" placeholder="이메일" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input
              className={input}
              type="password"
              placeholder="비밀번호 (6자 이상)"
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {isSignup && (
              <input
                className={input}
                type="password"
                placeholder="비밀번호 확인"
                autoComplete="new-password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            )}

            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            {notice && <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</p>}

            <button
              disabled={loading}
              className="btn w-full rounded-xl bg-navy py-3 text-white transition hover:bg-black disabled:opacity-50"
            >
              {loading ? "처리 중..." : isSignup ? "이메일로 가입하기" : "로그인"}
            </button>
          </form>

          <p className="text-center text-sm text-navy/60">
            {isSignup ? "이미 계정이 있으신가요? " : "아직 회원이 아니신가요? "}
            <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-navy underline underline-offset-2">
              {isSignup ? "로그인" : "회원가입"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
