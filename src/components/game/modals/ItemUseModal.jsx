export default function ItemUseModal({ itemUseModal, setItemUseModal, handleCraftingUse, getItemVisual }) {
  return (
    <>
      {itemUseModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3" onClick={() => setItemUseModal(null)}>
          <div className="bg-[#1a1111] border-2 border-[#e58a2b] p-5 w-full max-w-md shadow-[0_0_24px_rgba(229,138,43,0.18)]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4 border-b border-[#6b421e] pb-3">
              <div className="text-3xl">{getItemVisual(itemUseModal.itemId).icon}</div>
              <div><h3 className="font-bold text-[#f0a34a]">{itemUseModal.title}</h3><p className="text-[10px] text-[#8f7a7a] mt-1">아이템 사용 확인</p></div>
            </div>
            <div className="border border-[#3a1f1f] bg-[#110b0b] p-3 mb-4">
              <p className="text-xs font-bold text-[#f8f8f2] mb-2">{itemUseModal.error ? '사용할 수 없습니다' : '예상 효과'}</p>
              <p className={`text-xs leading-relaxed ${itemUseModal.error ? 'text-[#d84b4b]' : 'text-[#f0a34a]'}`}>{itemUseModal.error || itemUseModal.effect}</p>
            </div>
            <p className="text-[11px] text-[#8f7a7a] mb-4">{itemUseModal.error ? '조건을 확인한 뒤 다시 시도하세요.' : '사용하면 인벤토리에서 아이템 1개가 소모됩니다. 사용하시겠습니까?'}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setItemUseModal(null)} className="px-4 py-2 text-xs border border-[#5a4545] text-[#b9a6a6] hover:bg-[#2b1b1b]">{itemUseModal.error ? '닫기' : '취소'}</button>
              {!itemUseModal.error && <button onClick={() => { handleCraftingUse(itemUseModal.action); setItemUseModal(null); }} className="px-4 py-2 text-xs border border-[#e58a2b] bg-[#6b421e] text-[#fff0d8] hover:bg-[#a86420]">사용하기</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
