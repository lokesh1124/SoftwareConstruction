import { useMemo } from 'react';

interface MuscleHeatmapProps {
  muscles: string[];
  size?: number;
  className?: string;
}

// Canonical muscle group mappings → SVG path IDs
const MUSCLE_REGIONS: Record<string, { paths: string[]; view: 'front' | 'back' | 'both' }> = {
  // CHEST
  'pectorals':         { paths: ['chest-l', 'chest-r'], view: 'front' },
  'upper pectorals':   { paths: ['chest-l', 'chest-r'], view: 'front' },
  'lower pectorals':   { paths: ['chest-l', 'chest-r'], view: 'front' },
  'inner pectorals':   { paths: ['chest-l', 'chest-r'], view: 'front' },
  'chest':             { paths: ['chest-l', 'chest-r'], view: 'front' },

  // SHOULDERS
  'deltoids':          { paths: ['delt-l', 'delt-r'], view: 'front' },
  'front delts':       { paths: ['delt-l', 'delt-r'], view: 'front' },
  'lateral delts':     { paths: ['delt-l', 'delt-r'], view: 'front' },
  'rear delts':        { paths: ['rear-delt-l', 'rear-delt-r'], view: 'back' },
  'full deltoid':      { paths: ['delt-l', 'delt-r', 'rear-delt-l', 'rear-delt-r'], view: 'both' },
  'shoulders':         { paths: ['delt-l', 'delt-r'], view: 'front' },
  'rotator cuffs':     { paths: ['rear-delt-l', 'rear-delt-r'], view: 'back' },

  // ARMS
  'biceps':            { paths: ['bicep-l', 'bicep-r'], view: 'front' },
  'biceps brachii':    { paths: ['bicep-l', 'bicep-r'], view: 'front' },
  'bicep peak':        { paths: ['bicep-l', 'bicep-r'], view: 'front' },
  'bicep short head':  { paths: ['bicep-l', 'bicep-r'], view: 'front' },
  'biceps (long head)':{ paths: ['bicep-l', 'bicep-r'], view: 'front' },
  'brachialis':        { paths: ['bicep-l', 'bicep-r'], view: 'front' },
  'brachioradialis':   { paths: ['forearm-l', 'forearm-r'], view: 'front' },
  'triceps':           { paths: ['tricep-l', 'tricep-r'], view: 'back' },
  'triceps (long head)': { paths: ['tricep-l', 'tricep-r'], view: 'back' },
  'forearms':          { paths: ['forearm-l', 'forearm-r'], view: 'front' },

  // BACK
  'latissimus dorsi':  { paths: ['lat-l', 'lat-r'], view: 'back' },
  'latissimus dorsi (outer)': { paths: ['lat-l', 'lat-r'], view: 'back' },
  'lats':              { paths: ['lat-l', 'lat-r'], view: 'back' },
  'lats (lower)':      { paths: ['lat-l', 'lat-r'], view: 'back' },
  'rhomboids':         { paths: ['upper-back-l', 'upper-back-r'], view: 'back' },
  'middle back':       { paths: ['upper-back-l', 'upper-back-r'], view: 'back' },
  'mid back':          { paths: ['upper-back-l', 'upper-back-r'], view: 'back' },
  'lower back':        { paths: ['lower-back'], view: 'back' },
  'trapezius':         { paths: ['trap-l', 'trap-r'], view: 'back' },
  'traps':             { paths: ['trap-l', 'trap-r'], view: 'back' },
  'lower traps':       { paths: ['trap-l', 'trap-r'], view: 'back' },
  'spinal erectors':   { paths: ['lower-back'], view: 'back' },

  // CORE
  'core':              { paths: ['abs'], view: 'front' },
  'abs':               { paths: ['abs'], view: 'front' },
  'lower abs':         { paths: ['abs'], view: 'front' },
  'obliques':          { paths: ['oblique-l', 'oblique-r'], view: 'front' },
  'transverse abdominis': { paths: ['abs'], view: 'front' },
  'hip flexors':       { paths: ['hip-l', 'hip-r'], view: 'front' },

  // LEGS
  'quads':             { paths: ['quad-l', 'quad-r'], view: 'front' },
  'quadriceps':        { paths: ['quad-l', 'quad-r'], view: 'front' },
  'hamstrings':        { paths: ['ham-l', 'ham-r'], view: 'back' },
  'glutes':            { paths: ['glute-l', 'glute-r'], view: 'back' },
  'gluteus medius':    { paths: ['glute-l', 'glute-r'], view: 'back' },
  'calves':            { paths: ['calf-l', 'calf-r'], view: 'back' },
  'gastrocnemius':     { paths: ['calf-l', 'calf-r'], view: 'back' },
  'soleus':            { paths: ['calf-l', 'calf-r'], view: 'back' },
  'inner thighs':      { paths: ['quad-l', 'quad-r'], view: 'front' },
  'outer thighs':      { paths: ['quad-l', 'quad-r'], view: 'front' },
  'tibialis anterior': { paths: ['shin-l', 'shin-r'], view: 'front' },

  // COMPOUND / MISC
  'upper body compound': { paths: ['chest-l', 'chest-r', 'delt-l', 'delt-r', 'bicep-l', 'bicep-r'], view: 'front' },
  'full body':         { paths: ['chest-l', 'chest-r', 'abs', 'quad-l', 'quad-r', 'delt-l', 'delt-r', 'lat-l', 'lat-r'], view: 'both' },
  'full body mobility': { paths: ['abs', 'hip-l', 'hip-r', 'quad-l', 'quad-r'], view: 'front' },
  'cardio':            { paths: ['quad-l', 'quad-r', 'calf-l', 'calf-r'], view: 'front' },
  'grip':              { paths: ['forearm-l', 'forearm-r'], view: 'front' },
  'spine mobility':    { paths: ['lower-back'], view: 'back' },
  'thoracic spine':    { paths: ['upper-back-l', 'upper-back-r'], view: 'back' },
  'hip mobility':      { paths: ['hip-l', 'hip-r', 'glute-l', 'glute-r'], view: 'both' },
  'balance':           { paths: ['quad-l', 'quad-r', 'calf-l', 'calf-r'], view: 'front' },
  'plyos':             { paths: ['quad-l', 'quad-r', 'calf-l', 'calf-r'], view: 'front' },
  'cardiovascular':    { paths: ['quad-l', 'quad-r', 'abs'], view: 'front' },
};

