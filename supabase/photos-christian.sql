-- 교회앨범 예시 사진을 기독교 이미지(Unsplash 무료)로 교체
-- SQL Editor 에서 한 번 실행
truncate photos restart identity;

insert into photos (title, album, image_url, taken_at, featured) values
  ('주님의 전에서', '예배', 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=1920&q=75&auto=format&fit=crop', '2026-11-22', true),
  ('찬양으로 올려드리는 예배', '예배', 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=75&auto=format&fit=crop', '2026-11-15', true),
  ('말씀 묵상', '말씀', 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5a?w=1200&q=75&auto=format&fit=crop', '2026-11-12', false),
  ('손 들고 찬양', '찬양', 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&q=75&auto=format&fit=crop', '2026-11-08', false),
  ('함께 읽는 성경', '공동체', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=75&auto=format&fit=crop', '2026-11-01', false),
  ('다음세대 예배', '다음세대', 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&q=75&auto=format&fit=crop', '2026-10-25', false),
  ('로이 찬양단', '찬양', 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=1200&q=75&auto=format&fit=crop', '2026-10-18', false),
  ('JESUS', '찬양', 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=75&auto=format&fit=crop', '2026-10-11', false),
  ('하늘을 향한 십자가', '교회', 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=1200&q=75&auto=format&fit=crop', '2026-10-04', false),
  ('언덕 위의 교회', '교회', 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=1200&q=75&auto=format&fit=crop', '2026-09-27', false),
  ('말씀 앞에서', '말씀', 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=75&auto=format&fit=crop', '2026-09-20', false),
  ('펼쳐진 성경', '말씀', 'https://images.unsplash.com/photo-1499652848871-1527a310b13a?w=1200&q=75&auto=format&fit=crop', '2026-09-13', false);
