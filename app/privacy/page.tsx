import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = { title: "개인정보처리방침 | 다산교회" };

const Table = ({ rows }: { rows: string[][] }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[520px] text-left text-sm">
      <thead className="border-b border-navy/15 text-navy">
        <tr>
          {rows[0].map((h) => (
            <th key={h} className="py-2 pr-4 font-normal">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(1).map((r) => (
          <tr key={r[0]} className="border-b border-navy/5 align-top">
            {r.map((c, i) => (
              <td key={i} className="py-2 pr-4">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function PrivacyPage() {
  return (
    <LegalPage
      title="개인정보처리방침"
      updated="2026년 12월 1일"
      sections={[
        {
          h: "총칙",
          body: <p>다산교회(이하 “교회”)는 「개인정보 보호법」에 따라 이용자의 개인정보를 보호하고, 관련 고충을 신속하게 처리하기 위해 이 방침을 둡니다.</p>,
        },
        {
          h: "수집하는 개인정보와 목적",
          body: (
            <Table
              rows={[
                ["구분", "수집 항목", "목적"],
                ["회원가입(필수)", "이메일, 비밀번호(암호화) 또는 구글 계정 정보", "회원 식별, 로그인, 댓글 작성"],
                ["프로필(선택)", "이름, 성별, 전화번호, 주소", "교회 소식 안내, 심방·연락"],
                ["새가족 등록", "이름(필수), 성별·전화번호·주소(선택)", "새가족 안내와 연락"],
                ["자동 수집", "접속 기록, 로그인 시각", "서비스 안정성 확보, 부정 이용 방지"],
              ]}
            />
          ),
        },
        {
          h: "보유 및 이용 기간",
          body: (
            <>
              <p>회원 정보는 탈퇴 시까지, 새가족 등록 정보는 등록 후 2년 또는 삭제 요청 시까지 보관하며, 기간이 지나면 지체 없이 파기합니다.</p>
              <p>단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</p>
            </>
          ),
        },
        {
          h: "제3자 제공",
          body: <p>교회는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 따라 요구되는 경우는 예외로 합니다.</p>,
        },
        {
          h: "처리 위탁",
          body: (
            <Table
              rows={[
                ["수탁자", "위탁 업무"],
                ["Supabase Inc.", "회원 인증, 데이터 저장(서버 위치: 서울 리전)"],
                ["Google LLC", "구글 계정 로그인, 유튜브 영상 재생"],
              ]}
            />
          ),
        },
        {
          h: "정보주체의 권리",
          body: (
            <p>
              이용자는 언제든지 자신의 개인정보를 조회·수정·삭제하거나 처리 정지를 요구할 수 있습니다. 프로필은 사이트의 ‘내 프로필’에서 직접 수정할 수 있고, 그 밖의 요청은 아래 연락처로 하시면 지체 없이 처리합니다.
            </p>
          ),
        },
        {
          h: "안전성 확보 조치",
          body: (
            <ul className="list-disc pl-5">
              <li>비밀번호 암호화 저장, 전송 구간 암호화(HTTPS)</li>
              <li>데이터베이스 행 단위 접근 제어: 회원 본인과 관리자만 개인정보 열람</li>
              <li>관리자 권한 최소화와 접근 기록 관리</li>
            </ul>
          ),
        },
        {
          h: "쿠키",
          body: <p>사이트는 로그인 상태 유지를 위해 브라우저 저장소를 사용합니다. 브라우저 설정에서 삭제할 수 있으나, 이 경우 로그인이 해제됩니다.</p>,
        },
        {
          h: "개인정보 보호책임자",
          body: (
            <p>
              책임자: 다산교회 사무국 · 전화 054-956-0691 · 주소 (40109) 경북 고령군 다산면 다산중앙길 19-14
              <br />
              개인정보 침해 신고: 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118)
            </p>
          ),
        },
      ]}
    />
  );
}
