import React, { useState } from 'react';
import { Scroll, Sparkles, Feather } from 'lucide-react';
import { getPromptForDate } from '../utils/prompts';
import { chamberAudio } from '../utils/audio';

interface DailyPromptProps {
  onUsePrompt: (promptText: string) => void;
}

export const DailyPrompt: React.FC<DailyPromptProps> = ({ onUsePrompt }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const promptText = getPromptForDate(today);

  const handleReveal = () => {
    chamberAudio.playChime(620);
    setIsRevealed(true);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-emerald-900/60 bg-gradient-to-b from-stone-950 via-emerald-950/20 to-stone-950 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      {/* Decorative Runes */}
      <div className="absolute top-3 right-4 text-emerald-800/40 text-sm select-none font-cinzel">
        ᛟ ᚱ ᚨ ᚲ ᛚ ᛖ
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Scroll className="w-4 h-4 text-amber-400" />
        <h3 className="font-cinzel text-xs uppercase tracking-widest text-amber-300 font-semibold">
          Secret of the Day
        </h3>
      </div>

      {!isRevealed ? (
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-fell italic text-stone-300 text-center sm:text-left">
            The Chamber whispers a question to those who dare listen...
          </p>
          <button
            onClick={handleReveal}
            className="px-4 py-2 rounded-lg font-cinzel text-xs font-bold tracking-wider text-amber-200 bg-emerald-950 border border-emerald-600/40 hover:border-amber-400/80 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>REVEAL TODAY'S PROMPT</span>
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="p-4 rounded-lg bg-stone-900/80 border border-amber-900/40 shadow-inner my-2">
            <p className="font-fell italic text-base sm:text-lg text-amber-100 text-center sm:text-left leading-relaxed">
              “{promptText}”
            </p>
          </div>
          <div className="mt-3 flex items-center justify-end">
            <button
              onClick={() => {
                chamberAudio.playPageFlip();
                onUsePrompt(promptText);
              }}
              className="text-xs font-cinzel font-semibold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Feather className="w-3.5 h-3.5 text-amber-400" />
              <span>Inscribe into Today's Diary →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
