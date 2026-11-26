"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import UserMenu from "./UserMenu";
import SnsBar from "./SnsBar";
import { SECTIONS, pageHref } from "@/lib/sitePages";

const menus = SECTIONS.map((s) => ({
  label: s.label,
  href: pageHref(s.pages[0]),
  sub: s.pages.map((p) => [p.title, pageHref(p)] as const),
}));

// 교회소개 · 소개영상: 640×480 새 창으로 소개영상 열기
const INTRO_VIDEO = "https://www.youtube.com/embed/k7JFgEva4Ko?autoplay=1&rel=0";
const POPUP = new Set(["교회소개", "다산교회 소개영상"]);
function openIntro(e: React.MouseEvent) {
  const w = window.open(INTRO_VIDEO, "dasanIntro", "width=640,height=480,left=200,top=150");
  if (w) {
    e.preventDefault();
    w.focus();
  }
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/5 bg-background/70 backdrop-blur-md">
      {/* 맨 위 고정 띠: 연락처 + SNS (주소는 관리자 > SNS 설정) */}
      <div className="bg-navy text-white/80">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-5 text-xs">
          <a href="tel:054-956-0691" className="hover:text-white">
            ☎ 054-956-0691
          </a>
          <SnsBar />
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5 text-navy" aria-label="다산교회 홈">
          <Image src="/dasan-mark.png" alt="" width={36} height={36} priority />
          <span className="leading-none">
            <span className="block text-xl font-extrabold tracking-tight">다산교회</span>
            <span className="mt-1 block text-[10px] font-medium tracking-[0.15em] text-navy/50">대한예수교장로회 · 1907</span>
          </span>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex gap-1">
            {menus.map((m) => (
              <li key={m.label} className="group relative">
                <a href={m.href} onClick={POPUP.has(m.label) ? openIntro : undefined} className="block rounded-full px-4 py-2 text-[15px] font-medium text-navy hover:bg-cream">
                  {m.label}
                </a>
                <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <ul className="w-56 rounded-2xl border border-navy/5 bg-white p-2 shadow-xl">
                    {m.sub.map(([t, h]) => (
                      <li key={t}>
                        <a href={h} onClick={POPUP.has(t) ? openIntro : undefined} className="block rounded-xl px-4 py-2.5 font-semibold text-navy hover:bg-cream">
                          {t}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href="/video" className="text-sm font-medium text-navy hover:text-gold">
            온라인 예배
          </a>
          <span className="h-4 w-px bg-navy/15" />
          <Suspense fallback={null}>
            <UserMenu />
          </Suspense>
        </div>

        <button aria-label="메뉴" className="text-navy lg:hidden" onClick={() => setOpen(!open)}>
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l16 16M22 6L6 22" /> : <path d="M4 9h20M4 19h20" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="max-h-[80vh] overflow-y-auto bg-background px-5 pb-6 lg:hidden">
          {menus.map((m) => (
            <div key={m.label} className="border-b border-navy/10 py-4">
              <p className="text-lg font-bold text-navy">{m.label}</p>
              {m.sub.map(([t, h]) => (
                <a
                  key={t}
                  href={h}
                  onClick={(e) => {
                    if (POPUP.has(t)) openIntro(e);
                    setOpen(false);
                  }} className="mt-2 block text-navy/60">
                  {t}
                </a>
              ))}
            </div>
          ))}
          <Suspense fallback={null}>
            <UserMenu mobile onNavigate={() => setOpen(false)} />
          </Suspense>
        </nav>
      )}
    </header>
  );
}
