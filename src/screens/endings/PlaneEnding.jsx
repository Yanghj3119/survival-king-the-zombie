export default function PlaneEnding({ player, logs, getLogCategory }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans animate-fade-in ending-art-bg max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-[#38587a] mb-2 tracking-widest">비행기 탈출</h1>
        <h2 className="text-xl font-bold text-[#f8f8f2] mb-4">생존자: {player.name}</h2>
        <img src="./media/ending-plane.jpg" alt="공항 활주로에서 이륙을 위해 달리는 경비행기" className="w-full max-h-[340px] object-contain rounded-md border border-[#8f6236] mb-4 ending-background-art" />
        <div className="bg-[#111a23] border-2 border-[#38587a] p-5 w-full text-center mb-6 shadow-xl space-y-2">
          <div className="text-xs font-bold text-[#38587a] tracking-wider uppercase">히든 엔딩: 위험지역 탈출</div>
          <p className="text-sm md:text-base text-[#f8f8f2] font-bold italic leading-relaxed break-keep">
            "다른 장소에서 합류한 공학자 제민과 함께 공항에 도착한 당신은 버려진 비행기를 발견했습니다. 제민은 엔진을 점검하고, 당신은 연료를 주입했습니다. 마침내 엔진이 굉음을 내며 비행기가 활주로를 박차고 올랐고, 두 사람은 감염자들이 들끓는 위험지역을 벗어나 안전한 곳을 향해 날아갔습니다."
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

        <button onClick={() => window.location.reload()} className="px-8 py-3 border border-[#38587a] text-[#38587a] hover:bg-[#38587a] hover:text-[#0a0505] transition-colors tracking-widest font-bold">다시 시작</button>
      </div>
    );
}
