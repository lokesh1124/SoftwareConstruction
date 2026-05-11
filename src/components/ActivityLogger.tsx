import React, { useState } from 'react';
import { useFitnessContext } from '../context/FitnessContext';

export default function ActivityLogger({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { logActivity } = useFitnessContext();
  const [type, setType] = useState('Workout');
  const [value, setValue] = useState('');
  const [calories, setCalories] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    logActivity({
      type,
      value: Number(value),
      caloriesBurned: type === 'Workout' || type === 'Steps' ? Number(calories) : undefined,
    });
    
    // reset & close
    setValue('');
    setCalories('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--color-surface-container)] w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative border border-white/10 animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface)] text-on-surface-variant hover:text-white transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h2 className="font-headline text-2xl font-bold mb-6 tracking-tight">Log Activity</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selector */}
          <div className="grid grid-cols-4 gap-2">
            {['Workout', 'Steps', 'Water', 'Sleep'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`py-3 rounded-xl font-label text-[10px] uppercase font-bold tracking-widest transition-colors ${type === t ? 'bg-primary text-[#0E0E10]' : 'bg-[var(--color-surface)] text-on-surface-variant border border-white/5'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              {type === 'Workout' && 'Duration (Mins)'}
              {type === 'Steps' && 'Step Count'}
              {type === 'Water' && 'Amount (Liters)'}
              {type === 'Sleep' && 'Duration (Hours)'}
            </label>
            <input 
              type="number" 
              step="any"
              autoFocus
              className="w-full bg-[var(--color-surface)] outline-none rounded-xl px-4 py-4 font-headline text-xl font-bold border border-white/10 focus:border-primary transition-colors"
              placeholder="0"
              value={value}
              onChange={e => setValue(e.target.value)}
              required
            />
          </div>

          {/* Optional Calories Input */}
          {(type === 'Workout' || type === 'Steps') && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Calories Burned
              </label>
              <input 
                type="number" 
                className="w-full bg-[var(--color-surface)] outline-none rounded-xl px-4 py-4 font-headline text-xl font-bold border border-white/10 focus:border-secondary transition-colors"
                placeholder="Optional kcal"
                value={calories}
                onChange={e => setCalories(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="w-full bg-primary text-[#0E0E10] font-headline font-bold text-lg py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all">
            Save Entry
          </button>
        </form>
      </div>
    </div>
  );
}
