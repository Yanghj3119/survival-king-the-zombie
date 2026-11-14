// 상태에 의존하지 않는 게임 보조 함수
import { LOCATIONS, RESPAWN_LOCATIONS } from '../data/world';
import { DEATH_MESSAGES } from '../data/messages';

export const getCurrentLocationName = (locationId) => {
  const location = LOCATIONS.find((loc) => loc.id === locationId)
    || RESPAWN_LOCATIONS.find((loc) => loc.id === locationId);
  return location ? location.name : '위치 확인 중';
};

export const formatTime = (totalH) => {
  const day = Math.floor(totalH / 24) + 1;
  const hour = totalH % 24;
  return `D-${day} ${hour.toString().padStart(2, '0')}:00`;
};

export const getRandomDeathMessage = (category) => {
  const msgs = DEATH_MESSAGES[category] || DEATH_MESSAGES.unknown;
  return msgs[Math.floor(Math.random() * msgs.length)];
};

export const generateNextRescue = (currentTotalHours) => {
  const currentDay = Math.floor(currentTotalHours / 24) + 1;
  const nextDay = Math.ceil(currentDay / 3) * 3 || 3;
  const targetDay = currentDay >= nextDay ? currentDay + 3 : nextDay;
  const hour = Math.floor(Math.random() * 15) + 8; 
  const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)].id;
  return { targetDay, hour, locationId: randomLoc };
};

export const getItemVisual = (id) => {
  const data = { 
    'bat': { icon: '🏏', name: '야구 배트' }, 'medkit': { icon: '🚑', name: '구급상자' }, 
    'lighter': { icon: '🔥', name: '라이터' }, 'cigarette': { icon: '🚬', name: '담배' }, 
    'soju': { icon: '🍾', name: '소주' }, 'baton': { icon: '🚓', name: '진압봉' }, 
    'ration': { icon: '🥫', name: '전투식량' }, 'nutrition_bar': { icon: '🍫', name: '에너지바' }, 'knife': { icon: '🗡️', name: '군용 단검' },
    'soap': { icon: '🧼', name: '비누' }, 'wet_wipes': { icon: '🧻', name: '물티슈' },
    'radio': { icon: '📻', name: '무전기' }, 'gas_can': { icon: '⛽', name: '휘발유 캔' },
    'battery_pack': { icon: '🔋', name: '휴대용 배터리' }, 'pet_food': { icon: '🥩', name: '반려동물 사료' },               'drinking_water': { icon: '💧', name: '식수' }, 'blackbox_sd': { icon: '💾', name: '블랙박스 SD카드' },
    'bandage': { icon: '🩹', name: '붕대' }, 'painkiller': { icon: '💊', name: '진통제' },

    'coffee': { icon: '☕', name: '캔커피' },
    'pistol': { icon: '🔫', name: '권총' }, 'shotgun': { icon: '💥', name: '샷건' }, 'machete': { icon: '🗡️', name: '마체테' }, 'crowbar': { icon: '🛠️', name: '빠루' },
    'semiconductor_chip': { icon: '🧩', name: '반도체칩' },
    'pre_clinical_vaccine': { icon: '💉', name: '비임상 백신' }, 'completed_vaccine': { icon: '🧪', name: '완성된 백신' }
  };
  return data[id] || { icon: '📦', name: '알 수 없음' };
};
