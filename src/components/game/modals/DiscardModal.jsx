export default function DiscardModal({ inventory, discardModal, getItemVisual, handleDiscardChoice }) {
  return (
    <>
      {discardModal.open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1111] border-2 border-[#d84b4b] p-6 max-w-md w-full space-y-4 text-center animate-fade-in">
            <h2 className="text-lg font-bold text-[#d84b4b]">⚠️ 가방 공간 부족</h2>
            <p className="text-xs text-[#c7b8b8] leading-relaxed">
              가방이 꽉 찼습니다! 획득한 새 아이템을 챙기려면 버릴 아이템 하나를 선택해주세요.
            </p>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[#8f7a7a] font-bold mb-1.5 text-left">📦 현재 가방 소지품 (클릭 시 버림):</div>
                <div className="grid grid-cols-2 gap-2">
                  {inventory.map((itemId, idx) => (
                    <button key={idx} onClick={() => handleDiscardChoice(idx, false)} className="p-2 border border-[#3a1f1f] bg-[#110b0b] hover:border-[#d84b4b] text-xs flex items-center space-x-2">
                      <span className="text-lg">{getItemVisual(itemId).icon}</span>
                      <span className="truncate">{getItemVisual(itemId).name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#3a1f1f] pt-3">
                <div className="text-xs text-[#d84b4b] font-bold mb-1.5 text-left">✨ 새로 습득 아이템 (클릭 시 포기):</div>
                <div className="grid grid-cols-2 gap-2">
                  {discardModal.pendingItems.map((itemId, idx) => (
                    <button key={idx} onClick={() => handleDiscardChoice(idx, true)} className="p-2 border border-[#d84b4b] bg-[#231717] hover:bg-[#d84b4b] hover:text-[#0a0505] text-xs flex items-center space-x-2">
                      <span className="text-lg">{getItemVisual(itemId).icon}</span>
                      <span className="truncate">{getItemVisual(itemId).name} (버리기)</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
