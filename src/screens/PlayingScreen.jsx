import StatusToast from '../components/game/layout/StatusToast';
import DiscardModal from '../components/game/modals/DiscardModal';
import GameHeader from '../components/game/layout/GameHeader';
import PlayerCard from '../components/game/panels/PlayerCard';
import RadioPanel from '../components/game/panels/RadioPanel';
import VehiclePanel from '../components/game/panels/VehiclePanel';
import StatsPanel from '../components/game/panels/StatsPanel';
import CompanionList from '../components/game/panels/CompanionList';
import LogHeader from '../components/game/log/LogHeader';
import EventBanner from '../components/game/log/EventBanner';
import LogList from '../components/game/log/LogList';
import InventoryPanel from '../components/game/panels/InventoryPanel';
import TravelPanel from '../components/game/panels/TravelPanel';
import DestinationModal from '../components/game/modals/DestinationModal';
import FamilyReunionModal from '../components/game/modals/FamilyReunionModal';
import CompanionIntroModal from '../components/game/modals/CompanionIntroModal';
import CompanionDetailModal from '../components/game/modals/CompanionDetailModal';
import ItemUseModal from '../components/game/modals/ItemUseModal';

export default function PlayingScreen(props) {
  return (
    <div className="min-h-screen flex flex-col animate-fade-in relative">
      <StatusToast {...props} />
      <DiscardModal {...props} />
      <GameHeader {...props} />

      <div className="flex-1 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-4 p-4 min-h-0">
        {/* 왼쪽: 캐릭터 · 상태 · 동료 */}
        <div className="col-span-1 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-2">
          <PlayerCard {...props} />
          <RadioPanel {...props} />
          <VehiclePanel {...props} />
          <StatsPanel {...props} />
          <CompanionList {...props} />
        </div>

        {/* 가운데: 생존 일지 */}
        <div className="col-span-1 lg:col-span-3 flex flex-col bg-[#110b0b] border border-[#3a1f1f] shadow-inner overflow-hidden h-[500px] md:h-[650px]">
          <LogHeader {...props} />
          <EventBanner {...props} />
          <LogList {...props} />
        </div>

        {/* 오른쪽: 소지품 · 이동 */}
        <div className="col-span-1 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-2">
          <InventoryPanel {...props} />
          <TravelPanel {...props} />
        </div>
      </div>

      {/* 모달 */}
      <DestinationModal {...props} />
      <FamilyReunionModal {...props} />
      <CompanionIntroModal {...props} />
      <CompanionDetailModal {...props} />
      <ItemUseModal {...props} />
    </div>
  );
}
