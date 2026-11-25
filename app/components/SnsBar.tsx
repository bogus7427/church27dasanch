"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/** SNS 아이콘 (주소는 관리자 > SNS 설정에서 바꿈. 비어 있으면 그 아이콘은 숨김) */
const ICONS: Record<string, { label: string; bg: string; svg: React.ReactNode }> = {
  sns_youtube: {
    label: "유튜브",
    bg: "#FF0000",
    svg: <path fill="#fff" d="M10 8.6v6.8l5.8-3.4z" />,
  },
  sns_instagram: {
    label: "인스타그램",
    bg: "linear-gradient(45deg,#f9ce34,#ee2a7b 55%,#6228d7)",
    svg: (
      <g fill="none" stroke="#fff" strokeWidth="1.8">
        <rect x="6" y="6" width="12" height="12" rx="3.6" />
        <circle cx="12" cy="12" r="2.9" />
        <circle cx="15.6" cy="8.4" r=".6" fill="#fff" stroke="none" />
      </g>
    ),
  },
  sns_threads: {
    label: "쓰레드",
    bg: "#000",
    svg: (
      <path
        fill="#fff"
        d="M15.1 11.5c-.1 0-.1-.1-.2-.1-.1-2-1.2-3.1-3-3.1-1.1 0-2 .5-2.6 1.3l1 .7c.4-.6 1-.8 1.6-.8.6 0 1.1.2 1.4.6.2.3.3.6.4 1-.5-.1-1.1-.1-1.7-.1-1.7.1-2.8 1.1-2.7 2.5 0 .7.4 1.3 1 1.7.5.3 1.2.5 1.9.5.9 0 1.6-.4 2.1-1 .4-.5.6-1.1.7-1.9.4.2.7.6.9 1 .3.7.3 1.8-.6 2.7-.8.8-1.8 1.2-3.2 1.2-1.6 0-2.8-.5-3.6-1.5-.8-.9-1.1-2.3-1.2-4 0-1.7.4-3.1 1.2-4 .8-1 2-1.5 3.6-1.5s2.8.5 3.7 1.5c.4.5.7 1.1.9 1.8l1.2-.3c-.2-.9-.6-1.7-1.2-2.4C16.4 4.8 14.8 4.2 12.8 4.2c-2 0-3.6.7-4.6 2-1 1.2-1.5 2.8-1.5 4.8 0 2 .5 3.6 1.5 4.8 1 1.3 2.6 2 4.6 2 1.8 0 3-.5 4.1-1.5 1.4-1.4 1.3-3.1.9-4.1-.3-.7-.9-1.3-1.7-1.7zm-3 2.8c-.7 0-1.4-.3-1.5-1 0-.5.4-1.1 1.6-1.2h.4c.4 0 .9 0 1.3.1-.1 1.6-.9 2.1-1.8 2.1z"
      />
    ),
  },
  sns_kakao: {
    label: "카카오채널",
    bg: "#FEE500",
    svg: (
      <path
        fill="#3A1D1D"
        d="M12 6c-3.9 0-7 2.4-7 5.4 0 1.9 1.3 3.6 3.2 4.6l-.7 2.6c-.1.2.2.4.4.3l3-2c.4 0 .7.1 1.1.1 3.9 0 7-2.4 7-5.4S15.9 6 12 6z"
      />
    ),
  },
};

export default function SnsBar({ className = "" }: { className?: string }) {
  const [links, setLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key,value")
      .like("key", "sns_%")
      .then(({ data }) => {
        if (data) setLinks(Object.fromEntries(data.map((r) => [r.key, r.value ?? ""])));
      });
  }, []);

  const items = Object.entries(ICONS).filter(([k]) => links[k]);
  if (items.length === 0) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {items.map(([k, ic]) => (
        <a
          key={k}
          href={links[k]}
          target="_blank"
          rel="noreferrer"
          aria-label={`다산교회 ${ic.label}`}
          title={ic.label}
          className="grid h-8 w-8 place-items-center rounded-full shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          style={{ background: ic.bg }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            {ic.svg}
          </svg>
        </a>
      ))}
    </div>
  );
}
