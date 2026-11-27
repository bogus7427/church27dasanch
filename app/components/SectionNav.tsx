import Link from "next/link";
import { SECTIONS, pageHref } from "@/lib/sitePages";

/** 하위 페이지 공통 상단: 메뉴 이름 배너 + 같은 메뉴의 탭 줄 (slug = 현재 페이지) */
export default function SectionNav({ slug }: { slug: string }) {
  const section = SECTIONS.find((s) => s.pages.some((p) => p.slug === slug));
  if (!section) return null;

  return (
    <>
      <div className="bg-navy px-5 py-16 text-center text-white md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">{section.en}</p>
        <p className="mt-3 text-4xl font-extrabold md:text-5xl">{section.label}</p>
      </div>

      {/* 같은 메뉴의 다른 페이지: 가운데 정렬 탭, | 구분 */}
      <nav className="overflow-x-auto border-b border-navy/10 bg-[#f1f4e4]">
        <ul className="mx-auto flex w-max items-center whitespace-nowrap px-5 py-4 text-[15px] font-bold lg:text-[17px]">
          {section.pages.map((p, i) => (
            <li key={p.slug} className="flex items-center">
              {i > 0 && <span className="mx-2.5 h-3.5 w-px bg-navy/30 lg:mx-4" />}
              <Link href={pageHref(p)} className={p.slug === slug ? "text-gold" : "text-navy hover:text-gold"}>
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
