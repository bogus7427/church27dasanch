const worships = [
  { name: "주일 1부 예배", time: "오전 9:00", place: "본당" },
  { name: "주일 2부 예배", time: "오전 11:00", place: "본당" },
  { name: "주일 오후 예배", time: "오후 2:00", place: "본당" },
  { name: "수요 예배", time: "오후 7:30", place: "본당" },
  { name: "금요 기도회", time: "오후 9:00", place: "본당" },
  { name: "새벽 기도회", time: "오전 5:30 (월~토)", place: "소예배실" },
];

const sermons = [
  { title: "믿음으로 걷는 길", verse: "히브리서 11:1-6", date: "2026.11.22" },
  { title: "감사의 능력", verse: "데살로니가전서 5:16-18", date: "2026.11.15" },
  { title: "선한 목자", verse: "요한복음 10:11-15", date: "2026.11.08" },
];

const news = [
  { tag: "공지", title: "2027년 교회 표어 및 비전 선포", date: "11.24" },
  { tag: "행사", title: "추수감사절 연합예배 안내", date: "11.20" },
  { tag: "교육", title: "겨울 성경학교 교사 모집", date: "11.18" },
  { tag: "새가족", title: "11월 새가족 환영회", date: "11.12" },
];

const nextGen = ["영아부", "유치부", "초등부", "청소년부", "청년부"];

function SectionTitle({ en, ko }: { en: string; ko: string }) {
  return (
    <div className="mb-10 text-center">
      <p className="text-sm font-semibold tracking-[0.3em] text-gold">{en}</p>
      <h2 className="mt-2 font-serif text-3xl font-bold text-navy md:text-4xl">{ko}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-navy text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#c49a4a55,transparent_50%),radial-gradient(circle_at_80%_80%,#3b5a8a,transparent_55%)]" />
        <div className="relative px-5">
          <p className="tracking-[0.4em] text-gold">WELCOME TO DASAN CHURCH</p>
          <h1 className="mt-6 font-serif text-4xl font-bold leading-tight md:text-6xl">
            말씀으로 세워지고
            <br />
            사랑으로 하나 되는 교회
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-white/75">
            “너희는 먼저 그의 나라와 그의 의를 구하라” — 마태복음 6:33
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#worship" className="rounded-full bg-gold px-7 py-3 font-semibold hover:brightness-110">
              예배 안내
            </a>
            <a href="#sermon" className="rounded-full border border-white/60 px-7 py-3 font-semibold hover:bg-white hover:text-navy">
              설교 보기
            </a>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="relative z-10 mx-auto -mt-14 grid max-w-6xl grid-cols-2 gap-3 px-5 md:grid-cols-4">
        {[
          ["🙏", "새가족 안내", "#newcomer"],
          ["📖", "이번 주 주보", "#news"],
          ["▶", "온라인 예배", "#sermon"],
          ["📍", "오시는 길", "#location"],
        ].map(([icon, label, href]) => (
          <a key={label} href={href} className="rounded-2xl bg-white p-6 text-center shadow-lg transition hover:-translate-y-1">
            <div className="text-3xl">{icon}</div>
            <p className="mt-3 font-semibold text-navy">{label}</p>
          </a>
        ))}
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-cream to-gold/40" />
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-gold">ABOUT US</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-navy md:text-4xl">담임목사 인사말</h2>
            <p className="mt-6 leading-8 text-gray-600">
              다산교회 홈페이지를 찾아주신 여러분을 주님의 이름으로 환영합니다. 우리 교회는 하나님의 말씀 위에 바로 서서,
              예배가 살아있고 다음 세대를 세우며 지역을 섬기는 교회가 되기를 소망합니다. 이곳에서 참된 쉼과 은혜를 누리시길 축복합니다.
            </p>
            <p className="mt-6 font-serif text-lg text-navy">담임목사 ○○○</p>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {["예배 공동체", "양육 공동체", "선교 공동체"].map((v) => (
                <div key={v} className="rounded-xl bg-cream py-4 text-sm font-semibold text-navy">
                  {v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Worship */}
      <section id="worship" className="scroll-mt-20 bg-cream py-24">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle en="WORSHIP" ko="예배 안내" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {worships.map((w) => (
              <div key={w.name} className="rounded-2xl border border-gold/20 bg-white p-6">
                <p className="text-lg font-bold text-navy">{w.name}</p>
                <p className="mt-2 text-2xl font-semibold text-gold">{w.time}</p>
                <p className="mt-1 text-sm text-gray-500">{w.place}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sermon */}
      <section id="sermon" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
        <SectionTitle en="SERMON" ko="최근 설교" />
        <div className="grid gap-6 md:grid-cols-3">
          {sermons.map((s, i) => (
            <article key={s.title} className="group overflow-hidden rounded-2xl bg-white shadow-md">
              <div className={`relative grid aspect-video place-items-center ${i === 0 ? "bg-navy" : "bg-navy/80"}`}>
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-navy transition group-hover:scale-110">
                  ▶
                </span>
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-400">{s.date}</p>
                <h3 className="mt-1 text-lg font-bold text-navy">{s.title}</h3>
                <p className="text-sm text-gold">{s.verse}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Next generation */}
      <section id="next" className="scroll-mt-20 bg-navy py-24 text-white">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <p className="text-sm font-semibold tracking-[0.3em] text-gold">NEXT GENERATION</p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">다음 세대를 세우는 교회</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {nextGen.map((g) => (
              <span key={g} className="rounded-full border border-white/30 px-6 py-3 hover:border-gold hover:text-gold">
                {g}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
        <SectionTitle en="NEWS" ko="교회 소식" />
        <ul className="divide-y rounded-2xl bg-white shadow-sm">
          {news.map((n) => (
            <li key={n.title} className="flex items-center gap-4 px-6 py-5 hover:bg-cream/60">
              <span className="w-16 shrink-0 rounded-full bg-gold/15 py-1 text-center text-xs font-semibold text-gold">
                {n.tag}
              </span>
              <span className="flex-1 font-medium text-navy">{n.title}</span>
              <span className="text-sm text-gray-400">{n.date}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Newcomer + Location */}
      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-24 md:grid-cols-2">
        <div id="newcomer" className="scroll-mt-20 rounded-3xl bg-gold p-10 text-white">
          <h3 className="font-serif text-2xl font-bold">처음 오셨나요?</h3>
          <p className="mt-4 leading-7 text-white/90">
            다산교회에 오신 것을 환영합니다. 예배 후 새가족실에서 안내를 도와드립니다.
          </p>
          <button className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-gold">새가족 등록하기</button>
        </div>
        <div id="location" className="scroll-mt-20 rounded-3xl bg-cream p-10">
          <h3 className="font-serif text-2xl font-bold text-navy">오시는 길</h3>
          <p className="mt-4 text-gray-600">(교회 주소 입력)</p>
          <div className="mt-6 grid aspect-video place-items-center rounded-xl bg-white text-sm text-gray-400">
            지도 영역 (카카오/네이버 지도 연동)
          </div>
        </div>
      </section>
    </>
  );
}
