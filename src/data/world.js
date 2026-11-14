// 장소 · 지도 좌표 · 도로망 · 이동수단

export const LOCATIONS = [
  { id: 'street', name: '도심 거리', desc: '위험성이 적당하며 생존자를 마주칠 확률이 있습니다.', distance: 0 },
  { id: 'police_station', name: '관할 경찰서', desc: '총기 및 탄약, 경찰용 장비를 수색할 수 있지만 감염된 경찰관들이 배회합니다.', distance: 3 },
  { id: 'gas_station', name: '주유소', desc: '기름과 차 부품을 구하기 용이하지만 유독가스와 화재 위험이 있습니다.', distance: 2 },
  { id: 'fire_station', name: '소방서', desc: '소방 호스와 잔해로 탐색이 느리지만 구급약, 식수, 차량용 배터리를 드물게 찾을 수 있습니다.', distance: 4 },
  { id: 'hospital', name: '병원', desc: '의약품을 찾기 용이하지만 감염자 위험이 큽니다.', distance: 3 },
  { id: 'mart', name: '대형 마트', desc: '식량이 풍부하지만 약탈자와의 분쟁이 잦습니다.', distance: 2 },
  { id: 'military', name: '군부대 진지', desc: '강력한 무기를 얻을 수 있으나 무장한 군인 감염자가 출몰합니다.', distance: 5 },
  { id: 'subway', name: '지하철역', desc: '어둡고 밀폐된 지하 공간으로 탐색 위험이 높습니다.', distance: 4 },
  { id: 'highway', name: '외곽 고속도로', desc: '버려진 자동차가 길을 막고 있지만 멀리 이동하기 적합합니다.', distance: 6 },
  { id: 'school', name: '초등학교', desc: '보건실과 급식실에서 생존 물품을 찾을 수 있습니다.', distance: 3 },
  { id: 'broadcasting', name: '방송국', desc: '통신 장비 및 고가치가 있는 소모품을 수색할 수 있습니다.', distance: 4 },
  { id: 'port', name: '항구 물류창고', desc: '컨테이너 속 유용한 대량의 보급품이 잠들어 있습니다.', distance: 7 },
  { id: 'laboratory', name: '질병통제연구소', desc: '백신 연구가 진행되었던 시설입니다. 생물재해 위험이 있습니다.', distance: 8 },
  { id: 'airport', name: '국제 공항', desc: '광활한 활주로와 버려진 항공기들이 있는 곳. 특별한 탈출 수단을 찾을 수 있을지도 모릅니다.', distance: 12 },
  { id: 'controlled_area', name: '군사 통제구역', desc: '정부군이 방어선을 구축한 안전지대입니다. 최후의 보루입니다.', distance: 10 },
  { id: 'apartment', name: '아파트', desc: '가족의 흔적과 생활 물자를 찾을 수 있습니다. 초등학교를 경유하는 연결 지점이며 초등학교까지 이동 1시간.', distance: 1 },
  { id: 'playground', name: '놀이터', desc: '아이들의 흔적이 남은 놀이터입니다. 초등학교를 경유하는 연결 지점이며 초등학교까지 이동 1시간.', distance: 1 }
];

// 목적지 지도 좌표(퍼센트). 기존 위치 ID/거리 및 이동 로직은 그대로 사용한다.
export const MAP_POSITIONS = {
  street: { x: 50, y: 50, icon: '🏙️' },
  police_station: { x: 34, y: 32, icon: '🚓' },
  gas_station: { x: 66, y: 43, icon: '⛽' },
  fire_station: { x: 66, y: 54, icon: '🚒' },
  hospital: { x: 27, y: 57, icon: '🏥' },
  mart: { x: 62, y: 64, icon: '🛒' },
  military: { x: 81, y: 29, icon: '🪖' },
  subway: { x: 43, y: 70, icon: '🚇' },
  highway: { x: 16, y: 22, icon: '🛣️' },
  school: { x: 37, y: 21, icon: '🏫' },
  broadcasting: { x: 56, y: 24, icon: '📡' },
  port: { x: 85, y: 65, icon: '⚓' },
  laboratory: { x: 74, y: 81, icon: '🧪' },
  airport: { x: 89, y: 15, icon: '✈️' },
  controlled_area: { x: 13, y: 78, icon: '🛡️' },
  // 신규 가족 장소는 기존 도시 지도 위쪽에만 추가한다.
  // 아파트/놀이터는 초등학교에만 직접 연결되며, 다른 목적지는 학교 경유 경로를 사용한다.
  apartment: { x: 32, y: 7, icon: '🏢' },
  playground: { x: 57, y: 7, icon: '🛝' }
};

