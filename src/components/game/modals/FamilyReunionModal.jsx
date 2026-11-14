export default function FamilyReunionModal({ gameState, setIsPlaying, familyReunionModal, setFamilyReunionModal }) {
  return (
    <>
      {familyReunionModal && (() => {
        const reunionImage = './media/family-reunion.png';
                            return (
          <div className="fixed inset-0 z-[85] flex items-center justify-center p-3 bg-black/75 backdrop-blur-[2px] animate-fade-in">
            <div role="dialog" aria-modal="true" aria-label="가족 상봉 완료" className="relative w-full max-w-2xl max-h-[72vh] overflow-y-auto custom-scrollbar rounded-lg border border-[#9b7047] bg-[radial-gradient(ellipse_at_top,#39200f_0%,#1a0d07_48%,#080605_100%)] p-3 sm:p-4 shadow-[0_0_35px_rgba(0,0,0,.75)]">
              <button aria-label="닫기" onClick={() => { setFamilyReunionModal(null); setIsPlaying(current => gameState === 'playing' ? true : current); }} className="absolute right-3 top-2 z-20 text-2xl leading-none text-[#e7c9ac] hover:text-white">×</button>
              <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-[minmax(150px,.75fr)_minmax(0,1.25fr)]">
                <div className="relative mx-auto w-full max-w-[230px] overflow-hidden rounded-md border border-[#76563a] bg-[#100b08] sm:mx-0 sm:max-w-none">
                  <div className="relative aspect-[3/4]">
                    <img src={reunionImage} alt="서로를 꼭 끌어안은 순자와 하은" className="absolute inset-0 h-full w-full object-contain object-center bg-black" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                    <div className="absolute left-3 top-3 rounded bg-red-900/90 px-3 py-1 text-sm font-bold">가족의 재회</div>
                  </div>
                  <div className="border-t border-[#76563a] p-3 text-sm italic text-[#fff0df]">“이제 다시는 혼자가 아니에요.”</div>
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <div className="text-xs font-bold tracking-[.2em] text-amber-400">A PROMISE KEPT</div>
                  <h2 className="mt-2 text-xl font-black text-amber-300 sm:text-2xl">기다림의 끝, 다시 가족</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-stone-100">{familyReunionModal.story || '놀이터 저편에서 작은 목소리가 들렸습니다.\n\n“할머니…?”\n\n순자와 하은은 서로를 발견하자마자 달려가 꼭 끌어안았습니다. 참아 왔던 눈물이 두 사람의 뺨을 타고 흘렀습니다.\n\n“다행이다… 우리 손녀야. 이제 다시는 혼자 두지 않을게.”\n“할머니… 저도 너무 보고 싶었어요.”\n\n두 사람은 당신 덕분에 다시 가족을 만났습니다. 이제 서로를 지키며 함께 살아갈 수 있습니다.'}</p>
                  <div className="mt-3 border-y border-[#704222] py-3">
                    <div className="text-xs font-bold text-[#d6a16c]">가족을 만나게 해주어 고마워하는 중이다</div>
                    <p className="mt-1 text-sm leading-relaxed text-[#e1d0bd]">“우리를 다시 만나게 해줘서 고마워요. 이제 저희도 함께 당신의 생존을 돕겠습니다.”</p>
                    <p className="mt-2 text-xs font-bold text-amber-200">가족 상봉 완료 · 순자와 하은 모두 동료 합류</p>
                  </div>
                  <div className="mt-3 flex justify-end"><button onClick={() => { setFamilyReunionModal(null); setIsPlaying(current => gameState === 'playing' ? true : current); }} className="min-w-[140px] rounded-md border border-[#e2a05d] bg-gradient-to-b from-[#9b5b2b] to-[#542b13] px-7 py-2 text-sm font-black text-[#fff3e4] shadow-[inset_0_1px_0_rgba(255,220,170,.25)] transition hover:brightness-125">확인</button></div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
