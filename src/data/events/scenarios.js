// 장소별 시나리오 (공항 · 연구소 · 통제구역)

export const SCENARIOS_EVENTS = [
  {
    id: 'airport_scenario_1',
    condition: (state) => !state.travelState && state.currentLocation === 'airport',
    text: "[장소 시나리오: 국제 공항] 무너진 수화물 검색대 주변에 짐가방들이 흩어져 있습니다.",
    choices: [
      {
        text: "짐가방들을 샅샅이 뒤진다.",
        action: () => {
          if(Math.random() < 0.6) return { itemsGained: ['medkit', 'battery_pack'], log: "버려진 가방에서 구급상자와 휴대용 배터리를 찾았습니다!" };
          return { stats: { health: -15 }, log: "가방 속에서 튀어나온 감염된 보안요원에게 물릴 뻔했습니다." };
        }
      },
      { text: "조심스럽게 우회한다.", action: () => ({ log: "검색대를 조용히 우회했습니다." }) }
    ]
  },
  {
    id: 'airport_scenario_2',
    condition: (state) => !state.travelState && state.currentLocation === 'airport',
    text: "[장소 시나리오: 국제 공항] 불이 꺼진 면세점 구역에 고급 기호품들이 남아 있을 것 같습니다.",
    choices: [
      {
        text: "면세점 안으로 진입한다.",
        action: () => {
          const gained = Math.random() < 0.5 ? ['nutrition_bar', 'coffee'] : ['cigarette'];
          return { itemsGained: gained, log: "면세점에서 소중한 기호품들을 확보했습니다!" };
        }
      },
      { text: "어두워서 위험해 보이니 지나친다.", action: () => ({ log: "면세점 구역을 뒤로하고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'airport_scenario_3',
    condition: (state) => !state.travelState && state.currentLocation === 'airport',
    text: "[장소 시나리오: 국제 공항] 활주로 주변에 버려진 항공유 운반 차량이 서 있습니다.",
    choices: [
      {
        text: "차량에서 연료를 추출해본다.",
        action: () => {
          if(Math.random() < 0.7) return { itemsGained: ['gas_can'], log: "차량에서 소중한 [휘발유 캔]을 추출해냈습니다!" };
          return { stats: { health: -10, hygiene: -15 }, log: "연료가 유출되며 불길이 일어 화상을 입었습니다." };
        }
      },
      { text: "폭발 위험을 피해 멀어진다.", action: () => ({ log: "차량 근처에서 조용히 멀어졌습니다." }) }
    ]
  },
  {
    id: 'lab_scenario_1',
    condition: (state) => !state.travelState && state.currentLocation === 'laboratory',
    text: "[장소 시나리오: 질병통제연구소] 굳게 닫힌 연구실 문 뒤로 냉동 보관함과 구급 장비들이 보입니다.",
    choices: [
      {
        text: "빠루나 마체테로 문을 강제로 연다 (소음·부상 위험).",
        action: (inv) => {
          const w = inv.find(item => ['crowbar', 'machete'].includes(item));
          if (w === 'crowbar') return { useWeapon: w, stats: { health: -3 }, itemsGained: ['medkit', 'wet_wipes'], log: "빠루를 지렛대처럼 걸어 연구실 문을 벌렸습니다. 소음이 울렸지만 구급상자와 물티슈를 확보했습니다." };
          if (w === 'machete') return { useWeapon: w, stats: { health: -15 }, itemsGained: ['medkit', 'wet_wipes'], log: "마체테로 문 주변을 억지로 파손하다 유리에 베였습니다. 구급상자와 물티슈를 확보했습니다!" };
          return { stats: { health: -10 }, log: "문을 열 만한 도구가 없어 무리하게 힘을 쓰다 다쳤습니다." };
        }
      },
      {
        text: "휴대용 배터리를 사용해 전자 잠금장치를 푼다.",
        action: (inv) => {
          if (inv.includes('battery_pack')) {
            return { itemsLost: ['battery_pack'], itemsGained: ['medkit', 'medkit'], log: "배터리를 전력으로 사용해 문을 열고 다량의 의약품을 챙겼습니다!" };
          }
          return { log: "휴대용 배터리가 없어 문을 열 수 없습니다." };
        }
      },
      { text: "지나친다.", action: () => ({ log: "연구실을 지나쳤습니다." }) }
    ]
  },
  {
    id: 'lab_scenario_2',
    condition: (state) => !state.travelState && state.currentLocation === 'laboratory' && !state.inventory.includes('pre_clinical_vaccine') && !state.inventory.includes('completed_vaccine'),
    text: "[장소 시나리오: 질병통제연구소] 메인 서버실 근처에서 특수 보관함에 담긴 '비임상 백신' 샘플을 발견했습니다!",
    choices: [
      {
        text: "비임상 백신 샘플을 가방에 챙긴다.",
        action: () => ({ itemsGained: ['pre_clinical_vaccine'], log: "인류의 희망이 될 수도 있는 [비임상 백신]을 획득했습니다!" })
      },
      { text: "위험한 생물재해 물질일 수 있으니 무시한다.", action: () => ({ log: "샘플을 건드리지 않고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'controlled_area_scenario_1',
    condition: (state) => !state.travelState && state.currentLocation === 'controlled_area',
    text: "[장소 시나리오: 군사 통제구역] 삼엄한 경비가 펼쳐진 안전지대 초소 입구에 다다랐습니다.",
    choices: [
      {
        text: "검문에 순응하고 구호 물자를 배급 받는다.",
        action: () => ({ itemsGained: ['ration', 'soap'], stats: { mental: +15 }, log: "검문을 통과하고 전투식량과 비누를 지원받았습니다." })
      },
      { text: "위압적인 분위기에 겁을 먹고 멀어진다.", action: () => ({ stats: { mental: -5 }, log: "초소를 피해 멀어졌습니다." }) }
    ]
  },
  {
    id: 'controlled_area_scenario_2',
    condition: (state) => !state.travelState && state.currentLocation === 'controlled_area',
    text: "[장소 시나리오: 군사 통제구역] 초소 외곽에 방치된 군수품 상자를 발견했습니다.",
    choices: [
      {
        text: "상자를 몰래 열어 수색한다.",
        action: () => {
          if (Math.random() < 0.5) return { itemsGained: ['pistol'], log: "군수품 상자에서 [권총]을 찾아냈습니다!" };
          return { stats: { health: -10 }, log: "경비병에게 들켜 폭행당하고 쫓겨났습니다." };
        }
      },
      { text: "규율을 지키기 위해 무시한다.", action: () => ({ log: "상자를 무시하고 안전 구역에 머물렀습니다." }) }
    ]
  }
];
