import { useEffect, useRef, useState } from 'react';
import { GameHud } from './components/GameHud';
import { GameOverModal, type GameOverStats } from './components/GameOverModal';
import { MAX_GROWTH_DAY, SunflowerCanvas, type HudInfo } from './components/SunflowerCanvas';

const SEED_CLICKS_TO_SPROUT = 10;
const MAX_PLANT_HEALTH = 100;
const MAX_HYDRATION = 100;
const INITIAL_HYDRATION = 50;
const HYDRATION_DECAY_PER_SECOND = 5;
const DRY_HEALTH_DAMAGE_PER_SECOND = 2;
const RAIN_HYDRATION_GAIN = 2;
const PIGEON_ATTACK_DAMAGE = 10;
const ANT_ATTACK_DAMAGE = 2;
const CATERPILLAR_ATTACK_DAMAGE = 5;
const GAME_OVER_MODAL_DELAY_MS = 900;

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
  const [gameOverStats, setGameOverStats] = useState<GameOverStats | null>(null);
  const [runId, setRunId] = useState(0);
  const hydrationRef = useRef<number | null>(null);
  const runStartRef = useRef<number | null>(null);
  const hudRef = useRef<HudInfo>(INITIAL_HUD);
  const beesPollinatedRef = useRef(0);
  const pigeonAttacksRef = useRef(0);
  const antAttacksRef = useRef(0);
  const caterpillarAttacksRef = useRef(0);
  const hasSeedBroken = seedClicks >= SEED_CLICKS_TO_SPROUT;
  const isGameOver = gameOverStats !== null;

  useEffect(() => {
    hydrationRef.current = hydration;
  }, [hydration]);

  useEffect(() => {
    hudRef.current = hud;
  }, [hud]);

  useEffect(() => {
    if (runStartRef.current === null) {
      runStartRef.current = performance.now();
    }
  }, [runId]);

  useEffect(() => {
    if (isGameOver || plantHealth > 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const elapsedMs =
        runStartRef.current === null ? 0 : performance.now() - runStartRef.current;

      setGameOverStats({
        day: hudRef.current.day,
        maxDay: MAX_GROWTH_DAY,
        stage: hudRef.current.stage,
        beesPollinated: beesPollinatedRef.current,
        pigeonAttacks:
          pigeonAttacksRef.current + antAttacksRef.current + caterpillarAttacksRef.current,
        survivalSeconds: elapsedMs / 1_000,
      });
    }, GAME_OVER_MODAL_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [plantHealth, isGameOver]);

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
    if (!hasSeedBroken || isGameOver || plantHealth <= 0) {
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
  }, [hasSeedBroken, isGameOver, plantHealth]);

  const handleSeedClick = () => {
    setSeedClicks((currentClicks) => Math.min(currentClicks + 1, SEED_CLICKS_TO_SPROUT));
  };

  const handleBeePollinate = () => {
    beesPollinatedRef.current += 1;
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
    pigeonAttacksRef.current += 1;
    setPlantHealth((currentHealth) => Math.max(0, currentHealth - PIGEON_ATTACK_DAMAGE));
  };

  const handleAntAttack = () => {
    antAttacksRef.current += 1;
    setPlantHealth((currentHealth) => Math.max(0, currentHealth - ANT_ATTACK_DAMAGE));
  };

  const handleCaterpillarAttack = () => {
    caterpillarAttacksRef.current += 1;
    setPlantHealth((currentHealth) => Math.max(0, currentHealth - CATERPILLAR_ATTACK_DAMAGE));
  };

  const handleRestart = () => {
    runStartRef.current = null;
    hydrationRef.current = null;
    beesPollinatedRef.current = 0;
    pigeonAttacksRef.current = 0;
    antAttacksRef.current = 0;
    caterpillarAttacksRef.current = 0;
    hudRef.current = INITIAL_HUD;
    setSeedClicks(0);
    setPlantHealth(MAX_PLANT_HEALTH);
    setHydration(null);
    setHud(INITIAL_HUD);
    setGameOverStats(null);
    setRunId((currentRunId) => currentRunId + 1);
  };

  return (
    <main className="game-shell">
      <SunflowerCanvas
        key={runId}
        hasSeedBroken={hasSeedBroken}
        plantHealth={plantHealth}
        onSeedClick={handleSeedClick}
        onBeePollinate={handleBeePollinate}
        onRainCloudClick={handleRainCloudClick}
        onPigeonAttack={handlePigeonAttack}
        onAntAttack={handleAntAttack}
        onCaterpillarAttack={handleCaterpillarAttack}
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
      {gameOverStats && <GameOverModal stats={gameOverStats} onRestart={handleRestart} />}
    </main>
  );
}

export default App;
