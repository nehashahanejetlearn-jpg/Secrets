import React, { useState } from 'react';
import { Sparkles, PenTool, BookOpen, Calendar, Key, Shield, Flame, BookMarked } from 'lucide-react';
import { ChamberTab, DiaryEntry } from '../types/diary';
import { DailyPrompt } from './DailyPrompt';
import { CandleFlame } from './CandleFlame';
import { chamberAudio } from '../utils/audio';
import { getMoodConfig } from '../utils/constants';

interface ChamberDashboardProps {
  entries: DiaryEntry[];
  onNavigate: (tab: ChamberTab) => void;
  onOpenNewDiary: (initialText?: string) => void;
  onSelectEntry: (entry: DiaryEntry) => void;
  onTriggerEasterEgg: () => void;
}

const VAULT_IMAGE = '/src/assets/images/chamber_vault_interior_1791302462114.jpg';
const TOME_IMAGE = '/src/assets/images/enchanted_tome_cover_1791302484638.jpg';

export const ChamberDashboard: React.FC<ChamberDashboardProps> = ({
  entries,
  onNavigate,
  onOpenNewDiary,
  onSelectEntry,
  onTriggerEasterEgg,
}) => {
  const [runeClickCount, setRuneClickCount] = useState(0);
  const [vaultImgError, setVaultImgError] = useState(false);
  const [tomeImgError, setTomeImgError] = useState(false);

  const recentEntries = entries.slice(0, 3);

  const handleRuneClick = () => {
    chamberAudio.playChime(780);
    const next = runeClickCount + 1;
    setRuneClickCount(next);
    if (next >= 4) {
      setRuneClickCount(0);
      onTriggerEasterEgg();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Central Hero Sanctuary Area */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-6 sm:p-10">
        {/* Background Vault Image with Dark Scrim */}
        {!vaultImgError ? (
          <img
            src={VAULT_IMAGE}
            alt="Subterranean Chamber of Secrets Vault"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-45 contrast-110 pointer-events-none"
            referrerPolicy="no-referrer"
            onError={() => setVaultImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-emerald-950/40 to-stone-950" />
        )}

        {/* Ambient Overlay gradient for high contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />

        {/* Top Arch Bar with Salazar Rune (Easter Egg) */}
        <div className="relative z-20 flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <CandleFlame size="sm" className="hidden sm:flex" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-cinzel">
                Sanctum Inscriptum
              </p>
              <h2 className="font-cinzel text-lg sm:text-2xl font-bold text-amber-100 tracking-wider">
                The Inner Sanctum
              </h2>
            </div>
          </div>

          {/* Interactive Easter Egg Serpent Rune */}
          <button
            onClick={handleRuneClick}
            className="group px-3 py-1.5 rounded-lg border border-emerald-800/40 bg-black/60 hover:bg-emerald-950/60 transition-all cursor-pointer text-right"
            title="A curious snake rune glows faintly in the stonework..."
          >
            <div className="flex items-center gap-1.5 text-xs font-cinzel text-emerald-400 group-hover:text-amber-300">
              <span className="text-base group-hover:scale-125 transition-transform inline-block">🐍</span>
              <span className="hidden sm:inline">Rune of Slytherin</span>
              {runeClickCount > 0 && (
                <span className="text-[10px] text-amber-400 font-mono">({runeClickCount}/4)</span>
              )}
            </div>
          </button>
        </div>

        {/* Center Enchanted Tome Showcase */}
        <div className="relative z-20 my-auto py-6 flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
          {/* Tome Visual Clasp */}
          <div
            onClick={() => {
              chamberAudio.playPageFlip();
              onOpenNewDiary();
            }}
            className="relative group cursor-pointer w-36 h-36 sm:w-44 sm:h-44 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.5)] border-2 border-amber-400/60 hover:scale-105 transition-all duration-300"
            title="Click to open the Enchanted Grimoire"
          >
            {!tomeImgError ? (
              <img
                src={TOME_IMAGE}
                alt="Enchanted Diary Tome"
                className="w-full h-full object-cover filter brightness-95 contrast-110 group-hover:brightness-110 transition-all"
                referrerPolicy="no-referrer"
                onError={() => setTomeImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center p-3 text-amber-200">
                <BookMarked className="w-10 h-10 mb-2 text-amber-400" />
                <span className="font-cinzel text-xs text-center">Enchanted Tome</span>
              </div>
            )}
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 inset-x-2 bg-black/80 backdrop-blur-xs py-1 rounded text-[10px] font-cinzel text-center text-amber-200 tracking-wider">
              Touch to Open
            </div>
          </div>

          {/* Invitation Copy & Quick CTA */}
          <div className="max-w-md space-y-3">
            <h3 className="font-cinzel text-xl sm:text-3xl font-bold text-amber-100 tracking-wide">
              The Grimoire Awaits
            </h3>
            <p className="font-fell italic text-sm sm:text-base text-stone-300 leading-relaxed">
              No spell can break these bounds. Pour your confessions, daily triumphs, and deepest wanderings into the ink.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  chamberAudio.playPageFlip();
                  onOpenNewDiary();
                }}
                className="px-5 py-2.5 rounded-lg font-cinzel text-xs font-bold tracking-wider text-amber-200 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <PenTool className="w-3.5 h-3.5 text-emerald-300" />
                <span>WRITE TODAY'S SECRET</span>
              </button>

              <button
                onClick={() => {
                  chamberAudio.playChime(500);
                  onNavigate('vault');
                }}
                className="px-4 py-2.5 rounded-lg font-cinzel text-xs font-medium text-stone-300 hover:text-amber-100 bg-stone-900/80 hover:bg-stone-800/80 border border-stone-700/60 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                <span>Browse Memory Vault ({entries.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ambient bottom status strip */}
        <div className="relative z-20 flex flex-wrap justify-between items-center text-xs text-stone-400 font-cinzel pt-4 border-t border-emerald-900/40">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Vault Sealed & Secure in Browser</span>
          </span>
          <span className="font-mono text-stone-400 text-[11px]">
            {entries.length} {entries.length === 1 ? 'Secret Bound' : 'Secrets Bound'}
          </span>
        </div>
      </div>

      {/* Secret of the Day Interactive Prompt */}
      <DailyPrompt
        onUsePrompt={(promptText) => {
          onOpenNewDiary(promptText);
        }}
      />

      {/* Chamber Wing Portals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => {
            chamberAudio.playChime(500);
            onNavigate('diary');
          }}
          className="group p-4 rounded-xl border border-emerald-950/80 bg-stone-950/60 hover:bg-emerald-950/30 hover:border-emerald-600/50 transition-all text-left flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl">📖</span>
            <PenTool className="w-4 h-4 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h4 className="font-cinzel text-xs sm:text-sm font-bold text-amber-200 group-hover:text-amber-100">
              My Diary
            </h4>
            <p className="text-[11px] text-stone-400 font-sans mt-0.5">
              Daily entries & quill writing
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            chamberAudio.playChime(540);
            onNavigate('vault');
          }}
          className="group p-4 rounded-xl border border-emerald-950/80 bg-stone-950/60 hover:bg-emerald-950/30 hover:border-emerald-600/50 transition-all text-left flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl">🔐</span>
            <Key className="w-4 h-4 text-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h4 className="font-cinzel text-xs sm:text-sm font-bold text-amber-200 group-hover:text-amber-100">
              Memory Vault
            </h4>
            <p className="text-[11px] text-stone-400 font-sans mt-0.5">
              Floating parchment archive
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            chamberAudio.playChime(580);
            onNavigate('calendar');
          }}
          className="group p-4 rounded-xl border border-emerald-950/80 bg-stone-950/60 hover:bg-emerald-950/30 hover:border-emerald-600/50 transition-all text-left flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl">📅</span>
            <Calendar className="w-4 h-4 text-sky-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h4 className="font-cinzel text-xs sm:text-sm font-bold text-amber-200 group-hover:text-amber-100">
              Magical Calendar
            </h4>
            <p className="text-[11px] text-stone-400 font-sans mt-0.5">
              Glowing lunar chronology
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            chamberAudio.playChime(620);
            onNavigate('stats');
          }}
          className="group p-4 rounded-xl border border-emerald-950/80 bg-stone-950/60 hover:bg-emerald-950/30 hover:border-emerald-600/50 transition-all text-left flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xl">✨</span>
            <Sparkles className="w-4 h-4 text-yellow-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <h4 className="font-cinzel text-xs sm:text-sm font-bold text-amber-200 group-hover:text-amber-100">
              Secret Stats
            </h4>
            <p className="text-[11px] text-stone-400 font-sans mt-0.5">
              Streaks, auras & tallies
            </p>
          </div>
        </button>
      </div>

      {/* Recent Sealed Memories Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-cinzel text-sm uppercase tracking-wider text-amber-300 font-bold">
              Recently Sealed Memories
            </h3>
            <span className="text-xs text-stone-500 font-mono">({recentEntries.length})</span>
          </div>

          <button
            onClick={() => onNavigate('vault')}
            className="text-xs font-cinzel text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            Open Complete Vault →
          </button>
        </div>

        {recentEntries.length === 0 ? (
          <div className="p-8 rounded-xl border border-stone-900 bg-stone-950/40 text-center">
            <p className="font-fell italic text-stone-400">
              No secrets have yet been sealed inside the Chamber. Dip your quill to begin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentEntries.map((entry) => {
              const moodConf = getMoodConfig(entry.mood);
              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    chamberAudio.playPageFlip();
                    onSelectEntry(entry);
                  }}
                  className="group relative p-5 rounded-xl border border-emerald-950/70 bg-gradient-to-b from-stone-900/80 to-stone-950/90 hover:border-emerald-600/50 transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col justify-between"
                >
                  <div>
                    {/* Unboxed Metadata (Zero-Pill Discipline) */}
                    <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                      <span className="text-amber-300/90 font-cinzel">{entry.date}</span>
                      <span aria-hidden="true" className="opacity-40">·</span>
                      <span className="flex items-center gap-1" style={{ color: moodConf.colorHex }}>
                        <span>{moodConf.icon}</span>
                        <span>{moodConf.label}</span>
                      </span>
                    </div>

                    <h4 className="font-cinzel text-base font-semibold text-amber-100 group-hover:text-amber-200 transition-colors line-clamp-1">
                      {entry.title || 'Untitled Secret'}
                    </h4>

                    <p className="font-fell italic text-stone-300/80 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {entry.content}
                    </p>
                  </div>

                  {/* Clean unboxed tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center gap-2 text-[11px] text-stone-500 overflow-hidden">
                      {entry.tags.map((tag, idx) => (
                        <React.Fragment key={tag}>
                          {idx > 0 && <span aria-hidden="true">·</span>}
                          <span>#{tag}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
