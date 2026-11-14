import { COMPANION_INTRO_IMAGES, COMPANION_QUOTES, COMPANION_STORIES } from '../../../data/companions';

export default function CompanionIntroModal({ gameState, setIsPlaying, companionIntro, setCompanionIntro }) {
  return (
    <>
      {companionIntro && (() => {
        const introStory = COMPANION_STORIES[companionIntro.id];
        const introImage = COMPANION_INTRO_IMAGES[companionIntro.id];
        return (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 bg-black/75 backdrop-blur-[2px] animate-fade-in">
            <div role="dialog" aria-modal="true" aria-label={`${companionIntro.name} 영입 완료`} className="relative w-full max-w-2xl max-h-[72vh] overflow-y-auto custom-scrollbar rounded-lg border border-[#9b7047] bg-[radial-gradient(ellipse_at_top,#39200f_0%,#1a0d07_48%,#080605_100%)] p-3 sm:p-4 shadow-[0_0_35px_rgba(0,0,0,.75)]">
              <button aria-label="닫기" onClick={() => { setCompanionIntro(null); setIsPlaying(current => gameState === 'playing' ? true : current); }} className="absolute right-3 top-2 z-20 text-2xl leading-none text-[#e7c9ac] hover:text-white">×</button>
              <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-[minmax(150px,.75fr)_minmax(0,1.25fr)]">
                <div className="relative mx-auto w-full max-w-[230px] overflow-hidden rounded-md border border-[#76563a] bg-[#100b08] sm:mx-0 sm:max-w-none">
                  <div className="relative aspect-[3/4]">
                    {introImage ? <img src={introImage} alt={`${companionIntro.name} 초상화`} className={`absolute inset-0 h-full w-full object-cover ${companionIntro.id === 'grandmother' ? 'object-[center_18%]' : 'object-center'}`} /> : <div className="absolute inset-0 flex items-center justify-center text-5xl text-[#bd8c5b]">✦</div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080503] via-transparent to-black/10" />
                    <div className="absolute inset-x-0 bottom-0 p-3"><div className="text-[9px] font-bold tracking-[.2em] text-[#e6a35e]">NEW COMPANION</div><div className="mt-1 text-2xl font-black text-[#fff4e8]">{companionIntro.name}</div><div className="text-xs font-bold text-[#e6a35e]">{companionIntro.role}</div></div>
                  </div>
                  <p className="border-t border-[#76563a] bg-[#120c08] px-3 py-3 text-xs italic leading-relaxed text-white">“{COMPANION_QUOTES[companionIntro.id] || '함께 살아남읍시다.'}”</p>
                </div>
                <div className="flex min-w-0 flex-col">
                  <div className="text-[10px] font-bold tracking-[.22em] text-[#d79a5b]">RECRUITMENT CONFIRMED</div>
                  <h2 className="mt-1 text-xl font-black text-[#fff0df]">새로운 동료가 합류했습니다</h2>
                  <div className="mt-4 border border-[#704222] bg-black/25 p-3"><div className="text-xs font-bold text-[#e6a35e]">고유 생존 능력</div><p className="mt-1 text-sm leading-relaxed text-[#f0dfcc]">{companionIntro.desc || '함께 생존할 동료가 합류했습니다.'}</p></div>
                  {companionIntro.familyReunionThankYou ? <div className="mt-3 border-t border-[#704222] pt-3"><div className="text-xs font-bold text-[#d6a16c]">가족을 만나게 해주어 고마워하는 중이다</div><p className="mt-1 text-sm leading-relaxed text-[#e1d0bd]">“우리를 다시 만나게 해줘서 고마워요. 서로를 찾을 수 있다는 희망을 포기하지 않게 해주었어요. 이제 저희도 함께 당신의 생존을 돕겠습니다.”</p><p className="mt-2 text-xs text-[#c79b78]">가족의 재회 · 순자와 하은의 감사</p></div> : introStory && <div className="mt-3 border-t border-[#704222] pt-3"><div className="text-xs font-bold text-[#d6a16c]">아직 끝나지 않은 이야기</div><p className="mt-1 text-sm leading-relaxed text-[#e1d0bd]">{introStory.past}</p><p className="mt-2 text-xs text-[#c79b78]">개인 이야기의 흔적 · {introStory.placeName}</p></div>}
                  <div className="mt-auto flex justify-end pt-4"><button onClick={() => { setCompanionIntro(null); setIsPlaying(current => gameState === 'playing' ? true : current); }} className="min-w-[140px] rounded-md border border-[#e2a05d] bg-gradient-to-b from-[#9b5b2b] to-[#542b13] px-7 py-2 text-sm font-black text-[#fff3e4] shadow-[inset_0_1px_0_rgba(255,220,170,.25)] transition hover:brightness-125">확인</button></div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
