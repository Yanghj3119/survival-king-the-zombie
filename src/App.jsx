import useSurvivalGame from './hooks/useSurvivalGame';
import OpeningScreen from './screens/OpeningScreen';
import VideoScreen from './screens/VideoScreen';
import PrologueScreen from './screens/PrologueScreen';
import SetupScreen from './screens/SetupScreen';
import TutorialScreen from './screens/TutorialScreen';
import VaccineEnding from './screens/endings/VaccineEnding';
import BetrayalEnding from './screens/endings/BetrayalEnding';
import CompanionsEnding from './screens/endings/CompanionsEnding';
import MutantEnding from './screens/endings/MutantEnding';
import ChipEnding from './screens/endings/ChipEnding';
import PlaneEnding from './screens/endings/PlaneEnding';
import VictoryEnding from './screens/endings/VictoryEnding';
import GameOverScreen from './screens/GameOverScreen';
import PlayingScreen from './screens/PlayingScreen';

export default function App() {
  const game = useSurvivalGame();

  switch (game.gameState) {
    case 'opening':
      return <OpeningScreen {...game} />;
    case 'video':
      return <VideoScreen {...game} />;
    case 'prologue':
      return <PrologueScreen {...game} />;
    case 'setup':
      return <SetupScreen {...game} />;
    case 'tutorial':
      return <TutorialScreen {...game} />;
    case 'victory_vaccine':
      return <VaccineEnding {...game} />;
    case 'ending_betrayal':
      return <BetrayalEnding {...game} />;
    case 'ending_companions':
      return <CompanionsEnding {...game} />;
    case 'ending_mutant':
      return <MutantEnding {...game} />;
    case 'ending_chip':
      return <ChipEnding {...game} />;
    case 'ending_plane':
      return <PlaneEnding {...game} />;
    case 'victory':
      return <VictoryEnding {...game} />;
    case 'gameover':
      return <GameOverScreen {...game} />;
    default:
      return <PlayingScreen {...game} />;
  }
}
