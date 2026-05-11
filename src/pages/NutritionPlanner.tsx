import { useState } from 'react';
import { useFitnessContext } from '../context/FitnessContext';
import { useNavigate } from 'react-router-dom';
import { INDIAN_DISHES, CATEGORIES, type IndianDish } from '../data/indianDishes';
import { useToast } from '../context/ToastContext';

export default function NutritionPlanner() {
  const { profile, dailyStats } = useFitnessContext();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDish, setSelectedDish] = useState<IndianDish | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fasting State
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
    const list = ['Proteins: Chicken Breast, Salmon, Eggs', 'Carbs: Brown Rice, Oats', 'Veggies: Broccoli, Spinach'].join('\n');
    navigator.clipboard.writeText(list);
    showToast('Grocery list copied to clipboard!', 'success');
  };

  // Hydration State
  const [hydrationOz, setHydrationOz] = useState(45);
  const hydrationGoal = 120;
  
  // Swaps State
  const [swaps, setSwaps] = useState([
    {
      id: 1,
      title: 'Swap White Pasta for Zucchini Noodles',
      desc: 'Save 180 calories.',
      img1: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
      img2: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Swap Afternoon Cookie for Greek Yogurt',
      desc: 'More protein and less sugar.',
      img1: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800',
      img2: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'
    }
  ]);

  const addHydration = () => {
    if (hydrationOz < hydrationGoal) {
      setHydrationOz(prev => Math.min(prev + 8, hydrationGoal));
      showToast('Hydration +8 oz Logged!', 'success');
    } else {
      showToast('Hydration goal already met!', 'info');
    }
  };

  const handleSwap = (id: number, action: 'Confirmed' | 'Added to Queue') => {
    setSwaps(prev => prev.filter(s => s.id !== id));
    showToast(`Swap ${action}!`, action === 'Confirmed' ? 'success' : 'info');
  };

  const filteredDishes = INDIAN_DISHES.filter(dish => {
    const matchesCategory = activeCategory === 'All' || dish.tags.includes(activeCategory);
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Calculate remaining calories dynamically
  const remainingKcal = Math.max(0, profile.dailyCalorieGoal - dailyStats.calories);

  return (
    <main className="pt-6 pb-32 px-4 max-w-[430px] mx-auto space-y-8 min-h-screen relative shadow-2xl">
      {/* Section 1: Calorie & Macro Command Center */}
      <section className="flex flex-col gap-6">
        <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>
          <p className="font-label text-on-surface-variant tracking-[0.2em] uppercase text-xs mb-2">Daily Budget Status</p>
          <div className="flex items-baseline gap-2">
            <h1 className="font-headline font-extrabold text-[4.5rem] leading-none tracking-tighter text-primary drop-shadow-[0_0_30px_rgba(255,122,0,0.3)]">{remainingKcal}</h1>
            <span className="font-headline text-lg font-bold text-on-surface-variant mb-3">KCAL LEFT</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={() => showToast('AI Synchronization Successful!', 'success')} className="flex-1 bg-gradient-to-br from-primary to-[var(--color-primary-container)] px-4 py-3 rounded-xl text-black font-bold font-headline flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all text-sm">
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              Sync AI
            </button>
            <button onClick={() => navigate('/profile')} className="flex-1 bg-[var(--color-surface-container-high)] px-4 py-3 rounded-xl text-primary font-bold font-headline border border-primary/10 hover:bg-[var(--color-surface-container-highest)] active:scale-95 transition-all text-sm">
              Adjust
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Macro Trackers */}
          <div className="bg-[var(--color-surface-container-low)] rounded-[1.5rem] p-6 space-y-8">
            {/* Protein */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="font-headline font-bold text-lg">Protein</span>
                <span className="font-label text-sm text-on-surface-variant font-medium">142g <span className="text-on-surface">/ 180g</span></span>
              </div>
              <div className="h-3 w-full bg-[var(--color-surface-container-highest)] rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{width: "78%"}}></div>
              </div>
            </div>
            {/* Carbs */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="font-headline font-bold text-lg">Carbs</span>
                <span className="font-label text-sm text-on-surface-variant font-medium">110g <span className="text-on-surface">/ 220g</span></span>
              </div>
              <div className="h-3 w-full bg-[#252528] rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full" style={{width: "50%"}}></div>
              </div>
            </div>
            {/* Fats */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="font-headline font-bold text-lg">Fats</span>
                <span className="font-label text-sm text-on-surface-variant font-medium">45g <span className="text-on-surface">/ 65g</span></span>
              </div>
              <div className="h-3 w-full bg-[#252528] rounded-full overflow-hidden">
                <div className="h-full bg-[#fab0ff] rounded-full" style={{width: "69%"}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Fueling Strategy (Meal Plan) */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="font-headline text-2xl font-bold tracking-tight">Daily Meal Plan</h2>
          <p className="font-label text-secondary font-semibold uppercase tracking-widest text-[10px]">Day 14</p>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 [scrollbar-width:none] snap-x snap-mandatory">
          {/* Meal Card 1 */}
          <div className="min-w-[85%] snap-center bg-[var(--color-surface-container)] rounded-[2rem] overflow-hidden group hover:bg-[var(--color-surface-container-high)] transition-colors">
            <div className="h-48 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="meal" src="https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&q=80&w=800"/>
              <div className="absolute top-4 left-4 bg-[#00000099] backdrop-blur-md px-3 py-1 rounded-lg shadow-sm">
                <span className="font-headline text-xs font-bold text-[#ffffff]">08:00 AM</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-headline font-bold text-xl">Breakfast</h3>
                <p className="text-on-surface-variant text-sm">Avocado &amp; Smoked Salmon</p>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-primary text-base">timer</span> 12 min</span>
                <span className="flex items-center gap-1 font-headline font-bold text-primary">540 KCAL</span>
              </div>
              <div className="pt-4 border-t border-[var(--color-outline-variant)]/30 flex justify-between">
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">P</p><p className="font-headline font-bold text-on-surface">38g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">C</p><p className="font-headline font-bold text-on-surface">12g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">F</p><p className="font-headline font-bold text-on-surface">28g</p></div>
              </div>
            </div>
          </div>
          {/* Meal Card 2 */}
          <div className="min-w-[85%] snap-center bg-[var(--color-surface-container)] rounded-[2rem] overflow-hidden group hover:bg-[var(--color-surface-container-high)] transition-colors">
            <div className="h-48 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="meal" src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"/>
              <div className="absolute top-4 left-4 bg-[#00000099] backdrop-blur-md px-3 py-1 rounded-lg shadow-sm">
                <span className="font-headline text-xs font-bold text-[#ffffff]">12:30 PM</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-headline font-bold text-xl">Lunch</h3>
                <p className="text-on-surface-variant text-sm">Quinoa &amp; Roasted Veg Bowl</p>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-primary text-base">timer</span> 0 min</span>
                <span className="flex items-center gap-1 font-headline font-bold text-primary">620 KCAL</span>
              </div>
              <div className="pt-4 border-t border-[var(--color-outline-variant)]/30 flex justify-between">
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">P</p><p className="font-headline font-bold text-on-surface">45g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">C</p><p className="font-headline font-bold text-on-surface">64g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">F</p><p className="font-headline font-bold text-on-surface">14g</p></div>
              </div>
            </div>
          </div>
          {/* Meal Card 3 */}
          <div className="min-w-[85%] snap-center bg-[var(--color-surface-container)] rounded-[2rem] overflow-hidden group hover:bg-[var(--color-surface-container-high)] transition-colors">
            <div className="h-48 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="meal" src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"/>
              <div className="absolute top-4 left-4 bg-[#00000099] backdrop-blur-md px-3 py-1 rounded-lg shadow-sm">
                <span className="font-headline text-xs font-bold text-[#ffffff]">07:30 PM</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-headline font-bold text-xl">Dinner</h3>
                <p className="text-on-surface-variant text-sm">Grass-fed Beef &amp; Asparagus</p>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-primary text-base">timer</span> 25 min</span>
                <span className="flex items-center gap-1 font-headline font-bold text-primary">780 KCAL</span>
              </div>
              <div className="pt-4 border-t border-[var(--color-outline-variant)]/30 flex justify-between">
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">P</p><p className="font-headline font-bold text-on-surface">58g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">C</p><p className="font-headline font-bold text-on-surface">18g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">F</p><p className="font-headline font-bold text-on-surface">32g</p></div>
              </div>
            </div>
          </div>
          {/* Meal Card 4 */}
          <div className="min-w-[85%] snap-center bg-[var(--color-surface-container)] rounded-[2rem] overflow-hidden group hover:bg-[var(--color-surface-container-high)] transition-colors">
            <div className="h-48 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="meal" src="https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=800"/>
              <div className="absolute top-4 left-4 bg-[#FF4D4D]/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(255,77,77,0.4)]">
                <span className="font-headline text-xs font-bold text-[#ffffff] flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">bolt</span> Pre-Workout</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-headline font-bold text-xl">Power Snack</h3>
                <p className="text-on-surface-variant text-sm">Rice Cakes &amp; Almond Butter</p>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-primary text-base">timer</span> 5 min</span>
                <span className="flex items-center gap-1 font-headline font-bold text-primary">310 KCAL</span>
              </div>
              <div className="pt-4 border-t border-[var(--color-outline-variant)]/30 flex justify-between">
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">P</p><p className="font-headline font-bold text-on-surface">12g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">C</p><p className="font-headline font-bold text-on-surface">45g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">F</p><p className="font-headline font-bold text-on-surface">10g</p></div>
              </div>
            </div>
          </div>
          {/* Meal Card 5 */}
          <div className="min-w-[85%] snap-center bg-[var(--color-surface-container)] rounded-[2rem] overflow-hidden group hover:bg-[var(--color-surface-container-high)] transition-colors">
            <div className="h-48 relative overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="meal" src="https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=800"/>
              <div className="absolute top-4 left-4 bg-[#00000099] backdrop-blur-md px-3 py-1 rounded-lg shadow-sm">
                <span className="font-headline text-xs font-bold text-[#ffffff]">10:00 PM</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-headline font-bold text-xl">Night Recovery</h3>
                <p className="text-on-surface-variant text-sm">Casein Shake &amp; Walnuts</p>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center gap-1 text-on-surface"><span className="material-symbols-outlined text-primary text-base">timer</span> 2 min</span>
                <span className="flex items-center gap-1 font-headline font-bold text-primary">280 KCAL</span>
              </div>
              <div className="pt-4 border-t border-[var(--color-outline-variant)]/30 flex justify-between">
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">P</p><p className="font-headline font-bold text-on-surface">35g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">C</p><p className="font-headline font-bold text-on-surface">8g</p></div>
                <div className="text-center"><p className="text-[10px] text-on-surface-variant uppercase font-bold">F</p><p className="font-headline font-bold text-on-surface">12g</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2.5: Hydration Tracker */}
      <section className="bg-[var(--color-surface-container)] rounded-[2rem] p-6 flex flex-col gap-6 relative overflow-hidden group shadow-lg">
        <div className="absolute -inset-24 bg-gradient-to-r from-[#00b4d8]/10 to-transparent blur-[80px] pointer-events-none group-hover:from-[#00b4d8]/20 transition-all duration-700"></div>
        <div className="relative z-10 flex flex-col items-center text-center gap-3">
           <div className="w-12 h-12 rounded-full bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center">
             <span className="material-symbols-outlined text-[#00b4d8] text-2xl">water_drop</span>
           </div>
           <div>
             <h2 className="font-headline text-xl font-bold tracking-tight text-[#00b4d8]">Hydration Tracker</h2>
             <p className="text-on-surface-variant text-[11px] mt-1 font-medium tracking-wide">Goal: {hydrationGoal} oz &bull; Logged: {hydrationOz} oz</p>
           </div>
        </div>
        <div className="flex gap-2 relative z-10 w-full overflow-x-auto [scrollbar-width:none] pb-2">
          {[1,2,3,4,5,6,7,8].map((i) => {
             const cupOz = hydrationGoal / 8;
             const fillOz = Math.max(0, Math.min(cupOz, hydrationOz - (i - 1) * cupOz));
             const fillPercentage = (fillOz / cupOz) * 100;
             return (
               <div key={i} className={`min-w-[3rem] w-12 h-20 rounded-xl border flex items-end overflow-hidden cursor-pointer transition-transform hover:scale-105 ${fillPercentage > 0 ? 'bg-[#00b4d8]/10 border-[#00b4d8]/50 shadow-[0_0_15px_rgba(0,180,216,0.2)]' : 'bg-black/30 border-white/5 hover:border-white/20'}`}>
                 <div className="w-full bg-gradient-to-t from-[#00b4d8] to-[#90e0ef] transition-all duration-700" style={{ height: `${fillPercentage}%` }}></div>
               </div>
             );
          })}
          <button onClick={addHydration} className="min-w-[3rem] w-12 h-20 rounded-xl border-2 border-[dashed] border-[#00b4d8]/30 flex items-center justify-center text-[#00b4d8] hover:bg-[#00b4d8]/10 hover:border-[#00b4d8] transition-all active:scale-95"><span className="material-symbols-outlined font-bold">add</span></button>
        </div>
      </section>

      {/* Section 3 & 4: Bento Layout (Swap Engine & Micros) */}
      <div className="flex flex-col gap-6">
        {/* Healthy Alternatives */}
        <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-6 space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-2xl">restaurant</span>
            <h2 className="font-headline text-xl font-bold">Healthy Alternatives</h2>
          </div>
          
          {swaps.length === 0 ? (
            <div className="bg-[var(--color-surface-container-high)] rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4">
              <span className="material-symbols-outlined text-secondary text-5xl">task_alt</span>
              <div>
                <p className="font-headline font-bold text-xl text-on-surface">All Set!</p>
                <p className="text-sm text-on-surface-variant">No pending healthy alternatives right now.</p>
              </div>
            </div>
          ) : (
            swaps.map((swap) => (
              <div key={swap.id} className="bg-[var(--color-surface-container-high)] rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-[var(--color-surface-container-highest)] transition-all">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                    <div className="w-16 h-16 rounded-full border-4 border-[var(--color-surface)] overflow-hidden">
                      <img className="w-full h-full object-cover opacity-50" alt="swap before" src={swap.img1}/>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-[var(--color-surface)] overflow-hidden ring-4 ring-secondary/20">
                      <img className="w-full h-full object-cover" alt="swap after" src={swap.img2}/>
                    </div>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-lg">{swap.title}</p>
                    <p className="text-sm text-secondary font-medium">{swap.desc}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleSwap(swap.id, 'Added to Queue')} className="w-12 h-12 rounded-full border-2 border-outline-variant flex items-center justify-center text-on-surface-variant active:scale-90 transition-transform hover:bg-white/5">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                  <button onClick={() => handleSwap(swap.id, 'Confirmed')} className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-[#004818] active:scale-90 transition-transform">
                    <span className="material-symbols-outlined font-bold">check</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Vitamins and Minerals */}
        <div className="flex flex-col gap-6">
          <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-6 flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">science</span>
              <h2 className="font-headline text-xl font-bold">Vitamins &amp; Minerals</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                <span>Daily Goals</span>
                <span className="text-primary">On Track</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-12 text-xs font-black">VIT D</span>
                  <div className="flex-1 h-2 bg-[#252528] rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: "85%"}}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-12 text-xs font-black">MAG</span>
                  <div className="flex-1 h-2 bg-[#252528] rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: "60%"}}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-12 text-xs font-black">IRON</span>
                  <div className="flex-1 h-2 bg-[#252528] rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: "72%"}}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-12 text-xs font-black">OMEGA</span>
                  <div className="flex-1 h-2 bg-[#252528] rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: "90%"}}></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#ff716c]">
                  <span className="w-12 text-xs font-black">ZINC</span>
                  <div className="flex-1 h-2 bg-[#252528] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff716c]" style={{width: "25%"}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl" style={{fontVariationSettings: "'FILL' 1"}}>info</span>
                <p className="text-sm leading-relaxed text-on-surface">
                  <strong className="text-primary">AI INSIGHT:</strong> Zinc intake is low today. Consider adding <span className="underline decoration-primary/30 text-on-surface">oysters</span> or <span className="underline decoration-primary/30 text-on-surface">pumpkin seeds</span> to your dinner to support metabolic enzyme function.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Fasting Mode + Barcode Scanner + Supplements */}
      <div className="flex flex-col gap-6">
        {/* Fasting Timer */}
        <div className="bg-gradient-to-br from-[#ff9800]/10 to-transparent rounded-[2rem] p-6 border border-[#ff9800]/20 relative overflow-hidden group">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#ff9800]/5 rounded-full blur-3xl group-hover:bg-[#ff9800]/10 transition-all"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#ff9800]/10 border border-[#ff9800]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ff9800] text-xl">timer</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base">Fasting Mode</h3>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">16:8 Intermittent</p>
            </div>
          </div>
          <div className="relative z-10 text-center py-4">
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
          )}
        </div>

        {/* Barcode Scanner */}
        <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-6 border border-[var(--color-outline-variant)] flex flex-col items-center justify-center text-center group hover:border-primary/30 transition-colors cursor-pointer" onClick={() => showToast('Barcode Scanner — Coming with mobile release!', 'info')}>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary text-3xl">qr_code_scanner</span>
          </div>
          <h3 className="font-headline font-bold text-base mb-1">Scan Food</h3>
          <p className="text-[10px] text-on-surface-variant max-w-[160px]">Scan barcode to instantly log nutrition data</p>
          <span className="text-[9px] text-primary/60 font-bold uppercase tracking-widest mt-3 bg-primary/5 px-3 py-1 rounded-full">Mobile Only</span>
        </div>

        {/* Supplement Reminders */}
        <div className="bg-[var(--color-surface-container)] rounded-[2rem] p-6 border border-[var(--color-outline-variant)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-secondary text-2xl">medication</span>
            <h3 className="font-headline font-bold text-base">Supplement Stack</h3>
          </div>
          <div className="space-y-3">
            {supplements.map((s, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer" onClick={() => toggleSupplement(i)}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${s.done ? 'border-secondary bg-secondary/10' : 'border-[var(--color-outline)] hover:border-[var(--color-on-surface-variant)]'}`}>
                  {s.done && <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${s.done ? 'line-through text-on-surface-variant' : ''}`}>{s.name}</p>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 6: AI Grocery List */}
      <section className="bg-[var(--color-surface-container)] rounded-[2rem] p-6 border border-[var(--color-outline-variant)] relative overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/5 rounded-full blur-[80px]"></div>
        <div className="flex flex-col gap-4 mb-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-2xl">shopping_cart</span>
              <div>
                <h2 className="font-headline text-xl font-bold">AI Grocery List</h2>
              </div>
            </div>
            <button onClick={shareGroceryList} className="px-3 py-1.5 bg-secondary/10 text-secondary rounded-xl text-[10px] font-bold uppercase tracking-widest border border-secondary/20 hover:bg-secondary/20 transition-all active:scale-95">
              <span className="material-symbols-outlined text-xs mr-1 align-middle">share</span>
            </button>
          </div>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Auto-generated from your meal plan</p>
        </div>
        <div className="flex flex-col gap-6 relative z-10">
          {[
            { category: 'Proteins', items: ['Chicken Breast (2 lbs)', 'Salmon Fillet (1 lb)', 'Eggs (12 ct)', 'Greek Yogurt (32 oz)', 'Whey Protein (1 bag)'], color: '#FF4D4D' },
            { category: 'Carbs & Grains', items: ['Brown Rice (2 lbs)', 'Sweet Potatoes (4)', 'Oats (32 oz)', 'Rice Cakes (1 pack)', 'Quinoa (1 lb)'], color: '#ff9800' },
            { category: 'Veggies & Fruits', items: ['Broccoli (2 heads)', 'Spinach (1 bag)', 'Avocados (4)', 'Blueberries (1 pint)', 'Zucchini (3)'], color: '#6FFB85' },
          ].map((cat, ci) => (
            <div key={ci}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: cat.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></span>
                {cat.category}
              </p>
              <div className="space-y-2">
                {cat.items.map((item, ii) => {
                  const isChecked = checkedGroceries.has(item);
                  return (
                    <div key={ii} className="flex items-center gap-3 py-1.5 cursor-pointer group" onClick={() => toggleGrocery(item)}>
                      <div className={`w-5 h-5 rounded-md border transition-colors flex items-center justify-center ${isChecked ? 'bg-primary border-primary' : 'border-[var(--color-outline)] group-hover:border-primary/50'}`}>
                        {isChecked && <span className="material-symbols-outlined text-black text-[12px] font-bold">check</span>}
                      </div>
                      <span className={`text-sm transition-colors ${isChecked ? 'text-on-surface-variant line-through' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: Indian Kitchen — 55 Recipes */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-[#FF4D4D] flex items-center justify-center shadow-[0_8px_30px_rgba(255,122,0,0.25)]">
              <span className="material-symbols-outlined text-[#ffffff] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
            </div>
            <div>
              <h2 className="font-headline text-2xl font-bold tracking-tight">Fuel Kitchen</h2>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">{INDIAN_DISHES.length} Recipes • Videos</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-xl">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search recipes... (e.g. salmon, tofu, bibimbap)"
            className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline)] rounded-2xl py-4 pl-12 pr-5 text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto gap-2 pb-2 [scrollbar-width:none]">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all active:scale-95 border ${
                activeCategory === cat
                  ? 'bg-primary text-black border-primary'
                  : 'bg-[var(--color-surface-container)] text-on-surface-variant border-[var(--color-outline)] hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dish Count */}
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
          Showing {filteredDishes.length} dishes
        </p>

        {/* Recipe Grid */}
        <div className="flex flex-col gap-6">
          {filteredDishes.map(dish => (
            <div
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="bg-[var(--color-surface-container)] rounded-[2rem] overflow-hidden group hover:bg-[var(--color-surface-container-high)] transition-all cursor-pointer hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:-translate-y-1 duration-300"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={dish.name}
                  src={dish.image}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#00000099] backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-[#ffffff] uppercase tracking-wider shadow-sm">
                    {dish.prepTime}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-primary/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-black uppercase tracking-wider">
                    {dish.calories} KCAL
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-[#ff9800]/90 px-3 py-1 rounded-lg text-[10px] font-bold text-black uppercase tracking-wider">
                    {dish.category}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-headline font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{dish.name}</h3>
                <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2">{dish.description}</p>
                <div className="pt-3 border-t border-[var(--color-outline-variant)]/30 flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[9px] text-on-surface-variant uppercase font-bold">Protein</p>
                      <p className="font-headline font-bold text-sm text-primary">{dish.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] text-on-surface-variant uppercase font-bold">Carbs</p>
                      <p className="font-headline font-bold text-sm text-secondary">{dish.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] text-on-surface-variant uppercase font-bold">Fat</p>
                      <p className="font-headline font-bold text-sm text-[#fab0ff]">{dish.fat}g</p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-base">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">search_off</span>
            <p className="font-headline text-xl font-bold text-on-surface-variant/50">No dishes found</p>
            <p className="text-on-surface-variant text-sm mt-2">Try a different search or category</p>
          </div>
        )}
      </section>

      {/* Recipe Detail Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-lg flex items-start justify-center overflow-y-auto p-4 md:p-8" onClick={() => setSelectedDish(null)}>
          <div
            className="bg-[var(--color-surface)] rounded-[2rem] max-w-2xl w-full my-4 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-white/5 animate-[slideUp_0.3s_ease-out]"
            onClick={e => e.stopPropagation()}
          >
            {/* Hero Image */}
            <div className="relative h-56 md:h-72 overflow-hidden">
              <img className="w-full h-full object-cover" alt={selectedDish.name} src={selectedDish.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#00000099] backdrop-blur-md flex items-center justify-center text-[#ffffff] hover:bg-black transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-[#ff9800]/90 px-3 py-1 rounded-lg text-[10px] font-bold text-black uppercase tracking-wider">
                  {selectedDish.category}
                </span>
                <h2 className="font-headline font-black text-3xl tracking-tight mt-2 text-[#ffffff] drop-shadow-lg">{selectedDish.name}</h2>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: 'Calories', value: `${selectedDish.calories}`, unit: 'kcal', color: '#FF7A00' },
                  { label: 'Protein', value: `${selectedDish.protein}`, unit: 'g', color: '#FF4D4D' },
                  { label: 'Carbs', value: `${selectedDish.carbs}`, unit: 'g', color: '#6FFB85' },
                  { label: 'Fat', value: `${selectedDish.fat}`, unit: 'g', color: '#fab0ff' },
                  { label: 'Fiber', value: `${selectedDish.fiber}`, unit: 'g', color: '#ff9800' },
                ].map((s, i) => (
                  <div key={i} className="bg-[var(--color-surface-container)] rounded-xl p-3 text-center border border-white/5">
                    <p className="text-[8px] uppercase tracking-widest font-bold mb-1" style={{ color: s.color }}>{s.label}</p>
                    <p className="font-headline font-black text-lg text-on-surface">{s.value}<span className="text-[10px] text-on-surface-variant font-medium">{s.unit}</span></p>
                  </div>
                ))}
              </div>

              {/* Prep Time & YouTube */}
              <div className="flex gap-3">
                <div className="flex-1 bg-[var(--color-surface-container)] rounded-xl p-4 flex items-center gap-3 border border-white/5">
                  <span className="material-symbols-outlined text-primary">timer</span>
                  <div>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">Prep Time</p>
                    <p className="font-headline font-bold text-on-surface">{selectedDish.prepTime}</p>
                  </div>
                </div>
                <a
                  href={selectedDish.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-[#FF0000]/10 to-[#FF0000]/5 rounded-xl p-4 flex items-center gap-3 border border-[#FF0000]/20 hover:border-[#FF0000]/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(255,0,0,0.3)]">
                    <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#FF0000] uppercase tracking-widest font-bold">Watch Tutorial</p>
                    <p className="font-headline font-bold text-on-surface text-sm">{selectedDish.youtubeChannel}</p>
                  </div>
                </a>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">info</span>
                  About This Dish
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{selectedDish.description}</p>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-secondary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">checklist</span>
                  Required Ingredients ({selectedDish.ingredients.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedDish.ingredients.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 bg-[var(--color-surface-container)] rounded-xl border border-white/5">
                      <div className="w-5 h-5 rounded-md border border-secondary/40 flex items-center justify-center bg-secondary/5 flex-shrink-0">
                        <span className="text-[10px] font-bold text-secondary">{i + 1}</span>
                      </div>
                      <span className="text-sm text-on-surface">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-[#ff9800] mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">menu_book</span>
                  How to Make
                </h3>
                <div className="space-y-3">
                  {selectedDish.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-[var(--color-surface-container)] rounded-xl border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-[#ff9800]/10 border border-[#ff9800]/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-headline font-black text-xs text-[#ff9800]">{i + 1}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex gap-3 pt-2">
                <a
                  href={selectedDish.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#FF0000] text-white py-4 rounded-2xl font-headline font-bold text-sm text-center flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_8px_30px_rgba(255,0,0,0.3)]"
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Watch on YouTube
                </a>
                <button
                  onClick={() => setSelectedDish(null)}
                  className="px-6 py-4 bg-[var(--color-surface-container-high)] rounded-2xl font-headline font-bold text-sm text-on-surface-variant hover:text-on-surface hover:bg-[var(--color-surface-container-highest)] transition-all active:scale-95 border border-[var(--color-outline)]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
