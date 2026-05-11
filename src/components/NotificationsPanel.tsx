import { useToast } from '../context/ToastContext';

export default function NotificationsPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { showToast } = useToast();
  if (!isOpen) return null;

  const demoNotifications = [
    { title: 'Hydration Target', desc: 'You are 500ml behind your daily water goal.', time: '10 min ago', icon: 'water_drop', color: '#FF7A00' },
    { title: 'Goal Completed!', desc: 'You reached your 10,000 steps today!', time: '1 hr ago', icon: 'steps', color: '#6FFB85' },
    { title: 'Workout Scheduled', desc: 'Hypertrophy: Chest & Delts starts in 30 mins.', time: '2 hrs ago', icon: 'fitness_center', color: '#FAB0FF' },
    { title: 'Inactivity Warning', desc: 'You have been seated for 2 hours. Time to stand up.', time: '5 hrs ago', icon: 'warning', color: '#FF716C' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[150]" onClick={onClose}></div>
      <div className="absolute top-20 right-4 sm:right-8 w-80 bg-[rgba(25,25,28,0.85)] backdrop-blur-3xl border border-white/10 rounded-2xl p-4 z-[200] shadow-2xl animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h3 className="font-headline font-bold text-lg">System Alerts</h3>
          <button onClick={() => { showToast('All notifications marked as read!', 'success'); onClose(); }} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Mark All Read</button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto [scrollbar-width:none]">
          {demoNotifications.map((notif, idx) => (
            <div key={idx} className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/5" style={{ backgroundColor: `${notif.color}15`, color: notif.color }}>
                <span className="material-symbols-outlined text-sm">{notif.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-headline font-bold text-sm text-white group-hover:text-primary transition-colors">{notif.title}</p>
                <p className="text-xs text-on-surface-variant leading-tight mt-0.5">{notif.desc}</p>
                <p className="text-[9px] uppercase tracking-widest text-white/30 mt-2 font-bold">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
