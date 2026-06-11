import { useEffect, useRef, useState } from 'react';
import { GameHud } from './components/GameHud';
import { MAX_GROWTH_DAY, SunflowerCanvas, type HudInfo } from './components/SunflowerCanvas';

const SEED_CLICKS_TO_SPROUT = 10;
const MAX_PLANT_HEALTH = 100;
const MAX_HYDRATION = 100;
const INITIAL_HYDRATION = 50;
const HYDRATION_DECAY_PER_SECOND = 5;
const DRY_HEALTH_DAMAGE_PER_SECOND = 5;
const RAIN_HYDRATION_GAIN = 2;
const PIGEON_ATTACK_DAMAGE = 10;

const INITIAL_HUD: HudInfo = {
  day: 1,
  stage: 'seed',
  phase: 'day',
  cycleProgress: 0,
};

function App() {
  const [seedClicks, setSeedClicks] = useState(0);
  const [plantHealth, setPlantHealth] = useState(MAX_PLANT_HEALTH);
  const [hydration, setHydration] = useState<number | null>(null);
  const [hud, setHud] = useState<HudInfo>(INITIAL_HUD);
  const hydrationRef = useRef<number | null>(null);
  const hasSeedBroken = seedClicks >= SEED_CLICKS_TO_SPROUT;

  useEffect(() => {
    hydrationRef.current = hydration;
  }, [hydration]);

  useEffect(() => {
    if (!hasSeedBroken) {
      return;
    }

    setHydration((currentHydration) => {
      const nextHydration = currentHydration ?? INITIAL_HYDRATION;

      hydrationRef.current = nextHydration;
      return nextHydration;
    });
  }, [hasSeedBroken]);

  useEffect(() => {
    if (!hasSeedBroken) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const safeHydration = hydrationRef.current ?? INITIAL_HYDRATION;

      if (safeHydration <= 0) {
        setPlantHealth((currentHealth) =>
          Math.max(0, currentHealth - DRY_HEALTH_DAMAGE_PER_SECOND),
        );
        hydrationRef.current = 0;
        setHydration(0);
        return;
      }

      const nextHydration = Math.max(0, safeHydration - HYDRATION_DECAY_PER_SECOND);

      hydrationRef.current = nextHydration;
      setHydration(nextHydration);
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasSeedBroken]);

  const handleSeedClick = () => {
    setSeedClicks((currentClicks) => Math.min(currentClicks + 1, SEED_CLICKS_TO_SPROUT));
  };

  const handleBeePollinate = () => {
    setPlantHealth((currentHealth) => Math.min(currentHealth + 5, MAX_PLANT_HEALTH));
  };

  const handleRainCloudClick = () => {
    setHydration((currentHydration) => {
      if (currentHydration === null) {
        return currentHydration;
      }

      const nextHydration = Math.min(MAX_HYDRATION, currentHydration + RAIN_HYDRATION_GAIN);

      hydrationRef.current = nextHydration;
      return nextHydration;
    });
  };

  const handlePigeonAttack = () => {
    setPlantHealth((currentHealth) => Math.max(0, currentHealth - PIGEON_ATTACK_DAMAGE));
  };

  return (
    <main className="game-shell">
      <SunflowerCanvas
        hasSeedBroken={hasSeedBroken}
        plantHealth={plantHealth}
        onSeedClick={handleSeedClick}
        onBeePollinate={handleBeePollinate}
        onRainCloudClick={handleRainCloudClick}
        onPigeonAttack={handlePigeonAttack}
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
        hydration={hydration}
        maxHydration={MAX_HYDRATION}
        seedClicks={seedClicks}
        seedClicksToSprout={SEED_CLICKS_TO_SPROUT}
      />
    </main>
  );
}

export default App;
