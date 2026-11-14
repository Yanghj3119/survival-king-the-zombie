// 이동수단 발견
import { VEHICLE_TYPES } from '../world';

export const VEHICLES_EVENTS = [
  {
    id: 'find_vehicle_kickboard',
    condition: (state) => !state.vehicle && (state.travelState ? Math.random() < 0.22 : (state.currentLocation === 'street' || state.currentLocation === 'school') && Math.random() < 0.8),
    text: "[탈것 발견] 길가에 거의 새것 같은 전동 킥보드가 세워져 있습니다! 배터리가 조금 남아있어 보입니다.",
    choices: [
      {
        text: "전동 킥보드를 획득한다.",
        action: () => ({ setVehicle: { id: 'kickboard', cap: VEHICLE_TYPES.kickboard.startCap }, log: `전동 킥보드를 확보했습니다! 배터리는 ${VEHICLE_TYPES.kickboard.startCap}/${VEHICLE_TYPES.kickboard.maxCap}이고, 도로 거리 1칸마다 1씩 줄어듭니다. 이동 시간이 단축됩니다.` })
      },
      {
        text: "배터리를 분해해 부품만 챙긴다.",
        action: () => ({ itemsGained: ['battery_pack'], log: "킥보드 하부를 열어 휴대용 배터리만 떼어 냈습니다." })
      },
      { text: "지나친다.", action: () => ({ log: "킥보드를 남겨두고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'find_vehicle_car',
    condition: (state) => !state.vehicle && (state.travelState ? Math.random() < 0.22 : (state.currentLocation === 'gas_station' || state.currentLocation === 'highway' || state.currentLocation === 'mart') && Math.random() < 0.8),
    text: "[탈것 발견] 방치된 SUV 차를 발견했습니다. 열쇠가 꽂혀 있고 약간의 기름이 남아있습니다!",
    choices: [
      {
        text: "차량에 탑승한다.",
        action: () => ({ setVehicle: { id: 'car', cap: VEHICLE_TYPES.car.startCap }, log: `SUV 자동차를 확보했습니다! 연료는 ${VEHICLE_TYPES.car.startCap}/${VEHICLE_TYPES.car.maxCap}이고, 도로 거리 1칸마다 1씩 줄어듭니다.` })
      },
      {
        text: "차량 연료통에서 기름만 호스로 빼낸다.",
        action: () => ({ itemsGained: ['gas_can'], log: "트렁크에 굴러다니던 빈 캔에 호스로 기름을 옮겨 담아 [휘발유 캔]을 챙겼습니다." })
      },
      { text: "버려두고 지나친다.", action: () => ({ log: "차량을 지나쳤습니다." }) }
    ]
  },
  {
    id: 'find_vehicle_bicycle',
    condition: (state) => !state.vehicle && (state.travelState ? Math.random() < 0.22 : (state.currentLocation === 'school' || state.currentLocation === 'street') && Math.random() < 0.8),
    text: "[탈것 발견] 길가에 버려진 자전거 한 대가 눈에 띕니다. 체인과 바퀴는 아직 멀쩡해 보입니다.",
    choices: [
      {
        text: "자전거를 획득한다.",
        action: () => ({ setVehicle: { id: 'bicycle', cap: 100 }, log: "자전거를 확보했습니다! 페달을 밟는 만큼 체력과 포만감이 줄지만, 걷는 것보다 훨씬 빠릅니다." })
      },
      { text: "지나친다.", action: () => ({ log: "자전거를 두고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'find_vehicle_motorcycle',
    condition: (state) => !state.vehicle && (state.travelState ? Math.random() < 0.22 : (state.currentLocation === 'street' || state.currentLocation === 'police_station') && Math.random() < 0.8),
    text: "[탈것 발견] 방치된 오토바이를 발견했습니다. 연료 게이지가 아직 바닥은 아닙니다.",
    choices: [
      {
        text: "오토바이에 탑승한다.",
        action: () => ({ setVehicle: { id: 'motorcycle', cap: VEHICLE_TYPES.motorcycle.startCap }, log: `오토바이를 확보했습니다! 연료는 ${VEHICLE_TYPES.motorcycle.startCap}/${VEHICLE_TYPES.motorcycle.maxCap}이고, 도로 거리 1칸마다 1씩 줄어듭니다.` })
      },
      {
        text: "연료통의 기름만 빼낸다.",
        action: () => ({ itemsGained: ['gas_can'], log: "오토바이 연료통에서 기름을 뽑아 [휘발유 캔]에 담았습니다." })
      },
      { text: "지나친다.", action: () => ({ log: "오토바이를 지나쳤습니다." }) }
    ]
  }
];
