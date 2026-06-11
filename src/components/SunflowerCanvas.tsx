import { useEffect, useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import beeSpriteUrl from '../assets/bee/bee.png';
import cloud01Url from '../assets/cloud/cloud_01.png';
import cloud02Url from '../assets/cloud/cloud_02.png';
import cloud03Url from '../assets/cloud/cloud_03.png';
import cloud04Url from '../assets/cloud/cloud_04.png';
import cloud05Url from '../assets/cloud/cloud_05.png';
import moonSpriteUrl from '../assets/moon/moon.png';
import seedSpriteUrl from '../assets/seed.png';
import soilSpriteUrl from '../assets/soil.png';
import sproutSpriteUrl from '../assets/sprout.png';
import sunCrownUrl from '../assets/sun/crown.png';
import sunFaceUrl from '../assets/sun/face.png';
import sunflowerSpriteUrl from '../assets/idle_happy.png';
import backgroundSunflowerSpriteUrl from '../assets/sunflower_background.png';

const COLUMNS = 5;
const ROWS = 4;
const TOTAL_FRAMES = COLUMNS * ROWS;
const MAIN_FRAME_WIDTH = 360;
const MAIN_FRAME_HEIGHT = 527;
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
const DAY_DURATION_MS = 30_000;
const NIGHT_DURATION_MS = 10_000;
const TOTAL_CYCLE_MS = DAY_DURATION_MS + NIGHT_DURATION_MS;
export const MAX_GROWTH_DAY = 5;

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
  onSeedClick: () => void;
  onBeePollinate: () => void;
  onHudUpdate: (hud: HudInfo) => void;
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
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

type Cloud = {
  imageIndex: number;
  startX: number;
  y: number;
  width: number;
  speed: number;
  opacity: number;
};

type BackgroundFlower = {
  x: number;
  bottom: number;
  scale: number;
  phase: number;
  brightness: number;
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
  { imageIndex: 4, startX: 0.08, y: 0.14, width: 0.2, speed: 9, opacity: 0.42 },
  { imageIndex: 1, startX: 0.48, y: 0.1, width: 0.14, speed: 12, opacity: 0.34 },
  { imageIndex: 3, startX: 0.78, y: 0.2, width: 0.16, speed: 14, opacity: 0.38 },
  { imageIndex: 0, startX: 0.26, y: 0.25, width: 0.34, speed: 20, opacity: 0.5 },
  { imageIndex: 2, startX: 0.66, y: 0.31, width: 0.23, speed: 24, opacity: 0.46 },
  { imageIndex: 4, startX: 0.93, y: 0.38, width: 0.18, speed: 30, opacity: 0.4 },
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
  onSeedClick,
  onBeePollinate,
  onHudUpdate,
}: SunflowerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const seedHitboxRef = useRef<Rect | null>(null);
  const beesRef = useRef<Bee[]>([]);
  const beeHitboxesRef = useRef<Array<Rect & { id: number }>>([]);
  const hasSeedBrokenRef = useRef(hasSeedBroken);
  const seedBrokenAtRef = useRef<number | null>(null);
  const onSeedClickRef = useRef(onSeedClick);
  const onBeePollinateRef = useRef(onBeePollinate);
  const onHudUpdateRef = useRef(onHudUpdate);

  useEffect(() => {
    hasSeedBrokenRef.current = hasSeedBroken;

    if (hasSeedBroken && seedBrokenAtRef.current === null) {
      seedBrokenAtRef.current = performance.now();
    }
  }, [hasSeedBroken]);

  useEffect(() => {
    onSeedClickRef.current = onSeedClick;
  }, [onSeedClick]);

  useEffect(() => {
    onBeePollinateRef.current = onBeePollinate;
  }, [onBeePollinate]);

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
    let lastHudKey = '';
    let lastHudProgress = -1;
    let lastHudEmitTime = 0;
    const bees = beesRef.current;

    const beeSprite = new Image();
    const cloudSprites = [
      new Image(),
      new Image(),
      new Image(),
      new Image(),
      new Image(),
    ];
    const mainSunflowerSprite = new Image();
    const backgroundSunflowerSprite = new Image();
    const seedSprite = new Image();
    const soilSprite = new Image();
    const sproutSprite = new Image();
    const moonSprite = new Image();
    const sunFaceSprite = new Image();
    const sunCrownSprite = new Image();
    const sprites = [
      beeSprite,
      ...cloudSprites,
      mainSunflowerSprite,
      backgroundSunflowerSprite,
      seedSprite,
      soilSprite,
      sproutSprite,
      moonSprite,
      sunFaceSprite,
      sunCrownSprite,
    ];

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

    const drawClouds = (canvasWidth: number, canvasHeight: number, timestamp: number, cycleState: CycleState) => {
      const nightOpacity = cycleState.isDay ? 1 : 0.28;

      CLOUDS.forEach((cloud) => {
        const sprite = cloudSprites[cloud.imageIndex];
        const width = Math.max(90, canvasWidth * cloud.width);
        const height = width / CLOUD_ASPECT_RATIOS[cloud.imageIndex];
        const travelWidth = canvasWidth + width * 2;
        const travelX = (canvasWidth * cloud.startX + (timestamp / 1_000) * cloud.speed) % travelWidth;
        const x = travelX - width;
        const y = canvasHeight * cloud.y;

        context.save();
        context.globalAlpha = cloud.opacity * nightOpacity;
        context.drawImage(sprite, x, y, width, height);
        context.drawImage(sprite, x - travelWidth, y, width, height);
        context.restore();
      });
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
      context.filter = `brightness(${brightness})`;
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

    const drawBackgroundSunflowers = (canvasWidth: number, canvasHeight: number) => {
      const responsiveScale = Math.min(canvasWidth / 1100, canvasHeight / 720);
      const sceneScale = Math.min(1.22, Math.max(0.7, responsiveScale));

      BACKGROUND_FLOWERS.filter((flower) => {
        const isInCentralNearClear = flower.bottom >= 0.72 && Math.abs(flower.x - 0.5) <= 0.24;

        return !isInCentralNearClear;
      }).forEach((flower) => {
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
      });
    };

    const drawSeed = (canvasWidth: number, canvasHeight: number, timestamp: number) => {
      const seedHeight = Math.min(canvasHeight * 0.22, 178);
      const seedWidth = (seedHeight / SEED_HEIGHT) * SEED_WIDTH;
      const drawX = (canvasWidth - seedWidth) / 2;
      const drawY = canvasHeight * 0.78 - seedHeight / 2;
      const pivotX = drawX + seedWidth / 2;
      const pivotY = drawY + seedHeight * 0.9;
      const seedSway = Math.sin(timestamp / 380) * 0.08;

      seedHitboxRef.current = {
        x: drawX,
        y: drawY,
        width: seedWidth,
        height: seedHeight,
      };

      context.save();
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

    const drawSprout = (canvasWidth: number, canvasHeight: number, timestamp: number) => {
      seedHitboxRef.current = null;

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

      context.drawImage(soilSprite, soilX, soilY, soilWidth, soilHeight);

      context.save();
      context.translate(sproutPivotX, sproutPivotY);
      context.rotate(sproutSway);
      context.drawImage(
        sproutSprite,
        -sproutWidth / 2,
        -sproutHeight,
        sproutWidth,
        sproutHeight,
      );
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

    const drawMainSunflower = (canvasWidth: number, canvasHeight: number, growthScale: number) => {
      seedHitboxRef.current = null;
      const metrics = getSunflowerMetrics(canvasWidth, canvasHeight, growthScale);

      drawSpriteFrame(
        mainSunflowerSprite,
        currentFrame,
        MAIN_FRAME_WIDTH,
        MAIN_FRAME_HEIGHT,
        COLUMNS,
        canvasWidth / 2,
        metrics.bottomY,
        metrics.scale,
      );
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
        speed: 55 + Math.random() * 35,
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

      if (lifecycle.stage !== 'sunflower' || !cycleState.isDay) {
        bees.splice(0);
        nextBeeSpawnAt = Number.POSITIVE_INFINITY;
        return;
      }

      const sunflowerMetrics = getSunflowerMetrics(canvasWidth, canvasHeight, lifecycle.growthScale);

      if (!Number.isFinite(nextBeeSpawnAt)) {
        nextBeeSpawnAt = timestamp + getRandomBeeSpawnDelay();
      }

      if (timestamp >= nextBeeSpawnAt) {
        spawnBee(canvasWidth, canvasHeight, sunflowerMetrics.targetY);
        nextBeeSpawnAt = timestamp + getRandomBeeSpawnDelay();
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
          bee.x += (dx / distance) * bee.speed * elapsedSeconds;
          bee.y += (dy / distance) * bee.speed * elapsedSeconds;
        }
      }
    };

    const drawBees = (timestamp: number) => {
      const beeFrame = Math.floor(timestamp / BEE_FRAME_DURATION_MS) % BEE_FRAME_COUNT;

      beeHitboxesRef.current = bees.map((bee) => {
        const hoverY = Math.sin(timestamp / 210 + bee.wobble) * 8;
        const drawSize = bee.size;
        const drawX = bee.x - drawSize / 2;
        const drawY = bee.y + hoverY - drawSize / 2;
        const hitbox = {
          id: bee.id,
          x: drawX,
          y: drawY,
          width: drawSize,
          height: drawSize,
        };
        const shouldFlip = bee.side === -1;

        context.save();
        context.translate(bee.x, bee.y + hoverY);

        if (shouldFlip) {
          context.scale(-1, 1);
        }

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

      updateBees(canvasWidth, canvasHeight, timestamp, cycleState, lifecycle);

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawSky(canvasWidth, canvasHeight, cycleState);
      drawClouds(canvasWidth, canvasHeight, timestamp, cycleState);
      drawCelestialPath(canvasWidth, canvasHeight, cycleState, timestamp);
      drawField(canvasWidth, canvasHeight);
      drawBackgroundSunflowers(canvasWidth, canvasHeight);
      drawGroundShadow(canvasWidth, canvasHeight);

      if (lifecycle.stage === 'seed') {
        drawSeed(canvasWidth, canvasHeight, timestamp);
      } else if (lifecycle.stage === 'sprout') {
        drawSprout(canvasWidth, canvasHeight, timestamp);
      } else {
        drawMainSunflower(canvasWidth, canvasHeight, lifecycle.growthScale);
      }

      drawBees(timestamp);
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
    beeSprite.src = beeSpriteUrl;
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

    const bounds = canvas.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const clickedBee = beeHitboxesRef.current.find((hitbox) =>
      pointIsInside(pointerX, pointerY, hitbox),
    );

    if (clickedBee) {
      const clickedBeeIndex = beesRef.current.findIndex((bee) => bee.id === clickedBee.id);

      if (clickedBeeIndex >= 0) {
        beesRef.current.splice(clickedBeeIndex, 1);
      }

      beeHitboxesRef.current = beeHitboxesRef.current.filter((hitbox) => hitbox.id !== clickedBee.id);
      return;
    }

    if (hasSeedBroken || !seedHitbox) {
      return;
    }

    if (pointIsInside(pointerX, pointerY, seedHitbox)) {
      onSeedClickRef.current();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (hasSeedBroken || (event.key !== 'Enter' && event.key !== ' ')) {
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
    />
  );
}
