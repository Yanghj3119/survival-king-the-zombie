// 이동 중 이벤트
import { VEHICLE_TYPES, SUV_CRASH_FUEL_COST } from '../world';

export const TRAVEL_EVENTS = [
  {
    id: 'travel_car_drive',
    condition: (state) => state.travelState && state.travelState.vehicleId === 'car' && state.vehicle?.id === 'car' && VEHICLE_TYPES[state.vehicle.id]?.name === '🚗 SUV 자동차' && Math.random() < 0.5,
    text: "[이동 중 시나리오] 도로 중앙에 감염자 무리가 바글거립니다! 속도를 줄일 틈이 없습니다. 핸들을 강하게 쥐었습니다.",
    choices: [
      { text: "🚗 액셀을 밟아 그대로 들이받는다!", action: (inv, counters, trait, companions, vehicle) => {
          if (vehicle?.id === 'car' && vehicle.cap >= SUV_CRASH_FUEL_COST) {
            return { setVehicle: { ...vehicle, cap: Math.max(0, vehicle.cap - SUV_CRASH_FUEL_COST) }, log: `급가속으로 감염자 무리를 들이받고 돌파했습니다! 무리하게 달린 탓에 연료가 더 소모됩니다. (SUV 연료 -${SUV_CRASH_FUEL_COST})` };
          }
          return { stats: { health: -20 }, log: "연료가 부족해 가속이 붙지 않고 엔진이 덜컹거리며 멈췄습니다! 충돌 충격으로 부상을 입었지만 간신히 시동을 다시 걸어 빠져나왔습니다." };
      }},
      { text: "차량 속도를 줄이고 우회로를 찾는다.", action: () => {
          return { addTravelTime: 1, log: "골목길로 우회하여 경로를 변경했습니다. 이동 시간이 1시간 추가됩니다." };
      }}
    ]
  },
  {
    id: 'travel_zombie',
    condition: (state) => state.travelState && Math.random() < 0.5,
    text: "[이동 중 시나리오] 거리를 가로지르던 중 득실거리는 감염자 무리가 앞길을 막아섰습니다!",
    choices: [
      { text: "무기를 들고 강행 돌파한다.", action: (inv) => {
          const w = ['shotgun', 'pistol', 'machete', 'baton', 'bat', 'knife', 'crowbar'].find(item => inv.includes(item));
          const effects = {
            shotgun: { dmg: 0, log: "[CRITICAL!] 💥 샷건의 굉음과 함께 좀비의 머리가 터져 나갑니다!" },
            pistol: { dmg: 5, log: "[CRITICAL!] 🔫 날카로운 총성과 함께 좀비의 미간에 구멍이 뚫립니다!" },
            machete: { dmg: 10, log: "[CRITICAL!] 🗡️ 마체테가 번뜩이며 좀비의 팔다리가 숭텅 잘려 나갑니다!" },
            baton: { dmg: 12, log: "[CRITICAL!] 🚓 진압봉으로 좀비의 턱을 박살내며 뼈가 부러지는 소리가 울립니다!" },
            bat: { dmg: 15, log: "[CRITICAL!] 🏏 묵직한 파열음과 함께 좀비의 두개골이 산산조각 납니다!" },
            knife: { dmg: 15, log: "[CRITICAL!] 🔪 단검으로 좀비의 급소를 무자비하게 난도질합니다!" },
            crowbar: { dmg: 20, log: "[강제 돌파] 🛠️ 빠루로 좀비의 무릎을 강타해 쓰러뜨리고 길을 열었습니다!" }
          };
          const effect = effects[w] || { dmg: 30, log: "무기를 휘두르며 감염자들을 뚫고 돌파했습니다." };
          return { useWeapon: w, stats: { health: -effect.dmg, mental: -5 }, log: effect.log };
      }},
      { text: "먼 길로 우회로를 찾는다.", action: () => {
          return { stats: { hunger: -20 }, addTravelTime: 1, log: "먼 길로 우회했습니다. 포만감이 감소했습니다." };
      }},
      { text: "어둠 속에 숨죽여 무리가 지나가길 기다린다.", action: () => {
          return { stats: { mental: -15 }, addTravelTime: 2, log: "어둠 속에 숨죽여 감염자 무리가 지나가길 기다렸습니다. 이동 시간이 2시간 추가됩니다." };
      }}
    ]
  },
  {
    id: 'travel_special_zombie',
    condition: (state) => state.travelState && Math.random() < 0.4,
    text: "[이동 중 시나리오] 골목 어귀에서 괴이하게 변이된 대형 특수 좀비와 마주쳤습니다!",
    choices: [
      { text: "정면으로 맞서 싸운다 (리스크/하이리턴).", action: (inv) => {
          const w = ['shotgun', 'pistol', 'machete', 'baton', 'bat', 'knife', 'crowbar'].find(item => inv.includes(item));
          const effects = {
            shotgun: { health: -3, mental: 5, log: "💥 샷건으로 특수 좀비의 돌진을 정면에서 끊었습니다. 강한 충격에 반동을 입었지만 구급상자를 챙겼습니다." },
            pistol: { health: -8, mental: 3, log: "🔫 권총으로 관절의 약점을 맞혀 특수 좀비를 멈춰 세웠습니다. 반격을 피하며 구급상자를 확보했습니다." },
            machete: { health: -13, mental: 0, log: "🗡️ 마체테로 팔을 베어 움직임을 늦췄지만, 근접전에서 부상을 입고 구급상자를 챙겼습니다." },
            baton: { health: -11, mental: -2, log: "🚓 진압봉으로 돌진을 비껴내며 균형을 무너뜨렸습니다. 완전히 제압하진 못했지만 구급상자를 확보했습니다." },
            bat: { health: -17, mental: -4, log: "🏏 배트로 머리를 강타했지만 단단한 외피에 충격이 흡수됐습니다. 주춤한 틈에 구급상자를 챙겼습니다." },
            knife: { health: -10, mental: 2, log: "🔪 단검으로 눈과 목 아래의 약점을 노렸습니다. 위험한 근접전 끝에 구급상자를 확보했습니다." },
            crowbar: { health: -22, mental: -8, log: "🛠️ 빠루로 무릎을 강타해 돌진을 꺾었습니다. 큰 충격을 받았지만 구급상자를 챙길 틈을 얻었습니다." }
          };
          if (w) { const effect = effects[w]; return { useWeapon: w, stats: { health: effect.health, mental: effect.mental }, itemsGained: ['medkit'], log: effect.log }; }
          return { stats: { health: -40, mental: -20 }, log: "강력한 힘에 압도당해 큰 부상을 입고 도망쳤습니다." };
      }},
      { text: "식량을 미끼로 던지고 도망친다.", action: (inv) => {
          if(inv.includes('ration')) return { itemsLost: ['ration'], log: "전투식량으로 놈의 시선을 돌리고 안전하게 벗어났습니다." };
          return { stats: { health: -30 }, log: "미끼가 없어 도망치다 매섭게 공격당했습니다." };
      }},
      { text: "조용히 뒤로 물러나 다른 길을 찾는다.", action: () => {
          return { stats: { hunger: -15, mental: -5 }, addTravelTime: 1, log: "변이체의 눈을 피해 멀리 돌아갔습니다. 이동 시간이 1시간 추가됩니다." };
      }}
    ]
  },
  {
    id: 'travel_supply',
    condition: (state) => state.travelState && Math.random() < 0.5,
    text: "[이동 중 시나리오] 버려진 장갑차 옆에서 굳게 닫힌 보급상자를 발견했습니다.",
    choices: [
      { text: "힘으로 억지로 연다 (부상 위험).", action: () => {
          if(Math.random() < 0.5) return { stats: { health: -10 }, itemsGained: ['ration'], log: "철제 모서리에 손을 다쳤지만 식량을 얻었습니다." };
          return { itemsGained: ['medkit', 'ration'], log: "상자를 열어 유용한 물자를 챙겼습니다." };
      }},
      { text: "도구를 이용해 틈을 벌린다.", action: (inv) => {
          const w = inv.find(item => ['crowbar', 'machete', 'knife', 'bat'].includes(item));
          if(w) return { useWeapon: w, itemsGained: ['radio', 'ration'], log: "도구를 사용해 안전하게 열어 물자를 챙겼습니다." };
          return { log: "적절한 도구가 없어 흠집만 내고 발길을 돌렸습니다." };
      }},
      { text: "함정일지 모르니 무시하고 간다.", action: () => {
          return { stats: { mental: +5 }, log: "안전을 최우선으로 여겨 발걸음을 재촉했습니다." };
      }}
    ]
  }
];
