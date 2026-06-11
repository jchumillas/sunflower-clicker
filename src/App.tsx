import { useState } from 'react';
import { SunflowerCanvas } from './components/SunflowerCanvas';

const SEED_CLICKS_TO_SPROUT = 10;
const MAX_PLANT_HEALTH = 100;

function App() {
  const [seedClicks, setSeedClicks] = useState(0);
  const [plantHealth, setPlantHealth] = useState(MAX_PLANT_HEALTH);
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
        seedClicks={seedClicks}
        seedClicksToSprout={SEED_CLICKS_TO_SPROUT}
        plantHealth={plantHealth}
        maxPlantHealth={MAX_PLANT_HEALTH}
        onSeedClick={handleSeedClick}
        onBeePollinate={handleBeePollinate}
      />
    </main>
  );
}

export default App;
