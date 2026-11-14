// 엔딩 트리거 이벤트

export const ENDINGS_EVENTS = [
  {
    id: 'ending_betrayal',
    condition: (state) => state.companions.length >= 2 && state.companions.every(c => c.loyalty <= 35) && Math.floor(state.counters.totalHours / 24) >= 7,
    text: "[생존자의 결말] 헬기가 마침내 도착했습니다! 하지만 그동안의 억압과 배고픔에 분노한 동료들의 눈빛이 심상치 않습니다...",
    choices: [
      {
        text: "헬기를 향해 달려간다.",
        action: () => {
          return { flags: { triggerBetrayalEnding: true }, log: "동료들이 당신을 밀치고 헬기를 장악했습니다!" };
        }
      }
    ]
  },
  {
    id: 'ending_mutant',
    condition: (state) => !state.travelState && Math.floor(state.counters.totalHours / 24) >= 5 && state.stats.hygiene <= 50 && state.stats.mental <= 50 && (state.currentLocation === 'hospital' || state.currentLocation === 'controlled_area'),
    text: "[생존자의 결말] 몸 속에 퍼진 바이러스가 마침내 뇌를 잠식하기 시작합니다. 그러나 당신의 강인한 의지는 이성을 잃는 것을 거부합니다...",
    choices: [
      {
        text: "변이를 받아들이고 새로운 힘에 눈을 뜬다.",
        action: () => {
          return { flags: { triggerMutantEnding: true }, log: "감염자들의 포효가 마치 복종의 언어처럼 들려옵니다..." };
        }
      }
    ]
  },
  {
    id: 'ending_chip_protocol',
    condition: (state) => {
      const required = ['pharmacist', 'nurse', 'police', 'chef'];
      const requiredQuests = ['quest_pharmacist_done', 'quest_nurse_done', 'quest_police_done', 'quest_chef_done'];
      return !state.travelState && required.every(id => state.companions.some(c => c.id === id)) &&
        requiredQuests.every(flag => state.flags && state.flags[flag] === true) &&
        state.inventory.includes('semiconductor_chip');
    },
    text: "[최후의 프로토콜] 약사 혁준, 간호사 서연, 경찰관 지헌, 요리사 홍형이 반도체칩을 중심으로 모였습니다. 각자의 전문성을 결합하면 연구소의 생존자 지원 프로토콜을 재가동해 안전한 거점을 만들 수 있습니다.",
    choices: [
      {
        text: "네 동료와 함께 반도체칩 프로토콜을 가동한다. (생존 엔딩)",
        action: () => ({ flags: { triggerChipEnding: true }, log: "🧩 네 동료의 협력으로 반도체칩 기반 생존 프로토콜이 가동되었습니다. 생존자들을 보호할 수 있는 거점이 마련됩니다!" })
      }
    ]
  },
  {
    id: 'ending_plane',
    // 비행기 엔딩은 공항에 정착해 있고, 연료와 공학자 동료를 모두 확보했을 때만 활성화한다.
    condition: (state) => !state.travelState && state.currentLocation === 'airport' && state.inventory.includes('gas_can') &&
      state.companions.some(c => c.id === 'engineer'),
    text: "[탈출 기회] 공항에서 버려진 비행기를 발견했습니다. 연료 탱크는 거의 비어 있지만, 챙겨 온 휘발유 캔을 보태면 이륙할 정도는 될 것 같습니다. 다만 엔진을 점검하고 안전하게 가동하려면 공학자 제민의 도움이 필요합니다.",
    choices: [
      {
        text: "공학자와 함께 휘발유 캔의 기름을 비행기에 옮겨 넣고 엔진을 가동한다!",
        action: () => {
          return { itemsLost: ['gas_can'], flags: { triggerPlaneEnding: true }, log: "제민이 엔진을 점검한 뒤 휘발유 캔의 기름을 연료 계통에 연결합니다. 엔진이 굉음을 내며 비행기가 활주로를 달리기 시작합니다!" };
        }
      }
    ]
  },
  {
    id: 'ending_companion_legacy',
    condition: (state) => Math.floor(state.counters.totalHours / 24) >= 7 && (state.companions.length >= 1 || !!state.flags.companion_mission_casualty) && !state.flags.companion_ending_seen,
    text: "[동료들의 마지막 선택] 구조 신호가 가까워집니다. 함께 살아남은 동료들은 당신과 걸어온 시간을 돌아봅니다. 누구를 지켰고, 누구의 이야기를 끝까지 들어주었는지가 이제 마지막 선택이 됩니다.",
    choices: [
      { text: '동료들과 함께 구조 지점으로 향하며 각자의 이야기를 마무리한다.', action: () => ({ flags: { triggerCompanionEnding: true, companion_ending_seen: true }, log: '마지막 순간, 당신은 동료들과 함께 걸어온 길을 돌아봅니다.' }) },
      { text: '가장 신뢰하는 동료에게 후방을 맡기고 생존자들을 먼저 보낸다.', action: () => ({ flags: { triggerCompanionEnding: true, companion_ending_seen: true }, log: '당신은 가장 신뢰하는 동료에게 후방을 맡겼습니다. 그 선택은 마지막까지 기억될 것입니다.' }) }
    ]
  },
  {
    id: 'handover_vaccine_ending',
    condition: (state) => !state.travelState && state.currentLocation === 'controlled_area' && state.inventory.includes('completed_vaccine'),
    text: "[인류의 구원] 군사 통제구역의 사령관이 당신이 가진 '완성된 백신'을 보고 경악합니다. '이것만 있으면 세상을 구할 수 있어!'",
    choices: [
      {
        text: "백신을 넘기고 특별 헬기로 탈출한다. (진정한 생존 엔딩)",
        action: () => {
          return { flags: { triggerVaccineEnding: true }, log: "🎉 백신을 전달하여 인류를 구원한 영웅이 되었습니다!" };
        }
      }
    ]
  }
];
