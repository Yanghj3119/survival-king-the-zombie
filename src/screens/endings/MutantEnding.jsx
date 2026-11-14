export default function MutantEnding({ player, logs, getLogCategory }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans animate-fade-in ending-art-bg max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-[#8b2626] mb-2 tracking-widest">변이체 조종자</h1>
        <h2 className="text-xl font-bold text-[#f8f8f2] mb-4">생존자: {player.name}</h2>
        <img src="./media/ending-mutant.jpg" alt="다크히어로 엔딩: 폐허가 된 도심의 좀비 우두머리" className="w-full max-h-[340px] object-contain rounded-md border border-[#8f6236] mb-4 ending-background-art" />
        <div className="bg-[#1a0b0b] border-2 border-[#8b2626] p-5 w-full text-center mb-6 shadow-xl space-y-2">
          <div className="text-xs font-bold text-[#8b2626] tracking-wider uppercase">다크 히어로 엔딩: 감염의 지배자</div>
          <p className="text-sm md:text-base text-[#f8f8f2] font-bold italic leading-relaxed break-keep">
            "바이러스에 완전히 감염되었으나 강인한 정신력으로 이성을 잃지 않고 변이 반응을 적응해냅니다. 좀비들이 당신을 공격하지 않고 오히려 명령에 따르기 시작하면서, 감염자 무리를 지휘하는 수장이 됩니다."
          </p>
        </div>
        
        <div className="w-full bg-[#110b0b] border border-[#3a1f1f] p-4 text-xs h-56 overflow-y-auto custom-scrollbar mb-6 space-y-2 text-left">
          <h3 className="text-[#2e8b57] font-bold mb-2 border-b border-[#3a1f1f] pb-1">📜 전체 생존 일지 기록</h3>
          {[...logs].reverse().map((log, idx) => (
            <div key={idx} className={`flex space-x-2 ${getLogCategory(log) === 'travel' ? 'text-[#58758f]' : 'text-[#c7b8b8]'}`}>
              <span className="shrink-0 text-[10px]">[{log.timeStr}]</span>
              <span className="leading-relaxed">{log.text}</span>
            </div>
          ))}
        </div>

        <button onClick={() => window.location.reload()} className="px-8 py-3 border border-[#8b2626] text-[#8b2626] hover:bg-[#8b2626] hover:text-[#0a0505] transition-colors tracking-widest font-bold">다시 시작</button>
      </div>
    );
}
