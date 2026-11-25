"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import UserMenu from "./UserMenu";
import SnsBar from "./SnsBar";

const menus = [
  {
    label: "교회소개",
    href: "/#about",
    sub: [
      ["인사말", "담임목사님의 환영 인사"],
      ["비전", "우리가 꿈꾸는 교회"],
      ["섬기는 분들", "교역자와 직분자 소개"],
      ["오시는 길", "위치와 주차 안내"],
    ],
  },
  {
    label: "예배",
    href: "/#worship",
    sub: [
      ["예배시간", "주일·수요·새벽 예배"],
      ["주보", "이번 주 주보 보기"],
    ],
  },
  {
    label: "말씀",
    href: "/video",
    sub: [
      ["DASAN TV", "설교·찬양 영상 모아보기"],
      ["주일설교", "주일 예배 설교 영상"],
      ["수요설교", "수요 예배 말씀"],
    ],
  },
  {
    label: "다음세대",
    href: "/#next",
    sub: [
      ["교회학교", "영아부부터 청소년부까지"],
      ["청년부", "함께 성장하는 청년 공동체"],
    ],
  },
  {
    label: "소식",
    href: "/#news",
    sub: [
      ["공지사항", "교회의 새 소식"],
      ["게시판", "다산교회 이야기와 나눔"],
      ["교회앨범", "함께한 순간들"],
    ],
  },
];

const SUB_LINKS: Record<string, string> = { 교회앨범: "/album", 게시판: "/board", "DASAN TV": "/video" };

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
                <a href={m.href} className="block rounded-full px-4 py-2 text-[15px] font-medium text-navy hover:bg-cream">
                  {m.label}
                </a>
                <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                  <ul className="w-64 rounded-2xl border border-navy/5 bg-white p-2 shadow-xl">
                    {m.sub.map(([t, d]) => (
                      <li key={t}>
                        <a href={SUB_LINKS[t] ?? m.href} className="block rounded-xl px-4 py-3 hover:bg-cream">
                          <p className="font-semibold text-navy">{t}</p>
                          <p className="text-sm text-navy/50">{d}</p>
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
          <UserMenu />
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
              {m.sub.map(([t]) => (
                <a key={t} href={SUB_LINKS[t] ?? m.href} onClick={() => setOpen(false)} className="mt-2 block text-navy/60">
                  {t}
                </a>
              ))}
            </div>
          ))}
          <UserMenu mobile onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </header>
  );
}
