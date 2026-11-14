import TypewriterLine from '../components/TypewriterLine';

export default function PrologueScreen({ setGameState, setPrologueChoice, prologueSkipText, setPrologueSkipText, prologueTextDone, setPrologueTextDone, isBgmPlaying, setIsBgmPlaying }) {
    const choiceDetails = {
      survive: {
        title: '살아남기 위해 발버둥친다',
        text: '무엇이 기다리는지 알 수 없다. 하지만 가만히 있다면 살아남을 수 없다. 당신은 생존을 위해 움직이기로 결심한다.'
      }
    };
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#08090b] text-[#e8e3df] px-4 py-8 animate-fade-in">
        <button onClick={() => setIsBgmPlaying(v => !v)} aria-label={isBgmPlaying ? "배경음 끄기" : "배경음 켜기"} title={isBgmPlaying ? "배경음 끄기" : "배경음 켜기"} className="fixed top-3 right-3 z-50 border border-[#6b3434] bg-black/80 px-3 py-2 text-xs font-bold tracking-widest text-[#d88b8b] hover:bg-[#241313]">{isBgmPlaying ? '♫ BGM ON' : '♫ BGM OFF'}</button>
        
        <div className="w-full max-w-2xl border border-[#492a2a] bg-gradient-to-b from-[#171719] to-[#0c0d0f] shadow-2xl shadow-black/60">
          <div className="border-b border-[#382626] px-5 py-4 sm:px-8 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.28em] text-[#d56a6a] font-bold">EMERGENCY FREQUENCY · SIGNAL UNSTABLE</p>
              <p className="mt-1 text-xs text-[#817c7c]">오전 03:17 · 위치 불명</p>
            </div>
            <div className="text-2xl sm:text-3xl text-[#c74a4a] animate-pulse" aria-hidden="true">◉</div>
          </div>
          <div className="px-5 py-7 sm:px-8 sm:py-9 space-y-5">
            <p className="text-xs tracking-[0.2em] text-[#8e8a8a]">[ 정체불명의 수신 신호 ]</p>
            <div className="space-y-3 text-sm sm:text-base leading-8 text-[#d0cbca] min-h-[18rem]">
              <TypewriterLine text="정신을 차리자, 낯선 풍경과 차가운 공기가 먼저 감각을 파고든다." delay={125} skip={prologueSkipText} className="transition-opacity" />
              <TypewriterLine text="이곳이 거리인지, 건물 안인지조차 확신할 수 없다. 기억은 군데군데 끊겨 있고 휴대전화에는 통신 신호가 잡히지 않는다." delay={625} skip={prologueSkipText} />
              <TypewriterLine text="멀리서 잡음 섞인 긴급 방송이 희미하게 들려온다. 신호는 불안정하고, 송신 위치도 알 수 없다." delay={1650} skip={prologueSkipText} />
              <TypewriterLine text="“이 방송을 듣고 있다면…… 주변을 살피고, 함부로 움직이지 마십시오.”" delay={2250} skip={prologueSkipText} className="border-l-2 border-[#bd4848] pl-4 py-1 text-[#f0d4d4] italic" />
              <TypewriterLine text="“지금 어디에 있든, 당신이 믿을 수 있는 건 직접 확인한 것뿐입니다…….”" delay={2950} skip={prologueSkipText} className="border-l-2 border-[#bd4848] pl-4 py-1 text-[#f0d4d4] italic" />
              <TypewriterLine text="그때, 가까운 어딘가에서 발소리인지 바람 소리인지 모를 기척이 스친다." delay={3700} skip={prologueSkipText} className="text-[#d75b5b] font-black tracking-[0.35em]" />
              <TypewriterLine text="소리는 곧 멎는다. 침묵이 안전을 뜻하지는 않는다." delay={4150} skip={prologueSkipText} className="text-[#a6a0a0]" onComplete={() => setPrologueTextDone(true)} />
            </div>
            {!prologueTextDone && !prologueSkipText && (
              <div className="flex justify-end -mt-2">
                <button onClick={() => { setPrologueSkipText(true); setPrologueTextDone(true); }} className="text-xs text-[#8f8585] hover:text-[#f0dada] underline underline-offset-4">텍스트 빠르게 보기</button>
              </div>
            )}
            {prologueTextDone ? (
              <div className="pt-3 space-y-3 animate-fade-in">
                <p className="text-sm font-bold tracking-wide text-[#f0e8e8]">살아남기 위해, 이제 움직여야 한다.</p>
                <button onClick={() => { setPrologueChoice('survive'); setGameState('setup'); }} className="w-full text-left px-4 py-4 border border-[#a44343] bg-[#241416] hover:bg-[#35191c] hover:border-[#d56a6a] transition-colors rounded-sm">
                  <span className="block text-[#f0dada] font-black">생존을 위해 발버둥치며 움직인다 →</span>
                </button>
              </div>
            ) : (
              <p className="pt-3 text-xs text-[#786d6d] animate-pulse">방송 수신 중…</p>
            )}
          </div>
          <div className="border-t border-[#302426] px-5 py-3 sm:px-8 flex justify-between text-[10px] tracking-widest text-[#625959]">
            <span>SURVIVAL LOG / 001</span><span>NO SIGNAL · NO RESCUE CONFIRMED</span>
          </div>
        </div>
      </div>
    );
}