// 단일 도로망 데이터: 지도 도로, 최단거리, 이동시간 및 차량 자원 계산이 모두 이 데이터를 사용한다.
// distance는 게임 내 도로 거리 단위이며, 양방향 도로로 취급한다.
export const ROAD_EDGES = [
  ['street','police_station',3], ['street','gas_station',3], ['street','hospital',3],
  ['street','mart',3], ['street','subway',3], ['gas_station','fire_station',3], ['fire_station','mart',3], ['police_station','school',2],
  ['school','broadcasting',2], ['broadcasting','military',4], ['broadcasting','airport',5],
  ['police_station','highway',3], ['highway','controlled_area',5],
  ['hospital','controlled_area',4], ['hospital','subway',3], ['subway','mart',2],
  ['mart','port',4], ['mart','laboratory',4], ['port','laboratory',3],
  ['gas_station','military',4], ['military','airport',3], ['highway','school',3],
  ['broadcasting','gas_station',3], ['laboratory','controlled_area',5],
  // 아파트와 놀이터는 초등학교에만 연결한다. 다른 모든 장소로 갈 때도 반드시 초등학교를 경유한다.
  ['school','apartment',1], ['school','playground',1]
];

export const getRoadRoute = (fromId, toId) => {
  if (fromId === toId) return { distance: 0, path: [fromId] };
  const distances = Object.fromEntries(LOCATIONS.map(l => [l.id, Infinity]));
  const previous = {};
  const unvisited = new Set(LOCATIONS.map(l => l.id));
  distances[fromId] = 0;
  while (unvisited.size) {
    let current = null;
    for (const id of unvisited) if (current === null || distances[id] < distances[current]) current = id;
    if (current === null || !Number.isFinite(distances[current])) break;
    if (current === toId) break;
    unvisited.delete(current);
    for (const [a,b,w] of ROAD_EDGES) {
      const next = a === current ? b : b === current ? a : null;
      if (next && unvisited.has(next) && distances[current] + w < distances[next]) {
        distances[next] = distances[current] + w; previous[next] = current;
      }
    }
  }
  if (!Number.isFinite(distances[toId])) return { distance: Infinity, path: [] };
  const path = []; let cursor = toId;
  while (cursor) { path.unshift(cursor); if (cursor === fromId) break; cursor = previous[cursor]; }
  return { distance: distances[toId], path };
};

export const RESPAWN_LOCATIONS = [
  { id: 'alley', name: '피빛 골목길', log: "피와 악취가 진동하는 골목길 구석에서 정신을 차렸습니다." },
  { id: 'subway_tunnel', name: '지하철 선로 통로', log: "어두컴컴한 지하철 선로 한복판에서 눈을 떴습니다." },
  { id: 'highway', name: '버려진 고속도로', log: "뒤얽힌 고속도로 차 안에서 깨어났습니다." }
];

export const VEHICLE_TYPES = {
  bicycle: { name: '🚲 자전거', speedMult: 0.5, type: 'stamina', costPerDist: 4, desc: '기름이 필요 없지만 허기와 체력을 추가 소모합니다.' },
  kickboard: { name: '🛴 전동 킥보드', speedMult: 0.4, type: 'battery', maxCap: 100, costPerDist: 8, desc: '빠르고 조용하지만 배터리가 소모됩니다.' },
  motorcycle: { name: '🏍️ 오토바이', speedMult: 0.3, type: 'fuel', maxCap: 100, costPerDist: 7, desc: '기능이 뛰어나며 기름을 사용합니다.' },
  car: { name: '🚗 SUV 자동차', speedMult: 0.25, type: 'fuel', maxCap: 100, costPerDist: 5, desc: '안전하고 대량 파밍 가능. 연료 효율이 개선되었습니다.' }
};
