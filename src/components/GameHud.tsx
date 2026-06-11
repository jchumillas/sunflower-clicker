import type { CyclePhase, PlantStage } from './SunflowerCanvas';

type GameHudProps = {
  day: number;
  maxDay: number;
  stage: PlantStage;
  phase: CyclePhase;
  cycleProgress: number;
  plantHealth: number;
  maxPlantHealth: number;
  hydration: number | null;
  maxHydration: number;
  score: number;
  seedClicks: number;
  seedClicksToSprout: number;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const STAGE_LABELS: Record<PlantStage, string> = {
  seed: 'Pipa',
  sprout: 'Brote',
  sunflower: 'Girasol',
};

const STAGE_HINTS: Record<PlantStage, string> = {
  seed: 'Haz clic para germinar',
  sprout: 'Echando raices',
  sunflower: 'En plena floracion',
};

const STAGE_ORDER: PlantStage[] = ['seed', 'sprout', 'sunflower'];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1.5" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22.5" />
        <line x1="1.5" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22.5" y2="12" />
        <line x1="4.2" y1="4.2" x2="6" y2="6" />
        <line x1="18" y1="18" x2="19.8" y2="19.8" />
        <line x1="19.8" y1="4.2" x2="18" y2="6" />
        <line x1="6" y1="18" x2="4.2" y2="19.8" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M15.5 2.5a9.5 9.5 0 1 0 6 16.8 7.5 7.5 0 0 1-6-16.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 21s-7.5-4.7-10-9.3C.5 8.4 2 4.8 5.4 4.3 7.6 4 9.4 5.2 12 7.9c2.6-2.7 4.4-3.9 6.6-3.6 3.4.5 4.9 4.1 3.4 7.4C19.5 16.3 12 21 12 21Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2.5S5.5 9.8 5.5 15a6.5 6.5 0 0 0 13 0C18.5 9.8 12 2.5 12 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SeedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M19.3 4.7c1.6 4.8.6 9.9-2.7 13.2-3.2 3.2-8 4.2-12.6 2.8C2.7 16.2 3.8 11.3 7 8.1c3.3-3.3 7.7-4.5 12.3-3.4Z"
        fill="currentColor"
      />
      <path
        d="M6.1 18.4c3.8-2.2 6.7-5.1 9.1-9.4"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function GameHud({
  day,
  maxDay,
  stage,
  phase,
  cycleProgress,
  plantHealth,
  maxPlantHealth,
  hydration,
  maxHydration,
  score,
  seedClicks,
  seedClicksToSprout,
}: GameHudProps) {
  const healthRatio = clamp01(plantHealth / maxPlantHealth);
  const healthLevel = healthRatio > 0.6 ? 'high' : healthRatio > 0.3 ? 'mid' : 'low';
  const hasHydration = stage !== 'seed' && hydration !== null;
  const hydrationRatio = hasHydration ? clamp01(hydration / maxHydration) : 0;
  const hydrationLevel = hydrationRatio > 0.45 ? 'high' : hydrationRatio > 0.18 ? 'mid' : 'low';
  const cycleRatio = clamp01(cycleProgress);
  const germinationRatio = clamp01(seedClicks / seedClicksToSprout);
  const stageIndex = STAGE_ORDER.indexOf(stage);

  return (
    <div className="game-hud" data-phase={phase} aria-live="polite">
      <header className="game-hud__top">
        <span className={`game-hud__phase-badge game-hud__phase-badge--${phase}`}>
          {phase === 'day' ? <SunIcon /> : <MoonIcon />}
        </span>
        <div className="game-hud__day">
          <span className="game-hud__day-number">Dia {day}</span>
          <span className="game-hud__day-total">de {maxDay}</span>
        </div>
        <span className="game-hud__phase-name">{phase === 'day' ? 'Dia' : 'Noche'}</span>
      </header>

      <div className="game-hud__cycle">
        <div className="game-hud__cycle-track">
          <div
            className={`game-hud__cycle-fill game-hud__cycle-fill--${phase}`}
            style={{ width: `${cycleRatio * 100}%` }}
          />
        </div>
        <span className="game-hud__cycle-caption">
          {phase === 'day' ? 'Amaneciendo hacia el ocaso' : 'La noche avanza'}
        </span>
      </div>

      <section className="game-hud__metric">
        <div className="game-hud__metric-head">
          <span className="game-hud__metric-icon game-hud__metric-icon--score">
            <SeedIcon />
          </span>
          <span className="game-hud__metric-label">Puntos</span>
          <span className="game-hud__metric-value">{score}</span>
        </div>
      </section>

      <section className="game-hud__metric">
        <div className="game-hud__metric-head">
          <span className="game-hud__metric-icon game-hud__metric-icon--health">
            <HeartIcon />
          </span>
          <span className="game-hud__metric-label">Vida</span>
          <span className="game-hud__metric-value">
            {Math.round(plantHealth)}
            <span className="game-hud__metric-max"> / {maxPlantHealth}</span>
          </span>
        </div>
        <div className="game-hud__bar">
          <div
            className="game-hud__bar-fill"
            data-level={healthLevel}
            style={{ width: `${healthRatio * 100}%` }}
          />
        </div>
      </section>

      {hasHydration && (
        <section className="game-hud__metric">
          <div className="game-hud__metric-head">
            <span className="game-hud__metric-icon game-hud__metric-icon--hydration">
              <WaterIcon />
            </span>
            <span className="game-hud__metric-label">Hidratacion</span>
            <span className="game-hud__metric-value">
              {Math.round(hydration)}
              <span className="game-hud__metric-max">%</span>
            </span>
          </div>
          <div className="game-hud__bar">
            <div
              className="game-hud__bar-fill game-hud__bar-fill--hydration"
              data-level={hydrationLevel}
              style={{ width: `${hydrationRatio * 100}%` }}
            />
          </div>
        </section>
      )}

      {stage === 'seed' && (
        <section className="game-hud__metric">
          <div className="game-hud__metric-head">
            <span className="game-hud__metric-label">Germinacion</span>
            <span className="game-hud__metric-value">
              {seedClicks}
              <span className="game-hud__metric-max"> / {seedClicksToSprout}</span>
            </span>
          </div>
          <div className="game-hud__bar">
            <div
              className="game-hud__bar-fill game-hud__bar-fill--seed"
              style={{ width: `${germinationRatio * 100}%` }}
            />
          </div>
        </section>
      )}

      <footer className="game-hud__stage">
        <div className="game-hud__stage-track">
          {STAGE_ORDER.map((item, index) => (
            <span
              key={item}
              className="game-hud__stage-step"
              data-state={
                index < stageIndex ? 'done' : index === stageIndex ? 'active' : 'pending'
              }
              title={STAGE_LABELS[item]}
            />
          ))}
        </div>
        <div className="game-hud__stage-text">
          <span className="game-hud__stage-name">{STAGE_LABELS[stage]}</span>
          <span className="game-hud__stage-hint">{STAGE_HINTS[stage]}</span>
        </div>
      </footer>
    </div>
  );
}
