import { Nanum_Brush_Script } from "next/font/google";
import type { SubPage } from "@/lib/sitePages";

const brush = Nanum_Brush_Script({ weight: "400", subsets: ["latin"], display: "swap" });

/** 다음세대(유치부·유초등부·중고등부·청년부): 표어+대표 사진 → 성구 → 소개 → 섬기는 분들 → 사진 모음 */
export default function NextGen({ page }: { page: SubPage }) {
  const [worship, ...staff] = page.info ?? [];
  const verse = page.body?.find((t) => t.startsWith("“"));
  const intro = page.body?.filter((t) => t !== verse) ?? [];
  const [cover, ...photos] = page.images ?? [];

  return (
    <div className="space-y-16">
      {/* 표어 + 대표 사진 */}
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold tracking-widest text-gold">주제 표어</p>
          <p className={`${brush.className} mt-3 text-5xl leading-tight text-[#a88a55] md:text-6xl`}>{page.lead}</p>
          {worship && (
            <p className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full bg-cream px-5 py-2 text-navy">
              <span className="font-bold">{worship[0]}</span>
              <span className="text-navy/70">{worship[1]}</span>
            </p>
          )}
        </div>
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={page.title} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl" />
        )}
      </div>

      {/* 주제 성구 */}
      {verse && (
        <blockquote className="rounded-3xl bg-[#f1f4e4] px-8 py-10 text-center text-lg leading-9 text-navy md:text-xl">
          <p className="mb-3 text-sm font-bold tracking-widest text-gold">주제 성구</p>
          {verse}
        </blockquote>
      )}

      {/* 소개 */}
      {intro.length > 0 && (
        <div className="space-y-4">
          {intro.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      )}

      {/* 섬기는 분들 */}
      {staff.length > 0 && (
        <section>
          <h2 className="mb-6 border-b-2 border-navy pb-3 text-2xl font-extrabold text-navy">섬기는 분들</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {staff.map(([k, v]) => (
              <div key={k} className={`rounded-2xl bg-cream/70 px-5 py-4 ${v.length > 30 ? "sm:col-span-2" : ""}`}>
                <dt className="text-sm font-bold text-gold">{k}</dt>
                <dd className="mt-1 text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* 사진 모음 */}
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
