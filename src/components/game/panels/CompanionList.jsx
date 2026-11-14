export default function CompanionList({ companions, setSelectedCompanion, activeSynergies }) {
  return (
    <div className="bg-[#231717] border border-[#3a1f1f] p-4">
      <h3 className="text-xs font-bold text-[#8f7a7a] mb-2 tracking-widest flex justify-between">
        <span>동료 무리</span>
        <span className="text-[#d84b4b]">{companions.length}명</span>
      </h3>
      
      <div className="space-y-1 mb-3">
        {activeSynergies.tacticalUnit && <div className="text-[10px] font-bold text-[#d84b4b] bg-[#110b0b] p-1 border border-[#d84b4b]">✨ [시너지] 치안유지조: 전투 피격 피해 -75%</div>}
        {activeSynergies.medicalTeam && <div className="text-[10px] font-bold text-[#2e8b57] bg-[#110b0b] p-1 border border-[#2e8b57]">✨ [시너지] 의료지원팀: 오염패널티 차단 & 극대 회복</div>}
        {activeSynergies.survivalBase && <div className="text-[10px] font-bold text-[#a67c00] bg-[#110b0b] p-1 border border-[#a67c00]">✨ [시너지] 생존기지: 허기감소 -50% & 위생방어</div>}
        {activeSynergies.familyBond && <div className="text-[10px] font-bold text-[#f0b6d2] bg-[#110b0b] p-1 border border-[#f0b6d2]">✨ [시너지] 가족의 재회: 정신력 회복 +5</div>}
          {activeSynergies.wildBeasts && <div className="text-[10px] font-bold text-[#e271ac] bg-[#110b0b] p-1 border border-[#e271ac]">✨ [시너지] 야생 동반자: 힐링 및 보조 보너스</div>}
      </div>

      {companions.length === 0 ? (
        <div className="border border-[#5b422f] bg-[#1a120c] px-3 py-5 text-center rounded-sm">
          <div className="text-2xl text-[#9d7957]">♧</div>
          <p className="mt-2 text-xs text-[#bda58d]">아직 함께하는 동료가 없습니다.</p>
          <p className="mt-1 text-[10px] text-[#806a54]">폐허를 탐색하며 생존자를 만나보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {companions.map((comp) => (
            <div key={comp.id} className="min-w-0 border border-[#59412d] bg-gradient-to-r from-[#2b1e14] to-[#17110c] p-3 rounded-sm transition hover:border-[#8f6b49]">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1"><div className="min-w-[3em] whitespace-nowrap text-sm font-bold text-[#f0dfcc]">{comp.name}</div><div className="mt-0.5 text-[10px] text-[#b99a7b]">{comp.role}</div></div>
                <span className="shrink-0 text-[10px] text-[#a98968]">동료 기록</span>
              </div>
              <div className="mt-3 space-y-2">
                <div><div className="mb-1 flex justify-between text-[10px] text-[#d6c0a8]"><span>충성도</span><span>{Math.round(comp.loyalty || 0)}%</span></div><div className="h-1.5 overflow-hidden bg-[#100b07]"><div className={`h-full ${comp.loyalty < 35 ? 'bg-[#b64d3e]' : 'bg-[#b18a5c]'}`} style={{width:`${Math.max(0,Math.min(100,comp.loyalty || 0))}%`}} /></div></div>
                <div><div className="mb-1 flex justify-between text-[10px] text-[#d6c0a8]"><span>호감도</span><span>{Math.round(comp.affinity || 0)}%</span></div><div className="h-1.5 overflow-hidden bg-[#100b07]"><div className="h-full bg-[#9b796d]" style={{width:`${Math.max(0,Math.min(100,comp.affinity || 0))}%`}} /></div></div>
              </div>
              <button type="button" onClick={() => setSelectedCompanion(comp)} className="mt-3 w-full border border-[#6f5137] bg-[#241910] px-3 py-2 text-left text-[11px] font-bold text-[#e5c8a8] transition hover:bg-[#3b291a] hover:text-white focus:outline-none focus:ring-1 focus:ring-[#bd8c5b]">자세히 보기 <span className="float-right">›</span></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
