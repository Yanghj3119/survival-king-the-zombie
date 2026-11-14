export default function LogList({ logs, logEndRef, logContainerRef, getLogCategory, LOG_TONES }) {
  return (
    <div ref={logContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
      {[...logs].reverse().map((log, idx) => {
        const logCategory = getLogCategory(log);
        const logTone = LOG_TONES[logCategory] || LOG_TONES.normal;
        return (
        <div key={idx} className={`flex space-x-3 text-sm ${logTone.text} ${logCategory !== 'normal' ? `font-bold border-l-2 pl-2 rounded-r-sm ${logTone.border} ${logTone.bg}` : ''}`}>
          <div className="shrink-0 w-24 font-bold text-[#8f7a7a] text-[11px] pt-[3px] tracking-widest">[{log.timeStr}]</div>
          <div className="flex-1 leading-relaxed break-keep whitespace-pre-line">{log.text}</div>
        </div>
        );
      })}
      <div ref={logEndRef}></div>
    </div>
  );
}
