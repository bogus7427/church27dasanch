"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 모든 하위 페이지 오른쪽 아래에 고정된 "메인" 버튼. 새 창(팝업)이면 뒤의 메인 창으로 돌아가고 새 창은 닫음 */
export default function HomeButton() {
  const path = usePathname();
  if (path === "/") return null;

  function goHome(e: React.MouseEvent) {
    const opener = window.opener as Window | null;
    if (window.name === "dasanIntro" && opener && !opener.closed) {
      e.preventDefault();
      try {
        opener.location.href = "/";
        opener.focus();
      } catch {}
      window.close();
    }
  }

  return (
    <Link
      href="/"
      onClick={goHome}
      aria-label="메인으로"
      className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 flex-col items-center justify-center rounded-full bg-navy text-white shadow-[0_10px_30px_-8px_rgba(22,56,79,0.6)] transition hover:bg-gold"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="mt-0.5 text-[10px] font-bold">메인</span>
    </Link>
  );
}
