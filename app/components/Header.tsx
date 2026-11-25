"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const menus = [
  { label: "교회소개", href: "#about", sub: ["인사말", "비전", "섬기는 분들", "오시는 길"] },
  { label: "예배안내", href: "#worship", sub: ["예배시간", "주보"] },
  { label: "말씀", href: "#sermon", sub: ["주일설교", "수요설교", "특별집회"] },
  { label: "다음세대", href: "#next", sub: ["영아부", "유치부", "초등부", "청소년부", "청년부"] },
  { label: "교회소식", href: "#news", sub: ["공지사항", "교회앨범", "새가족"] },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-white/95 shadow-sm backdrop-blur text-navy" : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold font-serif text-lg font-bold text-white">
            多
          </span>
          <span className="font-serif text-xl font-bold tracking-tight">다산교회</span>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex gap-10">
            {menus.map((m) => (
              <li key={m.label} className="group relative py-6">
                <a href={m.href} className="font-medium hover:text-gold">
                  {m.label}
                </a>
                <ul className="invisible absolute left-1/2 top-full w-40 -translate-x-1/2 rounded-lg bg-white py-2 text-sm text-navy opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                  {m.sub.map((s) => (
                    <li key={s}>
                      <a href={m.href} className="block px-4 py-2 hover:bg-cream hover:text-gold">
                        {s}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#newcomer"
          className="hidden rounded-full bg-gold px-5 py-2 text-sm font-semibold text-white hover:brightness-110 lg:inline-block"
        >
          새가족 등록
        </a>

        <button aria-label="메뉴 열기" className="lg:hidden" onClick={() => setOpen(!open)}>
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l16 16M22 6L6 22" /> : <path d="M4 8h20M4 14h20M4 20h20" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t bg-white px-5 pb-6 text-navy lg:hidden">
          {menus.map((m) => (
            <div key={m.label} className="border-b py-3">
              <a href={m.href} onClick={() => setOpen(false)} className="font-semibold">
                {m.label}
              </a>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                {m.sub.map((s) => (
                  <a key={s} href={m.href} onClick={() => setOpen(false)}>
                    {s}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
