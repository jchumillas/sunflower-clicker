import { useState } from 'react';
import { SunflowerCanvas } from './components/SunflowerCanvas';

const SEED_CLICKS_TO_SPROUT = 10;

function App() {
  const [seedClicks, setSeedClicks] = useState(0);
  const hasSprouted = seedClicks >= SEED_CLICKS_TO_SPROUT;

  const handleSeedClick = () => {
    setSeedClicks((currentClicks) => Math.min(currentClicks + 1, SEED_CLICKS_TO_SPROUT));
  };

  return (
    <main className="game-shell">
      <SunflowerCanvas
        hasSprouted={hasSprouted}
        seedClicks={seedClicks}
        seedClicksToSprout={SEED_CLICKS_TO_SPROUT}
        onSeedClick={handleSeedClick}
      />
    </main>
  );
}

export default App;
