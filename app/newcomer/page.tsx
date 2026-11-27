"use client";

import Link from "next/link";
import SectionNav, { PageTitle } from "@/app/components/SectionNav";
import { Nanum_Brush_Script } from "next/font/google";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const brush = Nanum_Brush_Script({ weight: "400", subsets: ["latin"], display: "swap" });

const STEPS = [
  ["등록하기", "아래 신청서를 작성하시거나 예배 후 안내위원에게 말씀해 주세요."],
  ["새가족 환영", "담당 교역자와 새가족부가 연락드리고 교회를 안내해 드립니다."],
  ["함께하는 교회생활", "구역(목장)에 소속되어 예배와 교제로 함께 자라갑니다."],
];

const input =
  "w-full rounded-xl border border-navy/15 bg-white px-4 py-3.5 text-navy outline-none transition placeholder:text-navy/30 focus:border-navy";

/** 새가족 등록 신청: 누구나 작성 (로그인 불필요) · 내용은 관리자만 볼 수 있음 */
export default function NewcomerPage() {
  const [form, setForm] = useState({ name: "", gender: "", phone: "", address: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setErr("이름을 입력해주세요.");
    if (!agree) return setErr("개인정보 수집·이용에 동의해주세요.");
    setBusy(true);
    setErr("");
    const { error } = await supabase.from("newcomers").insert({
      name: form.name.trim(),
      gender: form.gender || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
    });
    setBusy(false);
    if (error) return setErr("등록하지 못했습니다. 잠시 후 다시 시도하거나 교회로 연락해주세요. (054-956-0691)");
    setDone(true);
  }

  return (
    <>
    <SectionNav slug="newcomer" />
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <PageTitle slug="newcomer" />
      <div className="grid gap-12 leading-8 text-navy/80 md:text-[17px] lg:grid-cols-[1fr_28rem]">
      {/* 환영 + 안내 */}
      <div className="space-y-12">
        <div>
          <p className="text-sm font-bold tracking-widest text-gold">WELCOME</p>
          <p className={`${brush.className} mt-3 text-5xl leading-tight text-[#a88a55] md:text-6xl`}>다산교회에 오신 것을 환영합니다</p>
          <p className="mt-6">
            처음 오신 분, 다시 교회를 찾으신 분 모두 진심으로 환영합니다. 다산교회는 1907년부터 다산 땅에서 복음을 전해 온 교회입니다.
            하나님의 사랑 안에서 한 가족이 되어 함께 예배하고 함께 자라가기를 소망합니다.
          </p>
        </div>
        <blockquote className="rounded-3xl bg-[#f1f4e4] px-8 py-8 text-center text-lg leading-9 text-navy">
          “그러므로 그리스도께서 우리를 받아 하나님께 영광을 돌리심과 같이 너희도 서로 받으라” <span className="text-sm text-navy/50">(로마서 15장 7절)</span>
        </blockquote>
        <section>
          <h2 className="mb-6 border-b-2 border-navy pb-3 text-2xl font-extrabold text-navy">새가족 안내</h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-cream/70 px-5 py-5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-sm font-bold text-white">{i + 1}</span>
                <p className="mt-3 font-bold text-navy">{t}</p>
                <p className="mt-1 text-sm leading-6 text-navy/70">{d}</p>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="mb-6 border-b-2 border-navy pb-3 text-2xl font-extrabold text-navy">문의</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-cream/70 px-5 py-4"><dt className="text-sm font-bold text-gold">전화</dt><dd className="mt-1 text-navy"><a href="tel:054-956-0691">054-956-0691</a></dd></div>
            <div className="rounded-2xl bg-cream/70 px-5 py-4"><dt className="text-sm font-bold text-gold">주소</dt><dd className="mt-1 text-navy">경북 고령군 다산면 다산중앙길 19-14</dd></div>
          </dl>
        </section>
      </div>
      <div className="h-fit w-full lg:sticky lg:top-40">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_-30px_rgba(22,56,79,0.3)]">
        <div className="bg-gold px-8 pb-5 pt-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Welcome</p>
          <h1 className="mt-1 text-4xl">새가족 등록</h1>
          <p className="mt-1 text-sm text-white/85">다산교회에 오신 것을 진심으로 환영합니다.</p>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <p className="text-5xl">🙏</p>
            <h2 className="mt-4 text-3xl text-navy">등록되었습니다</h2>
            <p className="mt-3 leading-7 text-navy/60">
              {form.name}님, 함께하게 되어 기쁩니다.
              <br />곧 교회에서 연락드리겠습니다.
            </p>
            <Link href="/" className="btn mt-8 inline-block rounded-full bg-navy px-8 py-2 text-white">
              홈으로
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 p-8">
            <label className="block">
              <span className="mb-1.5 block text-sm text-navy/60">
                이름 <span className="text-gold">*</span>
              </span>
              <input className={input} value={form.name} onChange={set("name")} placeholder="홍길동" maxLength={30} required />
            </label>

            <div>
              <span className="mb-1.5 block text-sm text-navy/60">성별</span>
              <div className="grid grid-cols-2 gap-2">
                {["남", "여"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, gender: f.gender === g ? "" : g }))}
                    className={`rounded-xl border py-3 transition ${
                      form.gender === g ? "border-navy bg-navy text-white" : "border-navy/15 text-navy hover:bg-cream"
                    }`}
                  >
                    {g}
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

            <label className="flex items-start gap-3 rounded-xl bg-cream px-4 py-3 text-sm text-navy/70">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0b8fc0]" />
              <span>
                <b className="text-navy">개인정보 수집·이용 동의 (필수)</b>
                <br />
                새가족 안내와 연락을 위해 이름·성별·전화번호·주소를 수집하며, 교회 관리자만 열람합니다. 삭제를 원하시면 교회로 연락해주세요.
              </span>
            </label>

            {err && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{err}</p>}

            <button disabled={busy} className="btn w-full rounded-xl bg-navy py-3 text-white transition hover:bg-black disabled:opacity-50">
              {busy ? "등록 중…" : "새가족 등록하기"}
            </button>
          </form>
        )}
      </div>
      </div>
      </div>
    </div>
    </>
  );
}