function resolveActivePaths(muscles: string[]): Set<string> {
  const active = new Set<string>();
  muscles.forEach(m => {
    const key = m.toLowerCase().trim();
    const region = MUSCLE_REGIONS[key];
    if (region) {
      region.paths.forEach(p => active.add(p));
    }
  });
  return active;
}

// Body SVG path data — simplified anatomical outlines
const FRONT_PATHS: Record<string, string> = {
  // Head + neck outline
  'head': 'M91,18 C91,8 100,2 110,2 C120,2 129,8 129,18 L129,30 C129,38 122,44 110,44 C98,44 91,38 91,30 Z',
  'neck': 'M103,44 L117,44 L119,56 L101,56 Z',

  // Torso outline
  'torso-outline': 'M80,56 L140,56 L148,90 L150,130 L145,170 L75,170 L70,130 L72,90 Z',

  // Chest
  'chest-l': 'M82,62 C82,58 92,56 102,56 L108,56 L108,82 C100,84 88,80 82,74 Z',
  'chest-r': 'M112,56 L118,56 C128,56 138,58 138,62 L138,74 C132,80 120,84 112,82 Z',

  // Shoulders
  'delt-l': 'M70,56 C68,52 72,48 78,48 L82,56 L82,72 C74,68 68,62 70,56 Z',
  'delt-r': 'M138,56 L142,48 C148,48 152,52 150,56 L150,56 C152,62 146,68 138,72 Z',

  // Abs
  'abs': 'M98,86 L122,86 L122,148 C122,152 118,156 110,156 C102,156 98,152 98,148 Z',

  // Obliques
  'oblique-l': 'M82,86 L96,86 L96,150 L82,150 C78,140 76,120 80,100 Z',
  'oblique-r': 'M124,86 L138,86 C140,100 142,120 138,150 L124,150 Z',

  // Hip flexors
  'hip-l': 'M80,155 L108,155 L105,175 L78,175 Z',
  'hip-r': 'M112,155 L140,155 L142,175 L115,175 Z',

  // Biceps
  'bicep-l': 'M60,72 L78,68 L78,100 C76,106 68,110 62,108 L58,100 Z',
  'bicep-r': 'M142,68 L160,72 L162,100 L158,108 C152,110 144,106 142,100 Z',

  // Forearms
  'forearm-l': 'M56,110 L76,102 L72,140 L66,155 L52,150 Z',
  'forearm-r': 'M144,102 L164,110 L168,150 L154,155 L148,140 Z',

  // Quads
  'quad-l': 'M80,175 L108,175 L110,240 L100,265 L80,265 L74,240 Z',
  'quad-r': 'M112,175 L140,175 L146,240 L140,265 L120,265 L110,240 Z',

  // Shins
  'shin-l': 'M78,268 L102,268 L98,330 L82,330 Z',
  'shin-r': 'M118,268 L142,268 L138,330 L122,330 Z',
};

