import { LOCATIONS } from '../../data/world';

export default function VaccineEnding({ player, inventory, companions, currentLocation, counters, logs, getLogCategory, formatTime, currentDay }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans animate-fade-in ending-art-bg max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-[#5a86b5] mb-2 tracking-widest">인류의 영웅</h1>
        <h2 className="text-xl font-bold text-[#f8f8f2] mb-4">생존자: {player.name}</h2>
        <img src="./media/ending-vaccine.jpg" alt="완성된 백신을 높이 든 생존자들과 새벽빛이 비치는 도시" className="w-full max-h-[340px] object-contain rounded-md border border-[#5a86b5] mb-4 ending-background-art" />
        <div className="bg-[#17232e] border-2 border-[#5a86b5] p-5 w-full text-center mb-6 shadow-xl space-y-2">
          <div className="text-xs font-bold text-[#5a86b5] tracking-wider uppercase">🧪 구원 성공: 백신 전달 완수</div>
          <p className="text-sm md:text-base text-[#f8f8f2] font-bold italic leading-relaxed break-keep">
            "반려동물의 고귀한 희생과 당신의 험난한 여정 끝에 마침내 완성된 백신이 군사 통제구역에 전달되었습니다. 인류는 당신 덕분에 멸망을 피했고, 당신은 전설적인 영웅이 되었습니다."
          </p>
        </div>

        <div className="bg-[#11161a] border border-[#1f2a3a] p-6 text-center text-sm text-[#c7b8b8] space-y-2 w-full mb-4">
          <h2 className="text-[#5a86b5] font-bold text-lg mb-3">최종 구원 기록</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <p>구원 날짜: {formatTime(counters.totalHours)} ({currentDay}일 차)</p>
            <p>도착 장소: {LOCATIONS.find(l => l.id === currentLocation)?.name || '알 수 없음'}</p>
            <p>함께 탈출한 동료: {companions.length}명</p>
            <p>잔여 물품: {inventory.length}개</p>
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

        <button onClick={() => window.location.reload()} className="px-8 py-3 border border-[#5a86b5] text-[#5a86b5] hover:bg-[#5a86b5] hover:text-[#0a0505] transition-colors tracking-widest font-bold">새로운 전설 도전</button>
      </div>
    );
}
