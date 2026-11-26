import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTIONS, findPage, pageHref } from "@/lib/sitePages";
import { HISTORY } from "@/lib/history";
import Greeting from "./Greeting";

export function generateStaticParams() {
  return SECTIONS.flatMap((s) => s.pages.filter((p) => !p.href).map((p) => ({ slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = findPage(slug);
  return { title: f ? `${f.page.title} | 다산교회` : "다산교회" };
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = findPage(slug);
  if (!f) notFound();
  const { section, page } = f;
  const empty = !page.body && !page.info && !page.groups && !page.history && !page.video && !page.people && !page.places;

  return (
    <div className="bg-white">
      {/* 상단 배너: 메뉴 이름 */}
      <div className="bg-navy px-5 py-16 text-center text-white md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">{section.en}</p>
        <p className="mt-3 text-4xl font-extrabold md:text-5xl">{section.label}</p>
      </div>

      {/* 같은 메뉴의 다른 페이지: 가운데 정렬 탭, | 구분 */}
      <nav className="border-b border-navy/10 bg-[#f1f4e4]">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-y-1 px-5 py-4 text-[15px] font-bold md:text-[17px]">
          {section.pages.map((p, i) => (
            <li key={p.slug} className="flex items-center">
              {i > 0 && <span className="mx-3 h-3.5 w-px bg-navy/30 md:mx-4" />}
              <Link
                href={pageHref(p)}
                className={p.slug === slug ? "text-gold" : "text-navy hover:text-gold"}
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-5xl px-5 py-16 md:py-24">
        {/* 페이지 제목 */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-extrabold text-navy md:text-5xl">{page.title}</h1>
          <span className="mx-auto mt-5 block h-1 w-10 bg-gold" />
          <p className="mt-4 text-sm text-navy/40">
            홈 &gt; {section.label} &gt; {page.title}
          </p>
        </div>

        <section className="leading-8 text-navy/80 md:text-[17px]">
          {slug === "greeting" ? (
            <Greeting />
          ) : page.kind === "board" ? (
            <>
              <div className="grid grid-cols-[60px_1fr_100px] border-y-2 border-navy py-3 text-center text-sm font-bold text-navy">
                <span>번호</span>
                <span>제목</span>
                <span>날짜</span>
              </div>
              <p className="py-16 text-center text-navy/40">등록된 게시물이 없습니다.</p>
            </>
          ) : (
            <>
              {page.lead && <p className="mb-10 text-center text-2xl font-bold text-gold md:text-3xl">{page.lead}</p>}
              {page.video && (
                <div className="aspect-video overflow-hidden rounded-2xl">
                  <iframe
                    title={page.title}
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${page.video}?rel=0`}
                    allowFullScreen
                  />
                </div>
              )}
              {slug === "greeting" || slug === "logo" ? (
                <div className="mb-8 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={page.images![0]} alt={page.title} className="max-h-80 w-auto" />
                </div>
              ) : null}
              {page.body?.map((t) => (
                <p key={t} className="mb-4">
                  {t}
                </p>
              ))}
              {page.history && (
                <ol className="space-y-4 border-l-2 border-gold/40 pl-6">
                  {HISTORY.map(([d, t], i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[31px] top-2.5 h-2.5 w-2.5 rounded-full bg-gold" />
                      <p className="font-bold text-navy">{d}</p>
                      <p className="whitespace-pre-line">{t}</p>
                    </li>
                  ))}
                </ol>
              )}
              {page.people && (
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {page.people.map((p) => (
                    <figure key={p.img} className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img} alt={p.name ?? p.role} loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover" />
                      <figcaption className="mt-3">
                        <p className="text-sm text-gold">{p.role}</p>
                        {p.name && <p className="font-bold text-navy">{p.name}</p>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
              {page.places?.map(([floor, rooms]) => (
                <div key={floor} className="mb-14">
                  <h2 className="mb-6 border-b-2 border-navy pb-3 text-2xl font-extrabold text-navy">{floor}</h2>
                  <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
                    {rooms.flatMap(([name, nums]) =>
                      nums.map((n, i) => (
                        <figure key={n}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/info/facility-${n}.jpg`}
                            alt={name}
                            loading="lazy"
                            className="aspect-[3/2] w-full rounded-xl object-cover"
                          />
                          <figcaption className="mt-3 font-bold text-navy">
                            {name}
                            {nums.length > 1 && <span className="ml-1 font-normal text-navy/40">{i + 1}</span>}
                          </figcaption>
                        </figure>
                      )),
                    )}
                  </div>
                </div>
              ))}
              {page.groups && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {page.groups.map((g) => (
                    <div key={g.h} className="rounded-2xl bg-cream p-5">
                      <p className="mb-2 font-bold text-navy">{g.h}</p>
                      <ul className="text-[15px] leading-7">
                        {g.lines.map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {page.info && (
                <dl className="divide-y divide-navy/10">
                  {page.info.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[120px_1fr] py-3">
                      <dt className="font-bold text-navy">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {page.images && slug !== "greeting" && slug !== "logo" && (
                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {page.images.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" loading="lazy" className="aspect-[3/2] w-full rounded-xl object-cover" />
                  ))}
                </div>
              )}
              {page.map && (
                <iframe
                  title="지도"
                  className="mt-6 h-80 w-full rounded-2xl"
                  src="https://maps.google.com/maps?q=경북%20고령군%20다산면%20다산중앙길%2019-14&z=16&output=embed"
                />
              )}
              {empty && <p className="py-16 text-center text-navy/40">내용 준비 중입니다.</p>}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
