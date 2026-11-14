import { LOCATIONS, MAP_POSITIONS } from '../../../data/world';

export default function DestinationModal({ activeEvent, pendingDestination, setPendingDestination, getTravelEstimate, handleSelectLocation }) {
  return (
    <>
      {pendingDestination && (() => {
        const pendingLoc = LOCATIONS.find(l => l.id === pendingDestination);
        if (!pendingLoc) return null;
        const pendingEstimate = getTravelEstimate(pendingLoc);
        const pendingRisk = {
          street: '보통', police_station: '높음', gas_station: '높음', fire_station: '높음', hospital: '매우 높음',
          mart: '보통', military: '매우 높음', subway: '높음', highway: '보통',
          school: '보통', broadcasting: '높음', port: '높음', laboratory: '매우 높음',
          airport: '높음', controlled_area: '높음'
        }[pendingLoc.id] || '알 수 없음';
        const pendingIsCurrent = pendingEstimate.isCurrent;
        return (
          <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-3" onClick={() => setPendingDestination(null)}>
            <div className="bg-[#101820] border-2 border-[#38587a] p-5 w-full max-w-md shadow-[0_0_28px_rgba(56,88,122,.28)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4 border-b border-[#31475b] pb-3">
                <div className="text-3xl">{(MAP_POSITIONS[pendingLoc.id] || {}).icon || '📍'}</div>
                <div><h3 className="font-bold text-[#a8c5e5]">{pendingLoc.name}</h3><p className="text-[10px] text-[#6e91a8] mt-1">이동 확인</p></div>
              </div>
              <div className="border border-[#31475b] bg-[#0b141b] p-3 mb-3">
                <p className="text-xs text-[#d9e7f0] leading-relaxed mb-3">{pendingLoc.desc}</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
                  <span className="text-[#7892a5]">거리</span><span className="text-right text-white">{pendingEstimate.dist} 단위</span>
                  <span className="text-[#7892a5]">예상 이동 시간</span><span className="text-right text-sky-200">{pendingEstimate.hours}시간</span>
                  <span className="text-[#7892a5]">이동 수단</span><span className="text-right text-white">{pendingEstimate.travelMode}</span>
                  <span className="text-[#7892a5]">위험도</span><span className={`text-right font-bold ${pendingRisk === '매우 높음' ? 'text-red-300' : pendingRisk === '높음' ? 'text-orange-300' : 'text-amber-300'}`}>{pendingRisk}</span>
                  <span className="text-[#7892a5]">예상 소모</span><span className={`text-right ${pendingEstimate.resourceWarning ? 'text-amber-300' : 'text-rose-300'}`}>{pendingEstimate.resourceNote}</span>
                </div>
              </div>
              {pendingEstimate.resourceWarning && <p className="text-[10px] text-amber-300 mb-3">주의: 현재 이동 수단의 연료가 부족할 수 있어 실제 이동은 도보로 처리될 수 있습니다.</p>}
              
              {activeEvent && <p className="text-[10px] text-amber-300 mb-3">현재 상황이 진행 중이므로 확인하면 이동 예약이 등록됩니다.</p>}
              <p className="text-[10px] text-[#8fa8b8] mb-4">{activeEvent ? '상황이 종료된 후 선택한 장소로 이동 예약됩니다.' : '확인하면 해당 장소로 이동을 시작합니다.'}</p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setPendingDestination(null)} className="px-4 py-2 text-xs border border-[#496274] text-[#b9d1df] hover:bg-[#1d3440]">취소</button>
                <button onClick={() => { handleSelectLocation(pendingDestination); setPendingDestination(null); }} disabled={pendingIsCurrent} className="px-4 py-2 text-xs border border-[#38587a] bg-[#234764] text-white hover:bg-[#2d5b7c] disabled:opacity-40">확인하고 이동</button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
