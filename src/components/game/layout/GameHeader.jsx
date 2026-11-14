export default function GameHeader({ setGameState, setIsPlaying, isBgmPlaying, setIsBgmPlaying, bgmAudioRef }) {
  return (
    <div className="h-20 bg-[#110b0b] border-b border-[#3a1f1f] flex items-center justify-between px-6 shrink-0">
      <img src="./media/title-logo.png" alt="생존왕 THE ZOMBIE" role="button" tabIndex={0} aria-label="첫 화면으로 돌아가기" title="클릭하면 첫 화면으로 돌아갑니다" onClick={() => { setIsPlaying(false); setGameState('opening'); const audio = bgmAudioRef.current; if (audio) { audio.pause(); audio.currentTime = 0; } }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsPlaying(false); setGameState('opening'); const audio = bgmAudioRef.current; if (audio) { audio.pause(); audio.currentTime = 0; } } }} className="w-[240px] h-[64px] object-contain object-left shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d84b4b] rounded-sm" />
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setIsBgmPlaying(!isBgmPlaying)}
          className="text-xs font-bold px-3 py-1 border border-[#3a1f1f] bg-[#1a1111] text-[#8f7a7a] hover:text-[#f8f8f2] transition-colors"
        >
          BGM {isBgmPlaying ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
}
