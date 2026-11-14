// 이동수단 발견

export const VEHICLES_EVENTS = [
  {
    id: 'find_vehicle_kickboard',
    condition: (state) => !state.vehicle && (state.travelState ? Math.random() < 0.22 : (state.currentLocation === 'street' || state.currentLocation === 'school') && Math.random() < 0.8),
    text: "[탈것 발견] 길가에 거의 새것 같은 전동 킥보드가 세워져 있습니다! 배터리가 조금 남아있어 보입니다.",
    choices: [
      {
        text: "전동 킥보드를 획득한다.",
        action: () => ({ setVehicle: { id: 'kickboard', cap: 60 }, log: "전동 킥보드를 확보했습니다! 이동 시간이 단축됩니다." })
      },
      {
        text: "배터리를 분해해 부품만 챙긴다.",
        action: () => ({ itemsGained: ['battery_pack'], log: "킥보드에서 휴대용 배터리를 추출했습니다." })
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
        action: () => ({ setVehicle: { id: 'car', cap: 40 }, log: "SUV 자동차를 확보했습니다! 주행 시 기름이 소모됩니다." })
      },
      {
        text: "차량 연료통에서 기름만 호스로 빼낸다.",
        action: () => ({ itemsGained: ['gas_can'], log: "기름을 캔에 받아 [휘발유 캔]을 챙겼습니다." })
      },
      { text: "버려두고 지나친다.", action: () => ({ log: "차량을 지나쳤습니다." }) }
    ]
  },
  {
    id: 'find_vehicle_bicycle',
    condition: (state) => !state.vehicle && (state.travelState ? Math.random() < 0.22 : (state.currentLocation === 'school' || state.currentLocation === 'street') && Math.random() < 0.8),
    text: "[탈것 발견] 주변에 버려진 아직 탈 만한 자전거가 있습니다.",
    choices: [
      {
        text: "자전거를 획득한다.",
        action: () => ({ setVehicle: { id: 'bicycle', cap: 100 }, log: "자전거를 확보했습니다! 체력을 소모하지만 이동이 빠릅니다." })
      },
      { text: "지나친다.", action: () => ({ log: "자전거를 두고 지나쳤습니다." }) }
    ]
  },
  {
    id: 'find_vehicle_motorcycle',
    condition: (state) => !state.vehicle && (state.travelState ? Math.random() < 0.22 : (state.currentLocation === 'street' || state.currentLocation === 'police_station') && Math.random() < 0.8),
    text: "[탈것 발견] 방치된 오토바이를 발견했습니다. 시동이 걸릴 것 같습니다.",
    choices: [
      {
        text: "오토바이에 탑승한다.",
        action: () => ({ setVehicle: { id: 'motorcycle', cap: 50 }, log: "오토바이를 확보했습니다! 주행 시 기름이 소모됩니다." })
      },
      {
        text: "기름만 빼낸다.",
        action: () => ({ itemsGained: ['gas_can'], log: "오토바이에서 [휘발유 캔]을 챙겼습니다." })
      },
      { text: "지나친다.", action: () => ({ log: "오토바이를 지나쳤습니다." }) }
    ]
  }
];
