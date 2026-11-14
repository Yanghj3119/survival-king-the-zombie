import { COMPANION_INTRO_IMAGES, COMPANION_QUOTES, COMPANION_STORIES } from '../../../data/companions';

export default function CompanionDetailModal({ flags, selectedCompanion, setSelectedCompanion }) {
  return (
    <>
      {selectedCompanion && (() => {
        const selectedStory = COMPANION_STORIES[selectedCompanion.id];
        const selectedImage = COMPANION_INTRO_IMAGES[selectedCompanion.id];
        return (
          <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/80 p-3" onClick={() => setSelectedCompanion(null)}>
            <div role="dialog" aria-modal="true" aria-label={`${selectedCompanion.name} 동료 정보`} className="relative w-full max-w-2xl max-h-[78vh] overflow-y-auto rounded-md border border-[#8e6845] bg-[#1b140e] shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-[#5a402a] bg-[#2b1e14] px-4 py-3">
                <div><div className="text-[10px] tracking-[.2em] text-[#b38a62]">COMPANION RECORD</div><h2 className="mt-1 text-xl font-bold text-[#f0dfcc]">{selectedCompanion.name} <span className="text-sm font-normal text-[#b99a7b]">· {selectedCompanion.role}</span></h2></div>
                <button aria-label="닫기" onClick={() => setSelectedCompanion(null)} className="px-2 text-2xl text-[#d4b89a] hover:text-white">×</button>
              </div>
              <div className="grid grid-cols-[104px_1fr] gap-3 p-4 sm:grid-cols-[140px_1fr]">
                <div className="h-36 overflow-hidden border border-[#76563a] bg-[#100b07] sm:h-44">{selectedImage ? <img src={selectedImage} alt={`${selectedCompanion.name} 이미지`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl text-[#bd8c5b]">✦</div>}</div>
                <div className="min-w-0">
                  <div className="text-[10px] tracking-wider text-[#b38a62]">SURVIVAL SKILL</div>
                  <p className="mt-1 text-sm leading-relaxed text-[#f0dfcc]">{selectedCompanion.desc || '고유 생존 능력'}</p>
                  <p className="mt-2 text-xs italic leading-relaxed text-white">“{COMPANION_QUOTES[selectedCompanion.id] || '함께 살아남읍시다.'}”</p>
                  <div className="mt-4 space-y-3">
                    <div><div className="mb-1 flex justify-between text-[11px] text-[#cdb49a]"><span>충성도</span><span>{Math.round(selectedCompanion.loyalty || 0)}%</span></div><div className="h-1.5 bg-[#0e0a07]"><div className={`h-full ${selectedCompanion.loyalty < 35 ? 'bg-[#b64d3e]' : 'bg-[#b18a5c]'}`} style={{width:`${Math.max(0,Math.min(100,selectedCompanion.loyalty || 0))}%`}} /></div></div>
                    <div><div className="mb-1 flex justify-between text-[11px] text-[#cdb49a]"><span>호감도</span><span>{Math.round(selectedCompanion.affinity || 0)}%</span></div><div className="h-1.5 bg-[#0e0a07]"><div className="h-full bg-[#9b796d]" style={{width:`${Math.max(0,Math.min(100,selectedCompanion.affinity || 0))}%`}} /></div></div>
                  </div>
                </div>
              </div>
              {selectedStory && <div className="mx-4 mb-4 border-t border-[#5a402a] pt-3">
                <div className="text-xs font-bold text-[#c79b6b]">개인 이야기 · {selectedStory.quest}</div>
                <p className="mt-1 text-xs leading-relaxed text-[#d0bda8]">{selectedStory.past}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#e1d0bd]">단서: {selectedStory.objective}</p>
                <div className="mt-2 text-[11px] text-[#b99a7b]">{flags[selectedStory.flag] ? '✓ 개인 이야기 완료' : `이야기의 흔적 · ${selectedStory.placeName}`}</div>
              </div>}
              <div className="flex justify-end border-t border-[#5a402a] bg-[#241910] px-4 py-3"><button onClick={() => setSelectedCompanion(null)} className="border border-[#9a744f] bg-[#4b3422] px-5 py-2 text-xs font-bold text-[#f0dfcc] hover:bg-[#60452d]">닫기</button></div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
