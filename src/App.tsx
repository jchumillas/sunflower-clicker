import { useState } from 'react';
import { GameHud } from './components/GameHud';
import { MAX_GROWTH_DAY, SunflowerCanvas, type HudInfo } from './components/SunflowerCanvas';

const SEED_CLICKS_TO_SPROUT = 10;
const MAX_PLANT_HEALTH = 100;

const INITIAL_HUD: HudInfo = {
  day: 1,
  stage: 'seed',
  phase: 'day',
  cycleProgress: 0,
};

function App() {
  const [seedClicks, setSeedClicks] = useState(0);
  const [plantHealth, setPlantHealth] = useState(MAX_PLANT_HEALTH);
  const [hud, setHud] = useState<HudInfo>(INITIAL_HUD);
  const hasSeedBroken = seedClicks >= SEED_CLICKS_TO_SPROUT;

  const handleSeedClick = () => {
    setSeedClicks((currentClicks) => Math.min(currentClicks + 1, SEED_CLICKS_TO_SPROUT));
  };

  const handleBeePollinate = () => {
    setPlantHealth((currentHealth) => Math.min(currentHealth + 5, MAX_PLANT_HEALTH));
  };

  return (
    <main className="game-shell">
      <SunflowerCanvas
        hasSeedBroken={hasSeedBroken}
        onSeedClick={handleSeedClick}
        onBeePollinate={handleBeePollinate}
        onHudUpdate={setHud}
      />
      <GameHud
        day={hud.day}
        maxDay={MAX_GROWTH_DAY}
        stage={hud.stage}
        phase={hud.phase}
        cycleProgress={hud.cycleProgress}
        plantHealth={plantHealth}
        maxPlantHealth={MAX_PLANT_HEALTH}
        seedClicks={seedClicks}
        seedClicksToSprout={SEED_CLICKS_TO_SPROUT}
      />
    </main>
  );
}

export default App;
