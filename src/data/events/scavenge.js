// 장소별 수색 이벤트

export const SCAVENGE_EVENTS = [
  {
    id: 'find_smoke_items',
    condition: (state) => !state.travelState && (state.currentLocation === 'street' || state.currentLocation === 'subway') && Math.random() < 0.2,
    text: "[수색] 구석진 곳에 버려진 낡은 재떨이와 누군가 벗어둔 점퍼가 떨어져 있습니다.",
    choices: [
      {
        text: "점퍼 주머니를 조심스럽게 확인한다.",
        action: () => {
          if (Math.random() < 0.7) return { itemsGained: ['cigarette', 'lighter'], log: "점퍼 주머니에서 온전한 [담배]와 [라이터]를 획득했습니다!" };
          return { stats: { health: -5 }, log: "주머니 속에 있던 날카로운 파편에 손을 베였습니다." };
        }
      },
      { text: "그냥 지나친다.", action: () => ({ log: "점퍼를 뒤로하고 길을 나섰습니다." }) }
    ]
  },
  {
    id: 'police_armory',
    condition: (state) => !state.travelState && state.currentLocation === 'police_station',
    text: "[장소 시나리오: 관할 경찰서] 철제로 이중 잠금 처리된 경찰서 지하 무기고 입구를 발견했습니다.",
    choices: [
      {
        text: "빠루나 마체테로 무기고 잠금장치를 강제로 연다.",
        action: (inv) => {
          if (inv.includes('crowbar')) return { useWeapon: 'crowbar', itemsGained: ['shotgun'], log: "🛠️ 빠루로 잠금장치 주변을 비틀어 무기고 문을 열고 [샷건]을 확보했습니다!" };
          if (inv.includes('machete')) return { useWeapon: 'machete', stats: { health: -5 }, itemsGained: ['pistol'], log: "🗡️ 마체테로 문고리 주변을 파손해 간신히 진입했습니다. [권총]을 획득했습니다!" };
          return { stats: { health: -10 }, log: "빠루나 적절한 절단 도구가 없어 무기고 문을 열지 못했습니다. 무리하게 힘을 쓰다 손을 다쳤습니다." };
        }
      },
      {
        text: "주변 데스크와 서랍에서 비상 열쇠를 탐색한다.",
        action: () => {
          if (Math.random() < 0.35) return { itemsGained: ['pistol'], log: "서랍 안쪽 비밀 수납함에서 38구경 권총을 발견했습니다!" };
          return { stats: { mental: -5 }, log: "열쇠를 찾지 못하고 시간만 허비했습니다." };
        }
      },
      { text: "소음 발생이 우려되어 그냥 지나친다.", action: () => ({ log: "무기고를 뒤로하고 복도를 벗어났습니다." }) }
    ]
  },
  {
    id: 'police_evidence_room',
    condition: (state) => !state.travelState && state.currentLocation === 'police_station',
    text: "[장소 시나리오: 관할 경찰서] 봉인 테이프가 찢겨 있는 증거물 보관실 문이 살짝 열려 있습니다.",
    choices: [
      {
        text: "내부 증거물 선반을 수색한다.",
        action: () => {
          const rand = Math.random();
          if (rand < 0.3) return { itemsGained: ['machete'], log: "증거물 상자 속에서 날카로운 마체테를 발견했습니다!" };
          if (rand < 0.6) return { itemsGained: ['baton', 'wet_wipes'], log: "진압봉과 위생용 물티슈를 챙겼습니다." };
          return { stats: { health: -15 }, log: "어둠 속에서 잠복해 있던 감염된 경찰관의 기습을 받았습니다!" };
        }
      },
      { text: "위험을 느껴 방을 지나친다.", action: () => ({ log: "증거물 보관실을 우회하여 이동했습니다." }) }
    ]
  },
  {
    id: 'street_broken_atm',
    condition: (state) => !state.travelState && state.currentLocation === 'street',
    text: "[장소 시나리오: 도심 거리] 파손된 자판기와 부서진 ATM이 길가에 방치되어 있습니다.",
    choices: [
      {
        text: "자판기 내부를 도구로 털어본다.",
        action: (inv) => {
          const w = inv.find(item => ['crowbar', 'machete', 'knife', 'baton', 'bat'].includes(item));
          if (w) {
            return { useWeapon: w, itemsGained: ['nutrition_bar', 'coffee'], log: "자판기를 부수고 에너지바와 캔커피를 찾아냈습니다!" };
          }
          return { stats: { hunger: -10 }, log: "도구가 없어 힘만 빼고 수확이 없었습니다." };
        }
      },
      { text: "그냥 지난친다.", action: () => ({ log: "거리를 계속 이동합니다." }) }
    ]
  },
  {
    id: 'street_barricade',
    condition: (state) => !state.travelState && state.currentLocation === 'street',
    text: "[장소 시나리오: 도심 거리] 방치된 바리케이드와 경찰 차량 잔해가 길을 막고 있습니다.",
    choices: [
      {
        text: "경찰차 내부를 수색한다.",
        action: () => {
          const rand = Math.random();
          if (rand < 0.35) return { itemsGained: ['baton'], log: "경찰차 좌석 밑에서 진압봉을 구했습니다!" };
          if (rand < 0.50) return { itemsGained: ['pistol'], log: "글로브 박스 깊은 곳에서 [권총]을 찾아냈습니다!" };
          return { stats: { health: -10 }, log: "깨진 유리창에 베여 상처를 입었습니다." };
        }
      },
      { text: "바리케이드를 우회한다.", action: () => ({ log: "조심스럽게 바리케이드를 돌아서 넘어갔습니다." }) }
    ]
  },
  {
    id: 'general_weapon_scavenge',
    condition: (state) => !state.travelState && state.currentLocation !== 'controlled_area' && Math.random() < 0.22,
    text: '[물자 수색] 무너진 선반과 버려진 가방 사이에서 무언가 단단한 금속 물체가 보입니다. 무기일까요?',
    choices: [
      { text: '잔해를 치우고 물체를 꺼낸다.', action: () => {
        const r = Math.random();
        if (r < 0.22) return { itemsGained: ['crowbar'], log: '잔해 아래에서 쓸 만한 빠루를 발견했습니다.' };
        if (r < 0.40) return { itemsGained: ['bat'], log: '버려진 가방에서 야구 배트를 찾아냈습니다.' };
        if (r < 0.55) return { itemsGained: ['knife'], log: '작업용 칼을 발견했습니다. 날은 조금 무뎌졌지만 여전히 쓸 만합니다.' };
        if (r < 0.63) return { itemsGained: ['machete'], log: '긴 칼집에 들어 있는 마체테를 발견했습니다.' };
        if (r < 0.69) return { itemsGained: ['baton'], log: '금속 진압봉을 찾아냈습니다.' };
        if (r < 0.73) return { itemsGained: ['pistol'], log: '먼지 쌓인 가방 안에서 권총을 발견했습니다.' };
        if (r < 0.75) return { itemsGained: ['shotgun'], log: '잠금 케이스 안에서 샷건을 확보했습니다.' };
        return { itemsGained: [Math.random() < 0.5 ? 'drinking_water' : 'bandage'], log: '무기는 아니었지만 쓸 만한 생존 물자를 확보했습니다.' };
      }},
      { text: '소음을 피하고 그대로 지나친다.', action: () => ({ log: '소음이 날 수 있어 잔해를 건드리지 않고 지나쳤습니다.' }) }
    ]
  },
  {
    id: 'fire_station_sdcard',
    condition: (state) => !state.travelState && state.currentLocation === 'fire_station' && !state.inventory.includes('blackbox_sd') && !state.flags.quest_jisoo_sd_resolved,
    text: '[장소 퀘스트: 소방서] 소방서 차고 안쪽, 멈춰 선 구급차의 블랙박스가 파손된 채 남아 있습니다. 저장 매체는 아직 손상되지 않은 듯합니다.',
    choices: [
      { text: '구급차 블랙박스에서 SD카드를 조심스럽게 회수한다.', action: () => ({ itemsGained: ['blackbox_sd'], flags: { quest_jisoo_sd_found: true }, log: '블랙박스 SD카드를 확보했습니다. 윤지수와 함께 있을 때 기록을 해독할 수 있을 것 같습니다.' }) },
      { text: '주변 잔해를 정리하고 물자를 먼저 수색한다.', action: () => ({ itemsGained: Math.random() < 0.35 ? ['medkit'] : Math.random() < 0.5 ? ['drinking_water'] : ['battery_pack'], log: '소방서 차고의 잔해 사이에서 생존 물자를 찾아냈습니다.' }) }
    ]
  },
  {
    id: 'fire_station_scavenge',
    condition: (state) => !state.travelState && state.currentLocation === 'fire_station',
    text: '[장소 시나리오: 소방서] 소방 호스와 무너진 선반이 통로를 막고 있습니다. 잔해 사이에 구급 물자와 식수가 드문드문 보입니다.',
    choices: [
      { text: '호스를 걷어내며 천천히 수색한다.', action: () => { const r = Math.random(); if (r < 0.15) return { itemsGained: ['medkit'], log: '소방 장비함에서 보존 상태가 좋은 구급상자를 발견했습니다.' }; if (r < 0.25) return { itemsGained: ['bandage'], log: '응급 처치 가방에서 멸균 붕대를 찾았습니다.' }; if (r < 0.32) return { itemsGained: ['painkiller'], log: '구급대 비상 약품함에서 진통제를 확보했습니다.' }; if (r < 0.42) return { itemsGained: ['battery_pack'], log: '비상 전원함에서 휴대용 배터리를 회수했습니다.' }; if (r < 0.55) return { itemsGained: ['drinking_water'], log: '구조대 비상 보급함에서 식수를 확보했습니다.' }; return { stats: { hunger: -8 }, log: '잔해를 치우느라 행동력을 소모했지만 쓸 만한 물자는 찾지 못했습니다.' }; } },
      { text: '무리하지 않고 차고 바깥으로 물러난다.', action: () => ({ log: '더 큰 소음을 내지 않도록 소방서를 빠져나왔습니다.' }) }
    ]
  },
  {
    id: 'blackbox_sd_decrypt',
    condition: (state) => !state.travelState && state.companions.some(c => c.id === 'jisoo') && state.inventory.includes('blackbox_sd') && !state.flags.quest_jisoo_sd_resolved && Math.random() < 0.18,
    text: '[블랙박스 기록 해독] 단말기가 SD카드의 손상된 음성 파일을 복구했습니다. 마지막 교신에는 끝까지 환자를 지키다 희생된 대원들의 목소리가 남아 있습니다. 지수에게 어떻게 전할까요?',
    choices: [
      { text: 'A. 진실을 알리고 함께 애도한다.', action: () => ({ itemsLost: ['blackbox_sd'], flags: { quest_jisoo_sd_resolved: true, jisoo_medical_mastery: true, jisoo_good_ending: true }, stats: { health: +5, mental: -5 }, log: '진실을 들은 지수는 깊은 슬픔을 나눈 뒤 남은 사람들을 살리겠다고 다짐했습니다. 응급 처치 효율이 50%로 영구 상승하고 파티 최대 체력이 소폭 증가합니다.' }) },
      { text: 'B. 동료들이 탈출했다고 말해 희망을 지켜준다.', action: (inv, counters) => ({ itemsLost: ['blackbox_sd'], flags: { quest_jisoo_sd_resolved: true, jisoo_morale_until: counters.totalHours + 72 }, stats: { mental: +10 }, log: '지수는 안도했지만 마음 한편의 불안은 사라지지 않았습니다. 파티 사기가 3일 동안 상승합니다.' }) },
      { text: 'C. 죽은 자는 잊고 생존에 집중하라고 다그친다.', action: () => ({ itemsLost: ['blackbox_sd'], flags: { quest_jisoo_sd_resolved: true, jisoo_fieldcraft_disabled: true, jisoo_bad_ending: true }, stats: { mental: -10 }, log: '지수는 차가운 말에 상처를 입었습니다. 현장 개척 패시브가 영구 비활성화되고 파티 사기가 매일 밤 하락합니다.' }) }
    ]
  },
  {
    id: 'gas_station_scavenge',
    condition: (state) => !state.travelState && state.currentLocation === 'gas_station',
    text: "[장소 시나리오: 주유소] 주유소 정비소 문이 단단히 잠겨 있습니다. 내부엔 기름통과 유용한 도구가 보입니다.",
    choices: [
      {
        text: "유리창을 깨고 진입한다.",
        action: () => {
          if (Math.random() < 0.5) return { itemsGained: ['gas_can', 'pet_food'], stats: { mental: +5 }, log: "유리창을 깨고 들어가 휘발유와 반려동물 사료를 챙겼습니다!" };
          return { stats: { health: -15 }, log: "유리 조각에 다치고 좀비 소음 어그로를 끌었습니다." };
        }
      },
      {
        text: "빠루나 마체테로 잠금장치를 강제로 비틀어 연다.",
        action: (inv) => {
          const w = inv.find(item => ['crowbar', 'machete'].includes(item));
          if (w === 'crowbar') return { useWeapon: w, itemsGained: ['gas_can'], log: "빠루를 지렛대처럼 사용해 정비소 셔터를 들어 올리고 [휘발유 캔]을 구했습니다." };
          if (w === 'machete') return { useWeapon: w, stats: { health: -5 }, itemsGained: ['gas_can'], log: "마체테로 자물쇠를 파손해 정비소에 진입했습니다. [휘발유 캔]을 확보했지만 손을 다쳤습니다." };
          return { stats: { hunger: -15 }, log: "빠루나 마체테가 없어 힘만 쏟고 실패했습니다." };
        }
      },
      { text: "위험하니 그냥 돌아선다.", action: () => ({ log: "주유소를 뒤로하고 떠났습니다." }) }
    ]
  },
  {
    id: 'gas_station_tanker',
    condition: (state) => !state.travelState && state.currentLocation === 'gas_station',
    text: "[장소 시나리오: 주유소] 방치된 유류 수송 탱크로리 차량이 누출 가스를 풍기며 멈춰 서 있습니다.",
    choices: [
      {
        text: "호스를 연결해 남은 기름을 수거한다.",
        action: () => {
          if (Math.random() < 0.5) return { itemsGained: ['gas_can'], log: "탱크 하부에서 유용한 [휘발유 캔]을 추출했습니다!" };
          return { stats: { health: -15, hygiene: -20 }, log: "유독 가스를 마시고 기름을 뒤집어썼습니다." };
        }
      },
      { text: "폭발 위험이 있으니 멀어진다.", action: () => ({ log: "탱크로리를 피해 멀찍이 이동했습니다." }) }
    ]
  },
  {
    id: 'gas_station_convenience',
    condition: (state) => !state.travelState && state.currentLocation === 'gas_station',
    text: "[장소 시나리오: 주유소] 주유소에 병설된 소형 편의점 창고 문이 살짝 열려 있습니다.",
    choices: [
      {
        text: "창고 안을 살핀다.",
        action: () => ({ itemsGained: ['coffee', 'wet_wipes'], log: "창고 안에서 캔커피와 물티슈를 발견했습니다!" })
      },
      { text: "그냥 지나친다.", action: () => ({ log: "편의점을 지나쳤습니다." }) }
    ]
  },
  {
    id: 'mart_scavenge',
    condition: (state) => !state.travelState && state.currentLocation === 'mart',
    text: "[장소 시나리오: 대형 마트] 엉망이 된 마트 진열대 사이로 봉인된 식량 박스가 눈에 띕니다.",
    choices: [
      {
        text: "박스를 개봉해 물자를 챙긴다.",
        action: () => {
          if (Math.random() < 0.5) return { itemsGained: ['ration', 'nutrition_bar'], log: "식량 박스에서 전투식량과 에너지바를 획득했습니다!" };
          return { stats: { health: -10 }, log: "박스 밑에 있던 좀비 손에 매복 공격을 받았습니다." };
        }
      },
      { text: "소음이 날 수 있으니 건드리지 않는다.", action: () => ({ log: "조심스럽게 진열대 사이를 빠져나왔습니다." }) }
    ]
  },
  {
    id: 'mart_warehouse_loot',
    condition: (state) => !state.travelState && state.currentLocation === 'mart',
    text: "[장소 시나리오: 대형 마트] 마트 뒤편 창고에 유통기한이 얼마 남지 않은 대량의 통조림 묶음이 쌓여 있습니다.",
    choices: [
      {
        text: "식량을 최대한 가방에 챙긴다.",
        action: () => ({ itemsGained: ['ration'], log: "통조림과 전투식량을 챙겼습니다!" })
      },
      {
        text: "약탈자의 함정인지 조심스럽게 살핀다.",
        action: () => ({ stats: { mental: +5 }, itemsGained: ['ration'], log: "안전을 확인한 후 식량을 확보했습니다." })
      }
    ]
  },
  {
    id: 'mart_pharmacy_scavenge',
    condition: (state) => !state.travelState && state.currentLocation === 'mart',
    text: "[장소 시나리오: 대형 마트] 마트 내부에 위치한 구급 약국 코너의 셔터가 반쯤 부서져 있습니다.",
    choices: [
      {
        text: "기어 들어가 약품을 수색한다.",
        action: () => {
          if (Math.random() < 0.5) return { itemsGained: ['medkit'], log: "약국 선반에서 보존 상태가 좋은 [구급상자]를 발견했습니다!" };
          return { stats: { health: -15 }, log: "셔터 틈에 걸려 다쳤습니다." };
        }
      },
      { text: "지나친다.", action: () => ({ log: "약국 코너를 뒤로했습니다." }) }
    ]
  },
  {
    id: 'hospital_icu',
    condition: (state) => !state.travelState && state.currentLocation === 'hospital',
    text: "[장소 시나리오: 병원] 집중치료실(ICU) 복도에 의료 장비와 의약품 상자가 박혀 있습니다.",
    choices: [
      {
        text: "의료 상자를 꼼꼼히 탐색한다.",
        action: () => ({ itemsGained: ['medkit', 'soap'], log: "구급상자와 비누 등 위생용품을 구했습니다!" })
      },
      {
        text: "병원 감염 위험을 우려해 신속히 지나친다.",
        action: () => ({ stats: { hygiene: -5 }, log: "신속히 오염 구역을 벗어났습니다." })
      }
    ]
  },
  {
    id: 'hospital_morgue',
    condition: (state) => !state.travelState && state.currentLocation === 'hospital',
    text: "[장소 시나리오: 병원] 지하 영안실 문이 열려 있고 오한이 서립니다. 안쪽에 비상 구급품이 보입니다.",
    choices: [
      {
        text: "위험을 무릅쓰고 영안실로 들어간다.",
        action: () => {
          if (Math.random() < 0.4) return { itemsGained: ['medkit'], stats: { mental: -10 }, log: "소름 끼치는 분위기를 견디고 구급상자를 챙겼습니다!" };
          return { stats: { health: -20, mental: -20 }, log: "깨어난 시체에 급습당해 상처를 입었습니다!" };
        }
      },
      { text: "발걸음을 돌린다.", action: () => ({ log: "차가운 공기를 뒤로하고 철수했습니다." }) }
    ]
  },
  {
    id: 'military_armory',
    condition: (state) => !state.travelState && state.currentLocation === 'military',
    text: "[장소 시나리오: 군부대 진지] 굳게 닫힌 탄약고/무기고 문이 보입니다.",
    choices: [
      {
        text: "빠루나 마체테로 잠금장치 주변을 강제로 연다.",
        action: (inv) => {
          const w = inv.find(item => ['crowbar', 'machete'].includes(item));
          if (w) {
            const extraWeapon = Math.random() < 0.3 ? 'shotgun' : 'knife';
            return { useWeapon: w, itemsGained: [extraWeapon, 'ration'], log: `무기고를 열어 [${extraWeapon === 'shotgun' ? '샷건' : '군용 단검'}]과 전투식량을 획득했습니다!` };
          }
          return { stats: { health: -10 }, log: "강철 문을 열지 못하고 손만 다쳤습니다." };
        }
      },
      { text: "경계 태세를 유지하며 지나친다.", action: () => ({ log: "탄약고를 뒤로하고 이동합니다." }) }
    ]
  },
  {
    id: 'military_bunker',
    condition: (state) => !state.travelState && state.currentLocation === 'military',
    text: "[장소 시나리오: 군부대 진지] 지하 지휘 벙커로 연결되는 계단이 어둠 속에 묻혀 있습니다.",
    choices: [
      {
        text: "조명을 켜고 벙커 진입을 시도한다.",
        action: () => {
          if (Math.random() < 0.4) return { itemsGained: ['radio', 'ration'], log: "벙커 내부에서 작동하는 무전기와 C-정식을 확보했습니다!" };
          return { stats: { health: -25 }, log: "무장한 군인 좀비의 기습을 받아 다쳤습니다." };
        }
      },
      { text: "지하 진입을 포기한다.", action: () => ({ log: "위험한 지하 벙커를 지나쳤습니다." }) }
    ]
  },
  {
    id: 'subway_control_room',
    condition: (state) => !state.travelState && state.currentLocation === 'subway',
    text: "[장소 시나리오: 지하철역] 역무 통제실 문이 잠겨 있으나 창문 안쪽에 캐비닛이 보입니다.",
    choices: [
      {
        text: "창문을 깨고 내부 수색을 진행한다.",
        action: () => ({ itemsGained: ['battery_pack', 'wet_wipes'], log: "통제실 안에서 휴대용 배터리와 물티슈를 찾았습니다!" })
      },
      { text: "어둠 속 소음을 피해 이동한다.", action: () => ({ stats: { mental: -5 }, log: "어두운 선로를 따라 계속 걸었습니다." }) }
    ]
  },
  {
    id: 'subway_vending_machine',
    condition: (state) => !state.travelState && state.currentLocation === 'subway',
    text: "[장소 시나리오: 지하철역] 승강장에 쓰러져 있는 매점 자판기 아래 물건들이 흐트러져 있습니다.",
    choices: [
      {
        text: "자판기 주변을 샅샅이 뒤진다.",
        action: () => ({ itemsGained: ['nutrition_bar'], log: "달콤한 에너지바를 발견하여 기운을 차립니다!" })
      },
      { text: "그냥 지나친다.", action: () => ({ log: "승강장을 떠났습니다." }) }
    ]
  },
  {
    id: 'highway_tour_bus',
    condition: (state) => !state.travelState && state.currentLocation === 'highway',
    text: "[장소 시나리오: 외곽 고속도로] 도로 한복판에 멈춰 선 대형 관광버스가 방치되어 있습니다.",
    choices: [
      {
        text: "버스 내부의 승객 짐가방들을 뒤진다.",
        action: () => {
          if (Math.random() < 0.5) return { itemsGained: ['wet_wipes', 'nutrition_bar'], log: "짐가방에서 물티슈와 에너지바를 구했습니다!" };
          return { stats: { health: -15 }, log: "좌석에 갇혀있던 감염자에게 발목을 물릴 뻔했습니다." };
        }
      },
      { text: "차량 사이로 우회한다.", action: () => ({ log: "관광버스를 돌아 지나쳐갔습니다." }) }
    ]
  },
  {
    id: 'highway_cargo_truck',
    condition: (state) => !state.travelState && state.currentLocation === 'highway',
    text: "[장소 시나리오: 외곽 고속도로] 전복된 대형 화물 트럭의 컨테이너가 열려 있습니다.",
    choices: [
      {
        text: "화물칸 내부로 들어가 물자를 수색한다.",
        action: () => {
          const gained = Math.random() < 0.2 ? 'machete' : 'gas_can';
          return { itemsGained: [gained], log: `화물칸에서 [${gained === 'machete' ? '마체테' : '휘발유 캔'}]을(를) 얻었습니다!` };
        }
      },
      { text: "안전을 위해 그냥 떠난다.", action: () => ({ log: "전복된 트럭을 뒤로하고 걸어갔습니다." }) }
    ]
  },
  {
    id: 'school_cafeteria',
    condition: (state) => !state.travelState && state.currentLocation === 'school',
    text: "[장소 시나리오: 초등학교] 급식실 창고 문이 가볍게 닫혀 있습니다. 대량의 대용량 통조림 식량이 보입니다.",
    choices: [
      {
        text: "창고 내부를 수색해 식량을 확보한다.",
        action: () => ({ itemsGained: ['ration', 'wet_wipes'], log: "급식실 창고에서 유용한 식량과 물티슈를 찾았습니다!" })
      },
      { text: "소리를 죽이고 교실 쪽으로 빠져나간다.", action: () => ({ log: "급식실을 살금살금 빠져나왔습니다." }) }
    ]
  },
  {
    id: 'school_infirmary',
    condition: (state) => !state.travelState && state.currentLocation === 'school',
    text: "[장소 시나리오: 초등학교] 1층 보건실의 구급함이 벽에 걸려 있습니다.",
    choices: [
      {
        text: "보건실 구급함을 털어본다.",
        action: () => {
          if (Math.random() < 0.5) return { itemsGained: ['medkit', 'soap'], log: "보건실 약장에서 구급상자와 비누를 챙겼습니다!" };
          return { stats: { health: -10 }, log: "침대 뒤에 숨어있던 어린 감염자의 기습에 손을 물릴 뻔했습니다." };
        }
      },
      { text: "그냥 지나친다.", action: () => ({ log: "보건실을 뒤로했습니다." }) }
    ]
  },
  {
    id: 'broadcasting_studio',
    condition: (state) => !state.travelState && state.currentLocation === 'broadcasting',
    text: "[장소 시나리오: 방송국] 메인 스튜디오에 비상용 백업 발전기와 방치된 방송 기기들이 널려 있습니다.",
    choices: [
      {
        text: "부품을 추출해 배터리와 유용한 도구를 구한다.",
        action: () => ({ itemsGained: ['battery_pack', 'radio'], log: "방송 장비에서 충전된 [휴대용 배터리]와 [무전기]를 추출했습니다!" })
      },
      { text: "복잡한 내부 스튜디오를 탈출한다.", action: () => ({ log: "스튜디오 조명 아래를 지나쳤습니다." }) }
    ]
  },
  {
    id: 'broadcasting_canteen',
    condition: (state) => !state.travelState && state.currentLocation === 'broadcasting',
    text: "[장소 시나리오: 방송국] 방송국 지하 스태프 매점이 깔끔하게 보존되어 있습니다.",
    choices: [
      {
        text: "매점 셔터를 올려 물품을 챙긴다.",
        action: () => ({ itemsGained: ['nutrition_bar', 'coffee'], log: "매점 안에서 에너지바와 캔커피를 획득했습니다!" })
      },
      { text: "소음 발생을 방지하기 위해 이동한다.", action: () => ({ log: "매점을 지나쳤습니다." }) }
    ]
  },
  {
    id: 'port_container',
    condition: (state) => !state.travelState && state.currentLocation === 'port',
    text: "[장소 시나리오: 항구 물류창고] 수입 컨테이너 하나가 잠금장치가 해제된 채 열려 있습니다.",
    choices: [
      {
        text: "컨테이너 내부로 들어가 물자를 수색한다.",
        action: () => {
          if (Math.random() < 0.5) return { itemsGained: ['gas_can', 'ration'], log: "컨테이너 속 유류 캔과 식량 상자를 대량 획득했습니다!" };
          return { stats: { health: -15 }, log: "컨테이너 안쪽에 갇혀있던 좀비에게 습격당했습니다." };
        }
      },
      { text: "함정일지 모르니 지나친다.", action: () => ({ log: "컨테이너 단지를 지나쳤습니다." }) }
    ]
  },
  {
    id: 'port_lighthouse',
    condition: (state) => !state.travelState && state.currentLocation === 'port',
    text: "[장소 시나리오: 항구 물류창고] 항구 끝자락 등대 초소가 고요하게 서 있습니다. 잠시 쉬어가기 좋은 장소입니다.",
    choices: [
      {
        text: "등대 안으로 들어가 긴장을 풀고 휴식을 취한다.",
        action: () => ({ stats: { mental: +25, health: +10 }, log: "탁 트인 바다를 바라보며 정신력을 크게 회복했습니다." })
      },
      {
        text: "등대 내부 서치라이트 장비를 뒤져본다.",
        action: () => ({ itemsGained: ['battery_pack'], log: "등대 조명 기기에서 고용량 배터리를 추출했습니다." })
      }
    ]
  }
];
