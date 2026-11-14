import TypewriterLine from '../components/TypewriterLine';

export default function VideoScreen({ setGameState, setPrologueChoice, setPrologueSkipText, setPrologueTextDone }) {
    return (
      <div className="h-[100dvh] min-h-[100dvh] w-full flex flex-col items-center justify-center gap-3 px-3 py-3 bg-black relative overflow-hidden animate-fade-in">
        <video 
          autoPlay
          playsInline
          preload="auto"
          onCanPlay={(e) => { e.currentTarget.muted = false; e.currentTarget.volume = 1; e.currentTarget.play().catch((err) => console.warn("오프닝 영상 재생이 차단되었습니다. 재생 버튼을 눌러주세요.", err)); }}
          onEnded={() => { setPrologueChoice(''); setPrologueSkipText(false); setPrologueTextDone(false); setGameState('prologue'); }}
          onError={() => { setPrologueChoice(''); setPrologueSkipText(false); setPrologueTextDone(false); setGameState('prologue'); }}
          className="relative z-0 block w-[min(82vw,1100px)] max-w-[82vw] max-h-[62vh] h-auto object-contain shrink-0"
          style={{ width: "min(82vw, 1100px)", maxHeight: "62vh" }}
          src="./media/opening.mp4"
        />
        <div aria-label="오프닝 내레이션" className="relative z-10 w-[min(88vw,900px)] px-4 py-2 sm:px-6 sm:py-3 border border-red-900/50 bg-black/75 shadow-2xl shadow-black/70 backdrop-blur-sm text-center shrink-0">
          <p className="text-[9px] sm:text-[10px] tracking-[0.32em] text-red-400 font-bold mb-1">SURVIVAL LOG · DAY 01</p>
          <div className="text-xs sm:text-base leading-5 sm:leading-7 text-[#f0e9e5] font-medium min-h-[2.5rem]">
            <TypewriterLine text="그날, 세상은 아무런 경고도 없이 무너졌다." delay={250} className="block" />
            <TypewriterLine text="통신망은 끊겼고, 어디선가 들리던 사람들의 목소리도 사라졌다." delay={1250} className="block text-[#d7ceca]" />
            <TypewriterLine text="그리고 지금, 어디에 있든 살아남기 위한 첫날이 시작된다." delay={2600} className="block text-red-200" />
          </div>
        </div>
        <button 
          onClick={() => { setPrologueChoice(''); setPrologueSkipText(false); setPrologueTextDone(false); setGameState('prologue'); }} 
          className="absolute top-3 right-3 sm:top-5 sm:right-5 px-3 py-2 sm:px-5 sm:py-2.5 border border-white/40 bg-black/70 text-white text-xs sm:text-sm font-bold rounded hover:bg-black hover:border-white transition-all tracking-widest z-20"
        >
          스킵하기 <span aria-hidden="true">»</span>
        </button>
      </div>
    );
}
