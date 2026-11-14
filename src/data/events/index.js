// 랜덤/조건 이벤트 모음. 이벤트를 추가하려면 해당 분류 파일에 항목만 넣으면 됩니다.
// (퀘스트 우선순위는 배열 순서를 따르므로 아래 순서를 유지하세요.)
import { FAMILY_EVENTS } from './family';
import { SCENARIOS_EVENTS } from './scenarios';
import { LABORATORY_EVENTS } from './laboratory';
import { ENDINGS_EVENTS } from './endings';
import { COMBAT_EVENTS } from './combat';
import { SCAVENGE_EVENTS } from './scavenge';
import { VEHICLES_EVENTS } from './vehicles';
import { RECRUITMENT_EVENTS } from './recruitment';
import { SURVIVAL_EVENTS } from './survival';
import { TRAVEL_EVENTS } from './travel';
import { COMPANIONS_EVENTS } from './companions';

export const EVENTS = [
  ...FAMILY_EVENTS,
  ...SCENARIOS_EVENTS,
  ...LABORATORY_EVENTS,
  ...ENDINGS_EVENTS,
  ...COMBAT_EVENTS,
  ...SCAVENGE_EVENTS,
  ...VEHICLES_EVENTS,
  ...RECRUITMENT_EVENTS,
  ...SURVIVAL_EVENTS,
  ...TRAVEL_EVENTS,
  ...COMPANIONS_EVENTS,
];
