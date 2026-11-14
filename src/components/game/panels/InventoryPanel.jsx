import { WEAPONS, weaponMaxDurability } from '../../../data/config';
import { ITEM_HOVER_HINTS, WEAPON_ROLES } from '../../../data/items';

export default function InventoryPanel({ inventory, weaponDurability, maxInventorySlots, handleInventoryItemClick, getItemVisual }) {
  return (
    <div className="bg-[#231717] border-2 border-[#8a552b] p-4 shadow-[0_0_14px_rgba(138,85,43,0.16)]">
      <h3 className="text-xs font-bold text-[#e0a66f] mb-4 tracking-widest flex justify-between border-b border-[#8a552b] pb-3">
        <span>🎒 소지품</span>
        <span className={inventory.length >= maxInventorySlots ? "text-[#d84b4b]" : "text-[#8f7a7a]"}>{inventory.length} / {maxInventorySlots}</span>
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: maxInventorySlots }).map((_, idx) => {
          const itemId = inventory[idx];
          const isWeapon = WEAPONS.includes(itemId);
          const dur = isWeapon ? (weaponDurability[itemId] !== undefined ? weaponDurability[itemId] : weaponMaxDurability(itemId)) : null;
          const wRole = isWeapon ? WEAPON_ROLES[itemId] : null;

          return (
            <button key={idx} type="button" onClick={() => itemId && handleInventoryItemClick(itemId)} title={wRole ? wRole.desc : (itemId ? (ITEM_HOVER_HINTS[itemId] || '아이템 정보를 확인하려면 클릭하세요.') : '')} className={`group flex flex-col items-center justify-center p-3 border text-center h-20 relative transition-all duration-150 ${itemId ? 'bg-[#110b0b] border-[#6b421e] hover:border-[#f0a34a] hover:bg-[#211713] hover:shadow-[0_0_12px_rgba(240,163,74,.18)] cursor-pointer' : 'bg-[#110b0b]/40 border-[#221515] text-[#443333]'}`}>
              {itemId ? (
                <>
                  <span className="text-2xl mb-1 transition-transform duration-150 group-hover:scale-110">{getItemVisual(itemId).icon}</span>
                  <span className="text-[11px] font-bold">{getItemVisual(itemId).name}</span>
                  {isWeapon && (
                    <span className="absolute top-1 right-1 text-[9px] px-1 bg-[#3a1f1f] text-[#d84b4b] border border-[#d84b4b]">
                      내구: {dur}/{weaponMaxDurability(itemId)}
                    </span>
                  )}
                  <span className="pointer-events-none absolute left-1/2 bottom-[calc(100%+6px)] z-[80] w-44 -translate-x-1/2 rounded border border-[#b9783b] bg-[#130d0b] px-2 py-2 text-left text-[10px] font-normal leading-relaxed text-[#f2dfc9] opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="block font-bold text-[#f0a34a]">{getItemVisual(itemId).name}</span>
                    <span className="block">{wRole ? wRole.desc : (ITEM_HOVER_HINTS[itemId] || '클릭하여 아이템 상세 및 사용 가능 여부를 확인하세요.')}</span>
                  </span>
                </>
              ) : (
                <span className="text-xs italic text-[#443333]">비어있음</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-[#8f7a7a] mt-2">아이템을 누르면 사용 확인 창이 나타납니다. 무기·퀘스트 아이템은 직접 사용할 수 없습니다.</p>
    </div>
  );
}
