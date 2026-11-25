// Unsplash 무료 이미지 (상업적 이용 가능, 출처 표기 불필요 - unsplash.com/license)
const u = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export const IMG = {
  sanctuary: u("1519491050282-cf00c82424b4"), // 예배당 내부
  chapel: u("1548625149-fc4a29cf7092"), // 언덕 위 교회
  cross: u("1515162305285-0293e4767cc2"), // 하늘과 십자가 지붕
  bible: u("1445445290350-18a3b86e0b5a"), // 펼친 성경과 커피
  bibleRead: u("1504052434569-70ad5836ab65"), // 성경 읽는 손
  worship: u("1438232992991-995b7058bbb3"), // 찬양 예배
  praise: u("1478147427282-58a87a120781"), // 손 들고 찬양
  jesus: u("1507692049790-de58290a4334"), // JESUS
  band: u("1544427920-c49ccfb85579"), // 찬양팀 무대
  congregation: u("1529070538774-1843cb3265df"), // 성경 든 성도들
  kids: u("1542810634-71277d95dcbb"), // 아이들
  bibleDark: u("1499652848871-1527a310b13a"), // 성경
  toddler: u("1503454537195-1dcabb73ffb9", 900), // 유치부
  children: u("1544776193-352d25ca82cd", 900), // 유초등부
  teens: u("1529390079861-591de354faf5", 900), // 중고등부
  youth: u("1511632765486-a01980e01a18", 900), // 청년부
};
