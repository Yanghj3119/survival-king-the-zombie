export default function BetrayalEnding({ player, logs, getLogCategory }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans animate-fade-in ending-art-bg max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-[#8f7a7a] mb-2 tracking-widest">배신과 고독</h1>
        <h2 className="text-xl font-bold text-[#f8f8f2] mb-4">생존자: {player.name}</h2>
        <img src="./media/ending-betrayal.jpg" alt="배신 엔딩: 믿었던 사람들이 등을 돌린 순간" className="w-full max-h-[340px] object-contain rounded-md border border-[#8f6236] mb-4 ending-background-art" />
        <div className="bg-[#231717] border-2 border-[#8f7a7a] p-5 w-full text-center mb-6 shadow-xl space-y-2">
          <div className="text-xs font-bold text-[#8f7a7a] tracking-wider uppercase">믿었던 사람들이.....</div>
          <p className="text-sm md:text-base text-[#f8f8f2] font-bold italic leading-relaxed break-keep">
            "구조 헬기가 도착했습니다. 하지만 믿었던 사람들은 당신을 뒤로한 채 떠났습니다. 마지막까지 함께할 거라 믿었던 이들의 뒷모습만이 폐허 속에 남았습니다."
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

        <button onClick={() => window.location.reload()} className="px-8 py-3 border border-[#8f7a7a] text-[#8f7a7a] hover:bg-[#8f7a7a] hover:text-[#0a0505] transition-colors tracking-widest font-bold">다시 시작</button>
      </div>
    );
}
