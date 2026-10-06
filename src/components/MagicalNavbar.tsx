import React from 'react';
import { Volume2, VolumeX, Lock, ShieldCheck, PenTool } from 'lucide-react';
import { ChamberTab } from '../types/diary';
import { chamberAudio } from '../utils/audio';

interface MagicalNavbarProps {
  activeTab: ChamberTab;
  onSelectTab: (tab: ChamberTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  hasPin: boolean;
  onLockChamber: () => void;
  onNewSecretClick: () => void;
}

export const MagicalNavbar: React.FC<MagicalNavbarProps> = ({
  activeTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  hasPin,
  onLockChamber,
  onNewSecretClick,
}) => {
  const navItems: { id: ChamberTab; label: string; icon: string }[] = [
    { id: 'chamber', label: 'Chamber', icon: '🏰' },
    { id: 'diary', label: 'My Diary', icon: '📖' },
    { id: 'vault', label: 'Vault', icon: '🔐' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'stats', label: 'Chronicle', icon: '✨' },
    { id: 'settings', label: 'Sanctuary', icon: '⚙️' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/60 bg-black/85 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => {
            chamberAudio.playChime(440);
            onSelectTab('chamber');
          }}
          className="text-left group flex items-center gap-2 focus-visible:outline-emerald-400 cursor-pointer"
        >
          <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-emerald-200 to-amber-300 transition-all duration-300 group-hover:brightness-125 whitespace-nowrap">
            Chamber of Secrets
          </span>
        </button>

        {/* Zone 2: 4-6 Nav Links */}
        <nav
          className="hidden md:flex items-center gap-1 sm:gap-2 lg:gap-4 text-xs lg:text-sm font-cinzel font-medium"
          aria-label="Chamber Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  chamberAudio.playChime(520);
                  onSelectTab(item.id);
                }}
                className={`px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap relative cursor-pointer ${
                  isActive
                    ? 'text-amber-200 bg-emerald-950/50 shadow-[0_0_12px_rgba(16,185,129,0.25)] border border-emerald-600/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-xs opacity-80" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Write Secret CTA */}
          <button
            onClick={() => {
              chamberAudio.playPageFlip();
              onNewSecretClick();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-cinzel font-semibold tracking-wider text-amber-200 bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:shadow-[0_0_18px_rgba(16,185,129,0.4)] transition-all cursor-pointer whitespace-nowrap"
            title="Inscribe a new secret"
          >
            <PenTool className="w-3.5 h-3.5 text-emerald-300" />
            <span>Inscribe</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              if (isMuted) {
                // Will unmute, trigger feedback
                chamberAudio.playChime(660);
              }
            }}
            className="p-2 rounded-md text-stone-400 hover:text-amber-200 hover:bg-stone-900/60 border border-transparent hover:border-emerald-900/50 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute chamber whispers' : 'Mute sounds'}
            aria-label={isMuted ? 'Unmute chamber audio' : 'Mute chamber audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Lock Chamber Button */}
          <button
            onClick={() => {
              chamberAudio.playLockClasp();
              onLockChamber();
            }}
            className={`p-2 rounded-md border transition-colors cursor-pointer ${
              hasPin
                ? 'text-amber-300 border-amber-800/40 hover:bg-amber-950/40 hover:border-amber-600'
                : 'text-stone-400 border-stone-800 hover:text-stone-200 hover:bg-stone-900'
            }`}
            title={hasPin ? 'Lock Chamber with Rune PIN' : 'Chamber is open (Configure PIN in Settings)'}
            aria-label="Lock Chamber"
          >
            {hasPin ? <Lock className="w-4 h-4 text-amber-400" /> : <ShieldCheck className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-emerald-950/40 bg-stone-950/90 px-2 py-1.5 overflow-x-auto text-[11px] font-cinzel">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                chamberAudio.playChime(520);
                onSelectTab(item.id);
              }}
              className={`flex flex-col items-center py-1 px-2 rounded transition-colors ${
                isActive ? 'text-amber-200 font-semibold bg-emerald-950/40' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
