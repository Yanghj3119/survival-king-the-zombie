export default function PlayerCard({ player, trait, currentLocation, getCurrentLocationName }) {
  return (
    <div className="bg-[#231717] border border-[#3a1f1f] p-4 text-center">
      <h2 className="text-xl font-bold tracking-widest">{player.name} ({player.gender})</h2>
      {trait && (
        <div className="mt-2 text-xs p-2 border border-[#d84b4b] bg-[#1a1111] text-[#d84b4b] font-bold text-left">
          <div className="text-sm mb-0.5">{trait.name}</div>
          <div className="text-[10px] text-[#8f7a7a] font-normal">{trait.desc}</div>
        </div>
      )}
      <div className="mt-2 text-xs py-1 px-3 border border-[#3a1f1f] bg-[#110b0b] text-[#c7b8b8]">
        {`[탐색] ${getCurrentLocationName(currentLocation)}`}
      </div>
    </div>
  );
}
