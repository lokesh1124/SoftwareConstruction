import { NavLink } from 'react-router-dom';

export default function BottomNavBar() {
  const navItems = [
    { to: '/', icon: 'grid_view', label: 'Home' },
    { to: '/workout', icon: 'fitness_center', label: 'Workout' },
    { to: '/nutrition', icon: 'restaurant', label: 'Nutrition' },
    { to: '/progress', icon: 'analytics', label: 'Progress' },
    { to: '/profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <nav className="fixed z-50 flex justify-around items-center px-2 py-2.5 mx-auto max-w-md bg-[var(--color-nav-bg)] backdrop-blur-xl bottom-5 left-1/2 -translate-x-1/2 w-[92%] rounded-2xl overflow-hidden shadow-lg border border-white/[0.04]">
      {navItems.map(item => (
        <NavLink 
          key={item.to}
          to={item.to} 
          end={item.to === '/'}
          className={({ isActive }) => 
            `flex flex-col items-center justify-center transition-colors duration-200 px-3 py-1.5 rounded-xl ${
              isActive 
                ? "text-primary bg-primary/[0.08]" 
                : "text-on-surface-variant/60 hover:text-on-surface active:scale-95"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span 
                className="material-symbols-outlined text-[20px]" 
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-[9px] font-semibold tracking-tight mt-0.5 font-headline">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
