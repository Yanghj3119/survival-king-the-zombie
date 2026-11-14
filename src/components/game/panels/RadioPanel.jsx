import { LOCATIONS } from '../../../data/world';

export default function RadioPanel({ inventory, rescueInfo }) {
  return (
    <>
      {inventory.includes('radio') && (
        <div className="bg-[#1a1a23] border border-[#38587a] p-4">
          <h3 className="text-xs font-bold text-[#38587a] mb-2 tracking-widest flex justify-between">
            <span>📻 구조대 무전 정보</span>
            <span className="text-[#2e8b57]">무전기 작동 중</span>
          </h3>
          <div className="bg-[#110b0b] p-3 border border-[#38587a] text-xs space-y-1">
            <div className="font-bold text-[#f8f8f2]">도착 예정: <span className="text-[#a67c00]">D-{rescueInfo.targetDay} {rescueInfo.hour.toString().padStart(2, '0')}:00</span></div>
            <div className="font-bold text-[#f8f8f2]">도착 장소: <span className="text-[#d84b4b]">{LOCATIONS.find(l => l.id === rescueInfo.locationId)?.name}</span></div>
            <p className="text-[10px] text-[#8f7a7a] mt-1">* 해당 시각에 도착 구역에 위치하면 엔딩으로 탈출합니다.</p>
          </div>
        </div>
      )}
    </>
  );
}
