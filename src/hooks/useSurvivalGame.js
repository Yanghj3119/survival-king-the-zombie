// 생존왕 게임 엔진: 모든 상태, 타이머(useEffect), 핸들러를 담고 화면(screens)에 전달한다.
import { useState, useEffect, useRef } from 'react';
import { MAX_LOGS, BASE_INVENTORY_SIZE, WEAPONS, weaponMaxDurability } from '../data/config';
import { TRAITS_POOL, START_ITEMS_POOL } from '../data/player';
import { NORMAL_LOGS } from '../data/messages';
import { LOCATIONS, getRoadRoute, RESPAWN_LOCATIONS, VEHICLE_TYPES, GAS_CAN_REFILL, BATTERY_PACK_REFILL, getAutoRefuelThreshold } from '../data/world';
import { EVENTS } from '../data/events';
import useGameAudio from './useGameAudio';
import { getLogCategory, LOG_TONES } from '../lib/logTones';
import { getCurrentLocationName, formatTime, getRandomDeathMessage, generateNextRescue, getItemVisual } from '../lib/gameHelpers';

export default function useSurvivalGame() {
  const [gameState, setGameState] = useState('opening'); 
  const [prologueChoice, setPrologueChoice] = useState('');
  const [prologueSkipText, setPrologueSkipText] = useState(false);
  const [prologueTextDone, setPrologueTextDone] = useState(false);
  const [player, setPlayer] = useState({ name: "", gender: "남성" });
  const [trait, setTrait] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [weaponDurability, setWeaponDurability] = useState({});
  const [companions, setCompanions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('street');
  const [stats, setStats] = useState({ health: 100, hunger: 100, mental: 100, hygiene: 100 });
  const [counters, setCounters] = useState({ totalHours: 8, zombiesKilled: 0 }); 
  const [flags, setFlags] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [logs, setLogs] = useState([]); 
  const [activeEvent, setActiveEvent] = useState(null);
  const [recentEventIds, setRecentEventIds] = useState([]);
  const [reservedLocation, setReservedLocation] = useState(null);
  const [destinationPopupOpen, setDestinationPopupOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState(null);
  const [hoveredMapLocation, setHoveredMapLocation] = useState(null);
  const [itemUseModal, setItemUseModal] = useState(null);
  const [companionIntro, setCompanionIntro] = useState(null);
  const [familyReunionModal, setFamilyReunionModal] = useState(null);
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [statusToast, setStatusToast] = useState('');
  const [statusToastType, setStatusToastType] = useState('item');
  const [travelState, setTravelState] = useState(null);
  const familyQuestTarget = flags.quest_family_reunion_done ? null : (companions.some(c => c.id === 'grandmother') && !companions.some(c => c.id === 'granddaughter') ? 'playground' : companions.some(c => c.id === 'granddaughter') && !companions.some(c => c.id === 'grandmother') ? 'apartment' : null);
  const [vehicle, setVehicle] = useState(null);
  const [isBgmPlaying, setIsBgmPlaying] = useState(true);
  const { bgmAudioRef, typingAudioRef } = useGameAudio({ gameState, isBgmPlaying, prologueSkipText, prologueTextDone });

  const [rescueInfo, setRescueInfo] = useState({ targetDay: 3, hour: 12, locationId: 'broadcasting' });

  const [deathCause, setDeathCause] = useState({ title: '', desc: '' });

  const [discardModal, setDiscardModal] = useState({ open: false, pendingItems: [] });

  // 가족 퀘스트는 정해진 목적지에서 두 번째 가족을 직접 만나야 완료된다.
  // 시간 경과만으로 동료를 자동 합류시키는 처리는 사용하지 않는다.

  const logEndRef = useRef(null);
  const logContainerRef = useRef(null);

  // 시나리오가 열리거나 선택이 끝나면 로그의 최신 기록이 있는 맨 위로 복귀한다.
  useEffect(() => {
    if (logContainerRef.current) logContainerRef.current.scrollTop = 0;
  }, [activeEvent]);
  
  const maxInventorySlots = BASE_INVENTORY_SIZE;

  const handleDeath = (category, causeTitle) => {
    const desc = getRandomDeathMessage(category);
    setDeathCause({ title: causeTitle, desc });
    setIsPlaying(false);
    setTimeout(() => setGameState('gameover'), 800);
  };

  const startGame = () => {
    const spawnPoint = RESPAWN_LOCATIONS[Math.floor(Math.random() * RESPAWN_LOCATIONS.length)];
    const assignedTrait = TRAITS_POOL[Math.floor(Math.random() * TRAITS_POOL.length)];
    const randomItem = START_ITEMS_POOL[Math.floor(Math.random() * START_ITEMS_POOL.length)];
    const maxHealth = assignedTrait.id === 'strong' ? 120 : 100;

    const initialDurability = {};
    if (WEAPONS.includes(randomItem)) {
      initialDurability[randomItem] = weaponMaxDurability(randomItem);
    }

    const initialRescue = generateNextRescue(8);
    setRescueInfo(initialRescue);

    setTrait(assignedTrait);
    setCounters({ totalHours: 8, zombiesKilled: 0, locationHours: 0 });
    setStats({ health: maxHealth, hunger: 100, mental: 100, hygiene: 100 });
    setFlags({});
    setCompanions([]);
    setInventory([randomItem]);
    setWeaponDurability(initialDurability);
    setRecentEventIds([]);
    setReservedLocation(null);
    setTravelState(null);
    setVehicle(null);
    setDeathCause({ title: '', desc: '' });
    // 시작 스폰 지점은 서사 로그로 유지하되, 게임 지도에서 실제로 지원하는 장소 ID로 연결한다.
    // alley / subway_tunnel은 RESPAWN_LOCATIONS 전용 ID라 LOCATIONS 조회와 이동 계산에 사용할 수 없다.
    const startLocationId = spawnPoint.id === 'alley' ? 'street'
      : spawnPoint.id === 'subway_tunnel' ? 'subway'
      : spawnPoint.id;
    setCurrentLocation(startLocationId);

    const prologueLog = {
      radio: '라디오를 다시 작동시켰지만 목소리는 돌아오지 않았다. 잡음 속에 남은 경고가 귓가를 맴돈다.',
      supplies: '당신은 살아남기 위해 주변을 살피고 물자를 챙기기로 했다. 작은 준비가 내일을 결정할 수 있다.',
      door: '주변의 소리를 살피자 가까운 곳의 기척이 멎었다. 침묵이 안전을 뜻하지는 않는다.'
    }[prologueChoice];
    setLogs([
      { timeStr: formatTime(8), text: `[성별: ${player.gender}] 특성 [${assignedTrait.name}]을(를) 가지고 생존을 시작합니다.`, type: 'event' },
      { timeStr: formatTime(8), text: spawnPoint.log, type: 'normal' },
      ...(prologueLog ? [{ timeStr: formatTime(8), text: `[프롤로그] ${prologueLog}`, type: 'event' }] : [])
    ]);
    // 메인 플레이에 들어가기 전 조작 안내를 먼저 보여준다.
    setGameState('tutorial');
    setIsPlaying(false);
  };

  const checkSynergies = () => {
    const cIds = companions.map(c => c.id);
    return {
      tacticalUnit: cIds.includes('police') && cIds.includes('soldier'), 
      medicalTeam: cIds.includes('nurse') && cIds.includes('pharmacist'), 
      survivalBase: cIds.includes('chef') && cIds.includes('engineer'), 
      wildBeasts: cIds.includes('military_dog') && cIds.includes('stray_cat'),
      familyBond: cIds.includes('grandmother') && cIds.includes('granddaughter') 
    };
  };

  const applyCompanionAndTraitEffects = (currentStats) => {
    let healthGain = 0;
    let hungerExtraLoss = companions.filter(c => c.role !== '길고양이' && c.role !== '군견').length * 0.8; 
    let mentalGain = 0;

    const synergies = checkSynergies();

    if (companions.some(c => c.id === 'nurse')) healthGain += (synergies.medicalTeam ? 7 : 4);
    if (companions.some(c => c.id === 'stray_cat')) mentalGain += (synergies.wildBeasts ? 5 : 3);
    if (synergies.familyBond) mentalGain += 5;
    if (trait?.id === 'clean_freak' && currentStats.hygiene >= 80) mentalGain += 3;
    
    const highAffinityCount = companions.filter(c => c.affinity >= 80).length;
    mentalGain += (highAffinityCount * 2);

    const maxHealth = (trait?.id === 'strong' ? 120 : 100) + (flags?.jisoo_good_ending ? 5 : 0);
    return {
      ...currentStats,
      health: Math.min(maxHealth, currentStats.health + healthGain),
      hunger: Math.max(0, currentStats.hunger - hungerExtraLoss),
      mental: Math.min(100, currentStats.mental + mentalGain)
    };
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const maxHealth = (trait?.id === 'strong' ? 120 : 100) + (flags?.jisoo_good_ending ? 5 : 0);

    if (stats.health < maxHealth * 0.10 && inventory.includes('medkit')) {
      handleCraftingUse('heal');
      setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: "⚠️ [자동 사용] 건강 위험(10% 미만)! [구급상자]를 자동으로 사용했습니다.", type: 'event' }].slice(-MAX_LOGS));
    }

    if (stats.hunger < 10 && inventory.includes('ration')) {
      handleCraftingUse('eat_ration');
      setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: "⚠️ [자동 사용] 허기 위험(10% 미만)! [전투식량]을 자동으로 섭취했습니다.", type: 'event' }].slice(-MAX_LOGS));
    }

    if (stats.mental < 10) {
      if (inventory.includes('nutrition_bar')) {
        handleCraftingUse('eat_nutrition_bar');
        setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: "⚠️ [자동 사용] 정신력 위험(10% 미만)! [에너지바]을 자동으로 먹었습니다.", type: 'event' }].slice(-MAX_LOGS));
      } else if (inventory.includes('coffee')) {
        handleCraftingUse('use_coffee');
        setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: "⚠️ [자동 사용] 정신력 위험(10% 미만)! [캔커피]를 자동으로 마셨습니다.", type: 'event' }].slice(-MAX_LOGS));
      } else if (inventory.includes('lighter') && inventory.includes('cigarette')) {
        handleCraftingUse('smoke');
        setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: "⚠️ [자동 사용] 정신력 위험(10% 미만)! [담배]를 자동으로 피웠습니다.", type: 'event' }].slice(-MAX_LOGS));
      }
    }

    if (stats.hygiene < 10) {
      if (inventory.includes('soap')) {
        handleCraftingUse('use_soap');
        setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: "⚠️ [자동 사용] 위생 위험(10% 미만)! [비누]를 자동으로 사용했습니다.", type: 'event' }].slice(-MAX_LOGS));
      } else if (inventory.includes('wet_wipes')) {
        handleCraftingUse('use_wipes');
        setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: "⚠️ [자동 사용] 위생 위험(10% 미만)! [물티슈]를 자동으로 사용했습니다.", type: 'event' }].slice(-MAX_LOGS));
      }
    }

    if (vehicle && VEHICLE_TYPES[vehicle.id]?.type !== 'stamina' && vehicle.cap <= getAutoRefuelThreshold(vehicle.id)) {
      if ((vehicle.id === 'motorcycle' || vehicle.id === 'car') && inventory.includes('gas_can')) {
        handleCraftingUse('refuel_vehicle');
        setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: `⚠️ [자동 사용] 차량 연료 부족(${vehicle.cap}/${VEHICLE_TYPES[vehicle.id].maxCap})! [휘발유 캔]을 자동으로 주유했습니다.`, type: 'event' }].slice(-MAX_LOGS));
      } else if (vehicle.id === 'kickboard' && inventory.includes('battery_pack')) {
        handleCraftingUse('charge_kickboard');
        setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: `⚠️ [자동 사용] 킥보드 배터리 부족(${vehicle.cap}/${VEHICLE_TYPES[vehicle.id].maxCap})! [휴대용 배터리]를 자동으로 충전했습니다.`, type: 'event' }].slice(-MAX_LOGS));
      }
    }
  }, [stats, vehicle, inventory, gameState, counters.totalHours, trait]);

  // 자전거는 체력 20 이하에서 이용할 수 없다. 이동 중이라면 남은 구간을 도보로 전환한다.
  useEffect(() => {
    if (!vehicle || vehicle.id !== 'bicycle' || stats.health > 20) return;
    setVehicle(null);
    setTravelState(prev => {
      if (!prev) return null;
      const remainingDistance = Math.max(0, Number.isFinite(prev.distanceRemaining) ? prev.distanceRemaining : 0);
      return {
        ...prev,
        hoursLeft: Math.max(1, Math.ceil(1 + remainingDistance * 2)),
        vehicleId: null,
        vehicleCostTotal: 0,
        vehicleTravelHours: 0,
        speedMult: 1,
        vehicleNote: `${prev.vehicleNote || ''} (체력 20 이하: 자전거 이용 불가, 도보 전환)`
      };
    });
    setLogs(l => [...l, { timeStr: formatTime(counters.totalHours), text: '⚠️ 체력이 20 이하로 떨어져 자전거를 더 이상 이용할 수 없습니다. 남은 이동은 도보로 전환됩니다.', type: 'event' }].slice(-MAX_LOGS));
  }, [stats.health, vehicle, counters.totalHours]);

  useEffect(() => {
    if (!isPlaying || gameState !== 'playing' || gameSpeed === 0 || activeEvent || discardModal.open || familyReunionModal || companionIntro || itemUseModal || pendingDestination || destinationPopupOpen || selectedCompanion) return;

    const intervalTime = 2500 / gameSpeed;

    const timer = setInterval(() => {
      let baseHoursPassed = Math.floor(Math.random() * 2) + 1;
      let hoursPassed = baseHoursPassed;
      
      if (travelState && travelState.hoursLeft < hoursPassed) {
          hoursPassed = travelState.hoursLeft;
      }

      const newHours = counters.totalHours + hoursPassed;
      const daysSurvived = Math.floor(newHours / 24);
      const curDay = Math.floor(newHours / 24) + 1;
      const curHour = newHours % 24;

      let currentRescue = rescueInfo;
      const rescueTotalHours = (currentRescue.targetDay - 1) * 24 + currentRescue.hour;
      
      if (counters.totalHours <= rescueTotalHours && newHours >= rescueTotalHours) {
          // 구조 예정 시각에 이동이 끝나는 경우, 아직 state에 반영되지 않은 도착지를 기준으로 판정한다.
          const rescueArrival = travelState && travelState.hoursLeft <= hoursPassed;
          const rescueCheckLocation = rescueArrival ? travelState.targetLoc : currentLocation;
          if (rescueCheckLocation === currentRescue.locationId) {
              const targetLocName = LOCATIONS.find(l => l.id === currentRescue.locationId)?.name;
              if (rescueArrival) {
                // 구조 시각에 목적지에 도착했다면 도착 상태와 마지막 주행 연료를 먼저 반영한다.
                setCurrentLocation(travelState.targetLoc);
                setTravelState(null);
                if (travelState.vehicleId && vehicle && vehicle.id === travelState.vehicleId) {
                  const arrivalVehicleData = VEHICLE_TYPES[travelState.vehicleId];
                  if (arrivalVehicleData && arrivalVehicleData.type !== 'stamina') {
                    const finalRawCost = Math.max(0, travelState.distanceRemaining || 0) * arrivalVehicleData.costPerDist + (travelState.fuelCarry || 0);
                    const finalCost = Math.ceil(finalRawCost - 1e-9);
                    const finalCap = Math.max(0, vehicle.cap - finalCost);
                    setVehicle(finalCap <= 0 ? null : { ...vehicle, cap: finalCap });
                  }
                }
              }
              setCounters(prev => ({
                ...prev,
                totalHours: newHours,
                locationHours: rescueArrival ? 0 : (prev.locationHours || 0) + hoursPassed
              }));
              setActiveEvent({
                id: 'rescue_ending_event',
                text: `🚁 [구조대 도착!] 굉음을 내며 [${targetLocName}] 상공에 군용 구조 헬리콥터가 착륙합니다! 무전기로 정보를 파악하고 제시간에 도착한 당신을 향해 구호 대원들이 신호를 보냅니다!`,
                choices: [
                  {
                    text: "🚁 헬기에 탑승하여 아포칼립스를 탈출한다! (생존 성공)",
                    action: () => {
                      setIsPlaying(false);
                      setTimeout(() => setGameState('victory'), 500);
                      return { log: "🎉 축하합니다! 무사히 구조대의 헬기에 탑승하여 죽음의 도시를 탈출했습니다!" };
                    }
                  }
                ]
              });
              setIsPlaying(false);
              return;
          }
      }

      if (newHours > rescueTotalHours) {
          currentRescue = generateNextRescue(newHours);
          setRescueInfo(currentRescue);
      }

      const difficultyMultiplier = 1 + (daysSurvived * 0.08);

      const synergies = checkSynergies();

      let chefMultiplier = companions.some(c => c.id === 'chef') ? 0.75 : 1.0;
      if (synergies.survivalBase) chefMultiplier = 0.50; 

      const isPharmacistActive = companions.some(c => c.id === 'pharmacist');
      const baseHealthDecayRate = (stats.hygiene < 20 && !isPharmacistActive && !synergies.medicalTeam ? 4 : 2);
      
      let engineerHygieneMod = companions.some(c => c.id === 'engineer') ? 0.7 : 1.0;
      if (synergies.survivalBase) engineerHygieneMod = 0.0; 

      const healthDecay = baseHealthDecayRate * difficultyMultiplier * 0.8;
      const hungerDecay = 3 * difficultyMultiplier * chefMultiplier * 0.8;
      const mentalDecayRate = trait?.id === 'calm' ? 0.5 : 1;
      const mentalDecay = (3 * mentalDecayRate) * difficultyMultiplier;
      const hygieneDecay = 4 * difficultyMultiplier * engineerHygieneMod;

      let nextStats = {
        health: Math.max(0, stats.health - healthDecay),
        hunger: Math.max(0, stats.hunger - hungerDecay),
        mental: Math.max(0, stats.mental - mentalDecay),
        hygiene: Math.max(0, stats.hygiene - hygieneDecay)
      };

      if (nextStats.hunger < 30) nextStats.health = Math.max(0, nextStats.health - 2 * difficultyMultiplier * 0.8);
      if (nextStats.hygiene < 30 && !isPharmacistActive && !synergies.medicalTeam) nextStats.mental = Math.max(0, nextStats.mental - 2 * difficultyMultiplier);
      if (nextStats.mental < 30) nextStats.hunger = Math.max(0, nextStats.hunger - 1 * difficultyMultiplier * 0.8);
      if (nextStats.hunger >= 80 && nextStats.hygiene >= 80) nextStats.mental = Math.min(100, nextStats.mental + 1);
      if (flags?.jisoo_morale_until && newHours < flags.jisoo_morale_until) nextStats.mental = Math.min(100, nextStats.mental + 1);
      if (flags?.jisoo_bad_ending && newHours % 24 < 1) nextStats.mental = Math.max(0, nextStats.mental - 2);
      
      nextStats = applyCompanionAndTraitEffects(nextStats);

      setCompanions(prevComps => prevComps.map(c => {
        let loyaltyLoss = 1;
        let affinityLoss = 0;
        if (nextStats.hunger <= 30) { loyaltyLoss += 2; affinityLoss += 1; }
        if (nextStats.hygiene <= 20) loyaltyLoss += 1;
        return { 
          ...c, 
          loyalty: Math.max(0, c.loyalty - loyaltyLoss),
          affinity: Math.max(0, c.affinity - affinityLoss)
        };
      }));

      // 동료 갈등: 할머니와 손녀는 갈등 당사자에서 제외한다. 매 게임 시간 틱마다 소확률로 발생한다.
      const conflictCandidates = companions.filter(c => !['grandmother', 'granddaughter'].includes(c.id));
      if (conflictCandidates.length >= 2 && Math.random() < 0.035) {
        const first = conflictCandidates[Math.floor(Math.random() * conflictCandidates.length)];
        const others = conflictCandidates.filter(c => c.id !== first.id);
        const second = others[Math.floor(Math.random() * others.length)];
        const hasGrandmother = companions.some(c => c.id === 'grandmother');
        const leaveChance = hasGrandmother ? 0.12 : 0.30;
        const conflictText = `⚡ [동료 갈등] ${first.name || first.role}와 ${second.name || second.role}가 보급품과 이동 방식을 두고 크게 다퉜습니다.`;
        if (Math.random() < leaveChance) {
          const leaving = Math.random() < 0.5 ? first : second;
          setCompanions(prev => prev.filter(c => c.id !== leaving.id));
          setLogs(prev => [...prev, { timeStr: formatTime(newHours), text: `${conflictText} 결국 ${leaving.name || leaving.role}가 일행을 떠났습니다.${hasGrandmother ? ' 할머니 순자가 중재해 이탈 가능성을 낮췄습니다.' : ''}`, type: 'event' }].slice(-MAX_LOGS));
        } else {
          setCompanions(prev => prev.map(c => c.id === first.id || c.id === second.id ? { ...c, loyalty: Math.max(0, c.loyalty - 5), affinity: Math.max(0, c.affinity - 4) } : c));
          setLogs(prev => [...prev, { timeStr: formatTime(newHours), text: `${conflictText} 다행히 이탈자는 없었지만 두 사람의 충성도와 호감도가 낮아졌습니다.${hasGrandmother ? ' 할머니 순자가 중재했습니다.' : ''}`, type: 'event' }].slice(-MAX_LOGS));
        }
      }

      if (nextStats.health <= 0) {
        setStats(nextStats);
        handleDeath('health', '체력 고갈 : 치명적인 상처와 과다출혈로 사망');
        return;
      }
      if (nextStats.hunger <= 0) {
        setStats(nextStats);
        handleDeath('hunger', '포만감 부족 : 식량을 섭취하지 못하여 아사');
        return;
      }
      if (nextStats.mental <= 0) {
        setStats(nextStats);
        handleDeath('mental', '정신력 고갈 : 살고자 하는 의지를 상실하고 삶을 포기');
        return;
      }

      const stateForCondition = {
        locationHours: counters.locationHours || 0,
        player, trait, stats: nextStats, counters: { ...counters, totalHours: newHours },
        flags, inventory, companions, currentLocation, vehicle, travelState
      };

      let validEvents = EVENTS.filter(e => e.condition(stateForCondition) && !recentEventIds.includes(e.id));

      // 같은 장소에 오래 머물수록 수색 가능한 물자가 줄어들어 아이템 획득 이벤트가 덜 발생한다.
      const stayedHours = counters.locationHours || 0;
      if (!travelState && currentLocation !== 'controlled_area' && stayedHours >= 24) {
        const lootEventIds = new Set([
          'airport_scenario_1', 'airport_scenario_2', 'airport_scenario_3',
          'find_smoke_items', 'police_armory', 'police_evidence_room',
          'street_broken_atm', 'street_barricade', 'fire_station_scavenge', 'gas_station_scavenge',
          'gas_station_tanker', 'gas_station_convenience', 'mart_scavenge',
          'mart_warehouse_loot', 'mart_pharmacy_scavenge', 'hospital_icu',
          'hospital_morgue', 'military_armory', 'military_bunker',
          'subway_control_room', 'subway_vending_machine', 'highway_tour_bus',
          'highway_cargo_truck', 'school_cafeteria', 'school_infirmary',
          'broadcasting_studio', 'broadcasting_canteen', 'port_container',
          'port_lighthouse', 'find_vehicle_kickboard', 'find_vehicle_car',
          'find_vehicle_bicycle', 'find_vehicle_motorcycle', 'abandoned_backpack'
        ]);
        const lootChance = stayedHours >= 48 ? 0.8 : 0.6;
        validEvents = validEvents.filter(e => !lootEventIds.has(e.id) || Math.random() >= lootChance);
      }
      
      const spawnChance = Math.min(0.95, 0.65 + (daysSurvived * 0.05));
      const triggerRandom = Math.random() < spawnChance;

      let newHoursLeft = travelState ? travelState.hoursLeft - hoursPassed : 0;

      // 이동 중에는 현재 장소 체류시간을 증가시키지 않고, 남은 거리 기준으로 연료를 소모한다.
      let updatedTravelState = travelState;
      if (travelState) {
        const hoursBefore = Math.max(1, travelState.hoursLeft);
        const distanceBefore = Math.max(0, Number.isFinite(travelState.distanceRemaining) ? travelState.distanceRemaining : (travelState.totalDistance || 0));
        // 남은 거리/남은 시간의 비율을 매번 다시 나누면 초반 소모가 줄고 마지막 틱에 몰린다.
        // 최초 주행 거리와 주행 예정 시간을 기준으로 시간당 이동 거리를 일정하게 계산한다.
        const plannedTravelHours = Math.max(1, travelState.vehicleTravelHours || travelState.hoursLeft);
        const plannedTotalDistance = Math.max(0, Number.isFinite(travelState.totalDistance) ? travelState.totalDistance : distanceBefore);
        const distanceCovered = newHoursLeft <= 0
          ? distanceBefore
          : Math.min(distanceBefore, plannedTotalDistance * hoursPassed / plannedTravelHours);
        const distanceRemaining = Math.max(0, distanceBefore - distanceCovered);
        updatedTravelState = { ...travelState, distanceRemaining };

        if (travelState.vehicleId && vehicle && vehicle.id === travelState.vehicleId) {
          const vehicleData = VEHICLE_TYPES[travelState.vehicleId];
          // 연료는 정수 단위로만 줄어든다. 틱마다 이동한 거리의 소수점 소모분은 fuelCarry 에 모아 두었다가
          // 1 이상 쌓이면 차감하고, 도착하는 마지막 틱에는 남은 소수점을 올림해 총 소모량이 정수가 되게 한다.
          let gaugeCost = 0;
          if (vehicleData && vehicleData.type !== 'stamina') {
            const rawCost = distanceCovered * vehicleData.costPerDist + (travelState.fuelCarry || 0);
            gaugeCost = newHoursLeft <= 0 ? Math.ceil(rawCost - 1e-9) : Math.floor(rawCost + 1e-9);
            updatedTravelState = { ...updatedTravelState, fuelCarry: newHoursLeft <= 0 ? 0 : rawCost - gaugeCost };
          }
          const nextCap = Math.max(0, vehicle.cap - gaugeCost);
          if (vehicleData && vehicleData.type !== 'stamina' && nextCap <= 0) {
            setVehicle(null);
            if (newHoursLeft > 0) {
              // 연료/배터리가 바닥나면 남은 구간은 도보 속도로 다시 계산한다.
              newHoursLeft = Math.max(1, Math.ceil(1 + distanceRemaining * 2));
            }
            updatedTravelState = {
              ...updatedTravelState,
              vehicleId: null,
              vehicleCostTotal: 0,
              vehicleTravelHours: 0,
              speedMult: 1
            };
            setLogs(l => [...l, { timeStr: formatTime(newHours), text: `⚠️ ${vehicleData.type === 'battery' ? '배터리' : '연료'}가 없어 운송수단을 이용하지 못합니다.`, type: 'event' }].slice(-MAX_LOGS));
          } else if (vehicleData && vehicleData.type !== 'stamina') {
            setVehicle(v => v && v.id === travelState.vehicleId ? { ...v, cap: nextCap } : v);
          }
        }
      }

      let eventTriggered = false;
      let chosenEvent = null;
      // 비행기 엔딩 조건은 무작위 이벤트 확률 및 최근 이벤트 기록과 무관하게 최우선 처리한다.
      // 이동 중에는 ending_plane.condition이 false이므로 목적지 도착 후에만 발동한다.
      const guaranteedPlaneEnding = EVENTS.find(e => e.id === 'ending_plane' && e.condition(stateForCondition));
      if (guaranteedPlaneEnding) {
        chosenEvent = guaranteedPlaneEnding;
      } else if (validEvents.length > 0 && triggerRandom) {
        const availableSpecialEnding = validEvents.find(e => e.id === 'ending_betrayal' || e.id === 'ending_mutant' || e.id === 'ending_chip_protocol' || e.id === 'ending_companion_legacy');
        if (availableSpecialEnding) {
          chosenEvent = availableSpecialEnding;
        } else {
          // 히든 칩 시나리오는 일반 수색 이벤트보다 먼저 보여줘 발견 기회를 보장한다.
          const hiddenLabEvent = validEvents.find(e => e.id === 'laboratory_blackbox_signal' || e.id === 'laboratory_chip_recovery');
          if (hiddenLabEvent) chosenEvent = hiddenLabEvent;
        }
        // 조건을 충족한 주요 개인 퀘스트/필수 장소 단서는 일반 탐색 이벤트와 경쟁하지 않도록 우선 처리한다.
        // SD카드 해독 자체는 condition 내부의 18% 확률 판정을 통과해야 후보가 되므로 여전히 무작위다.
        const priorityQuestIds = new Set([
          'fire_station_sdcard', 'blackbox_sd_decrypt', 'general_weapon_scavenge',
          'companion_quest_police', 'companion_quest_pharmacist', 'companion_quest_military_dog',
          'companion_quest_stray_cat', 'companion_quest_chef', 'companion_quest_engineer',
          'companion_quest_nurse', 'companion_quest_soldier', 'companion_quest_vaccine_developer',
          'apartment_grandmother', 'playground_granddaughter'
        ]);
        if (!chosenEvent) {
          chosenEvent = validEvents.find(e => priorityQuestIds.has(e.id)) || null;
        }
        const attackIds = new Set(['zombie_horde_attack', 'special_zombie_ambush', 'strength_mutant_ambush', 'speed_mutant_ambush']);
        const attackEvents = validEvents.filter(e => attackIds.has(e.id));
        const regularEvents = validEvents.filter(e => !attackIds.has(e.id));
        const stayDays = travelState ? 0 : Math.floor(Math.max(0, counters.locationHours || 0) / 24);
        // 공격 확률은 이벤트 목록의 개수와 분리해 한 번만 판정한다.
        const attackChance = Math.min(0.72, 0.10 + daysSurvived * 0.035 + stayDays * 0.12); // 2일차부터 변이·특수 좀비 조우 압력을 점진적으로 높임
        if (!chosenEvent && attackEvents.length > 0 && Math.random() < attackChance) {
          const specialEvents = attackEvents.filter(e => e.id !== 'zombie_horde_attack');
          const specialWeight = Math.min(0.88, 0.55 + Math.max(0, daysSurvived - 1) * 0.06);
          chosenEvent = specialEvents.length && Math.random() < specialWeight
            ? specialEvents[Math.floor(Math.random() * specialEvents.length)]
            : (attackEvents.find(e => e.id === 'zombie_horde_attack') || attackEvents[Math.floor(Math.random() * attackEvents.length)]);
        } else if (!chosenEvent && regularEvents.length > 0) {
          const vehicleEvents = travelState ? regularEvents.filter(e => e.id.startsWith('find_vehicle_')) : [];
          const eventPool = vehicleEvents.length > 0 ? vehicleEvents : regularEvents;
          // 발표용 밸런스 조정: 약사·경찰관·요리사 조우 이벤트의 선택 가중치를 소폭 높인다.
          // 이벤트 발동 빈도와 간호사 등장 조건 등 다른 로직은 그대로 유지한다.
          const companionRecruitmentIds = new Set([
            'recruitment_police', 'recruitment_pharmacist', 'recruitment_jisoo', 'recruitment_dog', 'recruitment_cat',
            'recruitment_soldier', 'recruitment_nurse', 'recruitment_chef', 'recruitment_engineer',
            'recruitment_vaccine_developer'
          ]);
          const weightedPool = eventPool.flatMap(e => {
            // 조건을 만족한 동료 조우는 일반 탐색 이벤트보다 우선적으로 뽑히도록 가중치를 높인다.
            const weight = companionRecruitmentIds.has(e.id) ? 6 : 1;
            return Array(weight).fill(e);
          });
          chosenEvent = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        }
      }
      if (chosenEvent) {
        setRecentEventIds(prev => [...prev.slice(-4), chosenEvent.id]);
        setStats(nextStats);
        
        if (travelState) {
          if (newHoursLeft <= 0) {
              setTravelState(null);
              setCurrentLocation(travelState.targetLoc);
              setCounters(c => ({ ...c, totalHours: newHours, locationHours: 0 }));
              setLogs(l => [...l, { timeStr: formatTime(newHours), text: `[목적지 도착] ${travelState.destName}에 도착했습니다.`, type: 'event' }].slice(-MAX_LOGS));
              setStatusToastType('travel');
              setStatusToastType('travel');
            setStatusToast(`✓ 이동 완료 · ${travelState.destName}에 도착했습니다.`);
              setTimeout(() => setStatusToast(''), 2800);
          } else {
              setTravelState({ ...updatedTravelState, hoursLeft: newHoursLeft });
              setCounters(c => ({ ...c, totalHours: newHours, locationHours: 0 }));
          }
        } else {
          setCounters(c => ({ ...c, totalHours: newHours, locationHours: (c.locationHours || 0) + hoursPassed }));
        }

        setActiveEvent(chosenEvent);
        setIsPlaying(false);
        eventTriggered = true;
      }

      if (!eventTriggered) {
        if (travelState) {
          if (newHoursLeft <= 0) {
            setCurrentLocation(travelState.targetLoc);
            setTravelState(null);
            setCounters(c => ({ ...c, totalHours: newHours, locationHours: 0 }));
            setLogs(l => [...l, { timeStr: formatTime(newHours), text: `[목적지 도착] ${travelState.destName}에 도착했습니다.`, type: 'event' }].slice(-MAX_LOGS));
            setStatusToastType('travel');
            setStatusToast(`✓ 이동 완료 · ${travelState.destName}에 도착했습니다.`);
            setTimeout(() => setStatusToast(''), 2800);
          } else {
            setTravelState({ ...updatedTravelState, hoursLeft: newHoursLeft });
            setCounters(c => ({ ...c, totalHours: newHours, locationHours: 0 }));
            setLogs(l => [...l, { timeStr: formatTime(newHours), text: `[이동 중] ${travelState.destName}(으)로 이동하고 있습니다... (남은 시간: ${newHoursLeft}시간, 진행: ${hoursPassed}시간 소요)`, type: 'normal' }].slice(-MAX_LOGS));
          }
        } else {
          const logsArray = NORMAL_LOGS.unsheltered;
          let randomLog = logsArray[Math.floor(Math.random() * logsArray.length)];
          
          if (inventory.includes('radio')) {
            const targetLocName = LOCATIONS.find(l => l.id === currentRescue.locationId)?.name;
            randomLog += ` 📻 [무전기 수신] D-${currentRescue.targetDay} ${currentRescue.hour.toString().padStart(2, '0')}:00에 [${targetLocName}] 구역으로 구조대가 도착합니다! (도착 시간에 맞춰 해당 장소에 있어야 구조될 수 있습니다!)`;
          }

          if (randomLog.includes("쓰레기통을 뒤집니다")) {
            if (Math.random() < 0.08) { 
              const trashPool = ['wet_wipes', 'soap', 'nutrition_bar', 'battery_pack', 'cigarette', 'lighter', 'crowbar'];
              const foundItem = trashPool[Math.floor(Math.random() * trashPool.length)];
              const foundItemName = getItemVisual(foundItem).name;
              randomLog = `쓰레기통을 뒤지던 중 유용한 [${foundItemName}]을(를) 발견하여 챙겼습니다!`;
              
              if (inventory.length < maxInventorySlots) {
                setInventory(inv => {
                  if (WEAPONS.includes(foundItem)) {
                    setWeaponDurability(d => ({ ...d, [foundItem]: weaponMaxDurability(foundItem) }));
                  }
                  return [...inv, foundItem];
                });
              } else {
                setIsPlaying(false);
                setDiscardModal({ open: true, pendingItems: [foundItem] });
              }
            }
          }
          const hoursStayed = (counters.locationHours || 0) + hoursPassed;
          if (currentLocation !== 'controlled_area' && hoursStayed >= 72) {
            nextStats.hunger = Math.max(0, nextStats.hunger - 5);
            nextStats.health = Math.max(0, nextStats.health - 3);
            nextStats.mental = Math.max(0, nextStats.mental - 2);
            if (Math.random() < Math.min(0.65, 0.12 + (hoursStayed - 72) * 0.01)) {
              nextStats.health = Math.max(0, nextStats.health - 8);
              randomLog = `⚠️ [호드 습격] ${Math.floor(hoursStayed)}시간째 정체 중. 보급품은 바닥나고 좀비의 습격이 잦아집니다. 건강 -8`;
            } else {
              randomLog = `⚠️ [고립 위험] ${Math.floor(hoursStayed)}시간째 체류 중. 물자가 고갈되고 허기·건강·정신력이 악화됩니다.`;
            }
          }
          setCounters(c => ({ ...c, totalHours: newHours, locationHours: (c.locationHours || 0) + hoursPassed }));
          setLogs(l => [...l, { timeStr: formatTime(newHours), text: randomLog, type: 'normal' }].slice(-MAX_LOGS));
        }
        setStats(nextStats);
      }

    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, gameState, gameSpeed, player, trait, stats, counters, flags, inventory, companions, currentLocation, recentEventIds, activeEvent, vehicle, discardModal, weaponDurability, rescueInfo, familyReunionModal, companionIntro, itemUseModal, pendingDestination, destinationPopupOpen, selectedCompanion]);

  // 생존 일지는 최신 기록이 위쪽에 유지되도록 자동 스크롤하지 않는다.
  // 플레이어가 읽고 싶은 기록을 직접 스크롤해 확인할 수 있다.

  const handleChoice = (choice) => {
    const result = choice.action(inventory, counters, trait, companions, vehicle, currentLocation);
    const maxHealth = (trait?.id === 'strong' ? 120 : 100) + (flags?.jisoo_good_ending ? 5 : 0);
    const usesFieldcraft = companions.some(c => c.id === 'jisoo') && !flags?.jisoo_fieldcraft_disabled && /장애물|바리케이드|잠금장치|잠긴 문|호스를 걷어내|잔해를 치우/.test(choice.text || '');
    if (usesFieldcraft && result.stats && typeof result.stats.hunger === 'number' && result.stats.hunger < 0) {
      result.stats.hunger = Math.ceil(result.stats.hunger * 0.8);
      result.log = `${result.log || ''} (현장 개척: 장애물 해제 소모 20% 감소)`;
    }
    
    let logStr = result.log || "";

    let currentInv = [...inventory];
    let currentDurability = { ...weaponDurability };

    if (result.useWeapon) {
      const hasParkSangsa = companions.some(c => c.id === 'soldier');
      const durabilityPrevented = hasParkSangsa && Math.random() < 0.30;
      if (durabilityPrevented) {
        const wName = getItemVisual(result.useWeapon).name;
        logStr += `\n🛡️ [박상사 보급 관리] ${wName}의 내구도 소모를 방지했습니다! (30% 확률)`;
      } else {
        let currentDur = currentDurability[result.useWeapon] !== undefined ? currentDurability[result.useWeapon] : weaponMaxDurability(result.useWeapon);
        currentDur -= 1;

      if (currentDur <= 0) {
        const idx = currentInv.indexOf(result.useWeapon);
        if (idx > -1) {
          currentInv.splice(idx, 1);
        }
        delete currentDurability[result.useWeapon];
        const wName = getItemVisual(result.useWeapon).name;
        logStr += `\n💥 무기 [${wName}]의 내구도가 모두 소진되어 내구도 한계로 파괴되었습니다!`;
      } else {
        currentDurability[result.useWeapon] = currentDur;
        const wName = getItemVisual(result.useWeapon).name;
        logStr += `\n⚔️ 무기 [${wName}] 사용! (남은 내구도: ${currentDur}/${weaponMaxDurability(result.useWeapon)})`;
      }
      }
    }

    if (result.setVehicle !== undefined) {
      const previousSpeedMult = travelState?.speedMult || (vehicle ? (VEHICLE_TYPES[vehicle.id]?.speedMult || 1) : 1);
      const nextVehicleData = result.setVehicle ? VEHICLE_TYPES[result.setVehicle.id] : null;
      const nextSpeedMult = nextVehicleData?.speedMult || 1;
      setVehicle(result.setVehicle);

      // 이동 중 새 이동수단을 얻으면 남은 시간·거리·연료 소모를 모두 연결한다.
      if (travelState && result.setVehicle && nextVehicleData && nextSpeedMult < previousSpeedMult) {
        setTravelState(prev => {
          if (!prev) return null;
          const adjustedHours = Math.max(1, Math.round(prev.hoursLeft * nextSpeedMult / previousSpeedMult));
          const remainingDistance = Math.max(0, Number.isFinite(prev.distanceRemaining) ? prev.distanceRemaining : 0);
          const usesGauge = nextVehicleData.type !== 'stamina';
          return {
            ...prev,
            hoursLeft: adjustedHours,
            vehicleId: usesGauge ? result.setVehicle.id : null,
            vehicleCostTotal: usesGauge ? remainingDistance * nextVehicleData.costPerDist : 0,
            vehicleTravelHours: usesGauge ? adjustedHours : 0,
            speedMult: nextSpeedMult
          };
        });
      }
    }
    if (result.addTravelTime) setTravelState(prev => prev ? { ...prev, hoursLeft: prev.hoursLeft + result.addTravelTime } : null);

    const synergies = checkSynergies();

    setStats(prev => {
      let healthDelta = result.stats?.health || 0;
      
      if (healthDelta < 0) {
        if (synergies.tacticalUnit) {
          healthDelta = Math.round(healthDelta * 0.25); 
          logStr = `🛡️ [시너지: 치안유지조] 지헌과 박상사의 철통 호흡으로 피해를 75%나 방어했습니다!\n` + logStr;
        } else if (companions.some(c => c.id === 'soldier')) {
          healthDelta = Math.round(healthDelta * 0.7); 
        } else if (companions.some(c => c.id === 'police')) {
          healthDelta = Math.round(healthDelta * 0.65); 
          logStr = `👮 [경찰관 '지헌'] 지헌이 피해를 차단했습니다!\n` + logStr;
        }

        if (companions.some(c => c.id === 'military_dog')) {
          healthDelta = Math.round(healthDelta * 0.8);
          logStr = `🐕 [군견 '제로'] 군견이 경계하며 위협을 완화시켰습니다!\n` + logStr;
        }

        if (healthDelta < -15 && companions.some(c => c.affinity >= 80)) {
          if(Math.random() < 0.48) {
            healthDelta = Math.round(healthDelta * 0.5);
            logStr = `💖 [협동] 호감도 높은 동료가 위험을 함께 막아 피해를 줄였습니다!\n` + logStr;
          }
        }
      }

      const newStats = {
        health: Math.min(maxHealth, Math.max(0, prev.health + healthDelta)),
        hunger: Math.min(100, Math.max(0, prev.hunger + (result.stats?.hunger || 0))),
        mental: Math.min(100, Math.max(0, prev.mental + (result.stats?.mental || 0))),
        hygiene: Math.min(100, Math.max(0, prev.hygiene + (result.stats?.hygiene || 0)))
      };

      if (newStats.health <= 0) handleDeath('health', '체력 고갈 : 치명적인 상처와 과다출혈로 사망');
      else if (newStats.hunger <= 0) handleDeath('hunger', '포만감 부족 : 식량을 섭취하지 못하여 아사');
      else if (newStats.mental <= 0) handleDeath('mental', '정신력 고갈 : 살고자 하는 의지를 상실하고 삶을 포기');

      return newStats;
    });

    if (result.flags && result.flags.triggerVaccineEnding) {
      setIsPlaying(false);
      setTimeout(() => setGameState('victory_vaccine'), 500);
      delete result.flags.triggerVaccineEnding;
    }
    if (result.flags && result.flags.triggerBetrayalEnding) {
      setIsPlaying(false);
      setTimeout(() => setGameState('ending_betrayal'), 500);
      delete result.flags.triggerBetrayalEnding;
    }
    if (result.flags && result.flags.triggerMutantEnding) {
      setIsPlaying(false);
      setTimeout(() => setGameState('ending_mutant'), 500);
      delete result.flags.triggerMutantEnding;
    }
    if (result.flags && result.flags.triggerCompanionEnding) {
      setIsPlaying(false);
      setTimeout(() => setGameState('ending_companions'), 500);
      delete result.flags.triggerCompanionEnding;
    }
    if (result.flags && result.flags.triggerPlaneEnding) {
      setIsPlaying(false);
      setTimeout(() => setGameState('ending_plane'), 500);
      delete result.flags.triggerPlaneEnding;
    }
    if (result.flags && result.flags.triggerChipEnding) {
      setIsPlaying(false);
      setTimeout(() => setGameState('ending_chip'), 500);
      delete result.flags.triggerChipEnding;
    }

    if (result.flags?.arrived && LOCATIONS.some(loc => loc.id === result.flags.arrived)) {
      setCurrentLocation(result.flags.arrived);
      setTravelState(null);
      setCounters(prev => ({ ...prev, locationHours: 0 }));
      logStr += `\n📍 강제 이동으로 현재 위치가 [${LOCATIONS.find(loc => loc.id === result.flags.arrived)?.name}]으로 변경되었습니다.`;
    }
    if (result.flags) setFlags(prev => ({ ...prev, ...result.flags }));

    if (result.updateLoyalty || result.updateAffinity) {
      setCompanions(prev => prev.map(c => {
        let newC = { ...c };
        if (result.updateLoyalty && c.id === result.updateLoyalty.id) newC.loyalty = Math.min(100, Math.max(0, newC.loyalty + result.updateLoyalty.delta));
        if (result.updateAffinity && c.id === result.updateAffinity.id) newC.affinity = Math.min(100, Math.max(0, newC.affinity + result.updateAffinity.delta));
        return newC;
      }));
    }

    if (typeof result.companionMorale === 'number' && result.companionMorale !== 0) {
      setCompanions(prev => prev.map(c => ({
        ...c,
        loyalty: Math.max(0, Math.min(100, c.loyalty + result.companionMorale)),
        affinity: Math.max(0, Math.min(100, c.affinity + Math.round(result.companionMorale / 2)))
      })));
    }

    if (result.itemsLost) {
      result.itemsLost.forEach(itemToLose => {
        const idx = currentInv.indexOf(itemToLose);
        if (idx > -1) {
          currentInv.splice(idx, 1);
          if (WEAPONS.includes(itemToLose)) {
            delete currentDurability[itemToLose];
          }
        }
      });
    }

    let pendingItemsToModal = [];

    if (result.itemsGained) {
      if (companions.some(c => c.id === 'stray_cat') && Math.random() < 0.25) {
        result.itemsGained.push('pet_food');
        logStr += " 🐈 (고양이 '나비'가 구석에서 사료 봉지를 물어왔습니다!)";
      }

      result.itemsGained.forEach(item => {
        if (WEAPONS.includes(item) && currentDurability[item] === undefined) {
          currentDurability[item] = weaponMaxDurability(item);
        }
        if (currentInv.length < maxInventorySlots) {
          currentInv.push(item);
        } else {
          pendingItemsToModal.push(item);
        }
      });
    }

    setInventory(currentInv);
    setWeaponDurability(currentDurability);

    if (result.addCompanion) {
      const incoming = result.addCompanion;
      const isFamilyRecruit = ['grandmother', 'granddaughter'].includes(incoming.id);
      const recruitmentChance = companions.some(c => c.id === 'granddaughter') ? 0.95 : 0.80;
      if (!isFamilyRecruit && Math.random() >= recruitmentChance) {
        logStr += `\n💬 [동료 영입 실패] ${incoming.name || incoming.role || '생존자'}가 아직 함께할 준비가 되지 않았습니다. (영입 성공 확률 ${Math.round(recruitmentChance * 100)}%)`;
        result.addCompanion = null;
      }
    }
    if (result.addCompanion) {
      const incoming = result.addCompanion;
      const familyIds = ['grandmother', 'granddaughter'];
      const alreadyHasFamily = companions.some(c => familyIds.includes(c.id));
      const isFamilyRecruit = familyIds.includes(incoming.id);
      const hasOtherFamily = isFamilyRecruit && companions.some(c => familyIds.includes(c.id) && c.id !== incoming.id);
      if (hasOtherFamily) {
        const missingId = incoming.id === 'grandmother' ? 'granddaughter' : 'grandmother';
        const missing = missingId === 'grandmother'
          ? { id: 'grandmother', role: '할머니', name: '순자', desc: '가족을 향한 의지: 동료 이탈 확률 감소', loyalty: 90, affinity: 85 }
          : { id: 'granddaughter', role: '손녀', name: '하은', desc: '가족과의 유대: 동료 영입 성공 확률 증가', loyalty: 95, affinity: 90 };
        setCompanions(prev => [...prev, incoming, missing].filter((c, i, a) => a.findIndex(x => x.id === c.id) === i));
        setFlags(prev => ({ ...prev, quest_family_reunion_done: true }));
        setFamilyReunionModal({
          incoming: { ...incoming, log: '가족이 서로를 확인하고 재회했습니다. 두 사람의 개인 퀘스트가 모두 완료되었습니다.' },
          missing,
          story: incoming.id === 'grandmother'
            ? '하은이를 먼저 만난 당신은 순자가 기다리는 아파트로 향했습니다. 창가에서 놀이터를 살피던 순자는 문 앞에 선 하은이를 보고 한동안 말을 잇지 못했습니다.\n\n“하은아… 정말 네가 맞니?”\n“할머니! 저 여기 있어요.”\n\n순자는 서둘러 문을 열고 하은이를 꼭 끌어안았습니다. 긴 기다림 끝에 두 사람은 아파트에서 다시 가족이 되었습니다.'
            : '순자를 먼저 만난 당신은 하은이가 기다리는 놀이터로 향했습니다. 그네 옆에 서 있던 하은이는 순자의 모습을 알아보자마자 달려왔습니다.\n\n“할머니…!”\n“하은아! 얼마나 보고 싶었는지 몰라.”\n\n순자는 하은이를 꼭 끌어안았습니다. 두 사람은 놀이터에서 서로를 다시 찾았고, 긴 기다림 끝에 가족은 다시 함께하게 되었습니다.'
        });
      } else {
        setCompanions(prev => [...prev, incoming]);
        if (['grandmother', 'granddaughter'].includes(incoming.id) && !companions.some(c => ['grandmother', 'granddaughter'].includes(c.id))) {
          setFlags(prev => ({ ...prev, family_first_recruit_hour: Number.isFinite(prev.family_first_recruit_hour) ? prev.family_first_recruit_hour : counters.totalHours }));
        }
        setCompanionIntro(incoming);
        if (incoming.id === 'grandmother') {
          setPendingDestination('playground');
          setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: '[가족 퀘스트] 순자가 동행합니다. 하은을 찾기 위해 목적지가 놀이터로 설정되었습니다.', type: 'event' }].slice(-MAX_LOGS));
        } else if (incoming.id === 'granddaughter') {
          setPendingDestination('apartment');
          setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: '[가족 퀘스트] 하은이가 동행합니다. 순자를 찾기 위해 목적지가 아파트로 설정되었습니다.', type: 'event' }].slice(-MAX_LOGS));
        }
      }
    }
    if (result.removeCompanionId) setCompanions(prev => prev.filter(c => c.id !== result.removeCompanionId));

    // 이동 중 기후/습격 선택의 지연 시간을 생존 로그에 명시한다.
    // 이동 시작/도착 로그와 달리, 일반 생존 로그는 이동 기록 색상을 사용하지 않는다.
    const eventText = String(activeEvent?.text || '');
    const choiceText = String(choice?.text || '');
    const isWeatherOrAttackEvent = /\[(?:기후|습격)\]/.test(eventText);
    const isDetourChoice = /우회|다른 길을 찾|경로를 변경|돌아간다|멀리 돌아/.test(choiceText);
    const isDirectAdvance = /강행 돌파|돌파한다|무기를 휘두르며 맞서 싸운다|정면으로 맞서|액셀/.test(choiceText);
    const alreadyAddsTravelTime = Number(result.addTravelTime) > 0;
    if (travelState && isWeatherOrAttackEvent && !alreadyAddsTravelTime) {
      let delayHours = 0;
      if (isDetourChoice) delayHours = 1;
      else if (!isDirectAdvance) delayHours = 2;
      if (delayHours > 0) {
        result.addTravelTime = delayHours;
        // 이 시점은 기존 addTravelTime 처리보다 뒤이므로 실제 남은 이동 시간에도 반영한다.
        setTravelState(prev => prev ? { ...prev, hoursLeft: prev.hoursLeft + delayHours } : null);
        logStr += (logStr ? '\\n' : '') + `⏳ 선택한 대응으로 이동 시간이 ${delayHours}시간 증가합니다.`;
      }
    }

    if (logStr) setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: logStr, type: 'event' }].slice(-MAX_LOGS));
    
    setActiveEvent(null);

    if (pendingItemsToModal.length > 0) {
      setIsPlaying(false);
      setDiscardModal({ open: true, pendingItems: pendingItemsToModal });
    } else {
      setTimeout(() => {
        setStats(currentStats => { 
          if(gameState === 'playing' && currentStats.health > 0 && currentStats.hunger > 0 && currentStats.mental > 0) setIsPlaying(true);
          return currentStats;
        });
      }, 600);
    }
  };

  // 목적지 목록에 표시할 이동 예상치. 실제 이동 로직은 기존 handleSelectLocation 계산을 그대로 유지한다.
  const getTravelEstimate = (loc) => {
    const currentLocData = LOCATIONS.find(l => l.id === currentLocation) || LOCATIONS[0];
    const isCurrent = currentLocation === loc.id && !travelState;
    const route = getRoadRoute(currentLocation, loc.id);
    const dist = isCurrent ? 0 : route.distance;
    const familyRoute = !isCurrent && route.path.length > 1 && route.path.every(id => ['school','apartment','playground'].includes(id));
    const baseHours = isCurrent ? 0 : familyRoute ? route.path.length - 1 : Number.isFinite(dist) ? 1 + dist * 2 : Infinity;
    const vData = vehicle ? VEHICLE_TYPES[vehicle.id] : null;
    let hours = baseHours;
    let travelMode = '도보';
    let resourceNote = '추가 소모 없음';
    let resourceWarning = false;

    if (!isCurrent && vData) {
      const cost = dist * vData.costPerDist;
      if (vData.type === 'stamina') {
        if (stats.health <= 20) {
          resourceNote = '체력 부족으로 도보 이동';
          resourceWarning = true;
        } else {
          hours = Math.max(1, Math.round(baseHours * vData.speedMult));
          travelMode = vData.name;
          resourceNote = `체력 약 ${Math.round(cost / 2)} · 포만감 ${cost} 소모`;
        }
      } else if (vehicle.cap >= cost) {
        hours = Math.max(1, Math.round(baseHours * vData.speedMult));
        travelMode = vData.name;
        resourceNote = `${vData.type === 'fuel' ? '연료' : '배터리'} ${cost} 소모 · 보유 ${vehicle.cap}/${vData.maxCap}`;
      } else {
        resourceNote = `${vData.name} ${vData.type === 'fuel' ? '연료' : '배터리'} 부족 (보유 ${vehicle.cap} / 필요 ${cost}) · 도보 이동`;
        resourceWarning = true;
      }
    }
    return { isCurrent, dist, hours, travelMode, resourceNote, resourceWarning, route: route.path, reachable: Number.isFinite(dist) };
  };

  const handleSelectLocation = (locId) => {
    setDestinationPopupOpen(false);
    if (familyQuestTarget && locId !== familyQuestTarget) {
      setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: `[가족 퀘스트] 가족을 다시 만나기 전까지 목적지는 [${LOCATIONS.find(l => l.id === familyQuestTarget)?.name}]로 고정됩니다.`, type: 'event' }].slice(-MAX_LOGS));
      setStatusToast(`가족 퀘스트 목적지: ${getCurrentLocationName(familyQuestTarget)}`);
      setTimeout(() => setStatusToast(''), 2600);
      return;
    }
    if (familyQuestTarget && currentLocation === familyQuestTarget && !travelState && locId !== familyQuestTarget) {
      setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: '[가족 퀘스트] 이 장소에서 가족 상봉을 완료하기 전에는 이동할 수 없습니다.', type: 'event' }].slice(-MAX_LOGS));
      return;
    }
    if (locId === currentLocation && !travelState) return;
    if (activeEvent) {
      setReservedLocation(locId);
      setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: `[이동 예약] 현재 상황이 종료된 후 [${LOCATIONS.find(l => l.id === locId)?.name}](으)로 자동 이동합니다.`, type: 'event' }].slice(-MAX_LOGS));
      return;
    }
    
    const targetLoc = LOCATIONS.find(l => l.id === locId);
    const currentLoc = LOCATIONS.find(l => l.id === currentLocation) || LOCATIONS[0];
    
    // 이동 계산은 지도와 동일한 도로망의 최단 경로를 사용한다. 아파트/놀이터 출발은 ROAD_EDGES에 따라 초등학교 경유가 강제된다.
    const route = getRoadRoute(currentLoc.id, targetLoc.id);
    const dist = route.distance;
    if (!Number.isFinite(dist) || route.path.length < 2) {
      setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: `[이동 불가] ${targetLoc.name}까지 연결된 도로가 없습니다.`, type: 'event' }].slice(-MAX_LOGS));
      return;
    }
    const familyRoute = route.path.length > 1 && route.path.every(id => ['school', 'apartment', 'playground'].includes(id));
    let baseHours = familyRoute ? route.path.length - 1 : 1 + (dist * 2);

    let vData = vehicle ? VEHICLE_TYPES[vehicle.id] : null;
    let actualTravelTime = baseHours;
    let vehicleStatusNote = "";
    let travelVehicleId = null;
    let travelVehicleCost = 0;
    let actualSpeedMult = 1;

    if (vehicle && vData) {
      const cost = dist * vData.costPerDist;
      if (vData.type === 'stamina' && stats.health <= 20) {
        setVehicle(null);
        actualTravelTime = baseHours;
        vehicleStatusNote = ' (⚠️ 체력 20 이하라 자전거를 이용할 수 없어 도보 이동)';
      } else if (vData.type === 'stamina') {
        actualTravelTime = Math.max(1, Math.round(baseHours * vData.speedMult));
        actualSpeedMult = vData.speedMult;
        setStats(s => ({ ...s, hunger: Math.max(0, s.hunger - cost), health: Math.max(1, s.health - Math.round(cost/2)) }));
        vehicleStatusNote = ` (🚲 자전거 이동: 체력/포만감 추가 소모)`;
      } else if (vehicle.cap >= cost) {
        // 목적지까지 필요한 연료/배터리가 충분할 때만 차량의 단축 이동 시간을 적용한다.
        // 부족한 연료로 전체 경로를 차량 속도로 이동하는 문제를 막는다.
        actualTravelTime = Math.max(1, Math.round(baseHours * vData.speedMult));
        actualSpeedMult = vData.speedMult;
        travelVehicleId = vehicle.id;
        travelVehicleCost = cost;
        vehicleStatusNote = ` (${vData.name} 이동: 목적지까지 필요한 ${vData.type === 'battery' ? '배터리' : '연료'}를 사용합니다)`;
      } else {
        actualTravelTime = baseHours;
        vehicleStatusNote = ` (⚠️ ${vData.name}의 ${vData.type === 'battery' ? '배터리' : '연료'}가 목적지까지 부족해 도보로 이동합니다)`;
      }
    }

    setCounters(prev => ({ ...prev, locationHours: 0 }));
    setTravelState({
      targetLoc: targetLoc.id,
      hoursLeft: actualTravelTime,
      destName: targetLoc.name,
      vehicleNote: vehicleStatusNote,
      vehicleId: travelVehicleId,
      vehicleCostTotal: travelVehicleCost,
      vehicleTravelHours: actualTravelTime,
      speedMult: actualSpeedMult,
      distanceRemaining: dist,
      totalDistance: dist,
      baseTravelHours: baseHours
    });
    setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: `[이동 시작] ${targetLoc.name}(으)로 이동합니다. (도로 경로: ${route.path.map(id => LOCATIONS.find(l => l.id === id)?.name || id).join(' → ')} · 거리 ${dist} · 예상 소요 시간: ${actualTravelTime}시간)${vehicleStatusNote}`, type: 'event' }].slice(-MAX_LOGS));
    setStatusToastType('travel');
    setStatusToast(`➜ 이동 시작 · ${targetLoc.name}까지 예상 ${actualTravelTime}시간${vehicleStatusNote}`);
    setTimeout(() => setStatusToast(''), 2800);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!activeEvent && reservedLocation && isPlaying && gameState === 'playing') {
      const loc = reservedLocation;
      setReservedLocation(null);
    setTravelState(null);
      handleSelectLocation(loc);
    }
  }, [activeEvent, reservedLocation, isPlaying, gameState]);

  const handleInventoryItemClick = (itemId) => {
    const actions = {
      medkit: { action: 'heal', title: '구급상자 사용', effect: '건강 +40. 의료 동료 조합에 따라 추가 회복할 수 있습니다.' },
      bandage: { action: 'use_bandage', title: '붕대 사용', effect: '건강을 회복합니다. 윤지수와 퀘스트 결과에 따라 회복 효율이 증가합니다.' },
      painkiller: { action: 'use_painkiller', title: '진통제 사용', effect: '통증을 완화하고 건강과 정신력을 회복합니다. 윤지수의 응급 처치 효과가 적용됩니다.' },
      ration: { action: 'eat_ration', title: '전투식량 섭취', effect: '포만감 +35, 건강 +5. 요리사 동료가 있으면 포만감 회복량이 증가하고, 동료들의 충성도와 호감도도 상승합니다.' },
      nutrition_bar: { action: 'eat_nutrition_bar', title: '에너지바 섭취', effect: '포만감 +20, 건강 +5. 가볍게 허기를 달래는 비상식량입니다.' },
      soap: { action: 'use_soap', title: '비누 사용', effect: '위생 +45, 정신력 +5.' },
      wet_wipes: { action: 'use_wipes', title: '물티슈 사용', effect: '위생 +30.' },
      drinking_water: { action: 'drink_water', title: '식수 마시기', effect: '포만감 +10, 정신력 +2.' },
      gas_can: { action: 'refuel_vehicle', title: '휘발유 주유', effect: `오토바이나 자동차의 연료를 ${GAS_CAN_REFILL}만큼 채웁니다. (최대치까지)` },
      battery_pack: { action: 'charge_kickboard', title: '배터리 팩 사용', effect: `전동 킥보드의 배터리를 ${BATTERY_PACK_REFILL}만큼 충전합니다. (최대치까지)` },
      pet_food: { action: 'feed_pet', title: '동료 동물에게 사료 주기', effect: '군견 또는 길고양이 동료의 충성도와 호감도를 최대로 회복하고, 정신력 +25.' },
      soju: { action: 'use_soju', title: '소주 마시기', effect: '정신력 +20, 건강 -5. 공포를 잠시 잊지만 몸에 부담이 됩니다.' },
      coffee: { action: 'use_coffee', title: '캔커피 섭취', effect: '정신력 +15, 포만감 +5.' },
      cigarette: { action: 'smoke', title: '담배 피우기', effect: '정신력 +40. 라이터가 필요합니다.' }
    };
    const entry = actions[itemId];
    if (!entry) return;
    let error = null;
    if (itemId === 'gas_can' && (!vehicle || !['motorcycle','car'].includes(vehicle.id))) error = '주유 가능한 오토바이나 자동차가 없습니다.';
    if (itemId === 'battery_pack' && (!vehicle || vehicle.id !== 'kickboard')) error = '충전할 전동 킥보드가 없습니다.';
    if (itemId === 'pet_food' && !companions.some(c => c.role === '군견' || c.role === '길고양이')) error = '사료를 줄 군견 또는 길고양이 동료가 없습니다.';
    if (itemId === 'cigarette' && !inventory.includes('lighter')) error = '담배를 피우려면 라이터가 필요합니다.';
    setItemUseModal({ itemId, ...entry, error });
  };

  const handleCraftingUse = (actionType) => {
    const maxHealth = (trait?.id === 'strong' ? 120 : 100) + (flags?.jisoo_good_ending ? 5 : 0);
    const synergies = checkSynergies();

    if (actionType === 'smoke') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('cigarette'), 1); return newInv; });
      setStats(prev => ({ ...prev, mental: Math.min(100, prev.mental + 40) }));
    } else if (actionType === 'heal') {
      let healAmount = companions.some(c => c.id === 'pharmacist') ? 60 : 40;
      if (synergies.medicalTeam) healAmount = 80; 
      if (companions.some(c => c.id === 'jisoo')) healAmount = Math.round(healAmount * (flags?.jisoo_medical_mastery ? 1.5 : 1.2));
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('medkit'), 1); return newInv; });
      setStats(prev => ({ ...prev, health: Math.min(maxHealth, prev.health + healAmount) }));
    } else if (actionType === 'use_bandage') {
      const base = 20;
      const multiplier = companions.some(c => c.id === 'jisoo') ? (flags?.jisoo_medical_mastery ? 1.5 : 1.2) : 1;
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('bandage'), 1); return newInv; });
      setStats(prev => ({ ...prev, health: Math.min(maxHealth, prev.health + Math.round(base * multiplier)) }));
    } else if (actionType === 'use_painkiller') {
      const multiplier = companions.some(c => c.id === 'jisoo') ? (flags?.jisoo_medical_mastery ? 1.5 : 1.2) : 1;
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('painkiller'), 1); return newInv; });
      setStats(prev => ({ ...prev, health: Math.min(maxHealth, prev.health + Math.round(10 * multiplier)), mental: Math.min(100, prev.mental + 5) }));
    } else if (actionType === 'eat_nutrition_bar') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('nutrition_bar'), 1); return newInv; });
      setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 20), health: Math.min(maxHealth, prev.health + 5) }));
    } else if (actionType === 'eat_ration') {
      const hungerAmount = companions.some(c => c.id === 'chef') ? 45 : 35;
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('ration'), 1); return newInv; });
      setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + hungerAmount), health: Math.min(maxHealth, prev.health + 5) }));
      setCompanions(prev => prev.map(c => ({ ...c, loyalty: Math.min(100, c.loyalty + 5), affinity: Math.min(100, c.affinity + 3) })));
    } else if (actionType === 'use_soap') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('soap'), 1); return newInv; });
      setStats(prev => ({ ...prev, hygiene: Math.min(100, prev.hygiene + 45), mental: Math.min(100, prev.mental + 5) }));
    } else if (actionType === 'use_wipes') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('wet_wipes'), 1); return newInv; });
      setStats(prev => ({ ...prev, hygiene: Math.min(100, prev.hygiene + 30) }));
    } else if (actionType === 'drink_water') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('drinking_water'), 1); return newInv; });
      setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 10), mental: Math.min(100, prev.mental + 2) }));
    } else if (actionType === 'refuel_vehicle') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('gas_can'), 1); return newInv; });
      setVehicle(v => ({ ...v, cap: Math.min(VEHICLE_TYPES[v.id].maxCap, v.cap + GAS_CAN_REFILL) }));
    } else if (actionType === 'charge_kickboard') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('battery_pack'), 1); return newInv; });
      setVehicle(v => ({ ...v, cap: Math.min(VEHICLE_TYPES[v.id].maxCap, v.cap + BATTERY_PACK_REFILL) }));
    } else if (actionType === 'use_soju') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('soju'), 1); return newInv; });
      setStats(prev => ({ ...prev, mental: Math.min(100, prev.mental + 20), health: Math.max(0, prev.health - 5) }));
    } else if (actionType === 'use_coffee') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('coffee'), 1); return newInv; });
      setStats(prev => ({ ...prev, mental: Math.min(100, prev.mental + 15), hunger: Math.min(100, prev.hunger + 5) }));
    } else if (actionType === 'feed_pet') {
      setInventory(prev => { const newInv = [...prev]; newInv.splice(newInv.indexOf('pet_food'), 1); return newInv; });
      setCompanions(prev => prev.map(c => (c.role === '군견' || c.role === '길고양이') ? { ...c, loyalty: 100, affinity: 100 } : c));
      setStats(prev => ({ ...prev, mental: Math.min(100, prev.mental + 25) }));
    }

    const effectMessages = {
      smoke: '정신력 +40 · 담배 1개 소모',
      heal: `건강 +${synergies.medicalTeam ? 80 : (companions.some(c => c.id === 'pharmacist') ? 60 : 40)} · 구급상자 1개 소모`,
      use_bandage: `건강 +${Math.round(20 * (companions.some(c => c.id === 'jisoo') ? (flags?.jisoo_medical_mastery ? 1.5 : 1.2) : 1))} · 붕대 1개 소모`,
      use_painkiller: `건강 +${Math.round(10 * (companions.some(c => c.id === 'jisoo') ? (flags?.jisoo_medical_mastery ? 1.5 : 1.2) : 1))}, 정신력 +5 · 진통제 1개 소모`,
      eat_ration: `포만감 +${companions.some(c => c.id === 'chef') ? 45 : 35}, 건강 +5 · 전투식량 1개 소모`,
      use_soap: '위생 +45, 정신력 +5 · 비누 1개 소모',
      use_wipes: '위생 +30 · 물티슈 1개 소모',
      drink_water: '갈증 완화 · 식수 1개 소모',
      refuel_vehicle: `차량 연료 +${GAS_CAN_REFILL} · 휘발유 캔 1개 소모`,
      charge_kickboard: `킥보드 배터리 +${BATTERY_PACK_REFILL} · 배터리 팩 1개 소모`,
      use_soju: '정신력 +20, 건강 -5 · 소주 1개 소모',
      use_coffee: '정신력 +20, 포만감 +10 · 캔커피 1개 소모',
      feed_pet: '동물 동료 충성도·호감도 최대 회복, 정신력 +25 · 사료 1개 소모'
    };
    if (effectMessages[actionType]) {
      // 아이템 사용 결과는 아이템 패널의 주황색 테두리를 사용한다.
      setStatusToastType('item');
      setStatusToast(`✓ ${effectMessages[actionType]}`);
      setTimeout(() => setStatusToast(''), 2800);
    }
  };

  const handleDiscardChoice = (discardedItemIndex, isPendingItem = false) => {
    if (isPendingItem) {
      const updatedPending = [...discardModal.pendingItems];
      const droppedItem = updatedPending.splice(discardedItemIndex, 1)[0];
      
      setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: `🎒 가방 공간 부족으로 새 아이템 [${getItemVisual(droppedItem).name}] 획득을 포기했습니다.`, type: 'event' }].slice(-MAX_LOGS));
      
      if (updatedPending.length > 0 && inventory.length >= maxInventorySlots) {
        setDiscardModal({ open: true, pendingItems: updatedPending });
      } else {
        let finalDurability = { ...weaponDurability };
        updatedPending.forEach(item => {
          if (WEAPONS.includes(item) && finalDurability[item] === undefined) {
            finalDurability[item] = weaponMaxDurability(item);
          }
        });
        setWeaponDurability(finalDurability);
        setInventory(prev => [...prev, ...updatedPending].slice(0, maxInventorySlots));
        setDiscardModal({ open: false, pendingItems: [] });
        setIsPlaying(true);
      }
    } else {
      const updatedInv = [...inventory];
      const droppedItem = updatedInv.splice(discardedItemIndex, 1)[0];
      
      let finalDurability = { ...weaponDurability };
      if (WEAPONS.includes(droppedItem)) {
        delete finalDurability[droppedItem];
      }

      const nextPending = [...discardModal.pendingItems];
      if (nextPending.length > 0) {
        const newAdded = nextPending.shift();
        
        setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: `🎒 가방이 가득 차서 [${getItemVisual(droppedItem).name}]을(를) 버리고 [${getItemVisual(newAdded).name}]을(를) 획득했습니다.`, type: 'event' }].slice(-MAX_LOGS));
        
        if (WEAPONS.includes(newAdded) && finalDurability[newAdded] === undefined) {
          finalDurability[newAdded] = weaponMaxDurability(newAdded);
        }
        updatedInv.push(newAdded);
      } else {
        setLogs(prev => [...prev, { timeStr: formatTime(counters.totalHours), text: `🎒 가방에서 [${getItemVisual(droppedItem).name}]을(를) 버렸습니다.`, type: 'event' }].slice(-MAX_LOGS));
      }
      
      setWeaponDurability(finalDurability);
      setInventory(updatedInv);
      
      if (nextPending.length > 0 && updatedInv.length >= maxInventorySlots) {
        setDiscardModal({ open: true, pendingItems: nextPending });
      } else {
        setDiscardModal({ open: false, pendingItems: [] });
        setIsPlaying(true);
      }
    }
  };

  const currentDay = Math.floor(counters.totalHours / 24) + 1;
  const maxHealth = (trait?.id === 'strong' ? 120 : 100) + (flags?.jisoo_good_ending ? 5 : 0);
  const activeSynergies = checkSynergies();

  return {
    gameState, setGameState, prologueChoice, setPrologueChoice, prologueSkipText, setPrologueSkipText,
    prologueTextDone, setPrologueTextDone, player, setPlayer, trait, setTrait,
    inventory, setInventory, weaponDurability, setWeaponDurability, companions, setCompanions,
    currentLocation, setCurrentLocation, stats, setStats, counters, setCounters,
    flags, setFlags, isPlaying, setIsPlaying, gameSpeed, setGameSpeed,
    logs, setLogs, activeEvent, setActiveEvent, recentEventIds, setRecentEventIds,
    reservedLocation, setReservedLocation, destinationPopupOpen, setDestinationPopupOpen, pendingDestination, setPendingDestination,
    hoveredMapLocation, setHoveredMapLocation, itemUseModal, setItemUseModal, companionIntro, setCompanionIntro,
    familyReunionModal, setFamilyReunionModal, selectedCompanion, setSelectedCompanion, statusToast, setStatusToast,
    statusToastType, setStatusToastType, travelState, setTravelState, familyQuestTarget, vehicle,
    setVehicle, isBgmPlaying, setIsBgmPlaying, bgmAudioRef, typingAudioRef, rescueInfo,
    setRescueInfo, deathCause, setDeathCause, discardModal, setDiscardModal, logEndRef,
    logContainerRef, getLogCategory, LOG_TONES, maxInventorySlots, getCurrentLocationName, formatTime,
    getRandomDeathMessage, handleDeath, generateNextRescue, startGame, checkSynergies, applyCompanionAndTraitEffects,
    handleChoice, getTravelEstimate, handleSelectLocation, handleInventoryItemClick, handleCraftingUse, getItemVisual,
    handleDiscardChoice, currentDay, maxHealth, activeSynergies,
  };
}