const BACK_PATHS: Record<string, string> = {
  // Head + neck
  'head-back': 'M91,18 C91,8 100,2 110,2 C120,2 129,8 129,18 L129,30 C129,38 122,44 110,44 C98,44 91,38 91,30 Z',
  'neck-back': 'M103,44 L117,44 L119,56 L101,56 Z',

  // Torso outline
  'torso-back-outline': 'M80,56 L140,56 L148,90 L150,130 L145,170 L75,170 L70,130 L72,90 Z',

  // Traps
  'trap-l': 'M86,48 L108,56 L108,72 L92,68 C86,64 84,56 86,48 Z',
  'trap-r': 'M134,48 L112,56 L112,72 L128,68 C134,64 136,56 134,48 Z',

  // Rear Delts
  'rear-delt-l': 'M70,56 C68,52 72,48 78,48 L82,56 L82,72 C74,68 68,62 70,56 Z',
  'rear-delt-r': 'M138,56 L142,48 C148,48 152,52 150,56 C152,62 146,68 138,72 Z',

  // Upper Back
  'upper-back-l': 'M86,72 L108,74 L108,100 L86,96 Z',
  'upper-back-r': 'M112,74 L134,72 L134,96 L112,100 Z',

  // Lats
  'lat-l': 'M80,96 L108,100 L108,140 L84,135 Z',
  'lat-r': 'M112,100 L140,96 L136,135 L112,140 Z',

  // Lower Back
  'lower-back': 'M90,140 L130,140 L128,170 L92,170 Z',

  // Triceps
  'tricep-l': 'M60,72 L78,68 L78,110 C74,116 66,118 60,114 Z',
  'tricep-r': 'M142,68 L160,72 L160,114 C154,118 146,116 142,110 Z',

  // Glutes
  'glute-l': 'M80,170 L110,170 L110,200 L80,200 Z',
  'glute-r': 'M110,170 L140,170 L140,200 L110,200 Z',

  // Hamstrings
  'ham-l': 'M78,202 L108,202 L106,268 L76,268 Z',
  'ham-r': 'M112,202 L142,202 L144,268 L114,268 Z',

  // Calves
  'calf-l': 'M78,270 L104,270 L100,335 L82,335 Z',
  'calf-r': 'M116,270 L142,270 L138,335 L120,335 Z',
};

export default function MuscleHeatmap({ muscles, size = 160, className = '' }: MuscleHeatmapProps) {
  const activePaths = useMemo(() => resolveActivePaths(muscles), [muscles]);

  // Determine which views are needed
  const needsFront = useMemo(() => {
    for (const m of muscles) {
      const region = MUSCLE_REGIONS[m.toLowerCase().trim()];
      if (region && (region.view === 'front' || region.view === 'both')) return true;
    }
    return true; // default to front
  }, [muscles]);

  const needsBack = useMemo(() => {
    for (const m of muscles) {
      const region = MUSCLE_REGIONS[m.toLowerCase().trim()];
      if (region && (region.view === 'back' || region.view === 'both')) return true;
    }
    return false;
  }, [muscles]);

  const renderBody = (paths: Record<string, string>, activePaths: Set<string>, label: string) => (
    <div className="flex flex-col items-center gap-1">
      <svg
        viewBox="0 0 220 345"
        width={needsFront && needsBack ? size * 0.85 : size}
        height={needsFront && needsBack ? size * 1.85 : size * 2.15}
        className="drop-shadow-[0_0_8px_rgba(255,122,0,0.08)]"
      >
        <defs>
          <radialGradient id={`heat-${label}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#FF4500" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FF2200" stopOpacity="0.45" />
          </radialGradient>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {Object.entries(paths).map(([id, d]) => {
          const isActive = activePaths.has(id);
          const isOutline = id.includes('outline') || id === 'head' || id === 'head-back' || id === 'neck' || id === 'neck-back';

          if (isOutline) {
            return (
              <path
                key={id}
                d={d}
                fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.8"
              />
            );
          }

          return (
            <path
              key={id}
              d={d}
              fill={isActive ? `url(#heat-${label})` : 'rgba(255,255,255,0.04)'}
              stroke={isActive ? 'rgba(255,122,0,0.5)' : 'rgba(255,255,255,0.06)'}
              strokeWidth={isActive ? '1' : '0.5'}
              filter={isActive ? `url(#glow-${label})` : undefined}
              className={isActive ? 'animate-heatmap-pulse' : ''}
              style={{
                transition: 'fill 0.6s ease, stroke 0.6s ease',
              }}
            />
          );
        })}
      </svg>
      <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/40">{label}</span>
    </div>
  );

  return (
    <div className={`flex items-end justify-center gap-4 ${className}`}>
      {needsFront && renderBody(FRONT_PATHS, activePaths, 'Front')}
      {needsBack && renderBody(BACK_PATHS, activePaths, 'Back')}
    </div>
  );
}
