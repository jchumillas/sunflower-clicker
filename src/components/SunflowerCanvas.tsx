import { useEffect, useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import blackAntSpriteUrl from '../assets/ant/black.png';
import redAntSpriteUrl from '../assets/ant/red.png';
import beeSpriteUrl from '../assets/bee/bee.png';
import caterpillarSpriteUrl from '../assets/caterpillar/walk.png';
import cloud01Url from '../assets/cloud/cloud_01.png';
import cloud02Url from '../assets/cloud/cloud_02.png';
import cloud03Url from '../assets/cloud/cloud_03.png';
import cloud04Url from '../assets/cloud/cloud_04.png';
import cloud05Url from '../assets/cloud/cloud_05.png';
import deathSunflowerSpriteUrl from '../assets/die.png';
import flySwatterSpriteUrl from '../assets/fly_swatter.png';
import gunshotSpriteUrl from '../assets/gunshot.png';
import moonSpriteUrl from '../assets/moon/moon.png';
import pigeonSpriteUrl from '../assets/pidgeon/fly.png';
import seedSpriteUrl from '../assets/seed.png';
import soilSpriteUrl from '../assets/soil.png';
import sproutSpriteUrl from '../assets/sprout.png';
import sunCrownUrl from '../assets/sun/crown.png';
import sunFaceUrl from '../assets/sun/face.png';
import angrySunflowerSpriteUrl from '../assets/idle_angry.png';
import veryAngrySunflowerSpriteUrl from '../assets/idle_very_angry.png';
import sunflowerSpriteUrl from '../assets/idle_happy.png';
import backgroundSunflowerSpriteUrl from '../assets/sunflower_background.png';

const COLUMNS = 5;
const ROWS = 4;
const TOTAL_FRAMES = COLUMNS * ROWS;
const MAIN_FRAME_WIDTH = 360;
const MAIN_FRAME_HEIGHT = 527;
const VERY_ANGRY_COLUMNS = 3;
const VERY_ANGRY_FRAME_COUNT = 8;
const VERY_ANGRY_OPEN_MOUTH_TRIGGER_FRAME = 1;
const DEATH_COLUMNS = 3;
const DEATH_FRAME_COUNT = 5;
const DEATH_FRAME_WIDTH = 400;
const DEATH_FRAME_HEIGHT = 351;
const DEATH_FRAME_DURATION_MS = 160;
const DEATH_STEM_OFFSET_X = 92;
const BACKGROUND_FRAME_WIDTH = 400;
const BACKGROUND_FRAME_HEIGHT = 351;
const SOIL_WIDTH = 300;
const SOIL_HEIGHT = 113;
const SPROUT_WIDTH = 256;
const SPROUT_HEIGHT = 243;
const MOON_WIDTH = 256;
const MOON_HEIGHT = 270;
const BEE_FRAME_WIDTH = 256;
const BEE_FRAME_HEIGHT = 256;
const BEE_FRAME_COUNT = 2;
const BEE_FRAME_DURATION_MS = 50;
const BEE_MIN_SPAWN_DELAY_MS = 5_000;
const BEE_MAX_SPAWN_DELAY_MS = 10_000;
const BEE_SPEED_MULTIPLIER = 1.5;
const BEE_CHAOS_STRENGTH = 0.74;
const BEE_VERTICAL_JITTER_STRENGTH = 0.22;
const PIGEON_COLUMNS = 4;
const PIGEON_ROWS = 4;
const PIGEON_FRAME_COUNT = PIGEON_COLUMNS * PIGEON_ROWS;
const PIGEON_FRAME_WIDTH = 500;
const PIGEON_FRAME_HEIGHT = 404;
const PIGEON_FRAME_DURATION_MS = 50;
const PIGEON_MIN_SPAWN_DELAY_MS = 5_000;
const PIGEON_MAX_SPAWN_DELAY_MS = 7_000;
const PIGEON_MIN_SPEED = 122;
const PIGEON_MAX_SPEED = 185;
const CATERPILLAR_FRAME_COUNT = 2;
const CATERPILLAR_FRAME_WIDTH = 256;
const CATERPILLAR_FRAME_HEIGHT = 173;
const CATERPILLAR_FRAME_DURATION_MS = 250;
const CATERPILLAR_MIN_SPAWN_DELAY_MS = 2_000;
const CATERPILLAR_MAX_SPAWN_DELAY_MS = 4_000;
const CATERPILLAR_MIN_SPEED = 30;
const CATERPILLAR_MAX_SPEED = 44;
const ANT_COLUMNS = 5;
const ANT_ROWS = 3;
const ANT_FRAME_COUNT = ANT_COLUMNS * ANT_ROWS;
const ANT_FRAME_WIDTH = 538;
const ANT_FRAME_HEIGHT = 759;
const ANT_FRAME_DURATION_MS = 50;
const ANT_SPAWN_INTERVAL_MS = 2_000;
const ANT_MIN_SPEED = 24;
const ANT_MAX_SPEED = 36;
const BUG_DAILY_DIFFICULTY_STEP = 0.1;
const RAIN_CLOUD_CHANCE = 1.0;
const RAIN_BURST_DURATION_MS = 1_200;
const RAIN_STREAK_COUNT = 42;
const RAIN_HYDRATION_MIN_SCREEN_PERCENT = 0.3;
const RAIN_HYDRATION_MAX_SCREEN_PERCENT = 0.7;
const CLOUD_ASPECT_RATIOS = [
  886 / 264,
  481 / 383,
  600 / 308,
  452 / 219,
  372 / 98,
];

const FRAME_DURATION_MS = 75;
const SEED_WIDTH = 128;
const SEED_HEIGHT = 178;
const DAY_DURATION_MS = 15_000;
const NIGHT_DURATION_MS = 15_000;
const TOTAL_CYCLE_MS = DAY_DURATION_MS + NIGHT_DURATION_MS;
const DAMAGE_FLASH_DURATION_MS = 220;
const DAMAGE_FLASH_FILTER = 'brightness(1.18) sepia(1) saturate(7) hue-rotate(315deg)';
const HEAL_FLASH_DURATION_MS = 260;
const HEAL_FLASH_FILTER = 'brightness(1.24) sepia(1) saturate(5.8) hue-rotate(62deg)';
const CRITICAL_HEALTH_THRESHOLD = 25;
const SEED_PROJECTILE_MIN_SPEED_X = 180;
const SEED_PROJECTILE_MAX_SPEED_X = 280;
const SEED_PROJECTILE_MIN_ANGULAR_SPEED = 5.2;
const SEED_PROJECTILE_MAX_ANGULAR_SPEED = 8.8;
const SEED_PROJECTILE_MIN_HEIGHT = 34;
const SEED_PROJECTILE_MAX_HEIGHT = 58;
const FLY_SWATTER_WIDTH = 128;
const FLY_SWATTER_HEIGHT = 142;
const SWATTER_SMACK_DURATION_MS = 260;
const GUNSHOT_WIDTH = 256;
const GUNSHOT_HEIGHT = 154;
const GUNSHOT_SHAKE_DURATION_MS = 320;
const PARTICLE_COUNT = 16;
const PARTICLE_MIN_DURATION_MS = 450;
const PARTICLE_MAX_DURATION_MS = 700;
const PARTICLE_COLORS = {
  enemy: ['#f8e7a6', '#f0a34b', '#c5543d', '#7a3224'],
  seed: ['#fff1a7', '#ffd35f', '#d98a24', '#80531c'],
};
export const MAX_GROWTH_DAY = 5;
const VICTORY_ELAPSED_MS = TOTAL_CYCLE_MS * MAX_GROWTH_DAY;

export type PlantStage = 'seed' | 'sprout' | 'sunflower';
export type CyclePhase = 'day' | 'night';

export type HudInfo = {
  day: number;
  stage: PlantStage;
  phase: CyclePhase;
  cycleProgress: number;
};

type SunflowerCanvasProps = {
  hasSeedBroken: boolean;
  isGameEnded: boolean;
  plantHealth: number;
  onSeedClick: () => void;
  onBeePollinate: () => void;
  onRainCloudClick: () => void;
  onPigeonAttack: () => void;
  onAntAttack: () => void;
  onCaterpillarAttack: () => void;
  onEnemyKilled: () => void;
  onPigeonKilled: () => void;
  onBeePresenceChange: (hasBees: boolean) => void;
  onVictory: () => void;
  onCriticalScream: () => void;
  onSunflowerHeadClick: () => void;
  onHudUpdate: (hud: HudInfo) => void;
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Circle = {
  x: number;
  y: number;
  radius: number;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type CycleState = {
  isDay: boolean;
  progress: number;
  cycleElapsed: number;
};

type PlantLifecycle =
  | {
      stage: 'seed';
      day: 1;
      growthScale: 0;
    }
  | {
      stage: 'sprout';
      day: 1;
      growthScale: 0;
    }
  | {
      stage: 'sunflower';
      day: number;
      growthScale: number;
    };

type Bee = {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  wobble: number;
  side: -1 | 1;
};

type Pigeon = {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  wobble: number;
  side: -1 | 1;
};

type Ant = {
  id: number;
  kind: 'black' | 'red';
  x: number;
  baseY: number;
  progressY: number;
  speed: number;
  size: number;
  side: -1 | 1;
  rowOffset: number;
  phase: number;
};

type Caterpillar = {
  id: number;
  x: number;
  baseY: number;
  progressY: number;
  speed: number;
  width: number;
  side: -1 | 1;
  phase: number;
};

type Cloud = {
  imageIndex: number;
  startX: number;
  y: number;
  width: number;
  speed: number;
  opacity: number;
};

type CloudInstance = Cloud & {
  id: number;
  x: number;
  isRainCloud: boolean;
  seed: number;
};

type RainBurst = {
  cloudId: number;
  startedAt: number;
  seed: number;
};

type BackgroundFlower = {
  x: number;
  bottom: number;
  scale: number;
  phase: number;
  brightness: number;
};

type SceneDrawable = {
  depthY: number;
  order: number;
  draw: () => void;
};

type SeedProjectile = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  rotation: number;
  angularVelocity: number;
  height: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  gravity: number;
  startedAt: number;
  duration: number;
};

type SwatterSmack = {
  id: number;
  x: number;
  y: number;
  size: number;
  startedAt: number;
  direction: -1 | 1;
};

type SwatterHover = {
  x: number;
  y: number;
  size: number;
};

type GunshotShake = {
  id: number;
  x: number;
  y: number;
  size: number;
  startedAt: number;
  direction: -1 | 1;
};

type GunshotHover = {
  x: number;
  y: number;
  size: number;
  direction: -1 | 1;
};

const BACKGROUND_FLOWERS = [
  { x: 0.03, bottom: 0.59, scale: 0.18, phase: 2, brightness: 0.62 },
  { x: 0.13, bottom: 0.61, scale: 0.2, phase: 6, brightness: 0.64 },
  { x: 0.24, bottom: 0.58, scale: 0.19, phase: 10, brightness: 0.62 },
  { x: 0.36, bottom: 0.62, scale: 0.2, phase: 14, brightness: 0.66 },
  { x: 0.49, bottom: 0.6, scale: 0.18, phase: 18, brightness: 0.63 },
  { x: 0.61, bottom: 0.62, scale: 0.2, phase: 4, brightness: 0.66 },
  { x: 0.74, bottom: 0.58, scale: 0.19, phase: 8, brightness: 0.62 },
  { x: 0.86, bottom: 0.61, scale: 0.2, phase: 12, brightness: 0.64 },
  { x: 0.97, bottom: 0.59, scale: 0.18, phase: 16, brightness: 0.62 },
  { x: 0.08, bottom: 0.69, scale: 0.27, phase: 1, brightness: 0.76 },
  { x: 0.19, bottom: 0.72, scale: 0.3, phase: 5, brightness: 0.8 },
  { x: 0.31, bottom: 0.68, scale: 0.27, phase: 9, brightness: 0.76 },
  { x: 0.43, bottom: 0.74, scale: 0.31, phase: 13, brightness: 0.82 },
  { x: 0.57, bottom: 0.74, scale: 0.31, phase: 17, brightness: 0.82 },
  { x: 0.69, bottom: 0.68, scale: 0.27, phase: 0, brightness: 0.76 },
  { x: 0.81, bottom: 0.72, scale: 0.3, phase: 3, brightness: 0.8 },
  { x: 0.92, bottom: 0.69, scale: 0.27, phase: 7, brightness: 0.76 },
  { x: 0.01, bottom: 0.82, scale: 0.36, phase: 11, brightness: 0.9 },
  { x: 0.12, bottom: 0.86, scale: 0.39, phase: 15, brightness: 0.94 },
  { x: 0.25, bottom: 0.81, scale: 0.35, phase: 19, brightness: 0.88 },
  { x: 0.37, bottom: 0.87, scale: 0.4, phase: 2, brightness: 0.95 },
  { x: 0.5, bottom: 0.83, scale: 0.36, phase: 6, brightness: 0.9 },
  { x: 0.63, bottom: 0.87, scale: 0.4, phase: 10, brightness: 0.95 },
  { x: 0.75, bottom: 0.81, scale: 0.35, phase: 14, brightness: 0.88 },
  { x: 0.88, bottom: 0.86, scale: 0.39, phase: 18, brightness: 0.94 },
  { x: 0.99, bottom: 0.82, scale: 0.36, phase: 4, brightness: 0.9 },
  { x: 0.05, bottom: 0.96, scale: 0.5, phase: 8, brightness: 1 },
  { x: 0.18, bottom: 0.93, scale: 0.45, phase: 12, brightness: 1 },
  { x: 0.31, bottom: 0.98, scale: 0.52, phase: 16, brightness: 1 },
  { x: 0.44, bottom: 0.94, scale: 0.46, phase: 1, brightness: 1 },
  { x: 0.56, bottom: 0.94, scale: 0.46, phase: 5, brightness: 1 },
  { x: 0.69, bottom: 0.98, scale: 0.52, phase: 9, brightness: 1 },
  { x: 0.82, bottom: 0.93, scale: 0.45, phase: 13, brightness: 1 },
  { x: 0.95, bottom: 0.96, scale: 0.5, phase: 17, brightness: 1 },
] satisfies BackgroundFlower[];

const CLOUDS = [
  { imageIndex: 4, startX: 0.08, y: 0.14, width: 0.2, speed: 27, opacity: 0.42 },
  { imageIndex: 1, startX: 0.48, y: 0.1, width: 0.14, speed: 36, opacity: 0.34 },
  { imageIndex: 3, startX: 0.78, y: 0.2, width: 0.16, speed: 42, opacity: 0.38 },
  { imageIndex: 0, startX: 0.26, y: 0.25, width: 0.34, speed: 60, opacity: 0.5 },
  { imageIndex: 2, startX: 0.66, y: 0.31, width: 0.23, speed: 72, opacity: 0.46 },
  { imageIndex: 4, startX: 0.93, y: 0.38, width: 0.18, speed: 90, opacity: 0.4 },
] satisfies Cloud[];

const SKY_COLORS = {
  nightTop: { r: 9, g: 25, b: 64 },
  nightBottom: { r: 28, g: 47, b: 94 },
  dawnTop: { r: 89, g: 143, b: 190 },
  dawnBottom: { r: 248, g: 158, b: 88 },
  dayTop: { r: 111, g: 201, b: 255 },
  dayBottom: { r: 224, g: 250, b: 255 },
  sunsetTop: { r: 246, g: 126, b: 82 },
  sunsetBottom: { r: 255, g: 184, b: 88 },
};

const pointIsInside = (pointX: number, pointY: number, rect: Rect) =>
  pointX >= rect.x &&
  pointX <= rect.x + rect.width &&
  pointY >= rect.y &&
  pointY <= rect.y + rect.height;

const pointIsInsideCircle = (pointX: number, pointY: number, circle: Circle) =>
  Math.hypot(pointX - circle.x, pointY - circle.y) <= circle.radius;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const smoothStep = (value: number) => {
  const clamped = clamp(value, 0, 1);

  return clamped * clamped * (3 - 2 * clamped);
};

const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;

const lerpColor = (start: Rgb, end: Rgb, amount: number): Rgb => ({
  r: Math.round(lerp(start.r, end.r, amount)),
  g: Math.round(lerp(start.g, end.g, amount)),
  b: Math.round(lerp(start.b, end.b, amount)),
});

const colorToCss = (color: Rgb) => `rgb(${color.r}, ${color.g}, ${color.b})`;

const getRandomBeeSpawnDelay = () =>
  BEE_MIN_SPAWN_DELAY_MS + Math.random() * (BEE_MAX_SPAWN_DELAY_MS - BEE_MIN_SPAWN_DELAY_MS);

const getRandomPigeonSpawnDelay = () =>
  PIGEON_MIN_SPAWN_DELAY_MS + Math.random() * (PIGEON_MAX_SPAWN_DELAY_MS - PIGEON_MIN_SPAWN_DELAY_MS);

const getRandomCaterpillarSpawnDelay = () =>
  CATERPILLAR_MIN_SPAWN_DELAY_MS +
  Math.random() * (CATERPILLAR_MAX_SPAWN_DELAY_MS - CATERPILLAR_MIN_SPAWN_DELAY_MS);

const getDailyBugMultiplier = (day: number) => 1 + Math.max(0, day - 1) * BUG_DAILY_DIFFICULTY_STEP;

const scaleBugSpawnDelay = (delayMs: number, multiplier: number) => delayMs / multiplier;

const getSeededNoise = (seed: number, index: number) => {
  const value = Math.sin(seed * 41.37 + index * 12.9898) * 43_758.5453;

  return value - Math.floor(value);
};

const getCycleState = (timestamp: number, cycleStart: number): CycleState => {
  const cycleElapsed = (timestamp - cycleStart) % TOTAL_CYCLE_MS;

  if (cycleElapsed < DAY_DURATION_MS) {
    return {
      isDay: true,
      progress: cycleElapsed / DAY_DURATION_MS,
      cycleElapsed,
    };
  }

  return {
    isDay: false,
    progress: (cycleElapsed - DAY_DURATION_MS) / NIGHT_DURATION_MS,
    cycleElapsed,
  };
};

const getSkyColors = ({ isDay, progress }: CycleState) => {
  if (isDay && progress < 0.22) {
    const amount = smoothStep(progress / 0.22);

    return {
      top: lerpColor(SKY_COLORS.nightTop, SKY_COLORS.dawnTop, amount),
      bottom: lerpColor(SKY_COLORS.nightBottom, SKY_COLORS.dawnBottom, amount),
    };
  }

  if (isDay && progress < 0.42) {
    const amount = smoothStep((progress - 0.22) / 0.2);

    return {
      top: lerpColor(SKY_COLORS.dawnTop, SKY_COLORS.dayTop, amount),
      bottom: lerpColor(SKY_COLORS.dawnBottom, SKY_COLORS.dayBottom, amount),
    };
  }

  if (isDay && progress < 0.72) {
    return {
      top: SKY_COLORS.dayTop,
      bottom: SKY_COLORS.dayBottom,
    };
  }

  if (isDay) {
    const amount = smoothStep((progress - 0.72) / 0.28);

    return {
      top: lerpColor(SKY_COLORS.dayTop, SKY_COLORS.sunsetTop, amount),
      bottom: lerpColor(SKY_COLORS.dayBottom, SKY_COLORS.sunsetBottom, amount),
    };
  }

  return {
    top: SKY_COLORS.nightTop,
    bottom: SKY_COLORS.nightBottom,
  };
};

export function SunflowerCanvas({
  hasSeedBroken,
  isGameEnded,
  plantHealth,
  onSeedClick,
  onBeePollinate,
  onRainCloudClick,
  onPigeonAttack,
  onAntAttack,
  onCaterpillarAttack,
  onEnemyKilled,
  onPigeonKilled,
  onBeePresenceChange,
  onVictory,
  onCriticalScream,
  onSunflowerHeadClick,
  onHudUpdate,
}: SunflowerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const seedHitboxRef = useRef<Rect | null>(null);
  const sunflowerHeadHitboxRef = useRef<Circle | null>(null);
  const cloudsRef = useRef<CloudInstance[]>([]);
  const cloudHitboxesRef = useRef<Array<Rect & { id: number }>>([]);
  const rainBurstsRef = useRef<RainBurst[]>([]);
  const beesRef = useRef<Bee[]>([]);
  const beeHitboxesRef = useRef<Array<Rect & { id: number }>>([]);
  const pigeonsRef = useRef<Pigeon[]>([]);
  const pigeonHitboxesRef = useRef<Array<Rect & { id: number }>>([]);
  const antsRef = useRef<Ant[]>([]);
  const antHitboxesRef = useRef<Array<Rect & { id: number }>>([]);
  const caterpillarsRef = useRef<Caterpillar[]>([]);
  const caterpillarHitboxesRef = useRef<Array<Rect & { id: number }>>([]);
  const seedProjectilesRef = useRef<SeedProjectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const swatterSmacksRef = useRef<SwatterSmack[]>([]);
  const swatterHoverRef = useRef<SwatterHover | null>(null);
  const gunshotShakesRef = useRef<GunshotShake[]>([]);
  const gunshotHoverRef = useRef<GunshotHover | null>(null);
  const nextSeedProjectileIdRef = useRef(1);
  const nextParticleIdRef = useRef(1);
  const nextSwatterSmackIdRef = useRef(1);
  const nextGunshotShakeIdRef = useRef(1);
  const hasSeedBrokenRef = useRef(hasSeedBroken);
  const isGameEndedRef = useRef(isGameEnded);
  const plantHealthRef = useRef(plantHealth);
  const previousPlantHealthRef = useRef(plantHealth);
  const damageFlashUntilRef = useRef(0);
  const healFlashUntilRef = useRef(0);
  const deathStartedAtRef = useRef<number | null>(plantHealth <= 0 ? performance.now() : null);
  const seedBrokenAtRef = useRef<number | null>(null);
  const onSeedClickRef = useRef(onSeedClick);
  const onBeePollinateRef = useRef(onBeePollinate);
  const onRainCloudClickRef = useRef(onRainCloudClick);
  const onPigeonAttackRef = useRef(onPigeonAttack);
  const onAntAttackRef = useRef(onAntAttack);
  const onCaterpillarAttackRef = useRef(onCaterpillarAttack);
  const onEnemyKilledRef = useRef(onEnemyKilled);
  const onPigeonKilledRef = useRef(onPigeonKilled);
  const onBeePresenceChangeRef = useRef(onBeePresenceChange);
  const onVictoryRef = useRef(onVictory);
  const onCriticalScreamRef = useRef(onCriticalScream);
  const onSunflowerHeadClickRef = useRef(onSunflowerHeadClick);
  const onHudUpdateRef = useRef(onHudUpdate);

  const emitParticles = (x: number, y: number, kind: keyof typeof PARTICLE_COLORS) => {
    const colors = PARTICLE_COLORS[kind];
    const now = performance.now();

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 70 + Math.random() * 150;

      particlesRef.current.push({
        id: nextParticleIdRef.current,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 36 - Math.random() * 42,
        radius: 2.2 + Math.random() * 4.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 150 + Math.random() * 95,
        startedAt: now,
        duration:
          PARTICLE_MIN_DURATION_MS +
          Math.random() * (PARTICLE_MAX_DURATION_MS - PARTICLE_MIN_DURATION_MS),
      });
      nextParticleIdRef.current += 1;
    }
  };

  const spawnSwatterSmack = (x: number, y: number, size: number) => {
    swatterSmacksRef.current.push({
      id: nextSwatterSmackIdRef.current,
      x,
      y,
      size: clamp(size * 1.85, 68, 126),
      startedAt: performance.now(),
      direction: Math.random() < 0.5 ? -1 : 1,
    });
    nextSwatterSmackIdRef.current += 1;
  };

  const spawnGunshotShake = (x: number, y: number, size: number, direction: -1 | 1) => {
    gunshotShakesRef.current.push({
      id: nextGunshotShakeIdRef.current,
      x,
      y,
      size: clamp(size * 1.35, 112, 178),
      startedAt: performance.now(),
      direction,
    });
    nextGunshotShakeIdRef.current += 1;
  };

  const launchSeedProjectile = (
    x: number,
    y: number,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    const direction: -1 | 1 = Math.random() < 0.5 ? -1 : 1;
    const height = clamp(canvasWidth * 0.042, SEED_PROJECTILE_MIN_HEIGHT, SEED_PROJECTILE_MAX_HEIGHT);
    const speedX =
      direction *
      (SEED_PROJECTILE_MIN_SPEED_X +
        Math.random() * (SEED_PROJECTILE_MAX_SPEED_X - SEED_PROJECTILE_MIN_SPEED_X));
    const speedY = -clamp(canvasHeight * (0.34 + Math.random() * 0.12), 260, 430);
    const angularVelocity =
      direction *
      (SEED_PROJECTILE_MIN_ANGULAR_SPEED +
        Math.random() * (SEED_PROJECTILE_MAX_ANGULAR_SPEED - SEED_PROJECTILE_MIN_ANGULAR_SPEED));

    seedProjectilesRef.current.push({
      id: nextSeedProjectileIdRef.current,
      x,
      y,
      vx: speedX,
      vy: speedY,
      gravity: clamp(canvasHeight * 0.78, 470, 760),
      rotation: Math.random() * Math.PI * 2,
      angularVelocity,
      height,
    });
    nextSeedProjectileIdRef.current += 1;
  };

  const getBugHitboxAtPoint = (pointX: number, pointY: number) =>
    caterpillarHitboxesRef.current.find((hitbox) => pointIsInside(pointX, pointY, hitbox)) ??
    antHitboxesRef.current.find((hitbox) => pointIsInside(pointX, pointY, hitbox)) ??
    null;

  const updateWeaponCursor = (canvas: HTMLCanvasElement, pointX: number, pointY: number) => {
    if (plantHealthRef.current <= 0 || isGameEndedRef.current) {
      canvas.style.cursor = '';
      swatterHoverRef.current = null;
      gunshotHoverRef.current = null;
      return;
    }

    const pigeonHitbox = pigeonHitboxesRef.current.find((hitbox) =>
      pointIsInside(pointX, pointY, hitbox),
    );

    if (pigeonHitbox) {
      canvas.style.cursor = `url(${gunshotSpriteUrl}) 38 28, crosshair`;
      swatterHoverRef.current = null;
      gunshotHoverRef.current = {
        x: pointX,
        y: pointY,
        size: clamp(Math.max(pigeonHitbox.width, pigeonHitbox.height) * 1.18, 112, 178),
        direction: pointX < window.innerWidth / 2 ? 1 : -1,
      };
      return;
    }

    const bugHitbox = getBugHitboxAtPoint(pointX, pointY);

    if (!bugHitbox) {
      canvas.style.cursor = '';
      swatterHoverRef.current = null;
      gunshotHoverRef.current = null;
      return;
    }

    canvas.style.cursor = `url(${flySwatterSpriteUrl}) 34 32, pointer`;
    gunshotHoverRef.current = null;
    swatterHoverRef.current = {
      x: pointX,
      y: pointY,
      size: clamp(Math.max(bugHitbox.width, bugHitbox.height) * 1.75, 62, 116),
    };
  };

  useEffect(() => {
    hasSeedBrokenRef.current = hasSeedBroken;

    if (hasSeedBroken && seedBrokenAtRef.current === null) {
      seedBrokenAtRef.current = performance.now();
    }
  }, [hasSeedBroken]);

  useEffect(() => {
    isGameEndedRef.current = isGameEnded;
  }, [isGameEnded]);

  useEffect(() => {
    if (plantHealth < previousPlantHealthRef.current) {
      damageFlashUntilRef.current = performance.now() + DAMAGE_FLASH_DURATION_MS;
    } else if (plantHealth > previousPlantHealthRef.current) {
      healFlashUntilRef.current = performance.now() + HEAL_FLASH_DURATION_MS;
    }

    if (plantHealth <= 0 && previousPlantHealthRef.current > 0) {
      deathStartedAtRef.current = performance.now();
    } else if (plantHealth > 0) {
      deathStartedAtRef.current = null;
    }

    plantHealthRef.current = plantHealth;
    previousPlantHealthRef.current = plantHealth;
  }, [plantHealth]);

  useEffect(() => {
    onSeedClickRef.current = onSeedClick;
  }, [onSeedClick]);

  useEffect(() => {
    onBeePollinateRef.current = onBeePollinate;
  }, [onBeePollinate]);

  useEffect(() => {
    onRainCloudClickRef.current = onRainCloudClick;
  }, [onRainCloudClick]);

  useEffect(() => {
    onPigeonAttackRef.current = onPigeonAttack;
  }, [onPigeonAttack]);

  useEffect(() => {
    onAntAttackRef.current = onAntAttack;
  }, [onAntAttack]);

  useEffect(() => {
    onCaterpillarAttackRef.current = onCaterpillarAttack;
  }, [onCaterpillarAttack]);

  useEffect(() => {
    onEnemyKilledRef.current = onEnemyKilled;
  }, [onEnemyKilled]);

  useEffect(() => {
    onPigeonKilledRef.current = onPigeonKilled;
  }, [onPigeonKilled]);

  useEffect(() => {
    onBeePresenceChangeRef.current = onBeePresenceChange;
  }, [onBeePresenceChange]);

  useEffect(() => {
    onVictoryRef.current = onVictory;
  }, [onVictory]);

  useEffect(() => {
    onCriticalScreamRef.current = onCriticalScream;
  }, [onCriticalScream]);

  useEffect(() => {
    onSunflowerHeadClickRef.current = onSunflowerHeadClick;
  }, [onSunflowerHeadClick]);

  useEffect(() => {
    onHudUpdateRef.current = onHudUpdate;
  }, [onHudUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    let animationFrameId = 0;
    let currentFrame = 0;
    let lastFrameTime = 0;
    let loadedImages = 0;
    let isMounted = true;
    let cycleStart = 0;
    let lastBeeUpdateTime = 0;
    let nextBeeSpawnAt = Number.POSITIVE_INFINITY;
    let nextBeeId = 1;
    let lastPigeonUpdateTime = 0;
    let nextPigeonSpawnAt = Number.POSITIVE_INFINITY;
    let nextPigeonId = 1;
    let lastCaterpillarUpdateTime = 0;
    let nextCaterpillarSpawnAt = Number.POSITIVE_INFINITY;
    let nextCaterpillarId = 1;
    let lastAntUpdateTime = 0;
    let nextAntSpawnAt = Number.POSITIVE_INFINITY;
    let nextAntId = 1;
    let lastHudKey = '';
    let lastHudProgress = -1;
    let lastHudEmitTime = 0;
    let lastCloudUpdateTime = 0;
    let lastEffectsUpdateTime = 0;
    let lastBeePresence = false;
    let hasVictoryBeenEmitted = false;
    let lastCriticalScreamFrame = -1;
    const bees = beesRef.current;
    const pigeons = pigeonsRef.current;
    const caterpillars = caterpillarsRef.current;
    const ants = antsRef.current;
    const clouds = cloudsRef.current;
    const rainBursts = rainBurstsRef.current;
    const seedProjectiles = seedProjectilesRef.current;
    const particles = particlesRef.current;
    const swatterSmacks = swatterSmacksRef.current;
    const gunshotShakes = gunshotShakesRef.current;

    const beeSprite = new Image();
    const pigeonSprite = new Image();
    const caterpillarSprite = new Image();
    const blackAntSprite = new Image();
    const redAntSprite = new Image();
    const flySwatterSprite = new Image();
    const gunshotSprite = new Image();
    const cloudSprites = [
      new Image(),
      new Image(),
      new Image(),
      new Image(),
      new Image(),
    ];
    const mainSunflowerSprite = new Image();
    const angrySunflowerSprite = new Image();
    const veryAngrySunflowerSprite = new Image();
    const deathSunflowerSprite = new Image();
    const backgroundSunflowerSprite = new Image();
    const seedSprite = new Image();
    const soilSprite = new Image();
    const sproutSprite = new Image();
    const moonSprite = new Image();
    const sunFaceSprite = new Image();
    const sunCrownSprite = new Image();
    const sprites = [
      beeSprite,
      pigeonSprite,
      caterpillarSprite,
      blackAntSprite,
      redAntSprite,
      flySwatterSprite,
      gunshotSprite,
      ...cloudSprites,
      mainSunflowerSprite,
      angrySunflowerSprite,
      veryAngrySunflowerSprite,
      deathSunflowerSprite,
      backgroundSunflowerSprite,
      seedSprite,
      soilSprite,
      sproutSprite,
      moonSprite,
      sunFaceSprite,
      sunCrownSprite,
    ];

    const emitBeePresenceChange = () => {
      const hasBees = bees.length > 0;

      if (hasBees === lastBeePresence) {
        return;
      }

      lastBeePresence = hasBees;
      onBeePresenceChangeRef.current(hasBees);
    };

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = false;
    };

    const drawSky = (canvasWidth: number, canvasHeight: number, cycleState: CycleState) => {
      const colors = getSkyColors(cycleState);
      const gradient = context.createLinearGradient(0, 0, 0, canvasHeight);

      gradient.addColorStop(0, colorToCss(colors.top));
      gradient.addColorStop(0.62, colorToCss(colors.bottom));
      gradient.addColorStop(1, colorToCss(colors.bottom));

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    };

    const drawCriticalHealthVignette = (canvasWidth: number, canvasHeight: number) => {
      const health = plantHealthRef.current;

      if (health >= CRITICAL_HEALTH_THRESHOLD) {
        return;
      }

      const intensity = clamp((CRITICAL_HEALTH_THRESHOLD - health) / CRITICAL_HEALTH_THRESHOLD, 0, 1);
      const edgeSize = Math.min(canvasWidth, canvasHeight) * 0.22;
      const innerColor = 'rgba(145, 0, 0, 0)';
      const outerColor = `rgba(185, 0, 0, ${0.16 + intensity * 0.34})`;

      context.save();

      const topGradient = context.createLinearGradient(0, 0, 0, edgeSize);
      topGradient.addColorStop(0, outerColor);
      topGradient.addColorStop(1, innerColor);
      context.fillStyle = topGradient;
      context.fillRect(0, 0, canvasWidth, edgeSize);

      const bottomGradient = context.createLinearGradient(0, canvasHeight, 0, canvasHeight - edgeSize);
      bottomGradient.addColorStop(0, outerColor);
      bottomGradient.addColorStop(1, innerColor);
      context.fillStyle = bottomGradient;
      context.fillRect(0, canvasHeight - edgeSize, canvasWidth, edgeSize);

      const leftGradient = context.createLinearGradient(0, 0, edgeSize, 0);
      leftGradient.addColorStop(0, outerColor);
      leftGradient.addColorStop(1, innerColor);
      context.fillStyle = leftGradient;
      context.fillRect(0, 0, edgeSize, canvasHeight);

      const rightGradient = context.createLinearGradient(canvasWidth, 0, canvasWidth - edgeSize, 0);
      rightGradient.addColorStop(0, outerColor);
      rightGradient.addColorStop(1, innerColor);
      context.fillStyle = rightGradient;
      context.fillRect(canvasWidth - edgeSize, 0, edgeSize, canvasHeight);

      context.restore();
    };

    const getCloudWidth = (cloud: Cloud, canvasWidth: number) => Math.max(90, canvasWidth * cloud.width);

    const randomizeCloud = (cloud: CloudInstance) => {
      cloud.isRainCloud = Math.random() < RAIN_CLOUD_CHANCE;
      cloud.seed = Math.random() * 10_000;
    };

    const recycleCloud = (cloud: CloudInstance, canvasWidth: number) => {
      const width = getCloudWidth(cloud, canvasWidth);

      cloud.x = -width - Math.random() * canvasWidth * 0.18;
      for (let index = rainBursts.length - 1; index >= 0; index -= 1) {
        if (rainBursts[index].cloudId === cloud.id) {
          rainBursts.splice(index, 1);
        }
      }
      randomizeCloud(cloud);
    };

    const ensureClouds = (canvasWidth: number) => {
      if (clouds.length > 0) {
        return;
      }

      CLOUDS.forEach((cloud, index) => {
        const cloudInstance: CloudInstance = {
          ...cloud,
          id: index + 1,
          x: canvasWidth * cloud.startX,
          isRainCloud: false,
          seed: 0,
        };

        randomizeCloud(cloudInstance);
        clouds.push(cloudInstance);
      });
    };

    const updateClouds = (canvasWidth: number, timestamp: number) => {
      ensureClouds(canvasWidth);

      const elapsedSeconds = lastCloudUpdateTime === 0 ? 0 : (timestamp - lastCloudUpdateTime) / 1_000;
      lastCloudUpdateTime = timestamp;

      clouds.forEach((cloud) => {
        const width = getCloudWidth(cloud, canvasWidth);

        cloud.x += cloud.speed * elapsedSeconds;

        if (cloud.x > canvasWidth + width) {
          recycleCloud(cloud, canvasWidth);
        }
      });
    };

    const drawClouds = (canvasWidth: number, canvasHeight: number, cycleState: CycleState) => {
      const nightOpacity = cycleState.isDay ? 1 : 0.28;

      cloudHitboxesRef.current = [];

      clouds.forEach((cloud) => {
        const sprite = cloudSprites[cloud.imageIndex];
        const width = getCloudWidth(cloud, canvasWidth);
        const height = width / CLOUD_ASPECT_RATIOS[cloud.imageIndex];
        const y = canvasHeight * cloud.y;

        context.save();
        context.globalAlpha = cloud.opacity * nightOpacity;
        context.filter = cloud.isRainCloud ? 'grayscale(0.92) brightness(0.72) contrast(1.12)' : 'none';
        context.drawImage(sprite, cloud.x, y, width, height);
        context.restore();

        if (cloud.isRainCloud) {
          cloudHitboxesRef.current.push({
            id: cloud.id,
            x: cloud.x,
            y,
            width,
            height,
          });
        }
      });
    };

    const drawRainBursts = (canvasWidth: number, canvasHeight: number, timestamp: number) => {
      for (let index = rainBursts.length - 1; index >= 0; index -= 1) {
        const burst = rainBursts[index];
        const age = timestamp - burst.startedAt;

        if (age > RAIN_BURST_DURATION_MS) {
          rainBursts.splice(index, 1);
          continue;
        }

        const cloud = clouds.find((candidate) => candidate.id === burst.cloudId);

        if (!cloud) {
          rainBursts.splice(index, 1);
          continue;
        }

        const width = getCloudWidth(cloud, canvasWidth);
        const height = width / CLOUD_ASPECT_RATIOS[cloud.imageIndex];
        const cloudY = canvasHeight * cloud.y;
        const progress = age / RAIN_BURST_DURATION_MS;
        const rainTop = cloudY + height * 0.64;
        const rainDepth = canvasHeight * 0.58;

        context.save();
        context.strokeStyle = `rgba(115, 185, 235, ${0.58 * (1 - progress * 0.45)})`;
        context.lineWidth = 2;
        context.lineCap = 'round';

        for (let dropIndex = 0; dropIndex < RAIN_STREAK_COUNT; dropIndex += 1) {
          const offsetX = getSeededNoise(burst.seed, dropIndex) * width * 0.82 + width * 0.09;
          const fallOffset = (timestamp / 7 + getSeededNoise(burst.seed, dropIndex + 100) * rainDepth) % rainDepth;
          const x = cloud.x + offsetX;
          const y = rainTop + fallOffset;

          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x - 5, y + 18);
          context.stroke();
        }

        context.restore();
      }
    };

    const drawCelestialPath = (
      canvasWidth: number,
      canvasHeight: number,
      cycleState: CycleState,
      timestamp: number,
    ) => {
      const horizonY = canvasHeight * 0.55;
      const bodySize = Math.min(Math.max(canvasWidth * 0.18, 94), 170);
      const x = -bodySize + cycleState.progress * (canvasWidth + bodySize * 2);
      const y = horizonY - Math.sin(cycleState.progress * Math.PI) * canvasHeight * 0.44;

      if (cycleState.isDay) {
        drawSun(x, y, bodySize, timestamp);
        return;
      }

      drawMoon(x, y, bodySize * 0.74);
    };

    const drawSun = (centerX: number, centerY: number, size: number, timestamp: number) => {
      const crownHeight = size * (241 / 256);
      const crownRotation = Math.sin(timestamp / (2_200 / 3)) * 0.16;

      context.save();
      context.translate(centerX, centerY);
      context.rotate(crownRotation);
      context.drawImage(sunCrownSprite, -size / 2, -crownHeight / 2, size, crownHeight);
      context.restore();

      context.drawImage(sunFaceSprite, centerX - size / 2, centerY - size / 2, size, size);
    };

    const drawMoon = (centerX: number, centerY: number, size: number) => {
      const moonHeight = size * (MOON_HEIGHT / MOON_WIDTH);

      context.drawImage(
        moonSprite,
        centerX - size / 2,
        centerY - moonHeight / 2,
        size,
        moonHeight,
      );
    };

    const drawField = (canvasWidth: number, canvasHeight: number) => {
      const horizonY = canvasHeight * 0.55;
      const fieldGradient = context.createLinearGradient(0, horizonY, 0, canvasHeight);

      fieldGradient.addColorStop(0, 'rgb(153 210 111)');
      fieldGradient.addColorStop(0.48, 'rgb(101 174 76)');
      fieldGradient.addColorStop(1, 'rgb(58 126 55)');

      context.fillStyle = fieldGradient;
      context.fillRect(0, horizonY, canvasWidth, canvasHeight - horizonY);

      context.fillStyle = 'rgba(255, 239, 128, 0.14)';

      for (let index = 0; index < 7; index += 1) {
        const y = horizonY + (canvasHeight - horizonY) * (0.12 + index * 0.11);

        context.beginPath();
        context.ellipse(canvasWidth * 0.5, y, canvasWidth * (0.42 + index * 0.08), 14, 0, 0, Math.PI * 2);
        context.fill();
      }
    };

    const drawGroundShadow = (canvasWidth: number, canvasHeight: number) => {
      const shadowWidth = Math.min(canvasWidth * 0.34, 330);
      const shadowHeight = Math.max(22, canvasHeight * 0.038);
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight * 0.9;

      context.fillStyle = 'rgba(35, 89, 38, 0.24)';
      context.beginPath();
      context.ellipse(centerX, centerY, shadowWidth / 2, shadowHeight / 2, 0, 0, Math.PI * 2);
      context.fill();
    };

    const drawSpriteFrame = (
      sprite: HTMLImageElement,
      frame: number,
      frameWidth: number,
      frameHeight: number,
      frameColumns: number,
      centerX: number,
      bottomY: number,
      scale: number,
      opacity = 1,
      brightness = 1,
      flashFilter: string | null = null,
    ) => {
      const column = frame % frameColumns;
      const row = Math.floor(frame / frameColumns);
      const sourceX = column * frameWidth;
      const sourceY = row * frameHeight;
      const drawWidth = frameWidth * scale;
      const drawHeight = frameHeight * scale;
      const drawX = centerX - drawWidth / 2;
      const drawY = bottomY - drawHeight;

      context.save();
      context.globalAlpha = opacity;
      context.filter = flashFilter ?? `brightness(${brightness})`;
      context.drawImage(
        sprite,
        sourceX,
        sourceY,
        frameWidth,
        frameHeight,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
      );
      context.restore();
    };

    const getPlantFlashFilter = (timestamp: number) => {
      if (timestamp < healFlashUntilRef.current) {
        return HEAL_FLASH_FILTER;
      }

      if (timestamp < damageFlashUntilRef.current) {
        return DAMAGE_FLASH_FILTER;
      }

      return null;
    };

    const getBackgroundSceneScale = (canvasWidth: number, canvasHeight: number) => {
      const responsiveScale = Math.min(canvasWidth / 1100, canvasHeight / 720);

      return Math.min(1.22, Math.max(0.7, responsiveScale));
    };

    const shouldDrawBackgroundFlower = (flower: BackgroundFlower) => {
      const isInCentralNearClear = flower.bottom >= 0.72 && Math.abs(flower.x - 0.5) <= 0.24;

      return !isInCentralNearClear;
    };

    const drawBackgroundSunflower = (
      flower: BackgroundFlower,
      canvasWidth: number,
      canvasHeight: number,
      sceneScale: number,
    ) => {
      drawSpriteFrame(
        backgroundSunflowerSprite,
        (currentFrame + flower.phase) % TOTAL_FRAMES,
        BACKGROUND_FRAME_WIDTH,
        BACKGROUND_FRAME_HEIGHT,
        COLUMNS,
        canvasWidth * flower.x,
        canvasHeight * flower.bottom,
        flower.scale * sceneScale,
        1,
        flower.brightness,
      );
    };

    const drawSeed = (canvasWidth: number, canvasHeight: number, timestamp: number) => {
      sunflowerHeadHitboxRef.current = null;
      const seedHeight = Math.min(canvasHeight * 0.22, 178);
      const seedWidth = (seedHeight / SEED_HEIGHT) * SEED_WIDTH;
      const drawX = (canvasWidth - seedWidth) / 2;
      const drawY = canvasHeight * 0.78 - seedHeight / 2;
      const pivotX = drawX + seedWidth / 2;
      const pivotY = drawY + seedHeight * 0.9;
      const seedSway = Math.sin(timestamp / 380) * 0.08;
      const plantFlashFilter = getPlantFlashFilter(timestamp);

      seedHitboxRef.current = {
        x: drawX,
        y: drawY,
        width: seedWidth,
        height: seedHeight,
      };

      context.save();
      context.filter = plantFlashFilter ?? 'none';
      context.translate(pivotX, pivotY);
      context.rotate(seedSway);
      context.drawImage(
        seedSprite,
        -seedWidth / 2,
        -seedHeight * 0.9,
        seedWidth,
        seedHeight,
      );
      context.restore();
    };

    const drawSprout = (
      canvasWidth: number,
      canvasHeight: number,
      timestamp: number,
      part: 'all' | 'soil' | 'sprout' = 'all',
    ) => {
      seedHitboxRef.current = null;
      sunflowerHeadHitboxRef.current = null;

      const maxDrawWidth = Math.min(canvasWidth * 0.28, 280);
      const maxDrawHeight = canvasHeight * 0.34;
      const scale = Math.min(
        maxDrawWidth / SOIL_WIDTH,
        maxDrawHeight / (SPROUT_HEIGHT + SOIL_HEIGHT * 0.62),
      ) * 0.5;
      const centerX = canvasWidth / 2;
      const soilWidth = SOIL_WIDTH * scale;
      const soilHeight = SOIL_HEIGHT * scale;
      const sproutWidth = SPROUT_WIDTH * scale;
      const sproutHeight = SPROUT_HEIGHT * scale;
      const soilBottomY = canvasHeight * 0.89;
      const soilX = centerX - soilWidth / 2;
      const soilY = soilBottomY - soilHeight;
      const sproutPivotX = centerX;
      const sproutPivotY = soilY + soilHeight * 0.33;
      const sproutSway = Math.sin(timestamp / 460) * 0.055;
      const plantFlashFilter = getPlantFlashFilter(timestamp);

      context.save();
      context.filter = plantFlashFilter ?? 'none';

      if (part !== 'sprout') {
        context.drawImage(soilSprite, soilX, soilY, soilWidth, soilHeight);
      }

      if (part !== 'soil') {
        context.translate(sproutPivotX, sproutPivotY);
        context.rotate(sproutSway);
        context.drawImage(
          sproutSprite,
          -sproutWidth / 2,
          -sproutHeight,
          sproutWidth,
          sproutHeight,
        );
      }

      context.restore();
    };

    const getSunflowerMetrics = (canvasWidth: number, canvasHeight: number, growthScale: number) => {
      const maxDrawWidth = canvasWidth * 0.34;
      const maxDrawHeight = canvasHeight * 0.58;
      const fullScale = Math.min(maxDrawWidth / MAIN_FRAME_WIDTH, maxDrawHeight / MAIN_FRAME_HEIGHT);
      const scale = fullScale * growthScale;
      const bottomY = canvasHeight * 0.9;

      return {
        scale,
        bottomY,
        targetX: canvasWidth / 2,
        targetY: bottomY - MAIN_FRAME_HEIGHT * scale * 0.76,
        targetRadius: Math.max(24, 58 * scale),
      };
    };

    const drawMainSunflower = (
      canvasWidth: number,
      canvasHeight: number,
      growthScale: number,
      timestamp: number,
    ) => {
      seedHitboxRef.current = null;
      const metrics = getSunflowerMetrics(canvasWidth, canvasHeight, growthScale);
      const health = plantHealthRef.current;
      const sunflowerSprite =
        health < 25
          ? veryAngrySunflowerSprite
          : health < 50
            ? angrySunflowerSprite
            : mainSunflowerSprite;
      const frame = health < 25 ? currentFrame % VERY_ANGRY_FRAME_COUNT : currentFrame;
      const frameColumns = health < 25 ? VERY_ANGRY_COLUMNS : COLUMNS;
      const plantFlashFilter = getPlantFlashFilter(timestamp);

      if (
        health > 0 &&
        health < CRITICAL_HEALTH_THRESHOLD &&
        frame === VERY_ANGRY_OPEN_MOUTH_TRIGGER_FRAME &&
        currentFrame !== lastCriticalScreamFrame
      ) {
        lastCriticalScreamFrame = currentFrame;
        onCriticalScreamRef.current();
      }

      sunflowerHeadHitboxRef.current = {
        x: metrics.targetX,
        y: metrics.targetY,
        radius: metrics.targetRadius,
      };

      drawSpriteFrame(
        sunflowerSprite,
        frame,
        MAIN_FRAME_WIDTH,
        MAIN_FRAME_HEIGHT,
        frameColumns,
        canvasWidth / 2,
        metrics.bottomY,
        metrics.scale,
        1,
        1,
        plantFlashFilter,
      );
    };

    const drawDeathSunflower = (
      canvasWidth: number,
      canvasHeight: number,
      growthScale: number,
      timestamp: number,
    ) => {
      seedHitboxRef.current = null;
      sunflowerHeadHitboxRef.current = null;
      const metrics = getSunflowerMetrics(canvasWidth, canvasHeight, growthScale);
      const deathStartedAt = deathStartedAtRef.current ?? timestamp;
      const elapsed = Math.max(0, timestamp - deathStartedAt);
      const frame = Math.min(
        DEATH_FRAME_COUNT - 1,
        Math.floor(elapsed / DEATH_FRAME_DURATION_MS),
      );
      const deathScale = metrics.scale * (MAIN_FRAME_HEIGHT / DEATH_FRAME_HEIGHT);

      drawSpriteFrame(
        deathSunflowerSprite,
        frame,
        DEATH_FRAME_WIDTH,
        DEATH_FRAME_HEIGHT,
        DEATH_COLUMNS,
        canvasWidth / 2 - DEATH_STEM_OFFSET_X * deathScale,
        metrics.bottomY,
        deathScale,
      );
    };

    const getPlantTarget = (canvasWidth: number, canvasHeight: number, lifecycle: PlantLifecycle) => {
      if (lifecycle.stage === 'sunflower') {
        const sunflowerMetrics = getSunflowerMetrics(canvasWidth, canvasHeight, lifecycle.growthScale);

        return {
          x: sunflowerMetrics.targetX,
          y: sunflowerMetrics.targetY,
          radius: sunflowerMetrics.targetRadius,
        };
      }

      return {
        x: canvasWidth / 2,
        y: canvasHeight * 0.77,
        radius: Math.max(24, Math.min(canvasWidth, canvasHeight) * 0.05),
      };
    };

    const spawnBee = (canvasWidth: number, canvasHeight: number, targetY: number) => {
      const side: -1 | 1 = Math.random() < 0.5 ? -1 : 1;
      const size = Math.min(Math.max(canvasWidth * 0.075, 42), 74);
      const x = side === -1 ? -size : canvasWidth + size;
      const y = clamp(
        targetY + (Math.random() - 0.5) * canvasHeight * 0.34,
        canvasHeight * 0.18,
        canvasHeight * 0.82,
      );

      bees.push({
        id: nextBeeId,
        x,
        y,
        speed: (55 + Math.random() * 35) * BEE_SPEED_MULTIPLIER,
        size,
        wobble: Math.random() * Math.PI * 2,
        side,
      });
      nextBeeId += 1;
    };

    const updateBees = (
      canvasWidth: number,
      canvasHeight: number,
      timestamp: number,
      cycleState: CycleState,
      lifecycle: PlantLifecycle,
    ) => {
      const elapsedSeconds = lastBeeUpdateTime === 0 ? 0 : (timestamp - lastBeeUpdateTime) / 1_000;
      lastBeeUpdateTime = timestamp;

      if (lifecycle.stage !== 'sunflower') {
        bees.splice(0);
        nextBeeSpawnAt = Number.POSITIVE_INFINITY;
        return;
      }

      const sunflowerMetrics = getSunflowerMetrics(canvasWidth, canvasHeight, lifecycle.growthScale);

      if (cycleState.isDay) {
        if (!Number.isFinite(nextBeeSpawnAt)) {
          nextBeeSpawnAt = timestamp + getRandomBeeSpawnDelay();
        }

        if (timestamp >= nextBeeSpawnAt) {
          spawnBee(canvasWidth, canvasHeight, sunflowerMetrics.targetY);
          nextBeeSpawnAt = timestamp + getRandomBeeSpawnDelay();
        }
      } else {
        nextBeeSpawnAt = Number.POSITIVE_INFINITY;
      }

      for (let index = bees.length - 1; index >= 0; index -= 1) {
        const bee = bees[index];
        const dx = sunflowerMetrics.targetX - bee.x;
        const dy = sunflowerMetrics.targetY - bee.y;
        const distance = Math.hypot(dx, dy);

        if (distance <= sunflowerMetrics.targetRadius) {
          bees.splice(index, 1);
          onBeePollinateRef.current();
          continue;
        }

        if (distance > 0) {
          const directionX = dx / distance;
          const directionY = dy / distance;
          const perpendicularX = -directionY;
          const perpendicularY = directionX;
          const chaoticDrift =
            Math.sin(timestamp / 145 + bee.wobble) * BEE_CHAOS_STRENGTH +
            Math.sin(timestamp / 79 + bee.wobble * 1.9) * BEE_CHAOS_STRENGTH * 0.42;
          const verticalJitter =
            Math.sin(timestamp / 105 + bee.wobble * 2.7) * BEE_VERTICAL_JITTER_STRENGTH;

          bee.x +=
            (directionX + perpendicularX * chaoticDrift) * bee.speed * elapsedSeconds;
          bee.y +=
            (directionY + perpendicularY * chaoticDrift + verticalJitter) *
            bee.speed *
            elapsedSeconds;
        }
      }
    };

    const drawBees = (
      canvasWidth: number,
      canvasHeight: number,
      timestamp: number,
      lifecycle: PlantLifecycle,
    ) => {
      const beeFrame = Math.floor(timestamp / BEE_FRAME_DURATION_MS) % BEE_FRAME_COUNT;
      const target = getPlantTarget(canvasWidth, canvasHeight, lifecycle);

      beeHitboxesRef.current = bees.map((bee) => {
        const hoverY = Math.sin(timestamp / 210 + bee.wobble) * 8;
        const drawSize = bee.size;
        const drawX = bee.x - drawSize / 2;
        const drawY = bee.y + hoverY - drawSize / 2;
        const targetAngle = Math.atan2(target.y - (bee.y + hoverY), target.x - bee.x);
        const spriteHeadAngle = -Math.PI * 0.75;
        const rotation = targetAngle - spriteHeadAngle;
        const hitbox = {
          id: bee.id,
          x: drawX,
          y: drawY,
          width: drawSize,
          height: drawSize,
        };

        context.save();
        context.translate(bee.x, bee.y + hoverY);
        context.rotate(rotation);

        context.drawImage(
          beeSprite,
          beeFrame * BEE_FRAME_WIDTH,
          0,
          BEE_FRAME_WIDTH,
          BEE_FRAME_HEIGHT,
          -drawSize / 2,
          -drawSize / 2,
          drawSize,
          drawSize,
        );
        context.restore();

        return hitbox;
      });
    };

    const updateEffects = (canvasWidth: number, canvasHeight: number, timestamp: number) => {
      const elapsedSeconds =
        lastEffectsUpdateTime === 0
          ? 0
          : Math.min(0.05, (timestamp - lastEffectsUpdateTime) / 1_000);
      lastEffectsUpdateTime = timestamp;

      for (let index = seedProjectiles.length - 1; index >= 0; index -= 1) {
        const projectile = seedProjectiles[index];

        projectile.x += projectile.vx * elapsedSeconds;
        projectile.y += projectile.vy * elapsedSeconds;
        projectile.vy += projectile.gravity * elapsedSeconds;
        projectile.rotation += projectile.angularVelocity * elapsedSeconds;

        if (
          projectile.x < -projectile.height * 3 ||
          projectile.x > canvasWidth + projectile.height * 3 ||
          projectile.y < -canvasHeight * 0.65 ||
          projectile.y > canvasHeight + projectile.height * 3
        ) {
          seedProjectiles.splice(index, 1);
        }
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];

        particle.x += particle.vx * elapsedSeconds;
        particle.y += particle.vy * elapsedSeconds;
        particle.vy += particle.gravity * elapsedSeconds;

        if (timestamp - particle.startedAt >= particle.duration) {
          particles.splice(index, 1);
        }
      }

      for (let index = swatterSmacks.length - 1; index >= 0; index -= 1) {
        if (timestamp - swatterSmacks[index].startedAt >= SWATTER_SMACK_DURATION_MS) {
          swatterSmacks.splice(index, 1);
        }
      }

      for (let index = gunshotShakes.length - 1; index >= 0; index -= 1) {
        if (timestamp - gunshotShakes[index].startedAt >= GUNSHOT_SHAKE_DURATION_MS) {
          gunshotShakes.splice(index, 1);
        }
      }
    };

    const drawSeedProjectiles = () => {
      seedProjectiles.forEach((projectile) => {
        const drawHeight = projectile.height;
        const drawWidth = drawHeight * (SEED_WIDTH / SEED_HEIGHT);

        context.save();
        context.translate(projectile.x, projectile.y);
        context.rotate(projectile.rotation);
        context.drawImage(
          seedSprite,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight,
        );
        context.restore();
      });
    };

    const drawParticles = (timestamp: number) => {
      particles.forEach((particle) => {
        const progress = clamp((timestamp - particle.startedAt) / particle.duration, 0, 1);
        const alpha = (1 - progress) * 0.86;
        const radius = particle.radius * (1 - progress * 0.28);

        context.save();
        context.globalAlpha = alpha;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });
    };

    const drawSwatterSmacks = (timestamp: number) => {
      swatterSmacks.forEach((smack) => {
        const progress = clamp((timestamp - smack.startedAt) / SWATTER_SMACK_DURATION_MS, 0, 1);
        const hitProgress = smoothStep(clamp(progress / 0.48, 0, 1));
        const fadeProgress = smoothStep(clamp((progress - 0.58) / 0.42, 0, 1));
        const drawWidth = smack.size;
        const drawHeight = drawWidth * (FLY_SWATTER_HEIGHT / FLY_SWATTER_WIDTH);
        const rotation =
          lerp(-0.82 * smack.direction, 0.14 * smack.direction, hitProgress) +
          Math.sin(progress * Math.PI * 2) * 0.06 * (1 - progress);
        const yOffset = lerp(-drawHeight * 0.32, 0, hitProgress);

        context.save();
        context.globalAlpha = 1 - fadeProgress;
        context.translate(smack.x, smack.y + yOffset);
        context.rotate(rotation);
        context.drawImage(
          flySwatterSprite,
          -drawWidth * 0.48,
          -drawHeight * 0.58,
          drawWidth,
          drawHeight,
        );
        context.restore();
      });
    };

    const drawSwatterHover = (timestamp: number) => {
      const hover = swatterHoverRef.current;

      if (!hover || plantHealthRef.current <= 0) {
        return;
      }

      const drawWidth = hover.size;
      const drawHeight = drawWidth * (FLY_SWATTER_HEIGHT / FLY_SWATTER_WIDTH);
      const sway = Math.sin(timestamp / 180) * 0.045;

      context.save();
      context.globalAlpha = 0.92;
      context.translate(hover.x, hover.y);
      context.rotate(-0.36 + sway);
      context.drawImage(
        flySwatterSprite,
        -drawWidth * 0.42,
        -drawHeight * 0.56,
        drawWidth,
        drawHeight,
      );
      context.restore();
    };

    const drawGunshotSprite = (
      x: number,
      y: number,
      size: number,
      direction: -1 | 1,
      rotation: number,
      alpha: number,
      recoilX = 0,
      recoilY = 0,
    ) => {
      const drawWidth = size;
      const drawHeight = drawWidth * (GUNSHOT_HEIGHT / GUNSHOT_WIDTH);

      context.save();
      context.globalAlpha = alpha;
      context.translate(x + recoilX, y + recoilY);

      if (direction === -1) {
        context.scale(-1, 1);
      }

      context.rotate(rotation * direction);
      context.drawImage(
        gunshotSprite,
        -drawWidth * 0.34,
        -drawHeight * 0.52,
        drawWidth,
        drawHeight,
      );
      context.restore();
    };

    const drawGunshotHover = (timestamp: number) => {
      const hover = gunshotHoverRef.current;

      if (!hover || plantHealthRef.current <= 0) {
        return;
      }

      const sway = Math.sin(timestamp / 150) * 0.035;

      drawGunshotSprite(hover.x, hover.y, hover.size, hover.direction, -0.08 + sway, 0.94);
    };

    const drawGunshotShakes = (timestamp: number) => {
      gunshotShakes.forEach((shake) => {
        const progress = clamp((timestamp - shake.startedAt) / GUNSHOT_SHAKE_DURATION_MS, 0, 1);
        const fadeProgress = smoothStep(clamp((progress - 0.66) / 0.34, 0, 1));
        const recoil = Math.sin(progress * Math.PI * 10) * (1 - progress);
        const recoilX = -shake.direction * recoil * 18;
        const recoilY = Math.cos(progress * Math.PI * 8) * (1 - progress) * 7;
        const rotation = -0.1 + recoil * 0.16;

        drawGunshotSprite(
          shake.x,
          shake.y,
          shake.size,
          shake.direction,
          rotation,
          1 - fadeProgress,
          recoilX,
          recoilY,
        );
      });
    };

    const spawnPigeon = (canvasWidth: number, canvasHeight: number) => {
      const side: -1 | 1 = Math.random() < 0.5 ? -1 : 1;
      const size = Math.min(Math.max(canvasWidth * 0.12, 88), 150);
      const x = side === -1 ? -size * (1.1 + Math.random() * 0.8) : canvasWidth + size * (1.1 + Math.random() * 0.8);
      const sideLane = Math.random();
      const y = lerp(
        canvasHeight * 0.08,
        canvasHeight * 0.84,
        sideLane,
      );

      pigeons.push({
        id: nextPigeonId,
        x,
        y,
        speed: PIGEON_MIN_SPEED + Math.random() * (PIGEON_MAX_SPEED - PIGEON_MIN_SPEED),
        size,
        wobble: Math.random() * Math.PI * 2,
        side,
      });
      nextPigeonId += 1;
    };

    const updatePigeons = (
      canvasWidth: number,
      canvasHeight: number,
      timestamp: number,
      lifecycle: PlantLifecycle,
    ) => {
      const elapsedSeconds =
        lastPigeonUpdateTime === 0 ? 0 : (timestamp - lastPigeonUpdateTime) / 1_000;
      lastPigeonUpdateTime = timestamp;

      if (lifecycle.stage === 'seed') {
        pigeons.splice(0);
        nextPigeonSpawnAt = Number.POSITIVE_INFINITY;
        return;
      }

      const target = getPlantTarget(canvasWidth, canvasHeight, lifecycle);

      if (!Number.isFinite(nextPigeonSpawnAt)) {
        nextPigeonSpawnAt = timestamp + getRandomPigeonSpawnDelay();
      }

      if (timestamp >= nextPigeonSpawnAt) {
        spawnPigeon(canvasWidth, canvasHeight);
        nextPigeonSpawnAt = timestamp + getRandomPigeonSpawnDelay();
      }

      for (let index = pigeons.length - 1; index >= 0; index -= 1) {
        const pigeon = pigeons[index];
        const dx = target.x - pigeon.x;
        const dy = target.y - pigeon.y;
        const distance = Math.hypot(dx, dy);

        if (distance <= target.radius + pigeon.size * 0.18) {
          pigeons.splice(index, 1);
          onPigeonAttackRef.current();
          continue;
        }

        if (distance > 0) {
          pigeon.x += (dx / distance) * pigeon.speed * elapsedSeconds;
          pigeon.y += (dy / distance) * pigeon.speed * elapsedSeconds;
        }
      }
    };

    const queuePigeons = (
      drawables: SceneDrawable[],
      getOrder: () => number,
      timestamp: number,
    ) => {
      const pigeonFrame = Math.floor(timestamp / PIGEON_FRAME_DURATION_MS) % PIGEON_FRAME_COUNT;

      pigeonHitboxesRef.current = pigeons.map((pigeon) => {
        const column = pigeonFrame % PIGEON_COLUMNS;
        const row = Math.floor(pigeonFrame / PIGEON_COLUMNS);
        const hoverY = Math.sin(timestamp / 260 + pigeon.wobble) * 10;
        const drawWidth = pigeon.size;
        const drawHeight = pigeon.size * (PIGEON_FRAME_HEIGHT / PIGEON_FRAME_WIDTH);
        const drawX = pigeon.x - drawWidth / 2;
        const drawY = pigeon.y + hoverY - drawHeight / 2;
        const shouldFlip = pigeon.side === -1;
        const hitbox = {
          id: pigeon.id,
          x: drawX,
          y: drawY,
          width: drawWidth,
          height: drawHeight,
        };

        drawables.push({
          depthY: drawY + drawHeight,
          order: getOrder(),
          draw: () => {
            context.save();
            context.translate(pigeon.x, pigeon.y + hoverY);

            if (shouldFlip) {
              context.scale(-1, 1);
            }

            context.drawImage(
              pigeonSprite,
              column * PIGEON_FRAME_WIDTH,
              row * PIGEON_FRAME_HEIGHT,
              PIGEON_FRAME_WIDTH,
              PIGEON_FRAME_HEIGHT,
              -drawWidth / 2,
              -drawHeight / 2,
              drawWidth,
              drawHeight,
            );
            context.restore();
          },
        });

        return hitbox;
      });
    };

    const getAntTarget = (canvasWidth: number, canvasHeight: number) => ({
      x: canvasWidth / 2,
      y: canvasHeight * 0.89,
      radius: Math.max(22, Math.min(canvasWidth, canvasHeight) * 0.045),
    });

    const spawnCaterpillar = (
      canvasWidth: number,
      canvasHeight: number,
      speedMultiplier: number,
    ) => {
      const side: -1 | 1 = Math.random() < 0.5 ? -1 : 1;
      const width = clamp(canvasWidth * 0.105, 76, 128);
      const rowOffset = (Math.random() - 0.5) * Math.max(14, canvasHeight * 0.035);
      const baseY = clamp(canvasHeight * 0.905 + rowOffset, canvasHeight * 0.84, canvasHeight * 0.97);
      const x = side === -1 ? -width : canvasWidth + width;

      caterpillars.push({
        id: nextCaterpillarId,
        x,
        baseY,
        progressY: 0,
        speed:
          (CATERPILLAR_MIN_SPEED +
            Math.random() * (CATERPILLAR_MAX_SPEED - CATERPILLAR_MIN_SPEED)) *
          speedMultiplier,
        width,
        side,
        phase: Math.random() * Math.PI * 2,
      });
      nextCaterpillarId += 1;
    };

    const updateCaterpillars = (
      canvasWidth: number,
      canvasHeight: number,
      timestamp: number,
      lifecycle: PlantLifecycle,
    ) => {
      const elapsedSeconds =
        lastCaterpillarUpdateTime === 0 ? 0 : (timestamp - lastCaterpillarUpdateTime) / 1_000;
      lastCaterpillarUpdateTime = timestamp;

      if (lifecycle.stage === 'seed') {
        caterpillars.splice(0);
        nextCaterpillarSpawnAt = Number.POSITIVE_INFINITY;
        return;
      }

      const bugMultiplier = getDailyBugMultiplier(lifecycle.day);

      if (!Number.isFinite(nextCaterpillarSpawnAt)) {
        nextCaterpillarSpawnAt =
          timestamp + scaleBugSpawnDelay(getRandomCaterpillarSpawnDelay(), bugMultiplier);
      }

      if (timestamp >= nextCaterpillarSpawnAt) {
        spawnCaterpillar(canvasWidth, canvasHeight, bugMultiplier);
        nextCaterpillarSpawnAt =
          timestamp + scaleBugSpawnDelay(getRandomCaterpillarSpawnDelay(), bugMultiplier);
      }

      const target = getAntTarget(canvasWidth, canvasHeight);

      for (let index = caterpillars.length - 1; index >= 0; index -= 1) {
        const caterpillar = caterpillars[index];
        const direction = caterpillar.side === -1 ? 1 : -1;

        caterpillar.x += direction * caterpillar.speed * elapsedSeconds;
        caterpillar.progressY += caterpillar.speed * elapsedSeconds;

        if (Math.abs(target.x - caterpillar.x) <= target.radius) {
          caterpillars.splice(index, 1);
          onCaterpillarAttackRef.current();
        }
      }
    };

    const queueCaterpillars = (
      drawables: SceneDrawable[],
      getOrder: () => number,
      timestamp: number,
    ) => {
      const caterpillarFrame =
        Math.floor(timestamp / CATERPILLAR_FRAME_DURATION_MS) % CATERPILLAR_FRAME_COUNT;

      caterpillarHitboxesRef.current = caterpillars.map((caterpillar) => {
        const waveY =
          Math.sin(timestamp / 380 + caterpillar.phase + caterpillar.progressY * 0.025) *
          Math.max(2, caterpillar.width * 0.025);
        const drawWidth = caterpillar.width;
        const drawHeight = drawWidth * (CATERPILLAR_FRAME_HEIGHT / CATERPILLAR_FRAME_WIDTH);
        const drawX = caterpillar.x - drawWidth / 2;
        const drawY = caterpillar.baseY + waveY - drawHeight;
        const hitbox = {
          id: caterpillar.id,
          x: drawX,
          y: drawY,
          width: drawWidth,
          height: drawHeight,
        };

        drawables.push({
          depthY: caterpillar.baseY + waveY,
          order: getOrder(),
          draw: () => {
            context.save();
            context.translate(caterpillar.x, caterpillar.baseY + waveY - drawHeight / 2);

            if (caterpillar.side === -1) {
              context.scale(-1, 1);
            }

            context.drawImage(
              caterpillarSprite,
              caterpillarFrame * CATERPILLAR_FRAME_WIDTH,
              0,
              CATERPILLAR_FRAME_WIDTH,
              CATERPILLAR_FRAME_HEIGHT,
              -drawWidth / 2,
              -drawHeight / 2,
              drawWidth,
              drawHeight,
            );
            context.restore();
          },
        });

        return hitbox;
      });
    };

    const spawnAnt = (canvasWidth: number, canvasHeight: number, speedMultiplier: number) => {
      const side: -1 | 1 = Math.random() < 0.5 ? -1 : 1;
      const size = clamp(canvasWidth * 0.055, 32, 56);
      const rowStep = Math.max(6, canvasHeight * 0.012);
      const rowOffset = (Math.floor(Math.random() * 5) - 2) * rowStep;
      const baseY = clamp(canvasHeight * 0.895 + rowOffset, canvasHeight * 0.82, canvasHeight * 0.96);
      const x = side === -1 ? -size : canvasWidth + size;

      ants.push({
        id: nextAntId,
        kind: Math.random() < 0.5 ? 'black' : 'red',
        x,
        baseY,
        progressY: 0,
        speed:
          (ANT_MIN_SPEED + Math.random() * (ANT_MAX_SPEED - ANT_MIN_SPEED)) *
          speedMultiplier,
        size,
        side,
        rowOffset,
        phase: Math.random() * Math.PI * 2,
      });
      nextAntId += 1;
    };

    const updateAnts = (
      canvasWidth: number,
      canvasHeight: number,
      timestamp: number,
      lifecycle: PlantLifecycle,
    ) => {
      const elapsedSeconds = lastAntUpdateTime === 0 ? 0 : (timestamp - lastAntUpdateTime) / 1_000;
      lastAntUpdateTime = timestamp;
      const bugMultiplier = getDailyBugMultiplier(lifecycle.day);
      const antSpawnInterval = scaleBugSpawnDelay(ANT_SPAWN_INTERVAL_MS, bugMultiplier);

      if (!Number.isFinite(nextAntSpawnAt)) {
        nextAntSpawnAt = timestamp + antSpawnInterval;
      }

      if (timestamp >= nextAntSpawnAt) {
        spawnAnt(canvasWidth, canvasHeight, bugMultiplier);
        nextAntSpawnAt = timestamp + antSpawnInterval;
      }

      const target = getAntTarget(canvasWidth, canvasHeight);

      for (let index = ants.length - 1; index >= 0; index -= 1) {
        const ant = ants[index];
        const direction = ant.side === -1 ? 1 : -1;

        ant.x += direction * ant.speed * elapsedSeconds;
        ant.progressY += ant.speed * elapsedSeconds;

        if (Math.abs(target.x - ant.x) <= target.radius) {
          ants.splice(index, 1);
          onAntAttackRef.current();
        }
      }
    };

    const queueAnts = (
      drawables: SceneDrawable[],
      getOrder: () => number,
      timestamp: number,
    ) => {
      const antFrame = Math.floor(timestamp / ANT_FRAME_DURATION_MS) % ANT_FRAME_COUNT;
      const column = antFrame % ANT_COLUMNS;
      const row = Math.floor(antFrame / ANT_COLUMNS);

      antHitboxesRef.current = ants.map((ant) => {
        const sprite = ant.kind === 'black' ? blackAntSprite : redAntSprite;
        const waveY =
          Math.sin(timestamp / 330 + ant.phase + ant.progressY * 0.035) *
          Math.max(3, ant.size * 0.1);
        const drawHeight = ant.size;
        const drawWidth = ant.size * (ANT_FRAME_WIDTH / ANT_FRAME_HEIGHT);
        const centerY = ant.baseY + waveY;
        const hitbox = {
          id: ant.id,
          x: ant.x - drawHeight / 2,
          y: centerY - drawWidth / 2,
          width: drawHeight,
          height: drawWidth,
        };

        drawables.push({
          depthY: centerY,
          order: getOrder(),
          draw: () => {
            context.save();
            context.translate(ant.x, centerY);
            context.rotate(ant.side === -1 ? Math.PI / 2 : -Math.PI / 2);
            context.drawImage(
              sprite,
              column * ANT_FRAME_WIDTH,
              row * ANT_FRAME_HEIGHT,
              ANT_FRAME_WIDTH,
              ANT_FRAME_HEIGHT,
              -drawWidth / 2,
              -drawHeight / 2,
              drawWidth,
              drawHeight,
            );
            context.restore();
          },
        });

        return hitbox;
      });
    };

    const drawLayeredBackgroundAndEnemies = (
      canvasWidth: number,
      canvasHeight: number,
      timestamp: number,
    ) => {
      const drawables: SceneDrawable[] = [];
      const sceneScale = getBackgroundSceneScale(canvasWidth, canvasHeight);
      let order = 0;
      const getOrder = () => {
        const currentOrder = order;

        order += 1;
        return currentOrder;
      };

      BACKGROUND_FLOWERS.filter(shouldDrawBackgroundFlower).forEach((flower) => {
        drawables.push({
          depthY: canvasHeight * flower.bottom,
          order: getOrder(),
          draw: () => drawBackgroundSunflower(flower, canvasWidth, canvasHeight, sceneScale),
        });
      });

      queueCaterpillars(drawables, getOrder, timestamp);
      queueAnts(drawables, getOrder, timestamp);
      queuePigeons(drawables, getOrder, timestamp);

      drawables
        .sort((first, second) => first.depthY - second.depthY || first.order - second.order)
        .forEach((drawable) => drawable.draw());
    };

    const getPlantLifecycle = (timestamp: number): PlantLifecycle => {
      if (!hasSeedBrokenRef.current || seedBrokenAtRef.current === null) {
        return {
          stage: 'seed',
          day: 1,
          growthScale: 0,
        };
      }

      const elapsed = Math.max(0, timestamp - seedBrokenAtRef.current);
      const completedDayCycles = Math.floor(elapsed / TOTAL_CYCLE_MS);

      if (completedDayCycles < 1) {
        return {
          stage: 'sprout',
          day: 1,
          growthScale: 0,
        };
      }

      const day = Math.min(completedDayCycles + 1, MAX_GROWTH_DAY);
      const growthProgress = (day - 2) / (MAX_GROWTH_DAY - 2);
      const growthScale = lerp(0.42, 1, smoothStep(growthProgress));

      return {
        stage: 'sunflower',
        day,
        growthScale,
      };
    };

    const emitHud = (timestamp: number, cycleState: CycleState, lifecycle: PlantLifecycle) => {
      const phase: CyclePhase = cycleState.isDay ? 'day' : 'night';
      const progress = clamp(cycleState.progress, 0, 1);
      const discreteKey = `${lifecycle.day}|${lifecycle.stage}|${phase}`;
      const discreteChanged = discreteKey !== lastHudKey;
      const progressChanged = Math.abs(progress - lastHudProgress) >= 0.005;
      const throttleReady = timestamp - lastHudEmitTime >= 100;

      if (!discreteChanged && !(progressChanged && throttleReady)) {
        return;
      }

      lastHudKey = discreteKey;
      lastHudProgress = progress;
      lastHudEmitTime = timestamp;
      onHudUpdateRef.current({
        day: lifecycle.day,
        stage: lifecycle.stage,
        phase,
        cycleProgress: progress,
      });
    };

    const drawFrame = (timestamp: number) => {
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const cycleState = getCycleState(timestamp, cycleStart);
      const lifecycle = getPlantLifecycle(timestamp);
      const isPlantDead = plantHealthRef.current <= 0;
      const isGameEnded = isGameEndedRef.current || hasVictoryBeenEmitted;
      const seedBrokenAt = seedBrokenAtRef.current;

      if (
        !hasVictoryBeenEmitted &&
        !isGameEndedRef.current &&
        !isPlantDead &&
        seedBrokenAt !== null &&
        timestamp - seedBrokenAt >= VICTORY_ELAPSED_MS
      ) {
        hasVictoryBeenEmitted = true;
        isGameEndedRef.current = true;
        onVictoryRef.current();
      }

      updateClouds(canvasWidth, timestamp);

      if (isPlantDead || isGameEnded) {
        bees.splice(0);
        pigeons.splice(0);
        caterpillars.splice(0);
        ants.splice(0);
        seedProjectiles.splice(0);
        particles.splice(0);
        swatterSmacks.splice(0);
        gunshotShakes.splice(0);
        swatterHoverRef.current = null;
        gunshotHoverRef.current = null;
        beeHitboxesRef.current = [];
        pigeonHitboxesRef.current = [];
        caterpillarHitboxesRef.current = [];
        antHitboxesRef.current = [];
        if (isPlantDead) {
          sunflowerHeadHitboxRef.current = null;
        }
      } else {
        updateBees(canvasWidth, canvasHeight, timestamp, cycleState, lifecycle);
        updatePigeons(canvasWidth, canvasHeight, timestamp, lifecycle);
        updateCaterpillars(canvasWidth, canvasHeight, timestamp, lifecycle);
        updateAnts(canvasWidth, canvasHeight, timestamp, lifecycle);
        updateEffects(canvasWidth, canvasHeight, timestamp);
      }

      emitBeePresenceChange();

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawSky(canvasWidth, canvasHeight, cycleState);
      drawCelestialPath(canvasWidth, canvasHeight, cycleState, timestamp);
      drawClouds(canvasWidth, canvasHeight, cycleState);
      drawField(canvasWidth, canvasHeight);
      drawGroundShadow(canvasWidth, canvasHeight);
      drawRainBursts(canvasWidth, canvasHeight, timestamp);

      if (!isPlantDead && lifecycle.stage === 'sprout') {
        drawSprout(canvasWidth, canvasHeight, timestamp, 'soil');
      }

      drawLayeredBackgroundAndEnemies(canvasWidth, canvasHeight, timestamp);

      if (isPlantDead) {
        const deathGrowthScale = lifecycle.stage === 'sunflower' ? lifecycle.growthScale : 0.42;

        drawDeathSunflower(canvasWidth, canvasHeight, deathGrowthScale, timestamp);
      } else if (lifecycle.stage === 'seed') {
        drawSeed(canvasWidth, canvasHeight, timestamp);
      } else if (lifecycle.stage === 'sprout') {
        drawSprout(canvasWidth, canvasHeight, timestamp, 'sprout');
      } else {
        drawMainSunflower(canvasWidth, canvasHeight, lifecycle.growthScale, timestamp);
      }

      drawBees(canvasWidth, canvasHeight, timestamp, lifecycle);
      drawSeedProjectiles();
      drawParticles(timestamp);
      drawGunshotHover(timestamp);
      drawSwatterHover(timestamp);
      drawGunshotShakes(timestamp);
      drawSwatterSmacks(timestamp);
      drawCriticalHealthVignette(canvasWidth, canvasHeight);
      emitHud(timestamp, cycleState, lifecycle);
    };

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTime >= FRAME_DURATION_MS) {
        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        lastFrameTime = timestamp;
      }

      drawFrame(timestamp);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!isMounted) {
        return;
      }

      resizeCanvas();
      cycleStart = performance.now();
      lastFrameTime = cycleStart;
      drawFrame(cycleStart);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    const handleSpriteLoad = () => {
      loadedImages += 1;

      if (loadedImages === sprites.length) {
        startAnimation();
      }
    };

    window.addEventListener('resize', resizeCanvas);
    sprites.forEach((sprite) => sprite.addEventListener('load', handleSpriteLoad));
    mainSunflowerSprite.src = sunflowerSpriteUrl;
    angrySunflowerSprite.src = angrySunflowerSpriteUrl;
    veryAngrySunflowerSprite.src = veryAngrySunflowerSpriteUrl;
    deathSunflowerSprite.src = deathSunflowerSpriteUrl;
    beeSprite.src = beeSpriteUrl;
    pigeonSprite.src = pigeonSpriteUrl;
    caterpillarSprite.src = caterpillarSpriteUrl;
    blackAntSprite.src = blackAntSpriteUrl;
    redAntSprite.src = redAntSpriteUrl;
    flySwatterSprite.src = flySwatterSpriteUrl;
    gunshotSprite.src = gunshotSpriteUrl;
    cloudSprites[0].src = cloud01Url;
    cloudSprites[1].src = cloud02Url;
    cloudSprites[2].src = cloud03Url;
    cloudSprites[3].src = cloud04Url;
    cloudSprites[4].src = cloud05Url;
    backgroundSunflowerSprite.src = backgroundSunflowerSpriteUrl;
    seedSprite.src = seedSpriteUrl;
    soilSprite.src = soilSpriteUrl;
    sproutSprite.src = sproutSpriteUrl;
    moonSprite.src = moonSpriteUrl;
    sunFaceSprite.src = sunFaceUrl;
    sunCrownSprite.src = sunCrownUrl;

    return () => {
      isMounted = false;
      bees.splice(0);
      pigeons.splice(0);
      caterpillars.splice(0);
      ants.splice(0);
      clouds.splice(0);
      rainBursts.splice(0);
      seedProjectiles.splice(0);
      particles.splice(0);
      swatterSmacks.splice(0);
      gunshotShakes.splice(0);
      swatterHoverRef.current = null;
      gunshotHoverRef.current = null;
      cloudHitboxesRef.current = [];
      beeHitboxesRef.current = [];
      pigeonHitboxesRef.current = [];
      caterpillarHitboxesRef.current = [];
      antHitboxesRef.current = [];
      seedHitboxRef.current = null;
      sunflowerHeadHitboxRef.current = null;
      if (lastBeePresence) {
        lastBeePresence = false;
        onBeePresenceChangeRef.current(false);
      }
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      sprites.forEach((sprite) => sprite.removeEventListener('load', handleSpriteLoad));
    };
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const seedHitbox = seedHitboxRef.current;

    if (!canvas) {
      return;
    }

    if (plantHealthRef.current <= 0 || isGameEndedRef.current) {
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const clickedPigeon = pigeonHitboxesRef.current.find((hitbox) =>
      pointIsInside(pointerX, pointerY, hitbox),
    );

    if (clickedPigeon) {
      const clickedPigeonIndex = pigeonsRef.current.findIndex(
        (pigeon) => pigeon.id === clickedPigeon.id,
      );

      if (clickedPigeonIndex >= 0) {
        pigeonsRef.current.splice(clickedPigeonIndex, 1);
        canvas.style.cursor = '';
        gunshotHoverRef.current = null;
        onPigeonKilledRef.current();
        spawnGunshotShake(
          clickedPigeon.x + clickedPigeon.width / 2,
          clickedPigeon.y + clickedPigeon.height / 2,
          Math.max(clickedPigeon.width, clickedPigeon.height),
          pointerX < bounds.width / 2 ? 1 : -1,
        );
        emitParticles(
          clickedPigeon.x + clickedPigeon.width / 2,
          clickedPigeon.y + clickedPigeon.height / 2,
          'enemy',
        );
      }

      pigeonHitboxesRef.current = pigeonHitboxesRef.current.filter(
        (hitbox) => hitbox.id !== clickedPigeon.id,
      );
      return;
    }

    const clickedCaterpillar = caterpillarHitboxesRef.current.find((hitbox) =>
      pointIsInside(pointerX, pointerY, hitbox),
    );

    if (clickedCaterpillar) {
      const clickedCaterpillarIndex = caterpillarsRef.current.findIndex(
        (caterpillar) => caterpillar.id === clickedCaterpillar.id,
      );

      if (clickedCaterpillarIndex >= 0) {
        caterpillarsRef.current.splice(clickedCaterpillarIndex, 1);
        canvas.style.cursor = '';
        swatterHoverRef.current = null;
        onEnemyKilledRef.current();
        spawnSwatterSmack(
          clickedCaterpillar.x + clickedCaterpillar.width / 2,
          clickedCaterpillar.y + clickedCaterpillar.height / 2,
          Math.max(clickedCaterpillar.width, clickedCaterpillar.height),
        );
        emitParticles(
          clickedCaterpillar.x + clickedCaterpillar.width / 2,
          clickedCaterpillar.y + clickedCaterpillar.height / 2,
          'enemy',
        );
      }

      caterpillarHitboxesRef.current = caterpillarHitboxesRef.current.filter(
        (hitbox) => hitbox.id !== clickedCaterpillar.id,
      );
      return;
    }

    const clickedAnt = antHitboxesRef.current.find((hitbox) =>
      pointIsInside(pointerX, pointerY, hitbox),
    );

    if (clickedAnt) {
      const clickedAntIndex = antsRef.current.findIndex((ant) => ant.id === clickedAnt.id);

      if (clickedAntIndex >= 0) {
        antsRef.current.splice(clickedAntIndex, 1);
        canvas.style.cursor = '';
        swatterHoverRef.current = null;
        onEnemyKilledRef.current();
        spawnSwatterSmack(
          clickedAnt.x + clickedAnt.width / 2,
          clickedAnt.y + clickedAnt.height / 2,
          Math.max(clickedAnt.width, clickedAnt.height),
        );
        emitParticles(
          clickedAnt.x + clickedAnt.width / 2,
          clickedAnt.y + clickedAnt.height / 2,
          'enemy',
        );
      }

      antHitboxesRef.current = antHitboxesRef.current.filter((hitbox) => hitbox.id !== clickedAnt.id);
      return;
    }

    const clickedBee = beeHitboxesRef.current.find((hitbox) =>
      pointIsInside(pointerX, pointerY, hitbox),
    );

    if (clickedBee) {
      const clickedBeeIndex = beesRef.current.findIndex((bee) => bee.id === clickedBee.id);

      if (clickedBeeIndex >= 0) {
        beesRef.current.splice(clickedBeeIndex, 1);
        canvas.style.cursor = '';
        swatterHoverRef.current = null;
        onEnemyKilledRef.current();
        spawnSwatterSmack(
          clickedBee.x + clickedBee.width / 2,
          clickedBee.y + clickedBee.height / 2,
          Math.max(clickedBee.width, clickedBee.height),
        );
        emitParticles(
          clickedBee.x + clickedBee.width / 2,
          clickedBee.y + clickedBee.height / 2,
          'enemy',
        );
      }

      beeHitboxesRef.current = beeHitboxesRef.current.filter((hitbox) => hitbox.id !== clickedBee.id);
      return;
    }

    const clickedCloud = cloudHitboxesRef.current.find((hitbox) =>
      pointIsInside(pointerX, pointerY, hitbox),
    );

    if (clickedCloud) {
      const cloud = cloudsRef.current.find((candidate) => candidate.id === clickedCloud.id);

      if (cloud?.isRainCloud) {
        const existingBurst = rainBurstsRef.current.find((burst) => burst.cloudId === cloud.id);
        const startedAt = performance.now();
        const cloudCenterX = clickedCloud.x + clickedCloud.width / 2;
        const isCloudOverPlantZone =
          cloudCenterX >= bounds.width * RAIN_HYDRATION_MIN_SCREEN_PERCENT &&
          cloudCenterX <= bounds.width * RAIN_HYDRATION_MAX_SCREEN_PERCENT;

        if (existingBurst) {
          existingBurst.startedAt = startedAt;
          existingBurst.seed = Math.random() * 10_000;
        } else {
          rainBurstsRef.current.push({
            cloudId: cloud.id,
            startedAt,
            seed: Math.random() * 10_000,
          });
        }

        if (isCloudOverPlantZone) {
          onRainCloudClickRef.current();
        }

        return;
      }
    }

    const sunflowerHeadHitbox = sunflowerHeadHitboxRef.current;

    if (sunflowerHeadHitbox && pointIsInsideCircle(pointerX, pointerY, sunflowerHeadHitbox)) {
      onSunflowerHeadClickRef.current();
      launchSeedProjectile(
        sunflowerHeadHitbox.x,
        sunflowerHeadHitbox.y,
        bounds.width,
        bounds.height,
      );
      emitParticles(sunflowerHeadHitbox.x, sunflowerHeadHitbox.y, 'seed');
      return;
    }

    if (hasSeedBroken || !seedHitbox) {
      return;
    }

    if (pointIsInside(pointerX, pointerY, seedHitbox)) {
      emitParticles(pointerX, pointerY, 'seed');
      onSeedClickRef.current();
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const bounds = canvas.getBoundingClientRect();

    updateWeaponCursor(canvas, event.clientX - bounds.left, event.clientY - bounds.top);
  };

  const handlePointerLeave = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.style.cursor = '';
      swatterHoverRef.current = null;
      gunshotHoverRef.current = null;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (
      plantHealthRef.current <= 0 ||
      isGameEndedRef.current ||
      hasSeedBroken ||
      (event.key !== 'Enter' && event.key !== ' ')
    ) {
      return;
    }

    event.preventDefault();
    onSeedClickRef.current();
  };

  return (
    <canvas
      ref={canvasRef}
      className={`sunflower-canvas ${hasSeedBroken ? 'is-sprouted' : 'is-seed'}`}
      aria-label={hasSeedBroken ? 'Planta en crecimiento' : 'Pipa lista para plantar'}
      role={hasSeedBroken ? 'img' : 'button'}
      tabIndex={hasSeedBroken ? -1 : 0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    />
  );
}
