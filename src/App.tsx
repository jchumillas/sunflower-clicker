import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { GameHud } from './components/GameHud';
import { GameOverModal, type GameOverStats } from './components/GameOverModal';
import { MAX_GROWTH_DAY, SunflowerCanvas, type HudInfo } from './components/SunflowerCanvas';
import enemyHitSoundUrl from './assets/sounds/hit.wav';
import enemyKillSoundUrl from './assets/sounds/squeeze.mp3';
import backgroundMusicUrl from './assets/sounds/music.wav';
import plantDeathSoundUrl from './assets/sounds/scream.wav';

const SEED_CLICKS_TO_SPROUT = 10;
const MAX_PLANT_HEALTH = 100;
const MAX_HYDRATION = 100;
const INITIAL_HYDRATION = 50;
const HYDRATION_DECAY_PER_SECOND = 2;
const DRY_HEALTH_DAMAGE_PER_SECOND = 2;
const RAIN_HYDRATION_GAIN = 4;
const PIGEON_ATTACK_DAMAGE = 10;
const ANT_ATTACK_DAMAGE = 2;
const CATERPILLAR_ATTACK_DAMAGE = 5;
const GAME_OVER_MODAL_DELAY_MS = 900;
const SOUND_POOL_SIZE = 4;
const BACKGROUND_MUSIC_VOLUME = 0.28;
const CRITICAL_HEALTH_THRESHOLD = 25;
const NORMAL_BACKGROUND_MUSIC_RATE = 1;
const CRITICAL_BACKGROUND_MUSIC_RATE = 1.3;

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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [runId, setRunId] = useState(0);
  const hydrationRef = useRef<number | null>(null);
  const runStartRef = useRef<number | null>(null);
  const hudRef = useRef<HudInfo>(INITIAL_HUD);
  const beesPollinatedRef = useRef(0);
  const pigeonAttacksRef = useRef(0);
  const antAttacksRef = useRef(0);
  const caterpillarAttacksRef = useRef(0);
  const enemyKillSoundsRef = useRef<HTMLAudioElement[]>([]);
  const enemyHitSoundsRef = useRef<HTMLAudioElement[]>([]);
  const plantDeathSoundsRef = useRef<HTMLAudioElement[]>([]);
  const enemyKillSoundIndexRef = useRef(0);
  const enemyHitSoundIndexRef = useRef(0);
  const plantDeathSoundIndexRef = useRef(0);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedBackgroundMusicRef = useRef(false);
  const previousPlantHealthRef = useRef(MAX_PLANT_HEALTH);
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
    const createSoundPool = (url: string, volume: number) =>
      Array.from({ length: SOUND_POOL_SIZE }, () => {
        const audio = new Audio(url);

        audio.preload = 'auto';
        audio.volume = volume;
        return audio;
      });

    enemyKillSoundsRef.current = createSoundPool(enemyKillSoundUrl, 0.58);
    enemyHitSoundsRef.current = createSoundPool(enemyHitSoundUrl, 0.68);
    plantDeathSoundsRef.current = createSoundPool(plantDeathSoundUrl, 0.72);
  }, []);

  useEffect(() => {
    const music = new Audio(backgroundMusicUrl);

    music.loop = true;
    music.preload = 'auto';
    music.volume = BACKGROUND_MUSIC_VOLUME;
    music.playbackRate =
      plantHealth < CRITICAL_HEALTH_THRESHOLD
        ? CRITICAL_BACKGROUND_MUSIC_RATE
        : NORMAL_BACKGROUND_MUSIC_RATE;
    backgroundMusicRef.current = music;

    return () => {
      music.pause();
      backgroundMusicRef.current = null;
      hasStartedBackgroundMusicRef.current = false;
    };
  }, []);

  useEffect(() => {
    const music = backgroundMusicRef.current;

    if (!music) {
      return;
    }

    music.playbackRate =
      plantHealth < CRITICAL_HEALTH_THRESHOLD
        ? CRITICAL_BACKGROUND_MUSIC_RATE
        : NORMAL_BACKGROUND_MUSIC_RATE;
  }, [plantHealth]);

  const playSoundFromPool = (
    pool: HTMLAudioElement[],
    indexRef: MutableRefObject<number>,
  ) => {
    if (!soundEnabled || pool.length === 0) {
      return;
    }

    const sound = pool[indexRef.current % pool.length];

    indexRef.current += 1;
    sound.currentTime = 0;
    void sound.play().catch(() => {
      // Browsers can block sound until the first user gesture.
    });
  };

  const playEnemyKillSound = () => {
    playSoundFromPool(enemyKillSoundsRef.current, enemyKillSoundIndexRef);
  };

  const playEnemyHitSound = () => {
    playSoundFromPool(enemyHitSoundsRef.current, enemyHitSoundIndexRef);
  };

  const playPlantDeathSound = () => {
    playSoundFromPool(plantDeathSoundsRef.current, plantDeathSoundIndexRef);
  };

  const startBackgroundMusic = () => {
    const music = backgroundMusicRef.current;

    if (!music || !soundEnabled || hasStartedBackgroundMusicRef.current) {
      return;
    }

    hasStartedBackgroundMusicRef.current = true;
    void music.play().catch(() => {
      hasStartedBackgroundMusicRef.current = false;
    });
  };

  useEffect(() => {
    const handleFirstInteraction = () => {
      startBackgroundMusic();
    };

    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const music = backgroundMusicRef.current;
    const audioPools = [
      enemyKillSoundsRef.current,
      enemyHitSoundsRef.current,
      plantDeathSoundsRef.current,
    ];

    audioPools.forEach((pool) => {
      pool.forEach((audio) => {
        audio.muted = !soundEnabled;

        if (!soundEnabled) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    });

    if (!music) {
      return;
    }

    music.muted = !soundEnabled;

    if (!soundEnabled) {
      music.pause();
      hasStartedBackgroundMusicRef.current = false;
      return;
    }

    startBackgroundMusic();
  }, [soundEnabled]);

  useEffect(() => {
    if (plantHealth <= 0 && previousPlantHealthRef.current > 0) {
      playPlantDeathSound();
    }

    previousPlantHealthRef.current = plantHealth;
  }, [plantHealth]);

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
    startBackgroundMusic();
    setSeedClicks((currentClicks) => Math.min(currentClicks + 1, SEED_CLICKS_TO_SPROUT));
  };

  const handleBeePollinate = () => {
    beesPollinatedRef.current += 1;
    setPlantHealth((currentHealth) => Math.min(currentHealth + 5, MAX_PLANT_HEALTH));
  };

  const handleRainCloudClick = () => {
    startBackgroundMusic();
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
    playEnemyHitSound();
    setPlantHealth((currentHealth) => Math.max(0, currentHealth - PIGEON_ATTACK_DAMAGE));
  };

  const handleAntAttack = () => {
    antAttacksRef.current += 1;
    playEnemyHitSound();
    setPlantHealth((currentHealth) => Math.max(0, currentHealth - ANT_ATTACK_DAMAGE));
  };

  const handleCaterpillarAttack = () => {
    caterpillarAttacksRef.current += 1;
    playEnemyHitSound();
    setPlantHealth((currentHealth) => Math.max(0, currentHealth - CATERPILLAR_ATTACK_DAMAGE));
  };

  const handleRestart = () => {
    runStartRef.current = null;
    hydrationRef.current = null;
    beesPollinatedRef.current = 0;
    pigeonAttacksRef.current = 0;
    antAttacksRef.current = 0;
    caterpillarAttacksRef.current = 0;
    previousPlantHealthRef.current = MAX_PLANT_HEALTH;
    hudRef.current = INITIAL_HUD;
    setSeedClicks(0);
    setPlantHealth(MAX_PLANT_HEALTH);
    setHydration(null);
    setHud(INITIAL_HUD);
    setGameOverStats(null);
    setRunId((currentRunId) => currentRunId + 1);
  };

  const toggleSound = () => {
    setSoundEnabled((currentSoundEnabled) => !currentSoundEnabled);
  };

  return (
    <main className="game-shell">
      <button
        type="button"
        className="sound-toggle"
        aria-label={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
        aria-pressed={!soundEnabled}
        title={soundEnabled ? 'Desactivar sonido' : 'Activar sonido'}
        onClick={toggleSound}
      >
        {soundEnabled ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" />
            <path d="M16 8c1.2 1.1 1.8 2.4 1.8 4s-.6 2.9-1.8 4" />
            <path d="M18.8 5.5c2 1.8 3.2 4 3.2 6.5s-1.2 4.8-3.2 6.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 9v6h4l5 4V5L8 9H4Z" />
            <path d="m17 9 5 5" />
            <path d="m22 9-5 5" />
          </svg>
        )}
      </button>
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
        onEnemyKilled={playEnemyKillSound}
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
