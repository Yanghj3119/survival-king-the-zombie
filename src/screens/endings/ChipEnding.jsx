import { LOCATIONS } from '../../data/world';

export default function ChipEnding({ player, companions, currentLocation, counters, logs, getLogCategory, formatTime, currentDay }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans animate-fade-in ending-art-bg max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-[#e58a2b] mb-2 tracking-widest text-center">네 사람의 프로토콜</h1>
        <h2 className="text-xl font-bold text-[#f8f8f2] mb-4">생존자: {player.name}</h2>
        <div className="bg-[#21170d] border-2 border-[#e58a2b] p-5 w-full text-center mb-6 shadow-xl space-y-2">
          <img src="./media/ending-chip.jpg" alt="폐허가 된 도시의 석양을 바라보는 생존자들" className="w-full max-h-[340px] object-cover rounded-md border border-[#8f6236] mb-4 ending-background-art" />
          <div className="text-xs font-bold text-[#e58a2b] tracking-wider uppercase">생존 엔딩: 반도체칩 기반 생존 거점 가동</div>
          <p className="text-sm md:text-base text-[#f8f8f2] font-bold italic leading-relaxed break-keep">
            "각자의 역할에 충실했던 네 명의 동료는 반도체 메모리칩을 핵심으로 삼아 AI 바이브 코딩으로 안전하게 작동하는 생존 지원 프로세스를 만들어냈습니다. 마침내 프로세스가 가동되며 생존자들을 보호할 안전 구역이 구축되었습니다. 네 사람의 협력은 절망 속에서 새로운 희망이 되었습니다."
          </p>
        </div>
        <div className="bg-[#11100e] border border-[#4a321d] p-6 text-center text-sm text-[#c7b8b8] space-y-2 w-full mb-4">
          <h2 className="text-[#e58a2b] font-bold text-lg mb-3">최종 생존 기록</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <p>생존 시간: {formatTime(counters.totalHours)} ({currentDay}일 차)</p>
            <p>작전 장소: {LOCATIONS.find(l => l.id === currentLocation)?.name || '질병통제연구소'}</p>
            <p>동료: {companions.filter(c => ['pharmacist','nurse','police','chef'].includes(c.id)).length}/4명</p>
            <p>반도체칩: 프로토콜 가동 완료</p>
          </div>
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
        <button onClick={() => window.location.reload()} className="px-8 py-3 border border-[#e58a2b] text-[#e58a2b] hover:bg-[#e58a2b] hover:text-[#0a0505] transition-colors tracking-widest font-bold">새로운 생존에 도전</button>
      </div>
    );
}
