// 연구소 히든 칩 · 백신 제작

export const LABORATORY_EVENTS = [
  {
    id: 'laboratory_blackbox_signal',
    condition: (state) => !state.travelState && ['laboratory', 'police_station', 'hospital', 'school', 'broadcasting'].includes(state.currentLocation) &&
      !state.flags.chipScenarioStarted && !state.flags.chipScenarioResolved &&
      !state.inventory.includes('semiconductor_chip') && Math.random() < 0.12,
    text: "[미확인 신호] 이 장소 깊숙한 곳에서 낮은 전자음이 반복됩니다. 주변 장비는 대부분 멈췄지만, 한쪽 구석의 비상 전력 패널에는 희미한 불빛이 남아 있습니다.",
    choices: [
      {
        text: "비상 전력 패널을 조작해 잠금장치를 해제한다.",
        action: () => ({ flags: { chipScenarioStarted: true, chipScenarioUnlocked: true }, stats: { mental: -5 }, log: "⚡ 비상 전력이 잠깐 살아나며 잠겨 있던 장치가 열렸습니다. 안쪽에서 정밀 장비가 작동하는 소리가 들립니다." })
      },
      {
        text: "불길한 신호를 무시하고 이곳을 떠난다.",
        action: () => ({ flags: { chipScenarioResolved: true }, log: "정체를 알 수 없는 장비를 뒤로하고 장소를 떠났습니다." })
      }
    ]
  },
  {
    id: 'laboratory_chip_recovery',
    condition: (state) => !state.travelState && ['laboratory', 'police_station', 'hospital', 'school', 'broadcasting'].includes(state.currentLocation) &&
      state.flags.chipScenarioUnlocked && !state.flags.chipScenarioResolved &&
      !state.inventory.includes('semiconductor_chip'),
    text: "[특별 시나리오: 봉인된 장치] 독립 전원으로 유지된 분석 장치가 작동하고 있습니다. 중앙의 차폐 케이스 안에서 손톱만 한 물체가 푸른 빛을 반사합니다. 케이스를 열려면 주변 장비를 조심스럽게 분리해야 합니다.",
    choices: [
      {
        text: "주변 장비를 분리해 차폐 케이스를 연다.",
        action: () => ({ itemsGained: ['semiconductor_chip'], flags: { chipScenarioResolved: true }, stats: { mental: +5 }, log: "🧩 차폐 케이스에서 정체를 알 수 없는 특수 반도체칩을 회수했습니다. 칩 표면에는 아직 읽을 수 없는 식별 코드가 남아 있습니다." })
      },
      {
        text: "위험을 감수하지 않고 장치를 봉인한다.",
        action: () => ({ flags: { chipScenarioResolved: true }, log: "장비를 건드리지 않고 장치를 다시 봉인했습니다. 안쪽의 전자음이 희미해집니다." })
      }
    ]
  },
  {
    id: 'craft_completed_vaccine',
    condition: (state) => state.inventory.includes('pre_clinical_vaccine') && state.companions.some(c => c.id === 'vaccine_developer') && state.companions.some(c => c.id === 'military_dog' || c.id === 'stray_cat') && !state.inventory.includes('completed_vaccine'),
    text: "[백신 완성의 대가] 백신개발자 김박사가 비임상 백신을 완성하려면 생체 실험체가 필요하다고 합니다. 곁에 있는 군견이나 고양이를 희생하면 인류를 구원할 '완성된 백신'을 만들 수 있습니다...",
    choices: [
      {
        text: "눈물을 머금고 반려동물을 희생하여 백신을 완성한다.",
        action: (inv, counters, trait, companions) => {
          const pet = companions.find(c => c.id === 'military_dog' || c.id === 'stray_cat');
          return {
            itemsLost: ['pre_clinical_vaccine'],
            itemsGained: ['completed_vaccine'],
            removeCompanionId: pet.id,
            stats: { mental: -50 },
            log: `반려동물 '${pet.name}'의 희생으로 [완성된 백신]이 제작되었습니다... 엄청난 죄책감에 시달립니다.`
          };
        }
      },
      {
        text: "반려동물은 가족이다. 백신 완성을 단호히 거절한다.",
        action: (inv, counters, trait, companions) => {
          const pet = companions.find(c => c.id === 'military_dog' || c.id === 'stray_cat');
          return {
            stats: { mental: +20 },
            updateLoyalty: { id: pet.id, delta: +50 },
            updateAffinity: { id: pet.id, delta: +50 },
            log: `백신보다 생명을 택했습니다! '${pet.name}'이(가) 당신의 품에 깊이 파고들며 절대적인 충성을 맹세합니다.`
          };
        }
      }
    ]
  }
];
