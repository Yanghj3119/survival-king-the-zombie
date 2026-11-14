// 생존 상태 · 날씨 · 돌발 상황
import { WEAPONS } from '../config';

export const SURVIVAL_EVENTS = [
  {
    id: 'water_outage',
    condition: (state) => state.counters.totalHours >= 24 && !state.flags.water_outage,
    text: "[단수 발생] 수돗물이 완전히 끊겼습니다. 변기 수조의 물이라도 마셔야 할지 갈등됩니다.",
    choices: [
      {
        text: "눈 딱 감고 마신다.",
        action: () => ({ stats: { health: -15, hunger: +40, mental: -15, hygiene: -20 }, flags: { water_outage: true }, log: "비위가 상하지만 갈증은 해소되었습니다." })
      },
      {
        text: "마실 것을 이용해 안전하게 갈증을 해소한다.",
        action: (inv) => {
          if (inv.includes('drinking_water')) return { itemsLost: ['drinking_water'], stats: { hunger: +50, mental: +10 }, flags: { water_outage: true }, log: '보관해 둔 식수를 마셔 안전하게 갈증을 해소했습니다.' };
          if (inv.includes('soju') || inv.includes('lighter')) {
            return { itemsLost: inv.includes('soju') ? ['soju'] : [], stats: { health: 0, hunger: +50, mental: +10 }, flags: { water_outage: true }, log: "마실 것을 이용해 갈증을 해소했습니다!" };
          }
          return { stats: { health: -20, hunger: +30, mental: -10 }, flags: { water_outage: true }, log: "소독 도구가 없어 탈이 났습니다." };
        }
      },
      {
        text: "베란다에 나가 빗물이나 이슬을 모아본다.",
        action: () => {
          if (Math.random() < 0.48) return { stats: { hunger: +20, mental: +5 }, flags: { water_outage: true }, log: "운 운 좋게 약간의 깨끗한 물을 모아 마셨습니다." };
          return { stats: { mental: -15 }, flags: { water_outage: true }, log: "물은 모이지 않았고 헛고생만 하여 기운이 빠집니다." };
        }
      },
      {
        text: "포기하고 그냥 참는다.",
        action: () => ({ stats: { health: -10, hunger: -15, mental: -5 }, flags: { water_outage: true }, log: "극심한 갈증으로 컨디션이 저하되었습니다." })
      }
    ]
  },
  {
    id: 'abandoned_backpack',
    condition: () => true,
    text: "[수색] 수풀 속에서 구멍이 뚫린 피 묻은 배낭을 발견했습니다.",
    choices: [
      {
        text: "조심스럽게 내용물을 뒤진다.",
        action: () => {
          const gained = Math.random() < 0.5 ? ['ration'] : ['wet_wipes'];
          return { itemsGained: gained, log: "배낭 속에서 유용한 생존 물품을 찾아냈습니다!" };
        }
      },
      {
        text: "막대기나 도구로 찔러 안전을 먼저 확인한다.",
        action: (inv) => {
          const w = inv.find(item => ['crowbar', 'machete', 'bat', 'baton'].includes(item));
          if (w) {
            return { useWeapon: w, itemsGained: ['soap'], stats: { mental: +5 }, log: "배낭 밑에 숨어있던 뱀을 쫓아내고 물건을 안전히 챙겼습니다." };
          }
          return { addTravelTime: 1, log: "주변의 나뭇가지를 찾느라 시간을 낭비했지만 가방은 비어있었습니다." };
        }
      },
      { text: "무시한다.", action: () => ({ log: "배낭을 지나쳤습니다." }) }
    ]
  },
  {
    id: 'stranger_knocking',
    condition: (state) => state.counters.totalHours >= 24,
    text: "[경계] 건물 입구 쪽에서 누군가 다급하게 도움을 요청합니다! '제발 도와주세요!'",
    choices: [
      {
        text: "다가오는 사람을 확인하고 도움을 준다.",
        action: () => {
          if (Math.random() < 0.5) return { stats: { mental: +20 }, itemsGained: ['medkit'], log: "구해준 낯선 이가 감사의 표시로 [구급상자]를 주고 떠났습니다." };
          return { stats: { health: -25, mental: -20 }, log: "괴한은 변장한 약탈자였습니다! 기습당해 다치고 물자를 빼앗길 뻔했습니다." };
        }
      },
      {
        text: "위험할 수 있어 거리를 두고 지켜본다.",
        action: () => ({ stats: { mental: -10 }, log: "밖에서 비명소리가 들리다 조용해졌습니다." })
      },
      {
        text: "무기를 준비하고 경계하며 대응한다.",
        action: (inv) => {
          const w = inv.find(item => WEAPONS.includes(item));
          if (w) return { useWeapon: w, stats: { mental: +5 }, log: "무기를 보자 낯선 이는 겁을 먹고 도망쳤습니다." };
          return { stats: { mental: -15 }, log: "무기가 없는 것을 눈치챈 낯선 이가 문을 발로 차고 도망갔습니다." };
        }
      },
      { text: "문 너머로 대화만 시도한다.", action: () => ({ stats: { mental: -5 }, log: "'가까이 오지 마!'라고 소리치자 상대는 절망하며 떠났습니다." }) }
    ]
  },
  {
    id: 'corpse_hygiene',
    condition: (state) => state.stats.hygiene <= 40,
    text: "[악취] 길가에 부패한 시체와 파리떼가 가득합니다. 세균 감염 위험이 큽니다.",
    choices: [
      {
        text: "위생용품(비누/물티슈)을 사용해 정화한다.",
        action: (inv) => {
          if (inv.includes('soap')) return { itemsLost: ['soap'], stats: { hygiene: +50, mental: +10 }, log: "비누로 몸을 씻어 오염을 방지했습니다." };
          if (inv.includes('wet_wipes')) return { itemsLost: ['wet_wipes'], stats: { hygiene: +30 }, log: "물티슈로 몸을 닦아냈습니다." };
          return { stats: { health: -10, hygiene: -15 }, log: "위생 도구가 없어 오염물에 지속 노출되었습니다." };
        }
      },
      {
        text: "옷가지로 코와 입을 단단히 막고 빠르게 돌파한다.",
        action: () => ({ stats: { hunger: -15, hygiene: -5 }, log: "체력을 소모해 빠르게 구역을 벗어났습니다." })
      },
      {
        text: "위험을 감수하고 시체를 뒤져본다.",
        action: () => {
          if(Math.random() < 0.3) return { stats: { health: -5, hygiene: -30 }, itemsGained: ['ration'], log: "시체 품에서 식량을 얻었지만 심하게 오염되었습니다." };
          return { stats: { health: -15, hygiene: -40, mental: -20 }, log: "시체가 갑자기 움직여 물리며 큰 피해를 입었습니다!" };
        }
      },
      { text: "우회한다.", action: () => ({ stats: { mental: -10, hygiene: -10 }, log: "악취를 참으며 먼 길로 우회했습니다." }) }
    ]
  },
  {
    id: 'acid_rain',
    condition: (state) => Math.random() < 0.15,
    text: "[기후] 피부를 쏘는 듯한 검은 유독성 산성비가 내리기 시작합니다!",
    choices: [
      {
        text: "건물 처마 밑으로 피신한다.",
        action: () => ({ stats: { health: -5, mental: -5 }, log: "비가 그칠 때까지 대기했습니다." })
      },
      {
        text: "버려진 우산이나 박스를 찾아 뒤집어쓴다.",
        action: () => {
          if(Math.random() < 0.5) return { stats: { mental: +5 }, log: "버려진 비닐 천막을 발견해 무사히 비를 피했습니다." };
          return { stats: { health: -15, hygiene: -20 }, log: "적당한 것을 찾지 못해 비를 다 맞았습니다." };
        }
      },
      {
        text: "강행 돌파한다.",
        action: () => ({ stats: { health: -20, hygiene: -30 }, log: "산성비에 피부 화상을 입고 위생이 크게 악화되었습니다." })
      }
    ]
  },
  {
    id: 'weather_fog',
    condition: (state) => Math.random() < 0.1,
    text: "[기후] 한 치 앞도 보이지 않는 짙은 핏빛 안개가 꼈습니다. 주변에서 기괴한 소음이 들려옵니다.",
    choices: [
      {
        text: "제자리에 웅크려 안개가 걷히길 기다린다.",
        action: () => {
          if (Math.random() < 0.6) return { stats: { mental: -10, hunger: -10 }, log: "긴장 속에서 시간을 허비했지만 무사히 안개가 걷혔습니다." };
          return { stats: { health: -20, mental: -15 }, log: "안개 속에서 다가온 감염자에게 기습당했습니다!" };
        }
      },
      {
        text: "방향 감각을 믿고 천천히 이동한다.",
        action: (inv, counters, trait, companions) => {
          if (companions.some(c => c.id === 'military_dog' || c.id === 'stray_cat')) {
            return { stats: { mental: +5 }, log: "동물의 예민한 감각 덕분에 안개를 뚫고 안전하게 벗어났습니다!" };
          }
          return { stats: { health: -15 }, log: "길을 잃고 헤매다 찰과상을 입었습니다." };
        }
      }
    ]
  },
  {
    id: 'weather_heatwave',
    condition: (state) => Math.random() < 0.1,
    text: "[기후] 숨이 막힐 듯한 끔찍한 폭염이 찾아왔습니다. 탈수 증세가 오기 시작합니다.",
    choices: [
      {
        text: "물티슈나 음료(커피)로 체온을 낮춘다.",
        action: (inv) => {
          if (inv.includes('wet_wipes')) return { itemsLost: ['wet_wipes'], stats: { health: +5, mental: +10 }, log: "물티슈로 몸을 닦아내어 폭염을 견뎌냈습니다." };
          if (inv.includes('coffee')) return { itemsLost: ['coffee'], stats: { hunger: +10, mental: +15 }, log: "음료를 섭취해 탈수를 막았습니다." };
          return { stats: { health: -20, hunger: -20 }, log: "사용할 물품이 없어 극심한 탈수와 일사병에 시달립니다." };
        }
      },
      {
        text: "그늘진 곳을 찾아 강제로 휴식한다.",
        action: () => ({ stats: { hunger: -15, mental: -5 }, log: "갈증을 참으며 억지로 그늘에서 버텼습니다." })
      }
    ]
  },
  {
    id: 'weather_coldwave',
    condition: (state) => Math.random() < 0.1,
    text: "[기후] 뼛속까지 시린 살인적인 한파가 불어닥칩니다. 체온이 급격히 떨어집니다.",
    choices: [
      {
        text: "라이터로 작은 불을 피워 몸을 녹인다.",
        action: (inv) => {
          if (inv.includes('lighter')) return { stats: { mental: +15 }, log: "라이터로 불씨를 만들어 언 몸을 녹였습니다." };
          return { stats: { health: -25, mental: -15 }, log: "불을 피울 도구가 없어 동상에 걸리고 말았습니다." };
        }
      },
      {
        text: "마실 것을 이용해 몸을 녹인다.",
        action: (inv) => {
          if (inv.includes('drinking_water')) return { itemsLost: ['drinking_water'], stats: { mental: +5 }, log: '식수를 조금씩 마시며 탈수를 막고 몸을 진정시켰습니다.' };
          if (inv.includes('soju')) return { itemsLost: ['soju'], stats: { mental: +20, health: -5 }, log: "마실 것을 이용해 잠시 추위를 견뎠습니다." };
          if (inv.includes('coffee')) return { itemsLost: ['coffee'], stats: { mental: +15 }, log: "마실 것을 이용해 체온을 조금 회복했습니다." };
          return { stats: { health: -20, mental: -10 }, log: "쓸 수 있는 마실 것이 없어 추위에 몸을 웅크린 채 고통받았습니다." };
        }
      },
      {
        text: "추위를 잊기 위해 무작정 걷는다.",
        action: () => ({ stats: { health: -15, hunger: -20 }, log: "체력을 심하게 소모하며 간신히 한파를 이겨냈습니다." })
      }
    ]
  }
];
