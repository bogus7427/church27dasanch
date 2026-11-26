import { Nanum_Brush_Script, Nanum_Pen_Script } from "next/font/google";

const brush = Nanum_Brush_Script({ weight: "400", subsets: ["latin"], display: "swap" });
const pen = Nanum_Pen_Script({ weight: "400", subsets: ["latin"], display: "swap" });

/** 인사말: 왼쪽 글 · 오른쪽 목사님 사진 + 서명 (기존 홈페이지 인사말 느낌) */
export default function Greeting() {
  return (
    <div className="grid items-end gap-10 md:grid-cols-[1fr_300px]">
      <div>
        <p className={`${pen.className} text-6xl leading-none text-[#4a9bb5]`}>Welcome</p>
        <p className={`${brush.className} mt-4 text-4xl leading-snug text-[#a88a55] md:text-5xl`}>
          홈페이지를 방문한 여러분들을
          <br />
          주님의 이름으로 환영합니다!
        </p>

        <p className="mt-8 text-xl font-semibold text-navy">
          ‘하나님의 기쁨이 되는 행복한 다산교회’
          <br />
          홈페이지를 방문해 주셔서 감사합니다.
        </p>

        <div className="mt-6 space-y-6 text-navy/70">
          <p>
            예수님의 보혈이 죄와 허물로 죽었던 우리를 살리셨고
            <br />
            영원한 생명을 주셨습니다.
          </p>
          <p>
            이제 예수님을 평생 우리들의 삶의 주인으로 삼고
            <br />
            어제보다 나은 오늘, 오늘보다 나은 내일을 살아가는
            <br />
            모든 분들이 되기를 바랍니다.
          </p>
          <p>
            다산교회는 여러분들의 신앙이 성숙될 수 있도록
            <br />
            최선을 다해 도와드리겠습니다.
          </p>
          <p className="text-[#4a9bb5]">
            사랑하는 성도들과 홈페이지를 방문한 여러분들!
            <br />
            이 공간이 믿음 안에서 살아가는 우리 모두의 아름다운 이야기로
            <br />
            가득찼으면 좋겠습니다.
            <br />
            주님 안에서 여러분들을 사랑하고, 진심으로 축복합니다.
          </p>
        </div>
      </div>

      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/info/greeting.png"
          alt="김준영 담임목사"
          className="mx-auto w-64 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
        />
        <p className="mt-6 text-navy/60">여러분의 목사</p>
        <p className={`${pen.className} text-6xl leading-tight text-[#1d2fd8]`}>김준영</p>
      </div>
    </div>
  );
}
