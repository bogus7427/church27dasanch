export default function Footer() {
  return (
    <footer className="bg-navy text-white/70">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-bold text-white">다산교회</p>
          <p className="mt-3 text-sm leading-relaxed">하나님을 사랑하고 이웃을 섬기는 공동체</p>
        </div>
        <div className="text-sm leading-7">
          <p className="mb-2 font-semibold text-white">연락처</p>
          <p>주소: (교회 주소 입력)</p>
          <p>전화: 000-000-0000</p>
          <p>이메일: info@dasanch.kr</p>
        </div>
        <div className="text-sm leading-7">
          <p className="mb-2 font-semibold text-white">바로가기</p>
          <p>유튜브 · 온라인헌금 · 주보 다운로드</p>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs">
        © 2027 Dasan Church. All rights reserved.
      </p>
    </footer>
  );
}
