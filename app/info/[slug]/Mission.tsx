import { Nanum_Brush_Script } from "next/font/google";
import type { SubPage } from "@/lib/sitePages";

const brush = Nanum_Brush_Script({ weight: "400", subsets: ["latin"], display: "swap" });

/** 선교(국내·해외): 표어+대표 사진 → 성구 → 소개 → 사역 묶음 카드 → 협력 교회 카드 → 사진 */
export default function Mission({ page }: { page: SubPage }) {
  const isVerse = page.lead?.startsWith("“");
  const [cover, ...photos] = page.images ?? [];
  const tones = ["bg-[#e7f3f8]", "bg-[#f1f4e4]", "bg-[#f8efe2]"];

  return (
    <div className="space-y-16">
      {/* 표어 + 대표 사진 */}
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold tracking-widest text-gold">{page.title === "해외선교" ? "OVERSEAS MISSION" : "DOMESTIC MISSION"}</p>
          <p className={`${brush.className} mt-3 text-5xl leading-tight text-[#a88a55] md:text-6xl`}>
            {isVerse ? "땅끝까지 복음을" : page.lead?.split(" · ").map((l) => <span key={l} className="block">{l}</span>)}
          </p>
        </div>
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={page.title} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl" />
        )}
      </div>

      {/* 성구 */}
      {isVerse && (
        <blockquote className="rounded-3xl bg-[#f1f4e4] px-8 py-10 text-center text-lg leading-9 text-navy md:text-xl">
          <p className="mb-3 text-sm font-bold tracking-widest text-gold">주제 성구</p>
          {page.lead}
        </blockquote>
      )}

      {/* 소개 */}
      {page.body && (
        <div className="space-y-4">
          {page.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      )}

      {/* 사역·기관 묶음 */}
      {page.groups?.map((g, gi) => {
        // "나라 – 내용 (연도 …)" 줄이 있으면 나라별 지원 현황 카드
        if (g.lines.some((l) => l.includes(" – "))) {
          const byCountry = new Map<string, { t: string; y?: string }[]>();
          for (const l of g.lines) {
            const [c, rest] = l.split(" – ");
            const m = rest?.match(/^(.*?)\s*\((\d{4}(?:\s*~\s*\d{0,4})?)\s*(.*?)\)$/);
            const list = byCountry.get(c) ?? [];
            if (rest) list.push(m ? { t: `${m[1]} ${m[3]}`.trim(), y: m[2] } : { t: rest });
            byCountry.set(c, list);
          }
          return (
            <section key={g.h}>
              <h2 className="mb-6 border-b-2 border-navy pb-3 text-2xl font-extrabold text-navy">{g.h}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {[...byCountry].map(([c, items]) => (
                  <div key={c} className="rounded-3xl border border-navy/10 bg-white p-7 shadow-[0_20px_40px_-25px_rgba(22,56,79,0.35)]">
                    <p className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-lg text-white">🌏</span>
                      <span className="text-2xl font-extrabold text-navy">{c}</span>
                    </p>
                    {items.length > 0 ? (
                      <ol className="mt-6 space-y-4 border-l-2 border-gold/40 pl-5">
                        {items.map((it) => (
                          <li key={it.t} className="relative">
                            <span className="absolute -left-[27px] top-2 h-3 w-3 rounded-full bg-gold" />
                            {it.y && <span className="mr-2 text-sm font-bold text-gold">{it.y}</span>}
                            <span className="text-navy">{it.t}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="mt-6 text-navy/60">선교사역을 위해 기도와 후원으로 함께하고 있습니다.</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        }
        // 사역·기관 목록: 번호 타일
        const many = g.lines.length > 6;
        return (
          <section key={g.h}>
            <h2 className="mb-6 border-b-2 border-navy pb-3 text-2xl font-extrabold text-navy">{g.h}</h2>
            <ul className={`grid gap-4 sm:grid-cols-2 ${many ? "lg:grid-cols-3" : "lg:grid-cols-5"}`}>
              {g.lines.map((l, i) => (
                <li
                  key={l}
                  className={`flex items-center gap-4 rounded-3xl px-5 py-5 text-navy ${tones[gi % tones.length]} ${
                    many ? "" : "lg:flex-col lg:justify-center lg:py-8 lg:text-center"
                  }`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sm font-extrabold text-gold shadow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-bold leading-6">{l}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {/* 협력 교회 */}
      {page.info && (
        <section>
          <h2 className="mb-6 border-b-2 border-navy pb-3 text-2xl font-extrabold text-navy">협력 교회</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {page.info.map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-cream/70 px-5 py-4">
                <dt className="font-bold text-navy">{k}</dt>
                <dd className="mt-1 text-sm text-navy/70">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* 사진 */}
      {photos.length > 0 && (
        <section>
          <h2 className="mb-6 border-b-2 border-navy pb-3 text-2xl font-extrabold text-navy">함께한 순간들</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {photos.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
