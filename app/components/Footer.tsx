import Image from "next/image";
import Link from "next/link";
import { YOUTUBE_CHANNEL_URL } from "@/lib/queries";

const info = [
  ["담임목사", "김준영"],
  ["주소", "(40109) 경북 고령군 다산면 다산중앙길 19-14"],
  ["전화", "054-956-0691"],
  ["팩스", "054-955-2749"],
] as const;

const btn = "rounded-full border border-white/25 px-5 py-2.5 text-sm text-white transition hover:border-white hover:bg-white hover:text-navy";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[auto_1fr_auto] md:gap-14">
        {/* 로고 */}
        <div className="mx-auto w-fit rounded-3xl bg-white px-6 py-5 md:mx-0">
          <Image src="/dasan-emblem.png" alt="다산교회 · Dasan 1907 · 대한예수교장로회" width={96} height={110} />
        </div>

        {/* 교회 정보 */}
        <div className="text-center md:text-left">
          <p className="text-2xl font-bold">다산교회</p>
          <p className="mt-1 text-sm text-white/50">Since 1907 · 대한예수교장로회</p>
          <dl className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {info.map(([k, v]) => (
              <div key={k} className={`flex justify-center gap-3 md:justify-start ${k === "주소" ? "sm:col-span-2" : ""}`}>
                <dt className="w-14 shrink-0 text-right text-gold md:text-left">{k}</dt>
                <dd className="text-white/80">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 바로가기 */}
        <div className="flex flex-wrap justify-center gap-2 md:flex-col">
          <a href="tel:054-956-0691" className={btn}>
            📞 전화하기
          </a>
          <a href="https://map.kakao.com/?q=경북 고령군 다산면 다산중앙길 19-14" target="_blank" rel="noreferrer" className={btn}>
            📍 길찾기
          </a>
          <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" className={btn}>
            ▶ 유튜브
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-white/40 sm:flex-row">
          <p>© 2027 Dasan Church. All rights reserved.</p>
          <p className="space-x-4">
            <Link href="/terms" className="hover:text-white">
              이용약관
            </Link>
            <Link href="/privacy" className="font-semibold text-white/70 hover:text-white">
              개인정보처리방침
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
