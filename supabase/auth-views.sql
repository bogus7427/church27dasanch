-- ════════════════════════════════════════════════════════════════
-- 로그인 관련 내부 표를 Table Editor 의 public 목록에서 보이게 하는 "보기 전용" 뷰
--   user         ← auth.users           (회원 계정)
--   account      ← auth.identities      (로그인 방식: google / email)
--   session      ← auth.sessions        (로그인 세션)
--   verification ← auth.one_time_tokens (이메일 인증·비밀번호 재설정 토큰)
--
-- · 원본은 Supabase 가 자동 관리하므로 여기서는 "보기"만 합니다 (수정은 원본/Authentication 메뉴에서).
-- · 비밀번호 해시, 토큰 값 같은 민감한 칸은 빼고 보여줍니다.
-- · 홈페이지(anon/로그인 사용자)에서는 읽을 수 없도록 잠급니다 → 대시보드에서만 보임.
-- SQL Editor 에서 실행 (여러 번 실행해도 안전)
-- ════════════════════════════════════════════════════════════════

create or replace view public."user" as
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name') as name,
  u.raw_user_meta_data ->> 'avatar_url' as image,
  u.email_confirmed_at is not null as email_verified,
  u.raw_app_meta_data ->> 'provider' as provider,
  u.created_at,
  u.updated_at,
  u.last_sign_in_at
from auth.users u;

create or replace view public.account as
select
  i.id,
  i.user_id,
  i.provider,
  i.provider_id as account_id,
  i.email,
  i.created_at,
  i.updated_at,
  i.last_sign_in_at
from auth.identities i;

create or replace view public.session as
select
  s.id,
  s.user_id,
  s.created_at,
  s.updated_at,
  s.not_after as expires_at
from auth.sessions s;

create or replace view public.verification as
select
  t.id,
  t.user_id,
  t.token_type::text as type,
  t.relates_to as identifier,
  t.created_at,
  t.updated_at
from auth.one_time_tokens t;

-- 홈페이지 API 로는 아무도 못 읽게 잠금 (대시보드·SQL Editor 에서만 조회)
revoke all on public."user", public.account, public.session, public.verification from anon, authenticated, public;

comment on view public."user" is '보기 전용: auth.users (로그인 회원)';
comment on view public.account is '보기 전용: auth.identities (로그인 방식)';
comment on view public.session is '보기 전용: auth.sessions (로그인 세션)';
comment on view public.verification is '보기 전용: auth.one_time_tokens (인증 토큰)';
