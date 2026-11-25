import { Suspense } from "react";
import Detail from "./Detail";

// 주소의 글 번호(useParams)를 읽는 부분은 Suspense 안에서 (빌드 시 미리 만들 수 없는 부분)
export default function Page() {
  return (
    <Suspense fallback={<p className="py-40 text-center text-navy/40">불러오는 중…</p>}>
      <Detail />
    </Suspense>
  );
}
