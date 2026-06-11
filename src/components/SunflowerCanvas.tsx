import { useEffect, useRef } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import seedSpriteUrl from '../assets/seed.png';
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
const FRAME_DURATION_MS = 75;
const SEED_WIDTH = 128;
const SEED_HEIGHT = 178;
const DAY_DURATION_MS = 60_000;
const NIGHT_DURATION_MS = 60_000;
const TOTAL_CYCLE_MS = DAY_DURATION_MS + NIGHT_DURATION_MS;

type SunflowerCanvasProps = {
  hasSprouted: boolean;
  seedClicks: number;
  seedClicksToSprout: number;
  onSeedClick: () => void;
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

const BACKGROUND_FLOWERS = [
  { x: 0.08, bottom: 0.78, scale: 0.42, phase: 1, opacity: 0.7 },
  { x: 0.2, bottom: 0.58, scale: 0.33, phase: 6, opacity: 0.58 },
  { x: 0.34, bottom: 0.7, scale: 0.28, phase: 11, opacity: 0.52 },
  { x: 0.66, bottom: 0.7, scale: 0.28, phase: 15, opacity: 0.52 },
  { x: 0.8, bottom: 0.58, scale: 0.33, phase: 4, opacity: 0.58 },
  { x: 0.92, bottom: 0.78, scale: 0.42, phase: 9, opacity: 0.7 },
  { x: 0.16, bottom: 0.95, scale: 0.5, phase: 13, opacity: 0.86 },
  { x: 0.84, bottom: 0.95, scale: 0.5, phase: 18, opacity: 0.86 },
  { x: 0.04, bottom: 0.52, scale: 0.26, phase: 2, opacity: 0.45 },
  { x: 0.96, bottom: 0.52, scale: 0.26, phase: 7, opacity: 0.45 },
];

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

const getNightSkyColorAt = (y: number, canvasHeight: number) => {
  const amount = clamp(y / (canvasHeight * 0.62), 0, 1);

  return lerpColor(SKY_COLORS.nightTop, SKY_COLORS.nightBottom, amount);
};

export function SunflowerCanvas({
  hasSprouted,
  seedClicks,
  seedClicksToSprout,
  onSeedClick,
}: SunflowerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const seedHitboxRef = useRef<Rect | null>(null);
  const hasSproutedRef = useRef(hasSprouted);
  const seedClicksRef = useRef(seedClicks);
  const onSeedClickRef = useRef(onSeedClick);

  useEffect(() => {
    hasSproutedRef.current = hasSprouted;
  }, [hasSprouted]);

  useEffect(() => {
    seedClicksRef.current = seedClicks;
  }, [seedClicks]);

  useEffect(() => {
    onSeedClickRef.current = onSeedClick;
  }, [onSeedClick]);

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

    const mainSunflowerSprite = new Image();
    const backgroundSunflowerSprite = new Image();
    const seedSprite = new Image();
    const sunFaceSprite = new Image();
    const sunCrownSprite = new Image();
    const sprites = [
      mainSunflowerSprite,
      backgroundSunflowerSprite,
      seedSprite,
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

      drawMoon(x, y, bodySize * 0.74, canvasHeight);
    };

    const drawSun = (centerX: number, centerY: number, size: number, timestamp: number) => {
      const crownHeight = size * (241 / 256);
      const crownRotation = Math.sin(timestamp / 2_200) * 0.16;

      context.save();
      context.translate(centerX, centerY);
      context.rotate(crownRotation);
      context.drawImage(sunCrownSprite, -size / 2, -crownHeight / 2, size, crownHeight);
      context.restore();

      context.drawImage(sunFaceSprite, centerX - size / 2, centerY - size / 2, size, size);
    };

    const drawMoon = (centerX: number, centerY: number, size: number, canvasHeight: number) => {
      context.save();
      context.fillStyle = 'rgba(255, 248, 213, 0.2)';
      context.beginPath();
      context.arc(centerX - size * 0.05, centerY, size * 0.68, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = 'rgb(239, 235, 205)';
      context.beginPath();
      context.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = colorToCss(getNightSkyColorAt(centerY, canvasHeight));
      context.beginPath();
      context.arc(centerX + size * 0.2, centerY - size * 0.06, size / 2, 0, Math.PI * 2);
      context.fill();
      context.restore();
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
      centerX: number,
      bottomY: number,
      scale: number,
      opacity = 1,
    ) => {
      const column = frame % COLUMNS;
      const row = Math.floor(frame / COLUMNS);
      const sourceX = column * frameWidth;
      const sourceY = row * frameHeight;
      const drawWidth = frameWidth * scale;
      const drawHeight = frameHeight * scale;
      const drawX = centerX - drawWidth / 2;
      const drawY = bottomY - drawHeight;

      context.globalAlpha = opacity;
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
      context.globalAlpha = 1;
    };

    const drawBackgroundSunflowers = (canvasWidth: number, canvasHeight: number, cycleState: CycleState) => {
      const responsiveScale = Math.min(canvasWidth / 1100, canvasHeight / 720);
      const sceneScale = Math.min(1.22, Math.max(0.7, responsiveScale));
      const nightDim = cycleState.isDay ? 1 : 0.64;

      BACKGROUND_FLOWERS.forEach((flower) => {
        drawSpriteFrame(
          backgroundSunflowerSprite,
          (currentFrame + flower.phase) % TOTAL_FRAMES,
          BACKGROUND_FRAME_WIDTH,
          BACKGROUND_FRAME_HEIGHT,
          canvasWidth * flower.x,
          canvasHeight * flower.bottom,
          flower.scale * sceneScale,
          flower.opacity * nightDim,
        );
      });
    };

    const drawSeed = (canvasWidth: number, canvasHeight: number) => {
      const seedHeight = Math.min(canvasHeight * 0.22, 178);
      const seedWidth = (seedHeight / SEED_HEIGHT) * SEED_WIDTH;
      const drawX = (canvasWidth - seedWidth) / 2;
      const drawY = canvasHeight * 0.78 - seedHeight / 2;

      seedHitboxRef.current = {
        x: drawX,
        y: drawY,
        width: seedWidth,
        height: seedHeight,
      };

      context.drawImage(seedSprite, drawX, drawY, seedWidth, seedHeight);
    };

    const drawMainSunflower = (canvasWidth: number, canvasHeight: number) => {
      seedHitboxRef.current = null;

      const maxDrawWidth = canvasWidth * 0.34;
      const maxDrawHeight = canvasHeight * 0.58;
      const scale = Math.min(maxDrawWidth / MAIN_FRAME_WIDTH, maxDrawHeight / MAIN_FRAME_HEIGHT);

      drawSpriteFrame(
        mainSunflowerSprite,
        currentFrame,
        MAIN_FRAME_WIDTH,
        MAIN_FRAME_HEIGHT,
        canvasWidth / 2,
        canvasHeight * 0.9,
        scale,
      );
    };

    const drawHud = (canvasWidth: number, cycleState: CycleState) => {
      const padding = Math.max(14, Math.min(canvasWidth * 0.02, 24));
      const lineHeight = 26;
      const status = hasSproutedRef.current
        ? 'Estado: feliz'
        : `Pipa: ${seedClicksRef.current}/${seedClicksToSprout}`;

      context.save();
      context.font = '700 16px Inter, system-ui, sans-serif';
      context.textBaseline = 'top';
      context.fillStyle = cycleState.isDay ? 'rgba(37, 49, 29, 0.82)' : 'rgba(236, 242, 255, 0.86)';
      context.fillText('Dia 1', padding, padding);
      context.fillText(status, padding, padding + lineHeight);
      context.fillText('Retos: proximamente', padding, padding + lineHeight * 2);
      context.restore();
    };

    const drawFrame = (timestamp: number) => {
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      const cycleState = getCycleState(timestamp, cycleStart);

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawSky(canvasWidth, canvasHeight, cycleState);
      drawCelestialPath(canvasWidth, canvasHeight, cycleState, timestamp);
      drawField(canvasWidth, canvasHeight);
      drawBackgroundSunflowers(canvasWidth, canvasHeight, cycleState);
      drawGroundShadow(canvasWidth, canvasHeight);

      if (hasSproutedRef.current) {
        drawMainSunflower(canvasWidth, canvasHeight);
      } else {
        drawSeed(canvasWidth, canvasHeight);
      }

      drawHud(canvasWidth, cycleState);
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
    backgroundSunflowerSprite.src = backgroundSunflowerSpriteUrl;
    seedSprite.src = seedSpriteUrl;
    sunFaceSprite.src = sunFaceUrl;
    sunCrownSprite.src = sunCrownUrl;

    return () => {
      isMounted = false;
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      sprites.forEach((sprite) => sprite.removeEventListener('load', handleSpriteLoad));
    };
  }, [seedClicksToSprout]);

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const seedHitbox = seedHitboxRef.current;

    if (!canvas || hasSprouted || !seedHitbox) {
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;

    if (pointIsInside(pointerX, pointerY, seedHitbox)) {
      onSeedClickRef.current();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (hasSprouted || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    onSeedClickRef.current();
  };

  return (
    <canvas
      ref={canvasRef}
      className={`sunflower-canvas ${hasSprouted ? 'is-sprouted' : 'is-seed'}`}
      aria-label={hasSprouted ? 'Girasol principal animado' : 'Pipa lista para plantar'}
      role={hasSprouted ? 'img' : 'button'}
      tabIndex={hasSprouted ? -1 : 0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
    />
  );
}
