import type { RatingAverages } from '@/types';
import { RATING_LABELS } from '@/types';

interface BuildingRatingsProps {
  ratings: RatingAverages;
}

export function BuildingRatings({ ratings }: BuildingRatingsProps) {
  return (
    <div className="space-y-3">
      {Object.entries(RATING_LABELS).map(([key, { ar, icon }]) => {
        const value = ratings[key as keyof typeof RATING_LABELS];
        const percentage = (value / 5) * 100;
        const color =
          value >= 4 ? 'bg-[var(--color-success)]' : value >= 2.5 ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-error)]';

        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs flex items-center gap-1">
                <span>{icon}</span> {ar}
              </span>
              <span className="text-xs font-bold">{value.toFixed(1)}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-surface-light)]">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
