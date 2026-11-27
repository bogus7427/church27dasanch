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
      {page.groups?.map((g, gi) => (
        <section key={g.h}>
          <h2 className="mb-6 border-b-2 border-navy pb-3 text-2xl font-extrabold text-navy">{g.h}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.lines.map((l) => (
              <li key={l} className={`rounded-2xl px-5 py-4 text-navy ${tones[gi % tones.length]}`}>
                {l}
              </li>
            ))}
          </ul>
        </section>
      ))}

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
