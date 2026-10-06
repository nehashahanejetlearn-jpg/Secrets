import React from 'react';
import { Flame, Lock, Sparkles, Tag, BookMarked, Moon, Feather, Award } from 'lucide-react';
import { DiaryEntry } from '../types/diary';
import { calculateStats } from '../utils/stats';
import { MOODS } from '../utils/constants';

interface SecretStatsProps {
  entries: DiaryEntry[];
}

export const SecretStats: React.FC<SecretStatsProps> = ({ entries }) => {
  const stats = calculateStats(entries);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-emerald-950/60 pb-4">
        <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wider">
          CHRONICLE OF SECRETS
        </h2>
        <p className="font-fell italic text-xs sm:text-sm text-stone-400 mt-1">
          Divinations and mystical metrics distilled from your personal grimoire.
        </p>
      </div>

      {/* Primary Magical Artifacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Flame of Constancy (Writing Streak) */}
        <div className="relative p-6 rounded-2xl border border-amber-900/40 bg-gradient-to-b from-[#18110b] via-[#120d09] to-[#0a0705] shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col justify-between overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="font-cinzel text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Flame of Constancy</span>
            </span>
            <span className="text-xs text-stone-500 font-mono">Current Streak</span>
          </div>

          <div className="my-2">
            <div className="font-cinzel text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tabular-nums">
              🔥 {stats.currentStreak} {stats.currentStreak === 1 ? 'Day' : 'Days'}
            </div>
            <p className="font-fell italic text-xs text-stone-400 mt-2">
              Longest recorded devotion: <span className="text-amber-300 font-bold">{stats.longestStreak} days</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-900/30 text-[11px] text-stone-500 font-cinzel">
            The flame burns as long as you visit every setting sun.
          </div>
        </div>

        {/* Vault of Tomes (Secrets Stored) */}
        <div className="relative p-6 rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-[#0b1712] via-[#09120e] to-[#050a08] shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col justify-between overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="font-cinzel text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Vault of Tomes</span>
            </span>
            <span className="text-xs text-stone-500 font-mono">Bound Entries</span>
          </div>

          <div className="my-2">
            <div className="font-cinzel text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-300 tabular-nums">
              🔐 {stats.totalSecrets}
            </div>
            <p className="font-fell italic text-xs text-stone-400 mt-2">
              Inscribed this lunar cycle: <span className="text-emerald-300 font-bold">{stats.entriesThisMonth} scrolls</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-900/30 text-[11px] text-stone-500 font-cinzel">
            Every secret is guarded by ancient browser encryption.
          </div>
        </div>

        {/* Dominant Aura (Most Common Mood) */}
        <div className="relative p-6 rounded-2xl border border-purple-900/40 bg-gradient-to-b from-[#140b19] via-[#0f0913] to-[#070409] shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col justify-between overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="font-cinzel text-xs uppercase tracking-widest text-purple-400 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Dominant Aura</span>
            </span>
            <span className="text-xs text-stone-500 font-mono">Prevalent State</span>
          </div>

          <div className="my-2">
            <div className="font-cinzel text-3xl sm:text-4xl font-black text-amber-100 flex items-center gap-3">
              <span className="text-4xl">{stats.mostCommonMood.icon}</span>
              <span>{stats.mostCommonMood.label}</span>
            </div>
            <p className="font-fell italic text-xs text-stone-400 mt-2">
              Attuned in <span className="text-purple-300 font-bold">{stats.mostCommonMood.count} entries</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-900/30 text-[11px] text-stone-500 font-cinzel">
            Your prevailing mental atmosphere in the chamber.
          </div>
        </div>

        {/* Ink Wells Consumed (Total Words Penned) */}
        <div className="relative p-6 rounded-2xl border border-stone-800/80 bg-stone-950/70 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-cinzel text-xs uppercase tracking-widest text-stone-300 font-bold flex items-center gap-2">
              <Feather className="w-4 h-4 text-amber-400" />
              <span>Words Penned</span>
            </span>
            <span className="text-xs text-stone-500 font-mono">Quill Depth</span>
          </div>

          <div className="my-2">
            <div className="font-cinzel text-3xl sm:text-4xl font-black text-amber-200 tabular-nums">
              📜 {stats.totalWords.toLocaleString()}
            </div>
            <p className="font-fell italic text-xs text-stone-400 mt-2">
              Approx. <span className="text-stone-300">{(stats.totalWords / 250).toFixed(1)} parchment pages</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-900 text-[11px] text-stone-500 font-cinzel">
            Each word anchors a fragment of memory into reality.
          </div>
        </div>

        {/* Rune of Greatest Affinity (Most Used Tag) */}
        <div className="relative p-6 rounded-2xl border border-stone-800/80 bg-stone-950/70 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-cinzel text-xs uppercase tracking-widest text-stone-300 font-bold flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Chief Affinity</span>
            </span>
            <span className="text-xs text-stone-500 font-mono">Top Rune</span>
          </div>

          <div className="my-2">
            <div className="font-cinzel text-3xl sm:text-4xl font-black text-emerald-300 truncate">
              {stats.mostUsedTag.tag ? `#${stats.mostUsedTag.tag}` : 'No Runes Yet'}
            </div>
            <p className="font-fell italic text-xs text-stone-400 mt-2">
              Invoked <span className="text-emerald-400 font-bold">{stats.mostUsedTag.count} times</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-900 text-[11px] text-stone-500 font-cinzel">
            The topic most woven into your recorded thoughts.
          </div>
        </div>

        {/* Master of the Chamber (Rank) */}
        <div className="relative p-6 rounded-2xl border border-stone-800/80 bg-stone-950/70 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-cinzel text-xs uppercase tracking-widest text-stone-300 font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Keeper Rank</span>
            </span>
            <span className="text-xs text-stone-500 font-mono">Title</span>
          </div>

          <div className="my-2">
            <div className="font-cinzel text-2xl sm:text-3xl font-black text-amber-200">
              {stats.totalSecrets >= 15
                ? 'Archivist of Salazar'
                : stats.totalSecrets >= 5
                ? 'Acolyte of Secrets'
                : 'Initiate of the Quill'}
            </div>
            <p className="font-fell italic text-xs text-stone-400 mt-2">
              Next ascension at {stats.totalSecrets >= 15 ? '50 secrets' : stats.totalSecrets >= 5 ? '15 secrets' : '5 secrets'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-900 text-[11px] text-stone-500 font-cinzel">
            Honored title granted by the stones of the chamber.
          </div>
        </div>
      </div>

      {/* Mood Spectrum Breakdown */}
      <div className="bg-stone-950/70 border border-emerald-950/70 rounded-2xl p-6 space-y-4">
        <h3 className="font-cinzel text-sm uppercase tracking-wider text-amber-300 font-bold flex items-center gap-2">
          <span>Emotional Resonance Distribution</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {MOODS.map((m) => {
            const count = stats.moodCounts[m.id] || 0;
            const pct = stats.totalSecrets > 0 ? Math.round((count / stats.totalSecrets) * 100) : 0;
            return (
              <div
                key={m.id}
                className="p-3 rounded-xl border border-stone-900 bg-stone-950/50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1.5 font-cinzel">
                    <span>{m.icon}</span>
                    <span className="text-stone-300">{m.label}</span>
                  </span>
                  <span className="font-mono text-stone-500">{count}</span>
                </div>
                <div className="mt-3 w-full bg-stone-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: m.colorHex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
