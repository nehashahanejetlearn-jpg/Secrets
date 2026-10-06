import React from 'react';

interface CandleFlameProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glowOpacity?: number;
}

export const CandleFlame: React.FC<CandleFlameProps> = ({
  size = 'md',
  className = '',
  glowOpacity = 0.6,
}) => {
  const heightClass = size === 'sm' ? 'h-12' : size === 'lg' ? 'h-24' : 'h-16';
  const candleWidth = size === 'sm' ? 'w-3' : size === 'lg' ? 'w-6' : 'w-4';
  const flameSize = size === 'sm' ? 'w-2 h-4' : size === 'lg' ? 'w-4 h-7' : 'w-3 h-5';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`} aria-hidden="true">
      {/* Ambient Radial Glow */}
      <div
        className="absolute -top-6 rounded-full pointer-events-none filter blur-xl bg-amber-500/20 w-16 h-16 transition-opacity duration-500"
        style={{ opacity: glowOpacity }}
      />

      {/* Flame */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`${flameSize} rounded-full bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-100 animate-candle-flame origin-bottom`}
          style={{
            borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.8), 0 0 20px rgba(217, 119, 6, 0.4)',
          }}
        >
          {/* Inner blue base of the flame */}
          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full mx-auto mt-auto opacity-75 blur-[0.5px]" />
        </div>

        {/* Candle Wick */}
        <div className="w-[1.5px] h-2 bg-stone-900 -mt-0.5" />
      </div>

      {/* Wax Pillar */}
      <div
        className={`${candleWidth} ${heightClass} bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 rounded-t-sm shadow-inner relative border-t border-amber-100/50`}
      >
        {/* Subtle wax drip artifact */}
        <div className="absolute top-1 -left-0.5 w-1 h-3 bg-stone-200 rounded-full opacity-80" />
      </div>
    </div>
  );
};
