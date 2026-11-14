export default function EventBanner({ companions, activeEvent, getLogCategory, LOG_TONES, handleChoice }) {
  return (
    <>
      {activeEvent && (() => {
        // 선택지 시나리오는 종류와 관계없이 기존의 붉은색 배너를 유지한다.
        const eventTone = LOG_TONES.event;
        const isTravelEvent = activeEvent.id.includes('travel') || getLogCategory({ text: activeEvent.text, type: 'event' }) === 'travel';
        return (
        <div className={`border-b-2 ${eventTone.border} ${eventTone.bg} p-5 animate-fade-in shrink-0 max-h-[360px] overflow-y-auto custom-scrollbar`} style={{ boxShadow: `0 4px 15px ${eventTone.glow}` }}>
          <p className={`${eventTone.text} text-[10px] font-bold tracking-widest mb-3 uppercase`}>{isTravelEvent ? "이동 이벤트" : "운명의 갈림길"}</p>
          <p className="text-[15px] text-[#f8f8f2] mb-6 leading-relaxed break-keep">{['apartment_grandmother', 'playground_granddaughter'].includes(activeEvent.id)
            ? (companions.some(c => ['grandmother', 'granddaughter'].includes(c.id))
              ? (activeEvent.id === 'apartment_grandmother'
                ? '[가족 상봉 이벤트: 아파트] 하은을 먼저 만난 뒤 아파트에 도착했습니다. 창가에서 놀이터를 살피던 순자와 눈이 마주쳤고, 순자는 하은을 알아보고 급히 아래로 내려옵니다. 두 사람은 아파트 입구에서 서로를 꼭 끌어안습니다.'
                : '[가족 상봉 이벤트: 놀이터] 순자를 먼저 만난 뒤 놀이터에 도착했습니다. 놀이터 저편에서 작은 목소리가 들렸습니다. “할머니…?” 순자는 하은을 발견하자마자 달려가 꼭 끌어안습니다.')
              : (activeEvent.id === 'apartment_grandmother'
                ? '[동료 영입: 순자] 아파트 창가에서 주변을 살피던 할머니 순자를 발견했습니다. 가족을 잃은 슬픔 속에서도 살아남으려 애쓰고 있습니다. 순자를 동료로 맞이할 수 있습니다.'
                : '[동료 영입: 하은] 놀이터 한쪽에 숨어 있던 하은을 발견했습니다. 가족을 찾으려는 마음으로 위험한 곳을 떠나지 못하고 있습니다. 하은을 동료로 맞이할 수 있습니다.'))
            : activeEvent.text}</p>
          <div className="space-y-2">
            {activeEvent.choices.map((choice, idx) => (
              <button key={idx} onClick={() => handleChoice(choice)} className="w-full text-left bg-[#110b0b] border border-[#3a1f1f] text-[#f8f8f2] px-3 py-3 text-sm leading-relaxed break-keep hover:border-[#d84b4b] transition-colors">
                {['apartment_grandmother', 'playground_granddaughter'].includes(activeEvent.id) && idx === 0
                  ? (companions.some(c => ['grandmother', 'granddaughter'].includes(c.id))
                    ? '순자와 하은의 가족 상봉을 돕는다.'
                    : (activeEvent.id === 'apartment_grandmother' ? '순자를 동료로 영입한다.' : '하은을 동료로 영입한다.'))
                  : choice.text}
              </button>
            ))}
          </div>
        </div>
        );
      })()}
    </>
  );
}
