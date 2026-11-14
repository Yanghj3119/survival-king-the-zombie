// 좀비 습격 · 변이 조우
import { WEAPONS } from '../config';

export const COMBAT_EVENTS = [
  {
    id: 'sudden_ambush_no_choice',
    condition: (state) => state.currentLocation !== 'controlled_area' && Math.random() < 0.08,
    text: "[기습 피해] 어둠 속에서 소리 없이 접근한 감염자에게 갑작스러운 기습을 당했습니다! 피하거나 방어할 선택지조차 없습니다!",
    choices: [
      {
        text: "[피해를 감수한다]",
        action: (inv, counters, trait, companions) => {
          const cIds = companions.map(c => c.id);
          const hasWildBeasts = cIds.includes('military_dog') && cIds.includes('stray_cat');
          if (hasWildBeasts) {
            return { stats: { health: -5, mental: -5 }, log: "🐾 [시너지: 야생의 동반자] 야생 동반자들이 기습을 미리 눈치채고 경고하여 피해를 크게 줄였습니다!" };
          }
          return { stats: { health: -30, mental: -20 }, log: "무방비 상태로 끔찍한 기습을 당해 치명적인 피해를 입었습니다!" };
        }
      }
    ]
  },
  {
    id: 'zombie_horde_attack',
    condition: (state) => state.currentLocation !== 'controlled_area',
    text: "[습격] 시간이 지나며 더 수적으로 증가한 좀비 무리가 갑자기 들이닥쳤습니다!",
    choices: [
      {
        text: "무기를 휘두르며 맞서 싸운다.",
        action: (inv) => {
          const chosenWeapon = inv.find(w => WEAPONS.includes(w));
          // 무기별 전투 역할: 샷건=광역 제압, 권총=안전한 약점 사격, 마체테=절단,
          // 배트=기절 유도, 진압봉=방어, 단검=정밀 타격, 빠루=비상 탈출용 방어.
          if (chosenWeapon === 'shotgun') return { useWeapon: 'shotgun', stats: { health: 0, mental: +12 }, log: "[광역 제압] 💥 샷건의 근거리 폭발음이 울리며 앞을 막던 좀비들이 한꺼번에 쓰러집니다. 반격을 허용하지 않았습니다." };
          if (chosenWeapon === 'pistol') return { useWeapon: 'pistol', stats: { health: -2, mental: +8 }, log: "[약점 사격] 🔫 거리를 유지하며 머리를 정확히 겨냥했습니다. 한 발로 길을 열었지만 탄약과 내구도를 소모했습니다." };
          if (chosenWeapon === 'machete') return { useWeapon: 'machete', stats: { health: -5, mental: +2 }, log: "[절단] 🗡️ 마체테로 앞선 좀비의 팔과 무릎을 베어 무리를 늦추고 틈새로 빠져나왔습니다." };
          if (chosenWeapon === 'bat') return { useWeapon: 'bat', stats: { health: -7, mental: +3 }, log: "[기절 유도] 🏏 배트로 선두 좀비의 머리를 강타해 잠시 움직임을 멈췄습니다. 그 틈에 포위망을 벗어났습니다." };
          if (chosenWeapon === 'baton') return { useWeapon: 'baton', stats: { health: -4, mental: 0 }, log: "[방어 자세] 🚓 진압봉으로 물어뜯는 팔을 쳐내며 공격을 흘렸습니다. 큰 피해는 피했지만 무리를 완전히 제압하진 못했습니다." };
          if (chosenWeapon === 'knife') return { useWeapon: 'knife', stats: { health: -10, mental: +1 }, log: "[정밀 타격] 🔪 단검으로 가까이 다가온 좀비의 눈과 목을 노렸습니다. 빠르게 빠져나왔지만 근접전의 위험은 컸습니다." };
          if (chosenWeapon === 'crowbar') return { useWeapon: 'crowbar', stats: { health: -12, mental: -3 }, log: "[비상 탈출] 🛠️ 빠루로 좀비를 밀쳐내고 머리를 가격해 겨우 포위망을 벗어났습니다. 무겁지만 방어에 도움이 됐습니다." };
          // 무기 연계는 개별 무기 시나리오를 무한히 늘리지 않고 무기군 단위로 처리한다.
          const meleeWeapon = inv.find(w => ['machete', 'knife'].includes(w));
          const bluntWeapon = inv.find(w => ['bat', 'baton', 'crowbar'].includes(w));
          const firearm = inv.find(w => ['shotgun', 'pistol'].includes(w));
          if (firearm) return { useWeapon: firearm, stats: { health: -6, mental: +5 }, log: "[총기류 연계] 🔫 총기로 위협을 제압하고 거리를 확보했습니다. 강한 제압력이 있지만 총성과 내구도 소모가 뒤따릅니다." };
          if (meleeWeapon) return { useWeapon: meleeWeapon, stats: { health: -9, mental: +2 }, log: "[근접 무기 연계] 🗡️ 날붙이로 선두 감염자를 공격해 길을 열었습니다. 효과적이지만 근접전의 위험이 남습니다." };
          if (bluntWeapon) return { useWeapon: bluntWeapon, stats: { health: -11, mental: 0 }, log: "[둔기류 연계] 🛠️ 둔기로 감염자를 밀어내며 포위망을 벗어났습니다. 제압은 가능했지만 반격을 받았습니다." };
          return { stats: { health: -25, mental: -15 }, log: "맨손으로 싸우다 호되게 물리고 다쳤습니다." };
        }
      },
      {
        text: "재빨리 주변 장애물 뒤로 숨는다.",
        action: () => {
          if (Math.random() < 0.4) return { stats: { mental: -10 }, log: "숨을 죽이고 긴 기다림 끝에 좀비들을 보냈습니다." };
          return { stats: { health: -20, mental: -20 }, log: "발각되어 기습당했습니다!" };
        }
      }
    ]
  },
  {
    id: 'special_zombie_ambush',
    condition: (state) => !state.travelState && state.currentLocation !== 'controlled_area' && Math.floor(state.counters.totalHours / 24) >= 1,
    text: "[특수 좀비 출몰] 시간이 흐를수록 더욱 거세진 괴이하게 변이된 대형 특수 좀비가 포효하며 돌진해옵니다!",
    choices: [
      {
        text: "무기로 약점을 공략한다.",
        action: (inv) => {
          const chosenWeapon = inv.find(w => WEAPONS.includes(w));
          if (chosenWeapon === 'shotgun') return { useWeapon: 'shotgun', stats: { health: -2, mental: +12 }, itemsGained: ['medkit'], log: "[중화력 제압] 💥 샷건을 근거리에서 발사해 특수 좀비의 돌진을 멈췄습니다. 강력한 한 방이 통했지만 총성이 주변을 뒤흔듭니다." };
          if (chosenWeapon === 'pistol') return { useWeapon: 'pistol', stats: { health: -8, mental: +5 }, itemsGained: ['medkit'], log: "[약점 사격] 🔫 관절 사이의 약점을 노려 움직임을 늦췄습니다. 정확한 사격은 통했지만 완전히 제압하기 전까지 반격을 피할 수 없었습니다." };
          if (chosenWeapon === 'machete') return { useWeapon: 'machete', stats: { health: -12, mental: -2 }, itemsGained: ['medkit'], log: "[절단 공격] 🗡️ 마체테로 돌진하는 특수 좀비의 팔을 깊게 베었습니다. 움직임은 둔해졌지만 가까이 붙은 대가로 부상을 입었습니다." };
          if (chosenWeapon === 'knife') return { useWeapon: 'knife', stats: { health: -9, mental: +3 }, itemsGained: ['medkit'], log: "[정밀 약점 공략] 🔪 단검을 눈과 목 아래의 약점에 찔러 넣고 간신히 거리를 벌렸습니다. 정밀했지만 위험한 근접전이었습니다." };
          if (chosenWeapon === 'bat') return { useWeapon: 'bat', stats: { health: -16, mental: -5 }, itemsGained: ['medkit'], log: "[충격 타격] 🏏 배트로 머리를 강타했지만 단단한 외피에 충격이 흡수됐습니다. 잠깐 주춤한 틈에 탈출했습니다." };
          if (chosenWeapon === 'baton') return { useWeapon: 'baton', stats: { health: -11, mental: -3 }, itemsGained: ['medkit'], log: "[방어·유도] 🚓 진압봉으로 돌진을 비껴내며 균형을 무너뜨렸습니다. 방어에는 성공했지만 특수 좀비를 쓰러뜨리진 못했습니다." };
          if (chosenWeapon === 'crowbar') return { useWeapon: 'crowbar', stats: { health: -20, mental: -8 }, itemsGained: ['medkit'], log: "[최후의 저항] 🛠️ 빠루를 방패처럼 세워 돌진을 막고 머리를 가격했습니다. 큰 충격을 버티며 탈출했지만 심한 부상을 입었습니다." };
          return { stats: { health: -35, mental: -20 }, log: "강력한 힘에 밀려 심각한 타격을 입었습니다." };
        }
      },
      {
        text: "소지품이나 식량을 던져 시선을 분산시키고 도망친다.",
        action: (inv) => {
          if (inv.includes('ration')) return { itemsLost: ['ration'], log: "전투식량을 던져 놈이 멈칫한 틈에 무사히 도망쳤습니다." };
          return { stats: { health: -30, mental: -15 }, log: "던질 만한 물건이 없어 도망치다 매섭게 공격당했습니다." };
        }
      }
    ]
  },
  {
    id: 'strength_mutant_ambush',
    condition: (state) => !state.travelState && state.currentLocation !== 'controlled_area' && Math.floor(state.counters.totalHours / 24) >= 1,
    text: "[변이 좀비: 완력 강화형] 거대한 근육이 비정상적으로 부푼 좀비가 차량 잔해를 내던지며 길을 막습니다. 정면 충돌은 위험합니다!",
    choices: [
      { text: "총기로 관절과 머리를 집중 사격한다.", action: (inv) => {
        const weapon = inv.find(w => ['shotgun','pistol'].includes(w));
        if (weapon === 'shotgun') return { useWeapon: 'shotgun', stats: { health: -2, mental: 5 }, log: "[완력형 대응] 💥 샷건의 강한 일격으로 돌진을 멈췄습니다. 큰 소음이 주변을 끌어들일 수 있습니다." };
        if (weapon === 'pistol') return { useWeapon: 'pistol', stats: { health: -8, mental: 2 }, log: "[완력형 대응] 🔫 관절을 노려 움직임을 늦췄지만, 쓰러뜨리기 전까지 반격을 받았습니다." };
        return { stats: { health: -22, mental: -8 }, log: "총기가 없어 완력형 좀비의 돌진을 막지 못했습니다. 크게 다친 채 도망쳤습니다." };
      } },
      { text: "빠루나 진압봉으로 돌진을 흘리고 우회한다.", action: (inv) => {
        if (inv.includes('baton')) return { useWeapon: 'baton', stats: { health: -6, mental: 1 }, log: "[방어 우회] 🚓 진압봉으로 공격을 비껴내고 잔해 사이로 빠져나왔습니다." };
        if (inv.includes('crowbar')) return { useWeapon: 'crowbar', stats: { health: -10, mental: 0 }, log: "[완력형 우회] 🛠️ 빠루로 잔해를 들어 올려 탈출 틈을 만들었습니다. 도구가 크게 흔들렸습니다." };
        return { stats: { health: -16, mental: -5 }, log: "버틸 도구가 없어 잔해를 피해 달아나다 부상을 입었습니다." };
      } }
    ]
  },
  {
    id: 'speed_mutant_ambush',
    condition: (state) => !state.travelState && state.currentLocation !== 'controlled_area' && Math.floor(state.counters.totalHours / 24) >= 1,
    text: "[변이 좀비: 속도 강화형] 낮게 웅크린 변이체가 지그재그로 달려듭니다. 조준이 어렵고 근접 거리를 허용하면 위험합니다!",
    choices: [
      { text: "샷건으로 접근을 차단한다.", action: (inv) => {
        if (inv.includes('shotgun')) return { useWeapon: 'shotgun', stats: { health: 0, mental: 4 }, log: "[속도형 제압] 💥 샷건의 넓은 탄착으로 돌진을 끊었습니다. 총성과 함께 내구도를 소모했습니다." };
        if (inv.includes('pistol')) return { useWeapon: 'pistol', stats: { health: -5, mental: 2 }, log: "[속도형 약점 사격] 🔫 빠르게 움직이는 표적을 맞혔지만 완전히 멈추지는 못했습니다." };
        return { stats: { health: -20, mental: -8 }, log: "빠른 변이체를 조준하지 못해 물리고 말았습니다." };
      } },
      { text: "마체테로 접근 경로를 막거나 장애물 뒤로 피한다.", action: (inv) => {
        if (inv.includes('machete')) return { useWeapon: 'machete', stats: { health: -7, mental: 1 }, log: "[속도형 차단] 🗡️ 마체테로 접근 경로를 막아 속도를 늦추고 빠져나왔습니다." };
        if (inv.includes('bat')) return { useWeapon: 'bat', stats: { health: -10, mental: 0 }, log: "[충격 타격] 🏏 배트가 스치듯 명중해 잠시 균형을 무너뜨렸지만, 반격을 피하지 못했습니다." };
        return { stats: { health: -14, mental: -6 }, log: "속도형 변이체를 따돌리지 못해 부상을 입었습니다." };
      } }
    ]
  }
];
