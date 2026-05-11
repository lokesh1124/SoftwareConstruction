// ─────────────────────────────────────────────────────────────
// MyFitAI — Plate Calculator Modal
// ─────────────────────────────────────────────────────────────

import { useState } from 'react';
import { usePreferences } from '../../context/PreferencesContext';

interface PlateCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

type BarType = 'standard' | 'olympic' | 'ez';

const BAR_WEIGHTS: Record<string, Record<BarType, number>> = {
  lbs: { standard: 45, olympic: 45, ez: 25 },
  kg:  { standard: 20, olympic: 20, ez: 10 },
};

const PLATE_SETS: Record<string, number[]> = {
  lbs: [45, 35, 25, 10, 5, 2.5],
  kg:  [25, 20, 15, 10, 5, 2.5, 1.25],
};

const PLATE_COLORS: Record<number, string> = {
  45: '#E53935', 25: '#1565C0', 20: '#1565C0', 15: '#FBBF24',
  35: '#FBBF24', 10: '#4CAF50', 5: '#7E57C2', 2.5: '#78909C', 1.25: '#B0BEC5',
};

function calculatePlates(targetWeight: number, barWeight: number, availablePlates: number[]): number[] {
  const perSide = (targetWeight - barWeight) / 2;
  if (perSide <= 0) return [];
  const plates: number[] = [];
  let remaining = perSide;
  for (const plate of availablePlates) {
    while (remaining >= plate) {
      plates.push(plate);
      remaining -= plate;
    }
  }
  return plates;
}

export default function PlateCalculator({ isOpen, onClose }: PlateCalculatorProps) {
  const { weightUnit } = usePreferences();
  const [targetWeight, setTargetWeight] = useState('');
  const [barType, setBarType] = useState<BarType>('standard');

  if (!isOpen) return null;

  const target = parseFloat(targetWeight) || 0;
  const barWeight = BAR_WEIGHTS[weightUnit][barType];
  const plates = calculatePlates(target, barWeight, PLATE_SETS[weightUnit]);
  const actualWeight = barWeight + plates.reduce((s, p) => s + p, 0) * 2;
  const remainder = target - actualWeight;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--color-surface)] w-full max-w-md rounded-t-[2rem] border-t border-white/[0.06] p-6 pb-10 animate-slide-up">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5" />
        <h3 className="font-headline font-extrabold text-lg tracking-tight mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">calculate</span>
          Plate Calculator
        </h3>

        {/* Target weight input */}
        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant block mb-1.5">
            Target Weight ({weightUnit})
          </label>
          <input
            type="number" inputMode="decimal" value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="Enter weight..."
            className="w-full bg-[var(--color-surface-container)] border border-white/[0.06] rounded-xl px-4 py-3 text-lg font-bold text-on-surface outline-none focus:border-primary/50 tabular-nums"
          />
        </div>

        {/* Bar type selector */}
        <div className="flex gap-2 mb-6">
          {([['standard', `Standard (${barWeight}${weightUnit})`], ['olympic', `Olympic (${barWeight}${weightUnit})`], ['ez', `EZ Bar (${BAR_WEIGHTS[weightUnit].ez}${weightUnit})`]] as [BarType, string][]).map(([type, label]) => (
            <button key={type} onClick={() => setBarType(type)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${
                barType === type ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-white/[0.03] text-on-surface-variant border border-white/[0.04]'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Plate visualization */}
        {target > 0 && (
          <div className="bg-[var(--color-surface-container)] rounded-2xl p-5 border border-white/[0.04]">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-3">
              Per Side ({plates.length} plate{plates.length !== 1 ? 's' : ''})
            </p>
            {plates.length > 0 ? (
              <div className="flex items-end gap-1.5 mb-4 h-20 justify-center">
                {/* Bar */}
                <div className="w-3 h-16 bg-[var(--color-outline)] rounded-full" />
                {/* Plates */}
                {plates.map((plate, i) => {
                  const height = 30 + (plate / (weightUnit === 'kg' ? 25 : 45)) * 40;
                  return (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <div className="rounded-md border border-white/10" style={{
                        width: '20px', height: `${height}px`,
                        backgroundColor: PLATE_COLORS[plate] || '#78909C',
                      }} />
                      <span className="text-[9px] font-bold text-on-surface-variant tabular-nums">{plate}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-4">Bar only — no plates needed</p>
            )}
            <div className="flex justify-between text-xs pt-3 border-t border-white/[0.04]">
              <span className="text-on-surface-variant">Actual</span>
              <span className="font-bold text-on-surface">{actualWeight} {weightUnit}</span>
            </div>
            {Math.abs(remainder) > 0.1 && (
              <div className="flex justify-between text-xs mt-1">
                <span className="text-on-surface-variant">Remainder</span>
                <span className="font-bold text-error">{remainder > 0 ? '+' : ''}{remainder.toFixed(1)} {weightUnit}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
