import { VEHICLE_TYPES } from '../../../data/world';

export default function VehiclePanel({ vehicle, setVehicle }) {
  return (
    <div className="bg-[#231717] border border-[#3a1f1f] p-4">
      <h3 className="text-xs font-bold text-[#8f7a7a] mb-2 tracking-widest flex justify-between">
        <span>보유 운송수단 (1개만 소지 가능)</span>
        {vehicle && <button onClick={() => setVehicle(null)} className="text-[10px] text-[#d84b4b] underline">버리기</button>}
      </h3>
      {vehicle ? (
        <div className="bg-[#110b0b] p-3 border border-[#3a1f1f] text-xs space-y-2">
          <div className="font-bold text-[#d84b4b]">{VEHICLE_TYPES[vehicle.id]?.name}</div>
          <div className="text-[10px] text-[#8f7a7a]">{VEHICLE_TYPES[vehicle.id]?.desc}</div>
          {VEHICLE_TYPES[vehicle.id]?.type === 'stamina' && (
            <div className="text-[10px] text-[#d84b4b]">체력 20 이하에서는 이용할 수 없습니다. 자전거 이동은 체력과 포만감을 소모합니다.</div>
          )}
          {VEHICLE_TYPES[vehicle.id]?.type !== 'stamina' && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>남은 연료</span>
                <span className="font-bold text-[#a67c00]">{vehicle.cap}%</span>
              </div>
              <div className="w-full bg-[#1a1111] h-1.5 border border-[#3a1f1f]">
                <div className="bg-[#a67c00] h-full transition-all duration-300" style={{ width: `${vehicle.cap}%` }}></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-[#554444] italic">보유한 운송수단이 없습니다. (도보 이동)</p>
      )}
    </div>
  );
}
