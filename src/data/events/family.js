// 가족 퀘스트 (할머니 순자 · 손녀 하은)

export const FAMILY_EVENTS = [
  { id: 'apartment_grandmother', condition: (state) => !state.travelState && state.currentLocation === 'apartment' && !state.companions.some(c => c.id === 'grandmother') && !state.flags.quest_family_reunion_done && (!state.companions.some(c => ['grandmother','granddaughter'].includes(c.id)) || state.companions.some(c => c.id === 'granddaughter')),
    text: '[가족 퀘스트: 아파트] 놀이터에서 먼저 만난 하은이가 아파트에 있는 할머니 순자를 찾아왔습니다. 두 사람의 재회를 도와주세요.',
    choices: [
      { text: '순자와 하은의 가족 상봉을 돕는다.', action: () => ({ addCompanion: { id: 'grandmother', role: '할머니', name: '순자', desc: '가족을 향한 의지: 동료 이탈 확률 감소', loyalty: 90, affinity: 85 }, log: '할머니 순자가 동행합니다. 손녀를 만나기 전까지 걱정을 떨치지 못합니다.' }) },
      { text: '주변 집을 먼저 수색한다.', action: () => ({ itemsGained: ['ration'], log: '아파트 복도에서 비상식량을 찾았습니다.' }) }
    ]
  },
  { id: 'playground_granddaughter', condition: (state) => !state.travelState && state.currentLocation === 'playground' && !state.companions.some(c => c.id === 'granddaughter') && !state.flags.quest_family_reunion_done && (!state.companions.some(c => ['grandmother','granddaughter'].includes(c.id)) || state.companions.some(c => c.id === 'grandmother')),
    text: '[가족 퀘스트: 놀이터] 아파트에서 먼저 만난 순자가 놀이터에 있는 손녀 하은이를 찾아왔습니다. 두 사람의 재회를 도와주세요.',
    choices: [
      { text: '하은과 순자의 가족 상봉을 돕는다.', action: () => ({ addCompanion: { id: 'granddaughter', role: '손녀', name: '하은', desc: '가족과의 유대: 동료 영입 성공 확률 증가', loyalty: 95, affinity: 90 }, log: '손녀 하은이가 동행합니다. 할머니를 만나기 전까지 불안한 마음을 감추지 못합니다.' }) },
      { text: '놀이터 주변을 조심스럽게 살핀다.', action: () => ({ itemsGained: ['nutrition_bar'], log: '벤치 아래에서 에너지바를 찾았습니다.' }) }
    ]
  }
];
