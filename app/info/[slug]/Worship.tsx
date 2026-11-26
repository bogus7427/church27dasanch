/** 예배안내: 구분별로 묶고 시간을 크게 보여줌 (기존 홈페이지 예배시간 안내) */
type Row = [name: string, day: string, time: string, place: string];

const GROUPS: { h: string; en: string; rows: Row[] }[] = [
  {
    h: "주일예배",
    en: "Sunday",
    rows: [
      ["주일 오전 1부 예배", "주일", "오전 9:00", "본당"],
      ["주일 오전 2부 예배", "주일", "오전 11:00", "본당"],
      ["주일 오후 예배", "주일", "오후 3:00", "본당"],
    ],
  },
  {
    h: "주중예배",
    en: "Weekday",
    rows: [
      ["새벽기도회", "매일", "오전 5:00", "본당"],
      ["중보기도모임", "화요일", "저녁 7:00", "유치부실"],
      ["수요예배", "수요일", "저녁 7:30", "본당"],
      ["금요기도회", "금요일", "저녁 9:00", "본당"],
    ],
  },
  {
    h: "교회학교",
    en: "Church School",
    rows: [
      ["유치부", "주일", "오전 9:00", "유치부실"],
      ["유초등부", "주일", "오전 9:00", "유초등부실"],
      ["중고등부", "주일", "오전 9:00", "교육관 1층"],
      ["청년부", "주일", "오후 2:00", "교육관 1층"],
    ],
  },
];

export default function Worship() {
  return (
    <div className="space-y-14">
      {GROUPS.map((g) => (
        <section key={g.h}>
          <div className="mb-5 flex items-baseline gap-3 border-b-2 border-navy pb-3">
            <h2 className="text-2xl font-extrabold text-navy">{g.h}</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-gold">{g.en}</span>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.rows.map(([name, day, time, place]) => (
              <li key={name} className="rounded-2xl border border-navy/10 bg-cream/60 p-6">
                <p className="font-bold text-navy">{name}</p>
                <p className="mt-3 text-sm text-navy/50">{day}</p>
                <p className="text-3xl font-extrabold leading-tight text-gold">{time}</p>
                <p className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-sm text-navy/70">📍 {place}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="text-center text-sm text-navy/50">문의 054-956-0691</p>
    </div>
  );
}
