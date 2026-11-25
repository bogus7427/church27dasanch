import { getChannelVideos, getHomeData, youtubeId, YOUTUBE_CHANNEL_URL } from "@/lib/queries";
import VideoCoverflow, { type CoverVideo } from "./components/VideoCoverflow";
import { IMG } from "@/lib/images";
import Image from "next/image";
import TypingText from "./components/TypingText";

const fmt = (d: string, full = true) => {
  const [y, m, day] = d.slice(0, 10).split("-");
  return full ? `${y}.${m}.${day}` : `${m}.${day}`;
};

function Empty({ text }: { text: string }) {
  return <p className="rounded-3xl bg-white py-12 text-center text-navy/40">{text}</p>;
}

function Heading({ title, desc, light }: { title: string; desc: string; light?: boolean }) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <h2 className={`text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl ${light ? "text-white" : "text-navy"}`}>{title}</h2>
      <p className={`mt-5 text-xl md:text-2xl ${light ? "text-white/70" : "text-navy/60"}`}>{desc}</p>
    </div>
  );
}

function Pill({ href, children, dark }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <a
      href={href}
      className={`btn inline-block rounded-full px-8 py-4 transition hover:-translate-y-0.5 ${
        dark ? "bg-navy text-white hover:bg-gold" : "bg-white text-navy hover:bg-cream"
      }`}
    >
      {children}
    </a>
  );
}

// 기존 홈페이지(dasanch.kr) 교회학교 안내
const nextGen = [
  { t: "유치부", time: "주일 오전 9:00 · 유치부실", motto: "예수님! 닮고 싶어요!", tone: "205,234,244", img: IMG.toddler },
  { t: "유초등부", time: "주일 오전 9:00 · 유초등부실", motto: "주의 뜻이 이루어지도록 해요!!", tone: "190,228,214", img: IMG.children },
  { t: "중고등부", time: "주일 오전 9:00 · 교육관 1층", motto: "좋은 열매를 맺는 바른생활 루틴이!", tone: "216,236,186", img: IMG.teens },
  { t: "청년부", time: "주일 오후 2:00", motto: "내가 여기 있나이다 나를 보내소서", tone: "176,214,132", img: IMG.youth },
];

