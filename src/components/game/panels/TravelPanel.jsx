import { LOCATIONS, MAP_POSITIONS, ROAD_EDGES } from '../../../data/world';

export default function TravelPanel({ currentLocation, isPlaying, activeEvent, reservedLocation, destinationPopupOpen, setDestinationPopupOpen, setPendingDestination, hoveredMapLocation, setHoveredMapLocation, travelState, familyQuestTarget, getCurrentLocationName, getTravelEstimate }) {
  return (
    <>
      {(isPlaying || activeEvent) && (
        <div className="bg-[#231717] border border-[#38587a] p-4 transition-all">
          <div className="flex flex-col items-start gap-2 mb-4">
            <div className="flex w-full justify-between items-center gap-2">
              <h3 className="text-xs font-bold text-[#38587a] tracking-widest">목적지 이동</h3>
              <button onClick={() => setDestinationPopupOpen(v => !v)} className="text-xs px-3 py-2 border border-[#38587a] text-[#a8c5e5] hover:bg-[#38587a] hover:text-white">{destinationPopupOpen ? '목적지 닫기' : '🗺️ 목적지 선택'}</button>
            </div>
            {activeEvent && <span className="text-[10px] text-[#d84b4b] font-bold animate-pulse">상황 진행 중 (이동 예약 가능)</span>}
          </div>
          
          {!destinationPopupOpen ? <p className="text-xs text-[#8f7a7a]">현재 위치: {getCurrentLocationName(currentLocation)} · 버튼을 눌러 목적지와 예상 이동 시간을 확인하세요.</p> : <div className="fixed inset-0 z-40 bg-black/75 flex items-center justify-center p-3" onClick={() => setDestinationPopupOpen(false)}><div className="bg-[#101820] border-2 border-[#38587a] p-3 sm:p-4 w-full max-w-5xl max-h-[92vh] overflow-y-auto custom-scrollbar shadow-[0_0_36px_rgba(56,88,122,0.2)]" onClick={e => e.stopPropagation()}><div className="flex justify-between items-center mb-3"><h3 className="font-bold text-[#a8c5e5]">🗺️ 생존 지역 지도</h3><button onClick={() => setDestinationPopupOpen(false)} className="text-[#d84b4b] px-2 py-1 border border-[#d84b4b]">닫기 ✕</button></div><p className="text-xs text-[#9bb1c6] mb-3">현재 위치: <span className="text-[#7dd3fc] font-bold">{getCurrentLocationName(currentLocation)}</span> · {familyQuestTarget ? <span className="font-bold text-amber-300">가족 퀘스트 진행 중: {getCurrentLocationName(familyQuestTarget)}만 선택할 수 있습니다.</span> : '노드에 커서를 올리면 이동 정보가 표시되고, 선택하면 확인 창이 열립니다.'}</p>
          <div className="relative w-full overflow-hidden border border-[#31475b] rounded-sm mb-4" style={{ aspectRatio: '900 / 480', background: 'radial-gradient(ellipse at 48% 48%, #1d3440 0%, #14232d 55%, #0b141b 100%)' }}>
            <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(125,211,252,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.18) 1px, transparent 1px)', backgroundSize: '5% 8%' }}></div>
            <svg viewBox="0 0 900 480" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-label="도로망 지도">
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {ROAD_EDGES.map(([a,b]) => {
                  const pa = MAP_POSITIONS[a], pb = MAP_POSITIONS[b];
                  return <g key={`${a}-${b}`}>
                    <line x1={pa.x*9} y1={pa.y*4.8} x2={pb.x*9} y2={pb.y*4.8} stroke="#496274" strokeWidth="10" />
                    <line x1={pa.x*9} y1={pa.y*4.8} x2={pb.x*9} y2={pb.y*4.8} stroke="#172a36" strokeWidth="2" strokeDasharray="12 10" />
                  </g>;
                })}
                {travelState?.routePath?.slice(1).map((id, i) => {
                  const a = MAP_POSITIONS[travelState.routePath[i]], b = MAP_POSITIONS[id];
                  return <line key={`route-${i}`} x1={a.x*9} y1={a.y*4.8} x2={b.x*9} y2={b.y*4.8} stroke="#59b8ff" strokeWidth="4" strokeLinecap="round" />;
                })}
              </g>
              <g fill="#6e8796" opacity=".45">
                <rect x="65" y="145" width="50" height="30" rx="3"/><rect x="190" y="190" width="35" height="24" rx="3"/>
                <rect x="320" y="205" width="40" height="20" rx="3"/><rect x="520" y="145" width="38" height="25" rx="3"/>
                <rect x="655" y="245" width="40" height="24" rx="3"/><rect x="700" y="340" width="30" height="20" rx="3"/>
                <rect x="465" y="365" width="35" height="22" rx="3"/><rect x="175" y="330" width="32" height="24" rx="3"/>
              </g>
            </svg>
            <div className="absolute top-2 left-2 text-[8px] sm:text-[10px] tracking-[.22em] text-[#6e91a8] font-bold pointer-events-none">SECTOR MAP // CITY ZONE</div>
            <div className="absolute bottom-2 left-2 text-[8px] sm:text-[10px] text-[#6e91a8] pointer-events-none">ROUTES UNVERIFIED · FIELD SCAN</div>
            {LOCATIONS.map(loc => {
              const pos = MAP_POSITIONS[loc.id] || { x: 50, y: 50, icon: '📍' };
              const isCurrentMapLoc = currentLocation === loc.id && !travelState;
              const isReservedMapLoc = reservedLocation === loc.id;
              const disabledMapLoc = (!!familyQuestTarget && loc.id !== familyQuestTarget);
              return (
                <button key={`map-${loc.id}`} type="button" onClick={() => setPendingDestination(loc.id)} onMouseEnter={() => setHoveredMapLocation(loc.id)} onMouseLeave={() => setHoveredMapLocation(null)} disabled={disabledMapLoc}
                  title={`${loc.name} · ${loc.desc}`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                  className={`absolute z-10 flex flex-col items-center justify-center gap-0.5 min-w-[34px] sm:min-w-[54px] px-1 py-1 rounded-sm border text-center transition-all ${isCurrentMapLoc ? 'bg-sky-950/95 border-sky-300 text-sky-200 shadow-[0_0_15px_rgba(125,211,252,.65)]' : isReservedMapLoc ? 'bg-amber-950/95 border-amber-300 text-amber-200' : 'bg-[#101820]/95 border-[#496274] text-[#b9d1df] hover:border-sky-300 hover:bg-sky-950'} ${disabledMapLoc ? 'cursor-default' : 'cursor-pointer'}`}>
                  <span className="text-[12px] sm:text-base leading-none">{pos.icon}</span>
                  <span className="text-[7px] sm:text-[10px] leading-tight font-bold whitespace-nowrap">{loc.name}</span>
                  {isCurrentMapLoc && <span className="text-[6px] sm:text-[8px] text-sky-300">현재 위치</span>}
                  {isReservedMapLoc && <span className="text-[6px] sm:text-[8px] text-amber-300">예약됨</span>}
                </button>
              );
            })}
            {hoveredMapLocation && (() => {
              const hoverLoc = LOCATIONS.find(l => l.id === hoveredMapLocation);
              if (!hoverLoc) return null;
              const hoverEstimate = getTravelEstimate(hoverLoc);
              const riskLevels = {
                street: ['보통', 'text-amber-300'], police_station: ['높음', 'text-orange-300'],
                gas_station: ['높음', 'text-orange-300'], fire_station: ['높음', 'text-orange-300'], hospital: ['매우 높음', 'text-red-300'],
                mart: ['보통', 'text-amber-300'], military: ['매우 높음', 'text-red-300'],
                subway: ['높음', 'text-orange-300'], highway: ['보통', 'text-amber-300'],
                school: ['보통', 'text-amber-300'], broadcasting: ['높음', 'text-orange-300'],
                port: ['높음', 'text-orange-300'], laboratory: ['매우 높음', 'text-red-300'],
                airport: ['높음', 'text-orange-300'], controlled_area: ['높음', 'text-orange-300']
              };
              const risk = riskLevels[hoverLoc.id] || ['알 수 없음', 'text-slate-300'];
              const hoverPos = MAP_POSITIONS[hoverLoc.id] || { x: 50, y: 50 };
              return (
                <div className="absolute z-30 w-44 sm:w-52 p-2.5 bg-[#07111a]/95 border border-sky-400/80 shadow-[0_0_18px_rgba(56,189,248,.22)] rounded-sm pointer-events-none"
                  style={{ left: `${Math.min(Math.max(hoverPos.x, 13), 74)}%`, top: `${Math.min(hoverPos.y + 7, 70)}%` }}>
                  <div className="text-[11px] font-bold text-sky-200 mb-1">{hoverLoc.name}</div>
                  <div className="text-[9px] leading-relaxed text-slate-300 mb-2">{hoverLoc.desc}</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px]">
                    <span className="text-slate-400">거리</span><span className="text-right text-slate-100">{hoverEstimate.dist} 단위</span>
                    <span className="text-slate-400">예상 시간</span><span className="text-right text-sky-200">{hoverEstimate.hours}시간</span>
                    <span className="text-slate-400">이동 수단</span><span className="text-right text-slate-100">{hoverEstimate.travelMode}</span>
                    <span className="text-slate-400">위험도</span><span className={`text-right font-bold ${risk[1]}`}>{risk[0]}</span>
                    <span className="text-slate-400">예상 소모</span><span className={`text-right ${hoverEstimate.resourceWarning ? 'text-amber-300' : 'text-rose-300'}`}>{hoverEstimate.resourceNote}</span>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] sm:text-[10px] text-[#8fa8b8] mb-3"><span><span className="inline-block w-2 h-2 rounded-full bg-sky-300 mr-1"></span>현재 위치</span><span><span className="inline-block w-2 h-2 rounded-full bg-amber-300 mr-1"></span>이동 예약</span><span>노드를 누르면 이동 확인 창이 열립니다.</span></div>
          <p className="text-[10px] text-[#6e91a8] mt-3">노드에 커서를 올려 거리·시간·위험도·자원 소모를 확인하세요. 선택 후 확인 버튼을 눌러야 이동합니다.</p>
        </div></div>}
        </div>
      )}

    </>
  );
}
