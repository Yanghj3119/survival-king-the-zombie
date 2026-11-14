// 동료 영입
import { WEAPONS } from '../config';

export const RECRUITMENT_EVENTS = [
  {
    id: 'recruitment_jisoo',
    condition: (state) => !state.companions.some(c => c.id === 'jisoo') && Math.random() < 0.12,
    text: "[생존자 조우] 응급 가방을 지켜내며 부상자를 돌보던 119 구급대원 윤지수를 만났습니다.",
    choices: [
      { text: '의료 물자를 나누고 함께 이동하자고 제안한다.', action: (inv) => {
        if (inv.includes('medkit') || inv.includes('drinking_water') || inv.includes('ration')) {
          const itemToLose = inv.includes('medkit') ? 'medkit' : inv.includes('drinking_water') ? 'drinking_water' : 'ration';
          return { itemsLost: [itemToLose], addCompanion: { id: 'jisoo', role: '119 구급대원', name: '윤지수', desc: '🚑 의료 회복 효율 +20% · 장애물 개척 지원', loyalty: 78, affinity: 70 }, log: '윤지수가 동료로 합류했습니다. 응급 처치와 현장 개척에 전문성을 발휘합니다.' };
        }
        return { stats: { mental: -3 }, log: '나눌 수 있는 의료 물자나 식수가 없어 지수를 설득하지 못했습니다.' };
      } },
      { text: '서로의 안전을 약속하고 함께 움직인다.', action: () => ({ addCompanion: { id: 'jisoo', role: '119 구급대원', name: '윤지수', desc: '🚑 의료 회복 효율 +20% · 장애물 개척 지원', loyalty: 65, affinity: 60 }, log: '윤지수가 합류했습니다. 의료용품 회복 효율과 장애물 개척을 지원합니다.' }) },
      { text: '위험을 감수하지 않고 헤어진다.', action: () => ({ log: '윤지수는 다른 생존자를 찾기 위해 길을 떠났습니다.' }) }
    ]
  },
  {
    id: 'recruitment_police',
    condition: (state) => !state.companions.some(c => c.id === 'police') && Math.random() < 0.14,
    text: "[생존자 구출] 감염자 무리에 싸여 권총 탄약이 떨어진 경찰관 '지헌'을 마주쳤습니다!",
    choices: [
      {
        text: "무기를 휘두르며 엄호하여 구출한다.",
        action: (inv) => {
          const w = inv.find(item => WEAPONS.includes(item));
          if (w) {
            return {
              useWeapon: w,
              stats: { mental: +20 },
              addCompanion: { id: 'police', role: '경찰관', name: '지헌', desc: '👮 피격 피해 35% 절감', loyalty: 85, affinity: 70 },
              log: "지헌을 감염자 무리에서 구출했습니다! (패시브: 피격 피해 35% 절감)"
            };
          }
          return { stats: { health: -25 }, log: "무기가 없어 구출에 실패하고 부상을 입었습니다." };
        }
      },
      { text: "위험하니 외면하고 지나친다.", action: () => ({ log: "경찰관을 외면하고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'recruitment_pharmacist',
    condition: (state) => !state.companions.some(c => c.id === 'pharmacist') && Math.random() < 0.14,
    text: "[생존자 조우] 약국 선반 구석에 숨어 조용히 의약품을 정돈하던 약사 '혁준'을 만났습니다.",
    choices: [
      {
        text: "식량이나 소주를 건네며 합류를 제안한다.",
        action: (inv) => {
          if (inv.includes('ration') || inv.includes('soju')) {
            const itemToLose = inv.includes('ration') ? 'ration' : 'soju';
            return {
              itemsLost: [itemToLose], stats: { mental: +15 },
              addCompanion: { id: 'pharmacist', role: '약사', name: '혁준', desc: '💊 구급상자 회복량 +20 & 오염 패널티 완화', loyalty: 80, affinity: 75 },
              log: "혁준이 동료로 합류했습니다! (패시브: 구급상자 회복량 증가 & 위생 감염 완화)"
            };
          }
          return { stats: { mental: -5 }, log: "나눠줄 물품이 부족해 설득에 실패했습니다." };
        }
      },
      {
        text: "의약품을 함께 나누고 서로 돕자고 설득한다.",
        action: () => ({
          stats: { mental: +10 },
          addCompanion: { id: 'pharmacist', role: '약사', name: '혁준', desc: '💊 구급상자 회복량 +20 & 오염 패널티 완화', loyalty: 65, affinity: 55 },
          log: "혁준이 서로 협력하자는 제안을 받아들여 동료로 합류했습니다! (기본 충성도)"
        })
      },
      { text: "그를 두고 돌아선다.", action: () => ({ log: "약사를 뒤로하고 떠났습니다." }) }
    ]
  },
  {
    id: 'recruitment_dog',
    condition: (state) => !state.companions.some(c => c.id === 'military_dog') && Math.random() < 0.18,
    text: "[애완동물 조우] 철창 뒤에서 목줄을 찬 훈련된 군견 '제로'가 굶주린 채 컹컹 짖고 있습니다!",
    choices: [
      {
        text: "사료나 전투식량을 주며 다가간다.",
        action: (inv) => {
          if (inv.includes('pet_food') || inv.includes('ration')) {
            const itemLost = inv.includes('pet_food') ? 'pet_food' : 'ration';
            return {
              itemsLost: [itemLost], stats: { mental: +25 },
              addCompanion: { id: 'military_dog', role: '군견', name: '제로', desc: '🐕 전투 시 피해 감쇄 & 위험 경고', loyalty: 90, affinity: 80 },
              log: "군견 '제로'가 꼬리를 치며 신뢰를 보입니다! 든든한 동료가 되었습니다."
            };
          }
          return { stats: { mental: -5 }, log: "먹을 것이 없어 군견이 경계하며 으르렁거립니다." };
        }
      },
      {
        text: "조심스럽게 손을 내밀어 쓰다듬어본다.",
        action: () => {
          if (Math.random() < 0.18) {
            return { addCompanion: { id: 'military_dog', role: '군견', name: '제로', desc: '🐕 전투 시 피해 감쇄 & 위험 경고', loyalty: 60, affinity: 60 }, log: "진심이 통했는지 군견 제로가 당신을 따르기 시작합니다!" };
          }
          return { stats: { health: -15 }, log: "위협을 느낀 군견에게 손을 물렸습니다." };
        }
      },
      { text: "무시하고 지나친다.", action: () => ({ log: "군견을 뒤로하고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'recruitment_cat',
    condition: (state) => !state.companions.some(c => c.id === 'stray_cat') && Math.random() < 0.3,
    text: "[애완동물 조우] 박스 더미 위에서 작은 길고양이 '나비'가 위태롭게 웅크리고 있습니다.",
    choices: [
      {
        text: "안아들고 함께 가자고 달랜다.",
        action: () => ({
          stats: { mental: +20 },
          addCompanion: { id: 'stray_cat', role: '길고양이', name: '나비', desc: '🐈 탐색 이득 보너스 & 정신력 치유', loyalty: 70, affinity: 85 },
          log: "길고양이 '나비'가 당신의 품에 안겼습니다! (정신력 치유 효과)"
        })
      },
      {
        text: "먹을 것을 가방에서 꺼내놓아 준다.",
        action: (inv) => {
          if(inv.includes('pet_food') || inv.includes('ration')) {
            const itemLost = inv.includes('pet_food') ? 'pet_food' : 'ration';
            return { itemsLost: [itemLost], addCompanion: { id: 'stray_cat', role: '길고양이', name: '나비', desc: '🐈 탐색 이득 보너스 & 정신력 치유', loyalty: 95, affinity: 100 }, log: "고양이가 감사의 그르렁 소리를 내며 완전히 마음을 열었습니다." };
          }
          return { log: "먹을 것이 없어 고양이의 관심이 멀어졌습니다." };
        }
      },
      { text: "지나친다.", action: () => ({ log: "고양이를 두고 걸음을 옮깁니다." }) }
    ]
  },
  {
    id: 'recruitment_soldier',
    condition: (state) => !state.companions.some(c => c.id === 'soldier') && Math.random() < 0.10,
    text: "[생존자 조우] 전직 행정보급관 박상사가 물자를 나눠주면 합류하겠다고 합니다.",
    choices: [
      {
        text: "물품을 내어주고 영입한다.",
        action: (inv) => {
          if (inv.includes('ration') || inv.includes('medkit')) {
            const itemToLose = inv.includes('ration') ? 'ration' : 'medkit';
            return {
              stats: { mental: +20 }, itemsLost: [itemToLose],
              addCompanion: { id: 'soldier', role: '행정보급관', name: '박상사', desc: '🛡️ 전투 피격 피해 30% 절감', loyalty: 65, affinity: 50 },
              log: "박상사가 동료로 합류했습니다! (패시브: 전투 피격 피해 절감)"
            };
          }
          return { stats: { mental: -5 }, log: "물품이 부족해 그를 돌려보냈습니다." };
        }
      },
      {
        text: "기습하여 물품만 빼앗는다.",
        action: (inv) => {
          const w = inv.find(item => WEAPONS.includes(item));
          if(w) return { useWeapon: w, stats: { health: -15, mental: -20 }, itemsGained: ['ration'], log: "부상을 입었지만 그의 식량을 뺏어 달아났습니다." };
          return { stats: { health: -40 }, log: "박상사의 반격에 뼈가 부러질 정도로 맞았습니다." };
        }
      },
      { text: "지나친다.", action: () => ({ log: "그를 뒤로하고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'recruitment_nurse',
    condition: (state) => !state.companions.some(c => c.id === 'nurse') && Math.random() < 0.12,
    text: "[구출] 감염자들에게 포위된 여성 간호사 '서연'을 발견했습니다!",
    choices: [
      {
        text: "무기로 구출해낸다.",
        action: (inv) => {
          const w = inv.find(item => WEAPONS.includes(item));
          if (w) {
            return {
              useWeapon: w,
              stats: { mental: +20 },
              addCompanion: { id: 'nurse', role: '간호사', name: '서연', desc: '💉 인벤토리 +1 & 지속적 체력 회복', loyalty: 80, affinity: 60 },
              log: "서연을 구출했습니다! (패시브: 인벤토리 +1 & 체력 회복)"
            };
          }
          return { stats: { health: -20 }, log: "적절한 무기가 없어 구출에 실패하고 부상만 입었습니다." };
        }
      },
      {
        text: "주변의 돌을 던져 감염자의 시선을 끈다.",
        action: () => {
          if(Math.random() < 0.5) {
            return { stats: { mental: +10 }, addCompanion: { id: 'nurse', role: '간호사', name: '서연', desc: '💉 인벤토리 +1 & 지속적 체력 회복', loyalty: 60, affinity: 70 }, log: "시선을 끈 사이 서연이 탈출해 합류했습니다!" };
          }
          return { stats: { health: -15, mental: -10 }, log: "감염자들의 어그로가 당신에게 끌려 도망쳐야 했습니다." };
        }
      },
      {
        text: "아무것도 하지 않고 상황을 지켜본다.",
        action: () => ({ stats: { mental: -20 }, itemsGained: ['medkit'], log: "간호사는 가까스로 도망치며 구급상자를 떨어뜨렸습니다. 당신은 구급상자를 챙겼지만, 구하러 나서지 않았다는 죄책감에 정신력이 감소합니다. (구급상자 +1 · 정신력 -20)" })
      },
      { text: "외면하고 지나친다.", action: () => ({ log: "외면하고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'recruitment_chef',
    condition: (state) => !state.companions.some(c => c.id === 'chef') && Math.random() < 0.14,
    text: "[생존자 조우] 대형 마트 주방 구석에 웅크리고 있던 베테랑 요리사 '홍형'을 마주쳤습니다.",
    choices: [
      {
        text: "함께 살아남지 않겠냐고 제안한다.",
        action: () => ({
          stats: { mental: +15 },
          addCompanion: { id: 'chef', role: '요리사', name: '홍형', desc: '👨‍🍳 포만감 소모 25% 완화', loyalty: 75, affinity: 50 },
          log: "홍형이 동료로 합류했습니다! (패시브: 포만감 소모 완화)"
        })
      },
      {
        text: "가진 식량을 주며 환심을 산다.",
        action: (inv) => {
          if(inv.includes('ration')) return { itemsLost: ['ration'], addCompanion: { id: 'chef', role: '요리사', name: '홍형', desc: '👨‍🍳 포만감 소모 25% 완화', loyalty: 90, affinity: 80 }, log: "식량을 받은 홍형이 깊은 감동을 받아 높은 충성도로 합류했습니다!" };
          return { log: "나눠줄 식량이 없어 그냥 지나쳤습니다." };
        }
      },
      { text: "거절하고 혼자 간다.", action: () => ({ log: "홍형을 두고 나왔습니다." }) }
    ]
  },
  {
    id: 'recruitment_engineer',
    condition: (state) => state.currentLocation !== 'airport' && state.counters.totalHours >= 24 && !state.companions.some(c => c.id === 'engineer'),
    text: "[생존자 조우] 고장 난 발전기 앞에서 도구를 만지작거리던 공학자 '제민'을 만났습니다.",
    choices: [
      {
        text: "기호품(소주/담배)을 건네며 동료로 스카우트한다.",
        action: (inv) => {
          if (inv.includes('soju') || inv.includes('cigarette')) {
            const itemToLose = inv.includes('soju') ? 'soju' : 'cigarette';
            return {
              itemsLost: [itemToLose], stats: { mental: +20 },
              addCompanion: { id: 'engineer', role: '공학자', name: '제민', desc: '🔧 위생 감소 속도 30% 완화', loyalty: 70, affinity: 60 },
              log: "제민이 동료로 합류했습니다! (패시브: 위생 감소 완화)"
            };
          }
          return { stats: { mental: -5 }, log: "기호품이 없어 그를 설득하지 못했습니다." };
        }
      },
      {
        text: "발전기를 고치면 보호해주겠다고 제안한다.",
        action: () => {
          if(Math.random() < 0.5) return { addCompanion: { id: 'engineer', role: '공학자', name: '제민', desc: '🔧 위생 감소 속도 30% 완화', loyalty: 50, affinity: 40 }, log: "어쩔 수 없다는 듯 제민이 마지못해 합류했습니다." };
          return { log: "제민은 당신을 믿지 못하겠다며 거절했습니다." };
        }
      },
      { text: "지나친다.", action: () => ({ log: "그를 두고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'recruitment_vaccine_developer',
    condition: (state) => !state.travelState && state.currentLocation === 'laboratory' && !state.companions.some(c => c.id === 'vaccine_developer'),
    text: "[생존자 조우] 연구소 구석에서 방호복을 입고 데이터를 백업 중인 백신개발자 '김박사'를 만났습니다.",
    choices: [
      {
        text: "안전을 약속하며 합류를 제안한다.",
        action: () => ({
          stats: { mental: +10 },
          addCompanion: { id: 'vaccine_developer', role: '백신개발자', name: '김박사', desc: '🔬 감염 속도 완화 및 백신 제작 지식', loyalty: 60, affinity: 50 },
          log: "김박사가 동료로 합류했습니다! (패시브: 백신 관련 특수 이벤트 가능)"
        })
      },
      { text: "그냥 지나친다.", action: () => ({ log: "김박사를 두고 떠났습니다." }) }
    ]
  }
];
