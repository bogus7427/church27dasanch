/** 이용약관·개인정보처리방침 공통 레이아웃 */
export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { h: string; body: React.ReactNode }[];
}) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="text-5xl text-navy">{title}</h1>
      <p className="mt-3 text-sm text-navy/50">시행일: {updated}</p>
      <div className="mt-10 space-y-8 rounded-3xl bg-white p-8 leading-8 text-navy/80 md:p-12">
        {sections.map((s, i) => (
          <section key={s.h}>
            <h2 className="text-xl text-navy">
              제{i + 1}조 ({s.h})
            </h2>
            <div className="mt-2 space-y-2">{s.body}</div>
          </section>
        ))}
      </div>
    </article>
  );
}
