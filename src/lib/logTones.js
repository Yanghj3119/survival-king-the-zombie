// 생존 일지 로그 분류와 색상 톤
// 로그 종류별 색상 분류: 이동은 파랑, 아이템 사용/상태 변화는 주황, 동료 관련은 갈색.
export const getLogCategory = (log) => {
  const text = String(log?.text || '');
  if (/\[이동 시작\]|\[목적지 도착\]|목적지를 설정했습니다|목적지 설정 완료|이동 예약|이동 불가/.test(text)) return 'travel';
  if (/동료|충성도|호감도|영입|합류|배신|군견|길고양이|지헌|박상사|김박사|제민|서연|박상사|나비|제로/.test(text)) return 'companion';
  if (/아이템 사용|자동 사용|사용했습니다|사용!|섭취|먹었습니다|마셨습니다|주유|충전|회복량|건강 \+|정신력 \+|포만감 \+|위생 \+|상태 변화|구급상자|전투식량|에너지바|영양바|물티슈|비누|에너지바|캔커피|휘발유 캔|배터리 팩/.test(text)) return 'item';
  return log?.type === 'event' ? 'event' : 'normal';
};
export const LOG_TONES = {
  travel: { text: 'text-[#58758f]', border: 'border-[#2b455a]', bg: 'bg-[#101b25]', glow: 'rgba(43,69,90,0.12)', label: '이동 기록' },
  item: { text: 'text-[#a88a6b]', border: 'border-[#5b4938]', bg: 'bg-[#1d1915]', glow: 'rgba(91,73,56,0.08)', label: '아이템 · 상태 변화' },
  companion: { text: 'text-[#a58b75]', border: 'border-[#554437]', bg: 'bg-[#1b1714]', glow: 'rgba(85,68,55,0.08)', label: '동료 기록' },
  event: { text: 'text-[#d84b4b]', border: 'border-[#d84b4b]', bg: 'bg-[#231717]', glow: 'rgba(216,75,75,0.15)', label: '운명의 갈림길' },
  normal: { text: 'text-[#c7b8b8]', border: 'border-[#49302b]', bg: 'bg-[#171010]', glow: 'rgba(0,0,0,0)' }
};
