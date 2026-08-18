'use client';

interface SliderProps {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const labels = ['', 'ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'];

export function Slider({ label, icon, value, onChange, min = 1, max = 5 }: SliderProps) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-secondary)]">{labels[value]}</span>
          <span className="text-sm font-bold text-[var(--color-primary)]">{value}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between mt-1">
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <span key={i} className="text-[10px] text-[var(--color-text-secondary)]">{min + i}</span>
        ))}
      </div>
    </div>
  );
}
