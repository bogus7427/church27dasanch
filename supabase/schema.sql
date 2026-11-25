-- 다산교회 메인 화면용 테이블
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run

create table if not exists worships (
  id bigint generated always as identity primary key,
  name text not null,
  time text not null,
  place text,
  sort_order int default 0
);

create table if not exists sermons (
  id bigint generated always as identity primary key,
  title text not null,
  verse text,
  preacher text,
  video_url text,
  preached_at date not null default current_date
);

create table if not exists news (
  id bigint generated always as identity primary key,
  tag text not null default '공지',
  title text not null,
  content text,
  created_at timestamptz not null default now()
);

-- 누구나 읽기만 가능 (쓰기는 대시보드/관리자만)
alter table worships enable row level security;
alter table sermons enable row level security;
alter table news enable row level security;

drop policy if exists "public read" on worships;
drop policy if exists "public read" on sermons;
drop policy if exists "public read" on news;
create policy "public read" on worships for select using (true);
create policy "public read" on sermons for select using (true);
create policy "public read" on news for select using (true);

-- 예시 데이터
insert into worships (name, time, place, sort_order) values
  ('주일 1부 예배', '오전 9:00', '본당', 1),
  ('주일 2부 예배', '오전 11:00', '본당', 2),
  ('주일 오후 예배', '오후 2:00', '본당', 3),
  ('수요 예배', '오후 7:30', '본당', 4),
  ('금요 기도회', '오후 9:00', '본당', 5),
  ('새벽 기도회', '오전 5:30 (월~토)', '소예배실', 6);

insert into sermons (title, verse, preached_at) values
  ('믿음으로 걷는 길', '히브리서 11:1-6', '2026-11-22'),
  ('감사의 능력', '데살로니가전서 5:16-18', '2026-11-15'),
  ('선한 목자', '요한복음 10:11-15', '2026-11-08');

insert into news (tag, title, created_at) values
  ('공지', '2027년 교회 표어 및 비전 선포', '2026-11-24'),
  ('행사', '추수감사절 연합예배 안내', '2026-11-20'),
  ('교육', '겨울 성경학교 교사 모집', '2026-11-18'),
  ('새가족', '11월 새가족 환영회', '2026-11-12');
