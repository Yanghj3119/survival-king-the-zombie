export default function SetupScreen({ player, setPlayer, isBgmPlaying, setIsBgmPlaying, startGame }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-5 font-sans animate-fade-in">
        <button onClick={() => setIsBgmPlaying(v => !v)} aria-label={isBgmPlaying ? "배경음 끄기" : "배경음 켜기"} title={isBgmPlaying ? "배경음 끄기" : "배경음 켜기"} className="fixed top-3 right-3 z-50 border border-[#6b3434] bg-black/80 px-3 py-2 text-xs font-bold tracking-widest text-[#d88b8b] hover:bg-[#241313]">{isBgmPlaying ? '♫ BGM ON' : '♫ BGM OFF'}</button>
        <div className="w-full max-w-5xl bg-[#1a1111] border border-[#3a1f1f] p-4 sm:p-6 space-y-4 shadow-2xl">
          <h2 className="text-xl font-black text-[#d84b4b] text-center border-b border-[#3a1f1f] pb-3 tracking-widest">생존자 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
            <label className="text-xs text-[#8f7a7a] font-bold">생존자 이름</label>
            <input type="text" value={player.name} onChange={(e) => setPlayer({ ...player, name: e.target.value })} placeholder="이름을 입력하세요" className="w-full bg-[#110b0b] border border-[#3a1f1f] p-3 text-sm focus:border-[#d84b4b] text-[#f8f8f2] outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[#8f7a7a] font-bold">성별 선택</label>
            <div className="grid grid-cols-2 gap-2">
              {['남성', '여성'].map(g => (
                <button key={g} onClick={() => setPlayer({ ...player, gender: g })} className={`py-2.5 text-xs font-bold border transition-colors ${player.gender === g ? 'bg-[#d84b4b] border-[#d84b4b] text-[#0a0505]' : 'bg-[#110b0b] border-[#3a1f1f] text-[#8f7a7a]'}`}>
                  {g === '남성' ? '👨 남성' : '👩 여성'}
                </button>
              ))}
            </div>
          </div>
          </div>
          <div className="p-3 sm:p-4 bg-[#1a1111] border-2 border-[#d84b4b] text-sm text-[#f8f8f2] space-y-2 leading-relaxed shadow-[0_0_15px_rgba(216,75,75,0.2)] rounded-sm">
            <h3 className="text-[#d84b4b] font-black text-base border-b border-[#3a1f1f] pb-2 mb-1">📜 생존 목표 안내</h3>
            <p className="text-xs text-[#a99a9a]">각 목표의 의미를 확인하세요. 진행 순서는 상황과 준비 상태에 따라 판단하면 됩니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="border border-[#294a35] bg-[#101713] p-2.5 sm:p-3 rounded-sm">
                <p className="font-bold text-[#65bd83]">🛡️ 1. 안전지대로 이동하라</p>
                <p className="mt-1 text-xs text-[#c7b8b8]">역할: 당장의 생존을 확보하는 주요 목표입니다.</p>
                <p className="text-xs text-[#9eaaa0]">쓰임: 물자와 체력을 관리하며 안전한 거점을 찾아 이동하세요. 이동 전 목적지의 위험과 소요 시간을 고려하세요.</p>
              </div>
              <div className="border border-[#304765] bg-[#10151b] p-2.5 sm:p-3 rounded-sm">
                <p className="font-bold text-[#79a9e5]">🧪 2. 백신을 제작해 전달하라</p>
                <p className="mt-1 text-xs text-[#c7b8b8]">역할: 감염 사태를 해결하기 위한 핵심 임무입니다.</p>
                <p className="text-xs text-[#9daab8]">쓰임: 관련 단서와 필요한 재료를 수색하고, 준비가 갖춰지면 백신 제작 및 전달 경로를 진행하세요.</p>
              </div>
              <div className="border border-[#59336b] bg-[#17101b] p-2.5 sm:p-3 rounded-sm">
                <p className="font-bold text-[#d7a4f0]">✈️ 3. 비행기를 가동해 탈출하라</p>
                <p className="mt-1 text-xs text-[#c7b8b8]">역할: 탈출을 위한 주요 목표입니다.</p>
                <p className="text-xs text-[#c1a9cf]">쓰임: 공항과 비행기 관련 조건을 조사하고, 필요한 준비를 마친 뒤 탈출 계획을 실행하세요.</p>
              </div>
              <div className="border border-[#70451f] bg-[#1b1510] p-2.5 sm:p-3 rounded-sm">
                <p className="font-bold text-[#e5a35e]">🤝 4. 4명의 동료와 특별한 물건을 찾아라</p>
                <p className="mt-1 text-xs text-[#c7b8b8]">역할: 세계 곳곳의 인물과 숨겨진 이야기로 이어지는 탐색 목표입니다.</p>
                <p className="text-xs text-[#b9a28b]">쓰임: 여러 장소를 탐색해 동료를 만나고 특별한 물건을 수집하세요. 특정 인물이나 물건은 발견 조건이 다를 수 있으니 단서를 놓치지 마세요.</p>
              </div>
            </div>
            <p className="text-[11px] text-[#887b7b]">안내는 목표의 의미를 설명합니다. 실제 진행 조건과 결과는 게임 내 이벤트 및 발견 상황에 따라 달라질 수 있습니다.</p>
          </div>
          <button onClick={startGame} disabled={!player.name} className="w-full bg-[#d84b4b] text-[#0a0505] font-bold py-3 sm:py-3.5 mt-1 tracking-widest disabled:bg-[#2b1b1b] disabled:text-[#4a1c1c] transition-colors">생존 시작</button>
        </div>
      </div>
    );
}
