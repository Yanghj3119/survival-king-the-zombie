// 게임 전역 설정값 / 무기 내구도

export const MAX_LOGS = 200;
export const BASE_INVENTORY_SIZE = 7;

export const WEAPONS = ['shotgun', 'pistol', 'machete', 'bat', 'baton', 'knife', 'crowbar'];
export const WEAPON_MAX_DURABILITY = { shotgun: 2, pistol: 5, machete: 5, bat: 4, baton: 5, knife: 4, crowbar: 6 }; // v1.35 B안: 정수 내구도 유지, 총기는 짧게/권총·날붙이·진압봉은 장기 활용, 빠루는 도구 역할로 유지
export const weaponMaxDurability = (id) => WEAPON_MAX_DURABILITY[id] || 2;