export default async function Home() {
  const [{ worships, news }, channel] = await Promise.all([getHomeData(), getChannelVideos()]);
  const cover: CoverVideo[] = channel
    .slice(0, 9)
    .map((v) => ({ yt: youtubeId(v.video_url) ?? "", title: v.title, date: fmt(v.preached_at) }))
    .filter((v) => v.yt);

  return (
    <>
      {/* Hero: 가운데 정렬 큰 헤드라인 + 그라데이션 블롭 */}
      <section className="relative overflow-hidden px-5 pb-24 pt-28 text-center md:pt-36">
        <div className="blob absolute -left-20 top-10 h-80 w-80 rounded-full bg-[#9ec749]/45" />
        <div className="blob absolute -right-10 top-40 h-96 w-96 rounded-full bg-[#029dca]/30 [animation-delay:-6s]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-6 inline-block rounded-full bg-white/70 px-5 py-2 text-base font-medium text-navy/70">
            Since 1907 · 경북 고령군 다산면
          </p>
          <h1 className="text-[2.9rem] font-extrabold leading-[1.1] tracking-tight text-navy sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem]">
            하나님의 <span className="whitespace-nowrap">기쁨이 되는</span>
            <br />
            <span className="text-gold">행복한 다산교회</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl text-navy/60 md:text-2xl">
            “그들이 사도의 가르침을 받아 서로 교제하고 떡을 떼며 오로지 기도하기를 힘쓰니라”
            <span className="mt-2 block text-lg">사도행전 2:42</span>
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Pill href="#worship" dark>
              예배 시간 보기
            </Pill>
            <Pill href="#newcomer">처음 오셨나요?</Pill>
          </div>
        </div>

        {/* 히어로 아래 큰 비주얼 카드 */}
        <div className="relative mx-auto mt-20 grid max-w-6xl gap-4 md:grid-cols-3">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-cover bg-center md:col-span-2 md:aspect-auto"
            style={{ backgroundImage: `url(${IMG.sanctuary})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e2d]/55 to-transparent" />
            <p className="absolute bottom-7 left-7 text-left text-xl font-bold text-white md:text-2xl">
              주님의 전에서
              <br />
              함께 예배해요
            </p>
          </div>
          <div className="grid gap-4">
            <div
              className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[2rem] bg-navy bg-cover bg-center p-7 text-left text-white"
              style={{ backgroundImage: `linear-gradient(to top, rgba(22,56,79,.92), rgba(22,56,79,.2)), url(${IMG.bibleRead})` }}
            >
              <p className="text-sm text-white/60">이번 주 말씀</p>
              <p className="mt-1 text-xl font-bold">{cover[0]?.title ?? "주일 설교"}</p>
            </div>
            <div
              className="flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[2rem] bg-olive bg-cover bg-center p-7 text-left text-white"
              style={{ backgroundImage: `linear-gradient(to top, rgba(63,165,138,.95), rgba(63,165,138,.3)), url(${IMG.cross})` }}
            >
              <p className="text-sm text-white/70">주일 예배</p>
              <p className="mt-1 text-xl font-bold">{worships[0]?.time ?? "오전 11:00"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 px-5 py-28">
        <Heading title="어서 오세요" desc="우리는 오래전부터 당신이 오기만을 손꼽아 기다리고 있었습니다" />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            ["01", "바른 교회", "하나님의 말씀에 근거한 바른 교회의 모습을 보이도록 개혁하고 변화하는 교회입니다."],
            ["02", "빛을 발하는 교회", "예수님과 우리가 성령 안에 하나 되어 십자가의 능력으로 빛을 발하는 교회입니다."],
            ["03", "선교하는 교회", "자립이 어려운 농어촌·개척교회와 군선교, 이웃을 섬기는 기관을 협력 지원합니다."],
          ].map(([n, t, d]) => (
            <div key={t} className="rounded-[2rem] bg-white p-10 transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-sm font-bold text-gold">{n}</p>
              <h3 className="mt-6 text-2xl font-bold text-navy">{t}</h3>
              <p className="mt-3 leading-7 text-navy/60">{d}</p>
            </div>
          ))}
        </div>

        {/* 엠블럼과 핵심 비전 */}
        <div className="mx-auto mt-16 grid max-w-6xl items-center gap-10 rounded-[2rem] bg-white p-10 md:grid-cols-[220px_1fr] md:p-14">
          <Image src="/dasan-emblem.png" alt="다산교회 엠블럼" width={220} height={251} className="mx-auto w-40 md:w-full" />
          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-gold">EMBLEM</p>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-navy">다산교회의 핵심 비전</h3>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["복음 중심의 예배공동체", "십자가 모양"],
                ["말씀 중심의 훈련공동체", "성경책 펼친 모양"],
                ["기도 중심의 능력공동체", "날개 모양"],
                ["사랑 중심의 교제공동체", "원 모양"],
                ["소통 중심의 선교공동체", "지구 모양"],
              ].map(([t, s], i) => (
                <li key={t} className="flex items-baseline gap-3 border-b border-navy/10 pb-3">
                  <span className="text-sm font-bold text-gold">{i + 1}</span>
                  <span>
                    <span className="font-semibold text-navy">{t}</span>
                    <span className="ml-2 text-sm text-navy/40">({s})</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-6xl overflow-hidden rounded-[2rem] bg-cream md:grid-cols-2">
          <div className="min-h-72 bg-cover bg-center" style={{ backgroundImage: `url(${IMG.bible})` }} />
          <div className="p-10 text-center md:p-14 md:text-left">
          <p className="text-lg leading-9 text-navy/80 md:text-xl">
            예수님의 보혈이 죄와 허물로 죽었던 우리를 살리셨고 영원한 생명을 주셨습니다. 이제 예수님을 평생 우리들의 삶의
            주인으로 삼고, 어제보다 나은 오늘, 오늘보다 나은 내일을 살아가는 모든 분들이 되기를 바랍니다. 다산교회는
            여러분들의 신앙이 성숙될 수 있도록 최선을 다해 도와드리겠습니다.
          </p>
          <p className="mt-6 font-semibold text-navy">담임목사 김준영</p>
          </div>
        </div>
      </section>

      {/* Worship */}
      <section id="worship" className="scroll-mt-20 bg-white/55 px-5 py-28 backdrop-blur-sm">
        <Heading title="예배 안내" desc="언제든 편하게 오세요. 자리가 준비되어 있습니다." />
        <div className="mx-auto max-w-4xl">
          {worships.length === 0 && <Empty text="등록된 예배 정보가 없습니다." />}
          <ul className="divide-y divide-navy/10">
            {worships.map((w) => (
              // 예배이름 | 장소 | 시간 을 고정 폭 칸으로 나눠 앞글자를 세로로 맞춤
              <li
                key={w.id}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-6 sm:grid-cols-[1fr_6rem_15rem]"
              >
                <span className="text-xl font-bold text-navy">{w.name}</span>
                <span className="order-3 text-sm text-navy/40 sm:order-none">{w.place}</span>
                <span className="text-2xl font-extrabold text-gold">{w.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sermon: 유튜브 채널 커버플로우 */}
      <section
        id="sermon"
        className="relative scroll-mt-20 overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.85)_0%,rgba(230,243,241,.35)_70%)] px-5 py-28"
      >
        <Heading title="DASAN TV" desc="좌우로 넘겨 보고, 가운데 영상을 눌러 바로 시청하세요." />
        <VideoCoverflow videos={cover} channelUrl={YOUTUBE_CHANNEL_URL} />

        {/* 채널 보는 방법 */}
        <div className="mx-auto mt-24 max-w-5xl">
          <p className="text-center text-xs font-bold tracking-[0.4em] text-navy/40">HOW TO WATCH</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["#7fd0ea", "01", "여기서 바로 보기", "위 카드에서 가운데 영상을 누르면 홈페이지 안에서 바로 재생됩니다."],
              ["#c4e38f", "02", "채널 구독하기", "구독하면 새 설교와 생방송 알림을 가장 먼저 받을 수 있어요."],
              ["#8fd5bf", "03", "알림 🔔 설정", "구독 후 종 모양을 ‘전체’로 바꾸면 주일 실시간 예배 알림이 옵니다."],
            ].map(([bg, n, t, d]) => (
              <div key={n} className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-20px_rgba(22,56,79,0.25)]">
                <div className="px-6 pb-3 pt-5" style={{ background: bg }}>
                  <p className="text-xs font-bold text-black">({n})</p>
                  <p className="mt-1 text-2xl font-black tracking-tight text-black">{t}</p>
                </div>
                <p className="px-6 py-5 text-sm leading-6 text-navy/70">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <a
              href={`${YOUTUBE_CHANNEL_URL}?sub_confirmation=1`}
              target="_blank"
              rel="noreferrer"
              className="btn rounded-full bg-[#ff0000] px-8 py-4 text-white transition hover:-translate-y-0.5"
            >
              ● 유튜브 구독하기
            </a>
            <Pill href="/video" dark>
              영상 전체 보기
            </Pill>
          </div>
        </div>
      </section>

      {/* Next generation */}
      <section id="next" className="scroll-mt-20 bg-navy px-5 py-28">
        <Heading
          title="다음 세대"
          desc="형식적이고 지루한 예배가 아닌, 즐겁게 예배드리는 세대입니다."
          light
        />
        <div
          className="mx-auto mb-4 aspect-[21/9] max-w-6xl rounded-[1.5rem] bg-cover bg-center md:aspect-[3/1]"
          style={{ backgroundImage: `url(${IMG.kids})` }}
        />
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
          {nextGen.map(({ t, time, motto, tone, img }, i) => (
            <div
              key={t}
              className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[1.5rem] p-6 transition hover:-translate-y-1"
              style={{ background: `rgb(${tone})` }}
            >
              {/* 사진 + 위쪽은 어둡게(표어), 아래쪽은 카드 색으로(부서명) */}
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${img})` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, rgba(10,30,45,.6) 0%, rgba(10,30,45,0) 38%, rgba(${tone},0) 52%, rgba(${tone},.95) 80%, rgb(${tone}) 100%)`,
                }}
              />
              <p className="relative min-h-[3rem] text-base font-semibold leading-6 text-white drop-shadow">
                “<TypingText text={motto} delay={i * 700} />”
              </p>
              <div className="relative">
                <p className="text-xs text-navy/70">{time}</p>
                <p className="mt-1 text-2xl font-bold text-navy">{t}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-white/50">중보기도모임 · 화요일 저녁 7:00</p>
      </section>

      {/* News */}
      <section id="news" className="scroll-mt-20 px-5 py-28">
        <Heading title="교회 소식" desc="다산교회의 새로운 이야기" />
        <div className="mx-auto max-w-4xl">
          {news.length === 0 && <Empty text="등록된 소식이 없습니다." />}
          <ul className="space-y-3">
            {news.map((n) => (
              <li key={n.id}>
                <a href={`/news/${n.id}`} className="flex items-center gap-5 rounded-2xl bg-white px-6 py-5 transition hover:shadow-md">
                  <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-gold">{n.tag}</span>
                  <span className="flex-1 font-semibold text-navy">{n.title}</span>
                  <span className="text-sm text-navy/40">{fmt(n.created_at, false)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA + 오시는 길 */}
      <section className="px-5 pb-28">
        <div
          id="newcomer"
          className="relative mx-auto max-w-6xl scroll-mt-20 overflow-hidden rounded-[2.5rem] bg-gold bg-cover bg-center px-8 py-20 text-center text-white"
          style={{ backgroundImage: `linear-gradient(rgba(2,140,185,.66), rgba(22,56,79,.8)), url(${IMG.congregation})` }}
        >
          <div className="relative">
            <h2 className="text-5xl font-extrabold tracking-tight md:text-6xl">처음 오셨나요?</h2>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/85">
              다산교회와 성도들은 새가족분들을 언제나 환영합니다. 등록하셔서 함께 아름다운 믿음의 공동체를 이루어갑시다.
            </p>
            <div className="mt-10">
              <Pill href="/newcomer">새가족 등록하기</Pill>
            </div>
          </div>
        </div>

        <div id="location" className="mx-auto mt-6 grid max-w-6xl scroll-mt-20 gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-10">
            <h3 className="text-2xl font-bold text-navy">오시는 길</h3>
            <p className="mt-4 text-lg font-semibold text-navy">경북 고령군 다산면 다산중앙길 19-14</p>
            <p className="mt-1 text-navy/50">(우) 40109 · 다산교회</p>
            <div className="mt-6 space-y-1 text-navy/70">
              <p>
                전화{" "}
                <a href="tel:054-956-0691" className="font-semibold text-navy underline-offset-2 hover:underline">
                  054-956-0691
                </a>
              </p>
              <p>팩스 054-955-2749</p>
            </div>
            <a
              href="https://map.naver.com/p/search/경북 고령군 다산면 다산중앙길 19-14"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-gold"
            >
              네이버 지도로 길찾기 →
            </a>
          </div>
          {/* 지도 칸을 왼쪽 카드와 같은 높이로 (iframe 은 칸을 꽉 채움) */}
          <div className="relative min-h-72 overflow-hidden rounded-[2rem]">
            <iframe
              title="다산교회 위치"
              src="https://maps.google.com/maps?q=경북%20고령군%20다산면%20다산중앙길%2019-14&z=16&output=embed"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
