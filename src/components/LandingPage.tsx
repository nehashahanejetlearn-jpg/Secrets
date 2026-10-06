import React, { useState } from 'react';
import { Sparkles, KeyRound, Volume2, VolumeX } from 'lucide-react';
import { chamberAudio } from '../utils/audio';

interface LandingPageProps {
  onEnter: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const DOOR_IMAGE = '/src/assets/images/chamber_door_ancient_1791302448617.jpg';

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnter,
  isMuted,
  onToggleMute,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleEnterClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    chamberAudio.playDoorOpen();

    // Cinematic delay matching door split & light burst animation
    setTimeout(() => {
      onEnter();
    }, 1800);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-amber-100 flex flex-col items-center justify-between overflow-hidden select-none">
      {/* Top ambient controls */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-30">
        <div className="flex items-center gap-2 text-xs font-cinzel text-emerald-400/80 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sanctuary of the Unspoken</span>
        </div>

        <button
          onClick={onToggleMute}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-950 bg-stone-950/70 text-xs text-stone-400 hover:text-emerald-300 hover:border-emerald-800 transition-colors cursor-pointer"
          aria-label={isMuted ? 'Enable sound' : 'Mute sound'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isMuted ? 'Sound Muted' : 'Sound Active'}</span>
        </button>
      </div>

      {/* Center Cinematic Portal */}
      <div className="relative w-full max-w-4xl px-4 flex flex-col items-center justify-center my-auto z-20 text-center">
        {/* Title Lockup */}
        <div className="mb-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-400/90 font-cinzel font-semibold">
            Subterranean Vault
          </p>
          <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-emerald-400 drop-shadow-[0_4px_24px_rgba(16,185,129,0.35)]">
            CHAMBER OF SECRETS
          </h1>
          <p className="font-fell italic text-base sm:text-xl text-stone-300/90 max-w-xl mx-auto">
            “Some secrets are meant to be written, not spoken.”
          </p>
        </div>

        {/* The Ancient Door Gateway */}
        <div className="relative w-full max-w-lg aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden shadow-[0_0_60px_rgba(11,61,46,0.8)] border border-emerald-800/40 my-4 group">
          {/* Light burst behind door on open */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-emerald-300 via-yellow-100 to-white transition-opacity duration-1000 z-10 pointer-events-none ${
              isOpening ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Left Door Wing */}
          <div
            className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden z-20 transition-transform duration-1000 ease-in-out ${
              isOpening ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            {!imageError ? (
              <img
                src={DOOR_IMAGE}
                alt="Ancient chamber door left wing"
                className="w-[200%] h-full object-cover object-left filter brightness-90 contrast-110"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-stone-900 to-emerald-950 flex items-center justify-center border-r border-emerald-500/30">
                <span className="font-cinzel text-xs text-emerald-400/60">᚛ ᚚ ᚜</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>

          {/* Right Door Wing */}
          <div
            className={`absolute inset-y-0 right-0 w-1/2 overflow-hidden z-20 transition-transform duration-1000 ease-in-out ${
              isOpening ? 'translate-x-full' : 'translate-x-0'
            }`}
          >
            {!imageError ? (
              <img
                src={DOOR_IMAGE}
                alt="Ancient chamber door right wing"
                className="w-[200%] h-full object-cover object-right -ml-full filter brightness-90 contrast-110"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-bl from-stone-900 to-emerald-950 flex items-center justify-center border-l border-emerald-500/30">
                <span className="font-cinzel text-xs text-emerald-400/60">᚛ ᚛ ᚜</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>

          {/* Central Rune Seal Clasp */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-700 ${
              isOpening ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-950/90 border-2 border-amber-400/70 shadow-[0_0_30px_rgba(212,175,55,0.6)] flex items-center justify-center text-amber-200">
              <span className="font-cinzel font-bold text-xl tracking-tighter animate-pulse">⚕</span>
            </div>
          </div>

          {/* Subtle mist overlay inside frame */}
          <div className="absolute inset-0 z-25 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>

        {/* Enter Chamber Glowing Button */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={handleEnterClick}
            disabled={isOpening}
            className={`relative group px-8 py-3.5 rounded-lg font-cinzel text-sm sm:text-base font-bold tracking-widest text-amber-100 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-400/60 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] transition-all duration-300 transform active:scale-95 cursor-pointer whitespace-nowrap ${
              isOpening ? 'opacity-80 scale-105 pointer-events-none' : 'hover:-translate-y-0.5'
            }`}
          >
            <span className="relative z-10 flex items-center gap-3">
              <KeyRound className="w-4 h-4 text-amber-300 transition-transform group-hover:rotate-45" />
              <span>{isOpening ? 'UNSEALING THE VAULT…' : 'ENTER THE CHAMBER'}</span>
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/10 via-emerald-500/20 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <p className="text-xs text-stone-400 font-sans tracking-wide">
            Encrypted & stored privately inside your local browser.
          </p>
        </div>
      </div>

      {/* Atmospheric Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 font-cinzel border-t border-emerald-950/40 z-30 gap-2">
        <span>Ancient Vault of Salazar · Protected Grimoire</span>
        <span>Local Sanctuary · No external transmission</span>
      </footer>

      {/* Ambient background mist simulation */}
      <div className="absolute inset-0 bg-radial from-emerald-950/20 via-black to-black pointer-events-none" />
    </div>
  );
};
