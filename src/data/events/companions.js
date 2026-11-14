// 동료 갈등 · 개인 퀘스트 · 관계 이벤트
import { WEAPONS } from '../config';

export const COMPANIONS_EVENTS = [
  {
    id: 'companion_betrayal',
    condition: (state) => state.companions.some(c => c.loyalty <= 35) || (state.companions.length > 0 && (state.stats.hunger <= 35 || state.stats.mental <= 25)),
    text: "[충성도 균열] 불만에 찬 동료가 배고픔과 공포를 견디지 못하고 배신을 획책하고 있습니다!",
    choices: [
      {
        text: "무기로 위협하여 쫓아낸다.",
        action: (inv, counters, trait, companions) => {
          const betrayer = companions.find(c => c.loyalty <= 35) || companions[0];
          const w = inv.find(item => WEAPONS.includes(item));
          if (w) {
            return { useWeapon: w, removeCompanionId: betrayer.id, stats: { mental: -15 }, log: `무기로 억제하여 소지품을 지켰습니다. [${betrayer.name}]은(는) 떠났습니다.` };
          }
          const stolenItem = inv.length > 0 ? inv[0] : null;
          return { removeCompanionId: betrayer.id, itemsLost: stolenItem ? [stolenItem] : [], stats: { mental: -25 }, log: `무기가 없어 저지하지 못했습니다! [${betrayer.name}]이(가) 소지품을 훔쳐 도망쳤습니다.` };
        }
      },
      {
        text: "전투식량을 내어주며 다독인다.",
        action: (inv, counters, trait, companions) => {
          const betrayer = companions.find(c => c.loyalty <= 35) || companions[0];
          if (inv.includes('ration')) {
            return { itemsLost: ['ration'], updateLoyalty: { id: betrayer.id, delta: +30 }, updateAffinity: { id: betrayer.id, delta: +10 }, stats: { mental: +15 }, log: `식량을 건네자 [${betrayer.name}]의 충성도가 크게 상승했습니다!` };
          }
          return { removeCompanionId: betrayer.id, stats: { mental: -20 }, log: "나눠줄 식량이 없어 동료가 결국 도망치고 말았습니다." };
        }
      },
      {
        text: "그동안 쌓아온 정에 호소하며 설득한다 (호감도 60 이상 필요).",
        action: (inv, counters, trait, companions) => {
          const betrayer = companions.find(c => c.loyalty <= 35) || companions[0];
          if (betrayer.affinity >= 60) {
            return { updateLoyalty: { id: betrayer.id, delta: +40 }, updateAffinity: { id: betrayer.id, delta: +15 }, log: `[${betrayer.name}]은(는) 당신의 진심 어린 호소에 마음을 돌렸습니다! (충성도 회복)` };
          }
          return { removeCompanionId: betrayer.id, stats: { health: -10, mental: -30 }, log: `호감도가 부족하여 설득에 실패했습니다. 오히려 그가 당신을 밀치고 도망쳤습니다.` };
        }
      },
      {
        text: "배신하기 전에 먼저 기습하여 제압한다.",
        action: (inv, counters, trait, companions) => {
          const betrayer = companions.find(c => c.loyalty <= 35) || companions[0];
          return { removeCompanionId: betrayer.id, itemsGained: ['ration'], stats: { mental: -40 }, log: `동료를 선제 공격하여 식량을 빼앗고 쫓아냈습니다. 깊은 죄책감에 시달립니다.` };
        }
      }
    ]
  },
  {
    id: 'companion_quest_police',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'police') && state.currentLocation === 'police_station' && !state.flags.quest_police_done,
    text: "[동료 개인 퀘스트: police] 지헌은 무전실 앞에서 멈춰 섭니다. 마지막 신고를 접수했던 시민의 이름이 기록에 남아 있을지도 모릅니다.",
    choices: [
      { text: "기록을 찾아 이름과 신고 내용을 끝까지 확인한다.", action: () => ({ flags: { quest_police_done: true }, updateLoyalty: { id: 'police', delta: 15 }, updateAffinity: { id: 'police', delta: 12 }, companionMorale: 3, log: "지헌은 끝내지 못한 신고를 읽고 한참 침묵합니다. 이제라도 기억하겠다고 다짐합니다. (충성도 +15 · 호감도 +12)" }) },
      { text: "기록을 덮고 지금의 생존자부터 지킨다.", action: () => ({ flags: { quest_police_done: true }, updateLoyalty: { id: 'police', delta: -5 }, updateAffinity: { id: 'police', delta: -3 }, log: "지헌은 잠시 실망하지만, 현재의 생존자를 지키자는 판단을 받아들입니다. (충성도 -5)" }) }
    ]
  },
  {
    id: 'companion_quest_pharmacist',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'pharmacist') && state.currentLocation === 'hospital' && !state.flags.quest_pharmacist_done,
    text: "[동료 개인 퀘스트: pharmacist] 혁준은 약제실에서 오래된 처방전을 발견합니다. 약이 부족했던 그날, 그는 한 환자만 살릴 수 있었습니다.",
    choices: [
      { text: "기록을 정리해 희생자의 이름을 남긴다.", action: () => ({ flags: { quest_pharmacist_done: true }, updateLoyalty: { id: 'pharmacist', delta: 15 }, updateAffinity: { id: 'pharmacist', delta: 12 }, companionMorale: 3, log: "혁준은 이름을 기록하며 죄책감을 조금 내려놓습니다. (충성도 +15 · 호감도 +12)" }) },
      { text: "필요한 약품만 챙기고 과거를 뒤로한다.", action: () => ({ flags: { quest_pharmacist_done: true }, updateLoyalty: { id: 'pharmacist', delta: -5 }, updateAffinity: { id: 'pharmacist', delta: -3 }, log: "혁준은 현실적인 판단이라며 고개를 끄덕이지만 마음의 짐은 남습니다. (충성도 -5)" }) }
    ]
  },
  {
    id: 'companion_quest_military_dog',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'military_dog') && state.currentLocation === 'military' && !state.flags.quest_dog_done,
    text: "[동료 개인 퀘스트: military_dog] 제로가 군부대의 낡은 훈련장 앞에서 걸음을 멈춥니다. 익숙한 호각 소리에 귀를 세우지만, 주변은 텅 비어 있습니다.",
    choices: [
      { text: "시간을 들여 흔적을 찾고 제로가 냄새를 확인하게 한다.", action: () => ({ flags: { quest_dog_done: true }, updateLoyalty: { id: 'military_dog', delta: 15 }, updateAffinity: { id: 'military_dog', delta: 12 }, companionMorale: 3, log: "제로는 당신 곁으로 돌아와 한동안 떨어지지 않습니다. 신뢰가 깊어집니다. (충성도 +15 · 호감도 +12)" }) },
      { text: "위험을 피하기 위해 즉시 이동한다.", action: () => ({ flags: { quest_dog_done: true }, updateLoyalty: { id: 'military_dog', delta: -5 }, updateAffinity: { id: 'military_dog', delta: -3 }, log: "제로는 따라오지만 한동안 주변을 경계합니다. (충성도 -5)" }) }
    ]
  },
  {
    id: 'companion_quest_stray_cat',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'stray_cat') && state.currentLocation === 'school' && !state.flags.quest_cat_done,
    text: "[동료 개인 퀘스트: stray_cat] 고양이는 학교 창고의 작은 틈으로 사라졌다가 먼지 묻은 목걸이를 물고 돌아옵니다. 이곳은 예전에 누군가 돌봐주던 장소였던 듯합니다.",
    choices: [
      { text: "은신처를 정리하고 안전한 공간으로 남긴다.", action: () => ({ flags: { quest_cat_done: true }, updateLoyalty: { id: 'stray_cat', delta: 15 }, updateAffinity: { id: 'stray_cat', delta: 12 }, companionMorale: 3, log: "고양이는 은신처를 한 바퀴 돈 뒤 당신 곁에 편하게 앉습니다. (충성도 +15 · 호감도 +12)" }) },
      { text: "물건만 챙기고 서둘러 떠난다.", action: () => ({ flags: { quest_cat_done: true }, updateLoyalty: { id: 'stray_cat', delta: -5 }, updateAffinity: { id: 'stray_cat', delta: -3 }, log: "고양이는 목걸이를 내려놓고 조용히 뒤따릅니다. (충성도 -5)" }) }
    ]
  },
  {
    id: 'companion_quest_chef',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'chef') && state.currentLocation === 'mart' && !state.flags.quest_chef_done,
    text: "[동료 개인 퀘스트: chef] 요리사 홍형은 비어 있는 마트 진열대를 바라봅니다. 과거 대피소에서 식량 배급을 결정하던 날을 떠올립니다.",
    choices: [
      { text: "식량을 공평하게 나누고 배급 원칙을 함께 세운다.", action: () => ({ flags: { quest_chef_done: true }, updateLoyalty: { id: 'chef', delta: 15 }, updateAffinity: { id: 'chef', delta: 12 }, companionMorale: 3, log: "홍형은 공평한 배급 원칙을 적어 둡니다. 동료들의 신뢰도 함께 높아집니다. (충성도 +15 · 호감도 +12)" }) },
      { text: "식량을 비축해 당장의 위험을 줄인다.", action: () => ({ flags: { quest_chef_done: true }, updateLoyalty: { id: 'chef', delta: -5 }, updateAffinity: { id: 'chef', delta: -3 }, log: "홍형은 생존을 위한 결정임을 이해하지만 배급 문제를 계속 고민합니다. (충성도 -5)" }) }
    ]
  },
  {
    id: 'companion_quest_engineer',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'engineer') && state.currentLocation === 'broadcasting' && !state.flags.quest_engineer_done,
    text: "[동료 개인 퀘스트: engineer] 제민은 방송국의 비상 발전기 제어반에서 과거 정전 기록을 발견합니다. 발전기 소음이 대피소를 감염자에게 노출했을 가능성이 있습니다.",
    choices: [
      { text: "기록을 확인하고 안전한 재가동 방법을 찾는다.", action: () => ({ flags: { quest_engineer_done: true }, updateLoyalty: { id: 'engineer', delta: 15 }, updateAffinity: { id: 'engineer', delta: 12 }, companionMorale: 3, log: "제민은 실수를 인정하고 같은 일이 반복되지 않도록 기록을 남깁니다. (충성도 +15 · 호감도 +12)" }) },
      { text: "발전기를 건드리지 않고 부품만 챙긴다.", action: () => ({ flags: { quest_engineer_done: true }, updateLoyalty: { id: 'engineer', delta: -5 }, updateAffinity: { id: 'engineer', delta: -3 }, log: "제민은 위험을 줄인 판단에 동의하지만 답을 찾지 못한 채 떠납니다. (충성도 -5)" }) }
    ]
  },
  {
    id: 'companion_quest_nurse',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'nurse') && state.currentLocation === 'hospital' && !state.flags.quest_nurse_done,
    text: "[동료 개인 퀘스트: nurse] 간호사는 병실 문 앞에서 환자 명단을 발견합니다. 그녀는 마지막까지 지키려 했던 환자들의 이름을 다시 읽습니다.",
    choices: [
      { text: "이름을 기록하고 병실을 조용히 정리한다.", action: () => ({ flags: { quest_nurse_done: true }, updateLoyalty: { id: 'nurse', delta: 15 }, updateAffinity: { id: 'nurse', delta: 12 }, companionMorale: 3, log: "간호사는 환자들을 잊지 않겠다고 다짐하며 당신에게 고맙다고 말합니다. (충성도 +15 · 호감도 +12)" }) },
      { text: "감염 위험을 고려해 기록 일부만 챙긴다.", action: () => ({ flags: { quest_nurse_done: true }, updateLoyalty: { id: 'nurse', delta: -5 }, updateAffinity: { id: 'nurse', delta: -3 }, log: "간호사는 판단을 이해하지만 미처 작별하지 못한 마음을 품습니다. (충성도 -5)" }) }
    ]
  },
  {
    id: 'companion_quest_soldier',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'soldier') && state.currentLocation === 'military' && !state.flags.quest_soldier_done,
    text: "[동료 개인 퀘스트: soldier] 박 상사는 통신실에서 자신이 전달했던 후퇴 명령의 기록을 찾습니다. 기록에는 당시 부대가 민간인을 철수시키기 위해 후퇴 명령을 내렸던 정황이 남아 있습니다.",
    choices: [
      { text: "기록을 끝까지 확인하고 책임을 함께 나눈다.", action: () => ({ flags: { quest_soldier_done: true }, updateLoyalty: { id: 'soldier', delta: 15 }, updateAffinity: { id: 'soldier', delta: 12 }, companionMorale: 3, log: "박 상사는 처음으로 자신의 선택을 설명하고 어깨의 짐을 나눕니다. (충성도 +15 · 호감도 +12)" }) },
      { text: "지금은 논쟁보다 임무가 우선이라며 기록을 봉인한다.", action: () => ({ flags: { quest_soldier_done: true }, updateLoyalty: { id: 'soldier', delta: -5 }, updateAffinity: { id: 'soldier', delta: -3 }, log: "박 상사는 명령에 따르지만 과거 이야기는 더 꺼내지 않습니다. (충성도 -5)" }) }
    ]
  },
  {
    id: 'companion_quest_vaccine_developer',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'vaccine_developer') && state.currentLocation === 'laboratory' && !state.flags.quest_vaccine_done,
    text: "[동료 개인 퀘스트: vaccine_developer] 연구원은 연구소의 실험 기록을 펼쳐 놓습니다. 백신 개발 과정에서 감춰진 위험과 희생이 적혀 있습니다.",
    choices: [
      { text: "기록을 보존하고 잘못을 숨기지 않기로 약속한다.", action: () => ({ flags: { quest_vaccine_done: true }, updateLoyalty: { id: 'vaccine_developer', delta: 15 }, updateAffinity: { id: 'vaccine_developer', delta: 12 }, companionMorale: 3, log: "연구원은 책임을 피하지 않겠다고 결심합니다. 연구를 향한 신뢰가 회복됩니다. (충성도 +15 · 호감도 +12)" }) },
      { text: "연구 자료만 회수하고 기록은 남겨 둔다.", action: () => ({ flags: { quest_vaccine_done: true }, updateLoyalty: { id: 'vaccine_developer', delta: -5 }, updateAffinity: { id: 'vaccine_developer', delta: -3 }, log: "연구원은 자료를 확보한 데 안도하지만 진실은 여전히 남아 있습니다. (충성도 -5)" }) }
    ]
  },
  {
    id: 'companion_bond_police_soldier',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'police') && state.companions.some(c => c.id === 'soldier') && state.currentLocation === 'police_station' && !state.flags.bond_police_soldier_resolved,
    text: "[동료 관계 이벤트] 지헌과 박 상사가 후퇴 경로를 두고 언성을 높입니다. 한쪽은 민간인 보호를, 다른 한쪽은 임무 완수를 우선합니다.",
    choices: [
      { text: "둘의 의견을 듣고 민간인 보호와 후퇴 기준을 함께 정한다.", action: () => ({ flags: { bond_police_soldier_resolved: true }, companionMorale: 2, updateLoyalty: { id: 'police', delta: 5 }, updateAffinity: { id: 'soldier', delta: 8 }, log: "두 사람은 서로의 판단을 인정하고 공동 경계 계획을 세웁니다. (협력 관계 개선)" }) },
      { text: "한 사람에게 결정을 맡기고 즉시 움직인다.", action: () => ({ flags: { bond_police_soldier_resolved: true }, companionMorale: -2, updateLoyalty: { id: 'soldier', delta: -5 }, log: "갈등은 멈췄지만 서로에 대한 불신은 남습니다. (갈등이 남았습니다)" }) }
    ]
  },
  {
    id: 'companion_bond_nurse_pharmacist',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'nurse') && state.companions.some(c => c.id === 'pharmacist') && state.currentLocation === 'hospital' && !state.flags.bond_nurse_pharmacist_resolved,
    text: "[동료 관계 이벤트] 간호사와 약사 혁준이 마지막 구급품의 사용 순서를 두고 다툽니다. 둘 다 누군가를 잃고 싶지 않습니다.",
    choices: [
      { text: "환자의 상태와 약품을 함께 검토해 우선순위를 정한다.", action: () => ({ flags: { bond_nurse_pharmacist_resolved: true }, companionMorale: 2, updateLoyalty: { id: 'nurse', delta: 5 }, updateAffinity: { id: 'pharmacist', delta: 8 }, log: "두 사람은 의료 물품을 공동 관리하기로 합니다. (협력 관계 개선)" }) },
      { text: "빠르게 결정하고 남은 물품을 각자 챙긴다.", action: () => ({ flags: { bond_nurse_pharmacist_resolved: true }, companionMorale: -2, updateLoyalty: { id: 'pharmacist', delta: -5 }, log: "두 사람은 결정을 따르지만 서로의 판단을 경계합니다. (갈등이 남았습니다)" }) }
    ]
  },
  {
    id: 'companion_bond_chef_engineer',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'chef') && state.companions.some(c => c.id === 'engineer') && state.currentLocation === 'mart' && !state.flags.bond_chef_engineer_resolved,
    text: "[동료 관계 이벤트] 홍형은 식량을 아끼자고 하고 제민은 발전기 수리를 위해 물자를 쓰자고 합니다. 두 계획 모두 생존에 필요합니다.",
    choices: [
      { text: "식량 일부를 나누고 수리 시간을 제한해 타협한다.", action: () => ({ flags: { bond_chef_engineer_resolved: true }, companionMorale: 2, updateLoyalty: { id: 'chef', delta: 5 }, updateAffinity: { id: 'engineer', delta: 8 }, log: "두 사람은 배급과 수리 계획을 함께 세웁니다. (협력 관계 개선)" }) },
      { text: "식량 보존을 우선하고 수리를 미룬다.", action: () => ({ flags: { bond_chef_engineer_resolved: true }, companionMorale: -2, updateLoyalty: { id: 'engineer', delta: -5 }, log: "홍형은 안도하지만 제민은 수리를 미룬 결정을 기억합니다. (갈등이 남았습니다)" }) }
    ]
  },
  {
    id: 'companion_bond_military_dog_stray_cat',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'military_dog') && state.companions.some(c => c.id === 'stray_cat') && state.currentLocation === 'school' && !state.flags.bond_military_dog_stray_cat_resolved,
    text: "[동료 관계 이벤트] 제로가 낯선 냄새를 따라가자 고양이가 낮게 울며 막아섭니다. 두 동물은 서로 다른 위험 신호를 감지한 듯합니다.",
    choices: [
      { text: "둘의 반응을 살피며 우회로를 확인한다.", action: () => ({ flags: { bond_military_dog_stray_cat_resolved: true }, companionMorale: 2, updateLoyalty: { id: 'military_dog', delta: 5 }, updateAffinity: { id: 'stray_cat', delta: 8 }, log: "두 동물의 경고가 함정을 찾아냅니다. 서로의 신호를 인정하기 시작합니다. (협력 관계 개선)" }) },
      { text: "제로를 따라 곧장 이동한다.", action: () => ({ flags: { bond_military_dog_stray_cat_resolved: true }, companionMorale: -2, updateLoyalty: { id: 'stray_cat', delta: -5 }, log: "제로는 앞장서지만 고양이는 거리를 두고 뒤따릅니다. (갈등이 남았습니다)" }) }
    ]
  },
  {
    id: 'companion_ration_leadership',
    condition: (state) => state.companions.length >= 2 && state.inventory.includes('ration') && !state.flags.ration_leadership_resolved,
    text: "[리더십 시험] 남은 전투식량은 많지 않습니다. 모두가 당신의 결정을 지켜봅니다. 배급 방식은 동료들이 당신을 어떤 리더로 기억할지 결정합니다.",
    choices: [
      { text: "전투식량 하나를 함께 나누고 배급 원칙을 설명한다.", action: () => ({ itemsLost: ['ration'], flags: { ration_leadership_resolved: true }, companionMorale: 6, log: "식량을 함께 나누고 배급 원칙을 공개했습니다. 동료들은 당신의 공정한 리더십을 기억합니다. (전체 충성도 +6)" }) },
      { text: "식량을 비축하고 임무 기여도에 따라 나중에 배분한다.", action: () => ({ flags: { ration_leadership_resolved: true }, companionMorale: -4, log: "식량을 비축했지만 일부 동료는 배급 기준에 불만을 품었습니다. (전체 충성도 -4)" }) }
    ]
  },
  {
    id: 'companion_dangerous_mission',
    condition: (state) => Math.floor(state.counters.totalHours / 24) >= 2 && state.companions.some(c => ['soldier', 'police', 'engineer'].includes(c.id)) && !state.flags.dangerous_mission_resolved,
    text: "[위험 임무 배정] 무너진 건물 안쪽에서 구조 신호가 들립니다. 정찰을 맡을 동료를 보낼 수도 있지만, 돌아오지 못할 위험이 있습니다. 당신의 결정은 동료들이 리더를 얼마나 믿을지 바꿉니다.",
    choices: [
      { text: '경험이 있는 동료에게 위험을 숨기지 않고 선택권을 준다.', action: (inv, counters, trait, team) => { const candidates = team.filter(c => ['soldier', 'police', 'engineer'].includes(c.id)); const skillBonus = { soldier: 0.14, police: 0.10, engineer: 0.16 }; const scout = candidates.sort((a, b) => ((skillBonus[b.id] || 0) + (b.loyalty || 0) * 0.003 + (b.affinity || 0) * 0.001) - ((skillBonus[a.id] || 0) + (a.loyalty || 0) * 0.003 + (a.affinity || 0) * 0.001))[0]; if (!scout) return { flags: { dangerous_mission_resolved: true }, stats: { health: -8 }, companionMorale: 4, log: '맡길 만한 전문 동료가 없어 직접 정찰했습니다. 동료들은 당신이 위험을 대신 감수한 것을 기억합니다.' }; const chance = Math.max(0.35, Math.min(0.88, 0.32 + (skillBonus[scout.id] || 0) + (scout.loyalty || 0) * 0.003 + (scout.affinity || 0) * 0.001)); const success = Math.random() < chance; if (success) return { flags: { dangerous_mission_resolved: true }, updateLoyalty: { id: scout.id, delta: 8 }, updateAffinity: { id: scout.id, delta: 5 }, itemsGained: ['ration'], log: `${scout.name}이(가) 전문성과 신뢰를 바탕으로 정찰을 마쳤습니다. 구조 신호의 위치와 식량을 확보했습니다. (성공 확률 ${Math.round(chance * 100)}% · 충성도 +8)` }; const casualtyChance = (scout.loyalty || 0) < 35 ? 0.40 : (scout.loyalty || 0) < 55 ? 0.22 : 0.08; if (Math.random() < casualtyChance) return { flags: { dangerous_mission_resolved: true, companion_mission_casualty: scout.id }, removeCompanionId: scout.id, stats: { health: -12, mental: -18 }, companionMorale: -4, log: `정찰 중 무너진 구조물이 ${scout.name}을(를) 덮쳤습니다. 끝내 돌아오지 못했습니다. 동료들은 침묵 속에서 당신의 결정을 되새깁니다. (임무 중 사망)` }; return { flags: { dangerous_mission_resolved: true }, updateLoyalty: { id: scout.id, delta: -12 }, updateAffinity: { id: scout.id, delta: -8 }, stats: { health: -8, mental: -5 }, log: `${scout.name}이(가) 부상을 입고 돌아왔습니다. 신뢰와 전문성이 부족할수록 임무의 위험은 커집니다. (충성도 -12 · 호감도 -8)` }; } },
      { text: '동료를 보내지 않고 직접 정찰한다.', action: () => ({ flags: { dangerous_mission_resolved: true }, stats: { health: -8 }, companionMorale: 5, log: '당신이 직접 위험을 감수했습니다. 동료들은 리더가 자신들을 소모품처럼 여기지 않는다고 느낍니다. (전체 충성도 +5)' }) }
    ]
  }
];
