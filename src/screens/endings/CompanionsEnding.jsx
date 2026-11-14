import { COMPANION_STORIES } from '../../data/companions';

export default function CompanionsEnding({ companions, flags }) {
    const completedPersonalQuests = companions.filter(c => COMPANION_STORIES[c.id] && flags[COMPANION_STORIES[c.id].flag]).length;
    const trustedCompanions = companions.filter(c => c.loyalty >= 75).length;
    const strainedCompanions = companions.filter(c => c.loyalty <= 35).length;
    const legacyTitle = companions.length === 0 ? '홀로 남은 생존자' : strainedCompanions >= Math.ceil(companions.length / 2) ? '갈라진 생존자들' : completedPersonalQuests >= 3 && trustedCompanions >= 1 ? '함께 쓴 새로운 역사' : completedPersonalQuests >= 1 ? '잊지 않기로 한 약속' : '끝까지 버틴 사람들';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans animate-fade-in ending-art-bg max-w-2xl mx-auto text-center bg-[#0b0808] text-[#f8f8f2]">
        <div className="text-6xl mb-5">{strainedCompanions >= Math.ceil(Math.max(1, companions.length) / 2) ? '🕯️' : completedPersonalQuests >= 3 ? '🤝' : '🌅'}</div>
        <p className="text-xs tracking-[0.35em] text-[#a67c00] mb-3">SURVIVOR CHRONICLE · COMPANION ENDING</p>
        <h1 className="text-3xl md:text-5xl font-black mb-5 text-[#d9b56d]">{legacyTitle}</h1>
        <img src="./media/ending-companions.jpg" alt="생존 엔딩: 동료들과 함께 구출된 생존자들" className="w-full max-h-[340px] object-contain rounded-md border border-[#8f6236] mb-4 ending-background-art" />
        <p className="text-sm md:text-base leading-8 text-[#c7b8b8] mb-5">{companions.length === 0 ? '마지막까지 곁에 남은 사람은 없었습니다. 당신은 살아남았지만, 그 여정의 이야기를 함께 기억할 사람도 남지 않았습니다.' : strainedCompanions >= Math.ceil(companions.length / 2) ? '구조 신호는 들렸지만, 상처와 불신은 쉽게 사라지지 않았습니다. 살아남은 이들은 각자의 길로 흩어졌고, 당신의 리더십은 오래도록 논쟁의 대상이 되었습니다.' : completedPersonalQuests >= 3 && trustedCompanions >= 1 ? '당신은 동료들의 과거를 외면하지 않았습니다. 서로 다른 상처를 나누어 짊어진 생존자들은 구조 이후에도 서로를 가족처럼 기억하며 새로운 삶을 시작합니다.' : completedPersonalQuests >= 1 ? '모든 상처를 해결할 수는 없었지만, 적어도 몇 사람의 이야기는 끝까지 들어주었습니다. 살아남은 동료들은 그 선택을 각자의 방식으로 기억합니다.' : '당신과 동료들은 살아남기 위해 함께 움직였습니다. 해결하지 못한 과거도 남았지만, 끝까지 버틴 시간만큼은 누구도 빼앗을 수 없습니다.'}</p>
        <div className="w-full grid grid-cols-2 gap-3 text-left mb-6">
          <div className="border border-[#3a1f1f] bg-[#1a1111] p-3"><p className="text-[10px] text-[#8f7a7a]">함께 살아남은 동료</p><p className="text-2xl font-bold text-[#f8f8f2]">{companions.length}명</p></div>
          <div className="border border-[#3a1f1f] bg-[#1a1111] p-3"><p className="text-[10px] text-[#8f7a7a]">마무리한 개인 퀘스트</p><p className="text-2xl font-bold text-[#f8f8f2]">{completedPersonalQuests}개</p></div>
        </div>
        <div className="w-full text-left border border-[#3a1f1f] bg-[#110b0b] p-4 mb-6"><h2 className="text-sm font-bold text-[#d9b56d] mb-2">마지막까지 함께한 사람들</h2>{companions.length ? companions.map(c => <p key={c.id} className="text-xs text-[#c7b8b8] py-1">{c.name} · 충성도 {Math.round(c.loyalty)}% · {COMPANION_STORIES[c.id] && flags[COMPANION_STORIES[c.id].flag] ? '개인 이야기 해결' : '미완의 이야기'}</p>) : <p className="text-xs text-[#8f7a7a]">기록된 동료가 없습니다.</p>}</div>
        <button onClick={() => window.location.reload()} className="w-full max-w-xs bg-[#d84b4b] text-[#0a0505] font-bold py-3 tracking-widest">다시 시작</button>
      </div>
    );
}
