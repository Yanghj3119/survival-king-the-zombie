export default function StatsPanel({ stats, maxHealth }) {
  return (
    <div className="bg-[#231717] border border-[#3a1f1f] p-4 space-y-4">
      <div className="space-y-1"><div className="flex justify-between text-xs mb-1">건강<span className="text-[#d84b4b] font-bold">{Math.round(stats.health)} / {maxHealth}</span></div><div className="w-full bg-[#110b0b] h-1.5 border border-[#3a1f1f]"><div className="bg-[#8b2626] h-full transition-all duration-500" style={{ width: `${(stats.health / maxHealth) * 100}%` }}></div></div></div>
      <div className="space-y-1"><div className="flex justify-between text-xs mb-1">포만감<span className="text-[#a67c00] font-bold">{Math.round(stats.hunger)}%</span></div><div className="w-full bg-[#110b0b] h-1.5 border border-[#3a1f1f]"><div className="bg-[#a67c00] h-full transition-all duration-500" style={{ width: `${stats.hunger}%` }}></div></div></div>
      <div className="space-y-1"><div className="flex justify-between text-xs mb-1">정신력<span className="text-[#38587a] font-bold">{Math.round(stats.mental)}%</span></div><div className="w-full bg-[#110b0b] h-1.5 border border-[#3a1f1f]"><div className="bg-[#38587a] h-full transition-all duration-500" style={{ width: `${stats.mental}%` }}></div></div></div>
      <div className="space-y-1"><div className="flex justify-between text-xs mb-1">위생<span className="text-[#2e8b57] font-bold">{Math.round(stats.hygiene)}%</span></div><div className="w-full bg-[#110b0b] h-1.5 border border-[#3a1f1f]"><div className="bg-[#2e8b57] h-full transition-all duration-500" style={{ width: `${stats.hygiene}%` }}></div></div></div>
    </div>
  );
}
