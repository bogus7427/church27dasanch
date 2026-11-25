-- 예시 데이터가 중복으로 들어갔을 때 정리 (같은 내용은 먼저 들어간 1개만 남김)
-- 여러 번 실행해도 안전합니다.
delete from worships a using worships b where a.id > b.id and a.name = b.name and a.time = b.time;
delete from sermons  a using sermons  b where a.id > b.id and a.title = b.title and a.preached_at = b.preached_at;
delete from news     a using news     b where a.id > b.id and a.title = b.title;
delete from photos   a using photos   b where a.id > b.id and a.image_url = b.image_url;
