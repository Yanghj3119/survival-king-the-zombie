export default function TutorialScreen({ setGameState, setIsPlaying, isBgmPlaying, setIsBgmPlaying }) {
    const tutorialCards = [
      { n: '01', icon: '❤️', title: '생존 상태', color: '#d84b4b', body: '체력·허기·정신력·위생은 생존 상태를 보여줍니다. 수치가 위험해지기 전에 음식과 회복 아이템을 사용하고, 무리한 행동을 피하세요.' },
      { n: '02', icon: '🎒', title: '아이템 / 인벤토리', color: '#8a552b', body: '아이템 영역에서 현재 가진 물품을 확인할 수 있습니다. 사용할 수 있는 아이템은 해당 항목을 눌러 사용 절차를 진행하세요. 음식과 의료 물품 등은 효과가 서로 다르니 설명을 확인하세요.' },
      { n: '03', icon: '🗺️', title: '목적지 이동 배너', color: '#38587a', body: '다른 장소로 이동하려면 ‘목적지 이동’ 영역을 이용하세요. 목적지를 고르기 전에 거리와 예상 소요 시간, 현재 연료와 보유 운송수단을 확인하세요. 이동 중에도 시간이 흐르고 생존 자원이 소모될 수 있습니다.' },
      { n: '04', icon: '📜', title: '생존 일지와 이벤트', color: '#d84b4b', body: '화면의 기록 영역에는 시간과 함께 행동 결과, 발견, 위험 상황이 기록됩니다. 새 로그가 나타나면 내용을 확인하고 다음 행동을 결정하세요.' },
      { n: '05', icon: '🤝', title: '동료와 특별한 물건', color: '#a67c00', body: '탐색 중 동료와 특별한 물건을 발견할 수 있습니다. 장소마다 발견 조건이 다를 수 있으니 새로운 장소를 탐색하고, 인물과 관련된 단서를 주의 깊게 살펴보세요.' }
    ];
    return (
      <div className="h-[100dvh] min-h-[100dvh] flex items-center justify-center p-2 sm:p-3 font-sans animate-fade-in bg-[#0d0808] overflow-hidden">
        <button onClick={() => setIsBgmPlaying(v => !v)} aria-label={isBgmPlaying ? "배경음 끄기" : "배경음 켜기"} title={isBgmPlaying ? "배경음 끄기" : "배경음 켜기"} className="fixed top-3 right-3 z-50 border border-[#6b3434] bg-black/80 px-3 py-2 text-xs font-bold tracking-widest text-[#d88b8b] hover:bg-[#241313]">{isBgmPlaying ? '♫ BGM ON' : '♫ BGM OFF'}</button>
        <div className="w-full max-w-5xl max-h-full overflow-y-auto custom-scrollbar border border-[#49302b] bg-[#171010] shadow-[0_0_40px_rgba(216,75,75,0.12)] p-3 sm:p-4 space-y-3">
          <div className="text-center space-y-1 border-b border-[#3a1f1f] pb-2">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] text-[#d84b4b] font-black">SURVIVAL FIELD MANUAL / 01</p>
            <h2 className="text-xl sm:text-2xl font-black tracking-widest text-[#f8f8f2]">메인 화면 조작 안내</h2>
            <p className="text-xs sm:text-sm text-[#a99a9a] leading-relaxed">게임 화면에 처음 진입하기 전, 각 영역의 위치와 사용법을 확인하세요.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tutorialCards.map(card => (
              <div key={card.n} className="bg-[#100b0b] border p-2 sm:p-3 space-y-1" style={{ borderColor: card.n === '04' ? '#3a1f1f' : card.color + '88' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center border text-lg" style={{ borderColor: card.n === '04' ? '#3a1f1f' : card.color, color: card.color, backgroundColor: card.color + '12' }}>{card.icon}</div>
                  <div><p className="text-[10px] tracking-widest font-black" style={{ color: card.color }}>FIELD GUIDE {card.n}</p><h3 className="text-xs sm:text-sm font-black text-[#f8f8f2]">{card.title}</h3></div>
                </div>
                <p className="text-[10px] sm:text-xs leading-snug text-[#c7b8b8]">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="border border-[#3a1f1f] bg-[#110b0b] p-2 sm:p-3 text-[10px] sm:text-xs text-[#9e8c8c] leading-relaxed">
            <span className="text-[#d84b4b] font-bold">생존 팁</span> 이동과 행동에는 시간이 들고, 상황에 따라 자원이 줄어들 수 있습니다. 아이템을 사용하기 전 효과를 확인하고, 목적지를 선택하기 전 현재 상태를 점검하세요.
          </div>
          <button onClick={() => { setGameState('playing'); setIsPlaying(true); }} className="w-full py-2.5 sm:py-3 bg-[#245b88] hover:bg-[#3276aa] border border-[#79a9e5] text-white text-sm sm:text-base font-black tracking-[0.2em] transition-colors shadow-[0_0_18px_rgba(70,135,195,0.18)]">안내 확인 완료 · 메인 게임 시작 →</button>
          <p className="text-center text-[9px] sm:text-[10px] text-[#665454]">이 안내는 게임 진행을 변경하지 않으며, 확인 후 실제 플레이 화면으로 이동합니다.</p>
        </div>
      </div>
    );
}
