export default function StatusToast({ statusToast, statusToastType }) {
  return (
    <>
      {statusToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-xl animate-fade-in pointer-events-none">
          <div className={statusToastType === 'travel' ? "bg-[#101d2d]/95 border-2 border-[#38587a] text-[#a8c5e5] px-4 py-3 text-xs md:text-sm font-bold text-center shadow-[0_0_22px_rgba(56,88,122,0.35)] rounded-sm" : "bg-[#21170d]/95 border-2 border-[#e58a2b] text-[#ffe0b3] px-4 py-3 text-xs md:text-sm font-bold text-center shadow-[0_0_22px_rgba(229,138,43,0.22)] rounded-sm"}>
            {statusToast}
          </div>
        </div>
      )}
    </>
  );
}
