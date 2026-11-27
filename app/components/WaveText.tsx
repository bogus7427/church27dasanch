/** 글자마다 순서대로 위아래로 출렁이는 물결 글씨 (CSS 애니메이션 · 서버 렌더) */
export default function WaveText({ text, start = 0, step = 0.08, className = "" }: { text: string; start?: number; step?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i}> </span>
        ) : (
          <span key={i} aria-hidden className="wave-char" style={{ animationDelay: `${(start + i) * step}s` }}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
