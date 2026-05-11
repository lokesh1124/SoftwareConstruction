const fs = require('fs');

let content = fs.readFileSync('src/pages/NutritionPlanner.tsx', 'utf8');

// 1. Add states
const stateInjection = `  // Fasting State
  const [isFasting, setIsFasting] = useState(true);
  
  // Supplements State
  const [supplements, setSupplements] = useState([
    { name: 'Whey Protein', time: 'Post-Workout', done: true, color: '#FF7A00' },
    { name: 'Creatine 5g', time: 'Morning', done: true, color: '#6FFB85' },
    { name: 'Fish Oil', time: 'With Lunch', done: false, color: '#ff9800' },
    { name: 'Vitamin D3', time: 'Morning', done: true, color: '#fab0ff' },
    { name: 'Magnesium', time: 'Before Bed', done: false, color: '#00b4d8' },
  ]);

  // Grocery State
  const [checkedGroceries, setCheckedGroceries] = useState<Set<string>>(new Set());

  const toggleSupplement = (index: number) => {
    setSupplements(prev => {
      const newSups = [...prev];
      newSups[index].done = !newSups[index].done;
      return newSups;
    });
  };

  const toggleGrocery = (item: string) => {
    setCheckedGroceries(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const shareGroceryList = () => {
    const list = ['Proteins: Chicken Breast, Salmon, Eggs', 'Carbs: Brown Rice, Oats', 'Veggies: Broccoli, Spinach'].join('\\n');
    navigator.clipboard.writeText(list);
    showToast('Grocery list copied to clipboard!', 'success');
  };
`;

content = content.replace(
  "  // Hydration State",
  stateInjection + "\n  // Hydration State"
);

// 2. Fasting Mode JSX
const fastingOld = `          <div className="relative z-10 text-center py-4">
            <p className="font-headline font-black text-4xl tracking-tighter text-[#ff9800]">14<span className="text-lg">h</span> 32<span className="text-lg">m</span></p>
            <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase tracking-widest">Fasted • 1h 28m until eat window</p>
            <div className="w-full h-2 bg-[#252528] rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#ff9800] to-[#FFD700] rounded-full" style={{ width: '91%' }}></div>
            </div>
          </div>
          <button onClick={() => showToast('Fast ended — Eating window started!', 'success')} className="w-full mt-3 py-2.5 rounded-xl border border-[#ff9800]/30 text-[#ff9800] font-headline font-bold text-xs uppercase tracking-widest hover:bg-[#ff9800]/10 transition-all active:scale-95">
            End Fast Early
          </button>`;

const fastingNew = `          <div className="relative z-10 text-center py-4">
            {isFasting ? (
              <>
                <p className="font-headline font-black text-4xl tracking-tighter text-[#ff9800]">14<span className="text-lg">h</span> 32<span className="text-lg">m</span></p>
                <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase tracking-widest">Fasted • 1h 28m until eat window</p>
                <div className="w-full h-2 bg-[#252528] rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff9800] to-[#FFD700] rounded-full" style={{ width: '91%' }}></div>
                </div>
              </>
            ) : (
              <>
                <p className="font-headline font-black text-4xl tracking-tighter text-secondary">00<span className="text-lg">h</span> 00<span className="text-lg">m</span></p>
                <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase tracking-widest">Eating Window Active</p>
                <div className="w-full h-2 bg-[#252528] rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '100%' }}></div>
                </div>
              </>
            )}
          </div>
          {isFasting ? (
            <button onClick={() => setIsFasting(false)} className="w-full mt-3 py-2.5 rounded-xl border border-[#ff9800]/30 text-[#ff9800] font-headline font-bold text-xs uppercase tracking-widest hover:bg-[#ff9800]/10 transition-all active:scale-95">
              End Fast Early
            </button>
          ) : (
            <button onClick={() => setIsFasting(true)} className="w-full mt-3 py-2.5 rounded-xl border border-secondary/30 text-secondary font-headline font-bold text-xs uppercase tracking-widest hover:bg-secondary/10 transition-all active:scale-95">
              Start Fast
            </button>
          )}`;
content = content.replace(fastingOld, fastingNew);

// 3. Supplements JSX
const supplementsOld = `            {[
              { name: 'Whey Protein', time: 'Post-Workout', done: true, color: '#FF7A00' },
              { name: 'Creatine 5g', time: 'Morning', done: true, color: '#6FFB85' },
              { name: 'Fish Oil', time: 'With Lunch', done: false, color: '#ff9800' },
              { name: 'Vitamin D3', time: 'Morning', done: true, color: '#fab0ff' },
              { name: 'Magnesium', time: 'Before Bed', done: false, color: '#00b4d8' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => showToast(\`\${s.name} \${s.done ? 'unchecked' : 'taken'}!\`, 'info')}>
                <div className={\`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all \${s.done ? 'border-secondary bg-secondary/10' : 'border-[var(--color-outline)] hover:border-[var(--color-on-surface-variant)]'}\`}>
                  {s.done && <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                </div>
                <div className="flex-1">
                  <p className={\`text-sm font-bold \${s.done ? 'line-through text-on-surface-variant' : ''}\`}>{s.name}</p>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.time}</span>
              </div>
            ))}`;

const supplementsNew = `            {supplements.map((s, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleSupplement(i)}>
                <div className={\`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all \${s.done ? 'border-secondary bg-secondary/10' : 'border-[var(--color-outline)] hover:border-[var(--color-on-surface-variant)]'}\`}>
                  {s.done && <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                </div>
                <div className="flex-1">
                  <p className={\`text-sm font-bold \${s.done ? 'line-through text-on-surface-variant' : ''}\`}>{s.name}</p>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.time}</span>
              </div>
            ))}`;
content = content.replace(supplementsOld, supplementsNew);

// 4. Grocery List JSX
const groceryShareOld = `<button onClick={() => showToast('Grocery list exported!', 'success')} className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-xl text-[10px] font-bold uppercase tracking-widest border border-secondary/20 hover:bg-secondary/20 transition-all active:scale-95">`;
const groceryShareNew = `<button onClick={shareGroceryList} className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-xl text-[10px] font-bold uppercase tracking-widest border border-secondary/20 hover:bg-secondary/20 transition-all active:scale-95">`;
content = content.replace(groceryShareOld, groceryShareNew);

const groceryItemsOld = `                {cat.items.map((item, ii) => (
                  <div key={ii} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => showToast(\`\${item} checked!\`, 'success')}>
                    <div className="w-5 h-5 rounded-md border border-[var(--color-outline)] group-hover:border-primary/50 transition-colors flex items-center justify-center"></div>
                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{item}</span>
                  </div>
                ))}`;

const groceryItemsNew = `                {cat.items.map((item, ii) => {
                  const isChecked = checkedGroceries.has(item);
                  return (
                    <div key={ii} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => toggleGrocery(item)}>
                      <div className={\`w-5 h-5 rounded-md border transition-colors flex items-center justify-center \${isChecked ? 'bg-primary border-primary' : 'border-[var(--color-outline)] group-hover:border-primary/50'}\`}>
                        {isChecked && <span className="material-symbols-outlined text-black text-[12px] font-bold">check</span>}
                      </div>
                      <span className={\`text-sm transition-colors \${isChecked ? 'text-on-surface-variant line-through' : 'text-on-surface-variant group-hover:text-on-surface'}\`}>{item}</span>
                    </div>
                  );
                })}`;
content = content.replace(groceryItemsOld, groceryItemsNew);

fs.writeFileSync('src/pages/NutritionPlanner.tsx', content, 'utf8');
