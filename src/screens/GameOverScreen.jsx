import { LOCATIONS } from '../data/world';

export default function GameOverScreen({ player, inventory, companions, currentLocation, counters, logs, deathCause, getLogCategory, formatTime, currentDay }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans animate-fade-in ending-art-bg w-full max-w-6xl mx-auto">
        <h1 className="text-6xl font-black text-[#d84b4b] mb-2 tracking-widest">사망</h1>
        <img src="./media/ending-gameover.jpg" alt="붉은 하늘 아래 폐허가 된 도시의 사망 엔딩" className="w-full max-h-[340px] object-contain rounded-md border border-[#8f6236] mb-4 ending-background-art" />
        <h2 className="text-xl font-bold text-[#f8f8f2] mb-4 w-full text-center">생존자: {player.name}</h2>
        <div className="bg-[#231717] border-2 border-[#d84b4b] p-5 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center mb-6 shadow-xl space-y-2">
          <div className="text-xs font-bold text-[#d84b4b] tracking-wider uppercase">💀 사망 원인: {deathCause.title || '알 수 없음'}</div>
          <p className="text-sm md:text-base text-[#f8f8f2] font-bold italic leading-relaxed break-keep">
            "{deathCause.desc || '가혹한 세상에서 생을 마감했습니다.'}"
          </p>
        </div>

        <div className="w-full bg-[#1a1111] border border-[#3a1f1f] p-6 text-center text-sm text-[#c7b8b8] space-y-2 mb-4">
          <h2 className="text-[#d84b4b] font-bold text-lg mb-3">마지막 생존 기록</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <p>생존 시간: {formatTime(counters.totalHours)} ({currentDay}일)</p>
            <p>최후의 장소: {LOCATIONS.find(l => l.id === currentLocation)?.name || '알 수 없음'}</p>
            <p>함께한 동료: {companions.length}명</p>
            <p>소지한 아이템: {inventory.length}개</p>
          </div>
        </div>

        <div className="w-full bg-[#110b0b] border border-[#3a1f1f] p-4 text-xs h-56 overflow-y-auto custom-scrollbar mb-6 space-y-2 text-left">
          <h3 className="text-[#d84b4b] font-bold mb-2 border-b border-[#3a1f1f] pb-1">📜 전체 생존 일지 기록</h3>
          {[...logs].reverse().map((log, idx) => (
            <div key={idx} className={`flex space-x-2 ${getLogCategory(log) === 'travel' ? 'text-[#58758f]' : 'text-[#c7b8b8]'}`}>
              <span className="shrink-0 text-[10px]">[{log.timeStr}]</span>
              <span className="leading-relaxed">{log.text}</span>
            </div>
          ))}
        </div>

        <button onClick={() => window.location.reload()} className="w-full py-4 border border-[#8f7a7a] text-[#8f7a7a] hover:bg-[#f8f8f2] hover:text-[#0a0505] transition-colors tracking-widest font-bold">다시 시작</button>
      </div>
    );
}
