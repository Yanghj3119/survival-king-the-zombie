export default function LogHeader({ counters, isPlaying, setIsPlaying, gameSpeed, setGameSpeed, formatTime }) {
  return (
    <div className="bg-[#231717] px-4 py-2.5 border-b border-[#3a1f1f] flex justify-between items-center shrink-0">
      <h3 className="text-[11px] font-bold text-[#c7b8b8] tracking-widest shrink-0">생존 일지</h3>
      <div className="flex justify-center flex-1 mx-2">
        <div className="flex items-center space-x-1 bg-[#110b0b] p-1 border border-[#3a1f1f]">
          {[ { speed: isPlaying ? 0 : 1, label: isPlaying ? '⏸️ 일시정지' : '▶️ 재생' }, { speed: 2, label: '2x' }, { speed: 4, label: '4x' }, { speed: 8, label: '8x' }, { speed: 16, label: '16x' } ].map((btn, idx) => (
            <button key={idx} onClick={() => { if (idx === 0) { setIsPlaying(!isPlaying); if (!isPlaying && gameSpeed === 0) setGameSpeed(1); } else { setGameSpeed(btn.speed); setIsPlaying(true); } }} className={`px-2 py-0.5 text-[10px] font-bold transition-colors ${(idx === 0 && !isPlaying) || (idx > 0 && gameSpeed === btn.speed && isPlaying) ? 'bg-[#d84b4b] text-[#0a0505]' : 'bg-[#1a1111] text-[#8f7a7a] hover:text-[#f8f8f2]'}`}>
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      <span className="text-[11px] font-bold text-[#8f7a7a] text-right shrink-0">{formatTime(counters.totalHours)}</span>
    </div>
  );
}
