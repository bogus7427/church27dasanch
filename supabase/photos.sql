-- 교회앨범 테이블 (SQL Editor 에서 한 번 실행)
create table if not exists photos (
  id bigint generated always as identity primary key,
  title text not null,
  album text not null default '교회행사',
  image_url text not null,
  description text,
  taken_at date not null default current_date,
  featured boolean not null default false  -- true 면 상단 와이드 사진으로 노출
);

alter table photos enable row level security;
drop policy if exists "public read" on photos;
create policy "public read" on photos for select using (true);

-- 예시 데이터 (Storage 에 올린 사진의 공개 URL 로 바꾸세요)
insert into photos (title, album, image_url, taken_at, featured) values
  ('추수감사 주일', '절기예배', 'https://picsum.photos/seed/dasan1/1920/830', '2026-11-15', true),
  ('성탄 칸타타', '절기예배', 'https://picsum.photos/seed/dasan2/1920/830', '2025-12-24', true),
  ('여름 수련회', '다음세대', 'https://picsum.photos/seed/dasan3/1200/800', '2026-07-28', false),
  ('청년부 봉사', '선교·봉사', 'https://picsum.photos/seed/dasan4/1200/800', '2026-06-10', false),
  ('새가족 환영회', '공동체', 'https://picsum.photos/seed/dasan5/1200/800', '2026-11-12', false),
  ('교회학교 소풍', '다음세대', 'https://picsum.photos/seed/dasan6/1200/800', '2026-05-05', false),
  ('부활절 연합예배', '절기예배', 'https://picsum.photos/seed/dasan7/1200/800', '2026-04-05', false),
  ('지역 나눔 바자회', '선교·봉사', 'https://picsum.photos/seed/dasan8/1200/800', '2026-10-03', false);
