import React, { useState } from 'react';
import { X, Sparkles, Feather, Eye } from 'lucide-react';
import { chamberAudio } from '../utils/audio';

interface EasterEggsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggsModal: React.FC<EasterEggsModalProps> = ({ isOpen, onClose }) => {
  const [incantationInput, setIncantationInput] = useState('');
  const [spellResult, setSpellResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCastIncantation = (e: React.FormEvent) => {
    e.preventDefault();
    const spell = incantationInput.trim().toLowerCase();

    if (spell === 'lumos') {
      chamberAudio.playChime(880);
      setSpellResult('✨ Lumos Maxima! The chamber vaults ignite with celestial silver light. The shadows temporarily flee.');
    } else if (spell === 'alohomora') {
      chamberAudio.playLockClasp();
      setSpellResult('🗝️ Alohomora! The hidden iron hinges behind the Salazar tapestry swing silently open, revealing an ancient quill fashioned from a thestral feather.');
    } else if (spell === 'nox') {
      chamberAudio.playChime(320);
      setSpellResult('🌙 Nox. A veil of midnight envelops the stone columns. Quiet solitude returns.');
    } else if (spell === 'parseltongue') {
      chamberAudio.playChime(660);
      setSpellResult('🐍 “Sss-ah-hess-ey…” The serpent carved into the archway turns its emerald eye toward you and bows in recognition.');
    } else if (spell === 'expecto patronum') {
      chamberAudio.playSpellSeal();
      setSpellResult('🦌 A brilliant silvery vapor swirls through the arches, leaving behind the scent of ozone and hope.');
    } else {
      chamberAudio.playChime(400);
      setSpellResult('The stone walls absorb your words in silence. Try whispering "Lumos", "Alohomora", or "Parseltongue"…');
    }
    setIncantationInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-2xl border-2 border-emerald-600/60 bg-[#0d120f] p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.4)] text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white bg-stone-900 border border-stone-800 cursor-pointer"
          aria-label="Close arcane modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-mystic-glow">
          🐍
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-cinzel font-semibold">
            Forbidden Lore Unsealed
          </span>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100 mt-1">
            The Whisper of Salazar
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-stone-950/80 border border-emerald-900/50 text-left space-y-2">
          <p className="font-fell italic text-sm sm:text-base text-amber-200/90 leading-relaxed">
            “He who writes with conviction binds the stars to the parchment. 
            Words kept in secret are not weakness—they are the dormant embers of ambition.”
          </p>
          <p className="text-[11px] font-cinzel text-emerald-500 text-right">
            — Fragment from the First Chronicle, 993 A.D.
          </p>
        </div>

        {/* Incantation Spell Input */}
        <div className="pt-2 border-t border-emerald-950/80 space-y-3">
          <p className="font-cinzel text-xs text-stone-400">
            Whisper an incantation into the stones:
          </p>

          <form onSubmit={handleCastIncantation} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Lumos, Alohomora, Parseltongue…"
              value={incantationInput}
              onChange={(e) => setIncantationInput(e.target.value)}
              className="flex-1 bg-stone-900 border border-emerald-900 rounded-lg px-3 py-1.5 text-xs text-amber-200 font-cinzel focus:outline-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500 text-xs font-cinzel text-amber-200 hover:bg-emerald-900 cursor-pointer font-bold whitespace-nowrap"
            >
              Cast Spell
            </button>
          </form>

          {spellResult && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/60 text-xs font-fell italic text-amber-200 animate-in fade-in">
              {spellResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
