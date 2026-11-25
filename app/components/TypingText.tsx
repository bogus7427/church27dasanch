"use client";

import { useEffect, useRef, useState } from "react";

/** 화면에 보이면 한 글자씩 타이핑. 다 쓰면 잠시 멈췄다가 지우고 다시 반복 */
export default function TypingText({
  text,
  speed = 90,
  delay = 0,
  hold = 2600,
  className = "",
}: {
  text: string;
  speed?: number;
  delay?: number;
  hold?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [n, setN] = useState(0);
  const [erasing, setErasing] = useState(false);
  const chars = Array.from(text); // 한글 조합 문자 안전하게 분리

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let t: ReturnType<typeof setTimeout>;
    if (!erasing && n < chars.length) t = setTimeout(() => setN(n + 1), n === 0 ? delay + speed : speed);
    else if (!erasing) t = setTimeout(() => setErasing(true), hold);
    else if (n > 0) t = setTimeout(() => setN(n - 1), speed / 2.5);
    else t = setTimeout(() => setErasing(false), 500);
    return () => clearTimeout(t);
  }, [visible, n, erasing, chars.length, speed, delay, hold]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{chars.slice(0, n).join("")}</span>
      <span aria-hidden className="ml-0.5 inline-block w-[2px] animate-pulse bg-current align-[-0.15em]" style={{ height: "1.1em" }} />
    </span>
  );
}
