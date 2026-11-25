import Image from "next/image";
import Link from "next/link";

const cols = [
  ["교회소개", ["인사말", "섬기는 사람들", "교회시설", "오시는 길"]],
  ["말씀·찬양", ["예배안내", "주일설교", "다산칼럼", "로이 찬양단"]],
  ["다음세대·소식", ["유치부 · 유초등부", "중고등부 · 청년부", "주보", "다산앨범"]],
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <Image src="/dasan-emblem.png" alt="다산교회 · Dasan 1907 · 대한예수교장로회" width={120} height={137} />
          <p className="mt-4 text-sm leading-7 text-navy/60">
            담임목사 김준영
            <br />
            (40109) 경북 고령군 다산면 다산중앙길 19-14
            <br />
            Tel 054-956-0691 · Fax 054-955-2749
          </p>
        </div>
        {cols.map(([title, items]) => (
          <div key={title}>
            <p className="mb-4 font-semibold text-navy">{title}</p>
            <ul className="space-y-2 text-sm text-navy/60">
              {items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-navy/10 py-6 text-center text-xs text-navy/40">
        <p className="mb-2 space-x-4">
          <Link href="/terms" className="hover:text-navy">
            이용약관
          </Link>
          <Link href="/privacy" className="font-semibold text-navy/70 hover:text-navy">
            개인정보처리방침
          </Link>
        </p>
        © 2027 Dasan Church. All rights reserved.
      </div>
    </footer>
  );
}
