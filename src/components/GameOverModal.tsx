import type { PlantStage } from './SunflowerCanvas';

export type GameOverStats = {
  day: number;
  maxDay: number;
  stage: PlantStage;
  seedsCollected: number;
  beesPollinated: number;
  pigeonAttacks: number;
  survivalSeconds: number;
};

type GameOverModalProps = {
  stats: GameOverStats;
  onRestart: () => void;
};

const STAGE_LABELS: Record<PlantStage, string> = {
  seed: 'Pipa',
  sprout: 'Brote',
  sunflower: 'Girasol',
};

const formatDuration = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function SeedHarvestIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <path d="M31.3 6.8c8 6.4 11.4 15.1 8.7 22.3-2.7 7.3-10.6 11.6-20.8 11.6-4.6-9.1-4.9-18.5-.4-24.7 4.5-6.3 8.7-9.2 12.5-9.2Z" />
        <path d="M48.6 23.2c5.2 5.1 7.1 11.8 4.8 17.1-2.4 5.4-8.6 8.2-16 7.3-3.1-6.8-2.7-13.8 1.1-18.3 3.9-4.6 7.3-6.6 10.1-6.1Z" />
        <path d="M18.6 34.1c6.4 2.9 10 8.3 9.2 13.9-.8 5.5-5.8 9.8-12.7 11-5.1-4.8-7.1-11.1-5.1-16.2 2-5.2 4.9-8.1 8.6-8.7Z" />
      </g>
      <g fill="none" stroke="rgba(255,255,255,0.62)" strokeLinecap="round" strokeWidth="2.4">
        <path d="M22 35.4c5.6-5.1 9.5-12.1 11.6-21" />
        <path d="M39.8 44.2c4.2-3.7 7-8.6 8.5-14.8" />
        <path d="M15.3 54.5c3.4-3.2 5.5-7.3 6.4-12.2" />
      </g>
    </svg>
  );
}

export function GameOverModal({ stats, onRestart }: GameOverModalProps) {
  const items = [
    { label: 'Dia alcanzado', value: `${stats.day} / ${stats.maxDay}` },
    { label: 'Etapa final', value: STAGE_LABELS[stats.stage] },
    { label: 'Pipas conseguidas', value: `${stats.seedsCollected}` },
    { label: 'Abejas polinizadas', value: `${stats.beesPollinated}` },
    { label: 'Ataques recibidos', value: `${stats.pigeonAttacks}` },
    { label: 'Tiempo de vida', value: formatDuration(stats.survivalSeconds) },
  ];

  return (
    <div className="game-over" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="game-over__backdrop" />
      <div className="game-over__card" role="document">
        <div className="game-over__glow" aria-hidden="true" />
        <span className="game-over__icon">
          <SeedHarvestIcon />
        </span>
        <h2 className="game-over__title" id="game-over-title">
          Game Over
        </h2>
        <p className="game-over__subtitle">Tu girasol se ha marchitado</p>

        <dl className="game-over__stats">
          {items.map((item) => (
            <div className="game-over__stat" key={item.label}>
              <dt className="game-over__stat-label">{item.label}</dt>
              <dd className="game-over__stat-value">{item.value}</dd>
            </div>
          ))}
        </dl>

        <button type="button" className="game-over__button" onClick={onRestart} autoFocus>
          Volver a plantar
        </button>
      </div>
    </div>
  );
}
