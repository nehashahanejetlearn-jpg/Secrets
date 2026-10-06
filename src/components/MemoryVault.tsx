import React, { useState, useMemo } from 'react';
import { Search, Calendar, Filter, ArrowUpDown, Trash2, Edit3, X, BookOpen, Clock } from 'lucide-react';
import { DiaryEntry, MoodType } from '../types/diary';
import { MOODS, getMoodConfig } from '../utils/constants';
import { chamberAudio } from '../utils/audio';

interface MemoryVaultProps {
  entries: DiaryEntry[];
  hidePreviews: boolean;
  onEditEntry: (entry: DiaryEntry) => void;
  onDeleteEntry: (id: string) => void;
  onOpenNewDiary: () => void;
}

export const MemoryVault: React.FC<MemoryVaultProps> = ({
  entries,
  hidePreviews,
  onEditEntry,
  onDeleteEntry,
  onOpenNewDiary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [activeReadingEntry, setActiveReadingEntry] = useState<DiaryEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => (e.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [entries]);

  // Filtered & sorted entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = e.title.toLowerCase().includes(q);
          const matchesContent = e.content.toLowerCase().includes(q);
          const matchesTag = (e.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesContent && !matchesTag) return false;
        }

        // Mood filter
        if (selectedMood !== 'all' && e.mood !== selectedMood) {
          return false;
        }

        // Tag filter
        if (selectedTag !== 'all' && !(e.tags || []).includes(selectedTag)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [entries, searchQuery, selectedMood, selectedTag, sortOrder]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    chamberAudio.playChime(300);
    onDeleteEntry(id);
    setDeleteConfirmId(null);
    if (activeReadingEntry?.id === id) {
      setActiveReadingEntry(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Vault Header Title Lockup */}
      <div className="border-b border-emerald-950/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wider">
            THE MEMORY VAULT
          </h2>
          <p className="font-fell italic text-xs sm:text-sm text-stone-400 mt-1">
            Archived parchment scrolls preserved beyond the reach of time.
          </p>
        </div>

        <button
          onClick={() => {
            chamberAudio.playPageFlip();
            onOpenNewDiary();
          }}
          className="self-start sm:self-auto px-4 py-2 rounded-lg font-cinzel text-xs font-bold tracking-wider text-amber-200 bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer whitespace-nowrap"
        >
          + Inscribe New Scroll
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3 bg-stone-950/70 p-4 rounded-xl border border-emerald-950/60">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search your memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900/90 border border-stone-800 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-amber-200 placeholder:text-stone-500 font-sans focus:outline-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort order toggle button */}
          <button
            onClick={() => {
              chamberAudio.playChime(500);
              setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
            }}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-xs font-cinzel text-stone-300 hover:text-amber-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Sort: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>

        {/* Filter Controls Row: Interactive Filter Tabs */}
        <div className="pt-2 border-t border-stone-900 flex flex-wrap items-center gap-2">
          <span className="font-cinzel text-[11px] text-stone-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-emerald-400" />
            <span>Mood:</span>
          </span>

          <button
            onClick={() => {
              chamberAudio.playChime(480);
              setSelectedMood('all');
            }}
            className={`px-2.5 py-1 rounded text-xs font-cinzel transition-all cursor-pointer ${
              selectedMood === 'all'
                ? 'bg-emerald-950 text-amber-200 border border-emerald-600/50 font-bold'
                : 'text-stone-400 hover:text-stone-200 bg-stone-900/40 border border-stone-800/80'
            }`}
          >
            All Moods
          </button>

          {MOODS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  chamberAudio.playChime(520);
                  setSelectedMood(m.id);
                }}
                className={`px-2.5 py-1 rounded text-xs font-cinzel transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? `${m.borderClass} ${m.bgClass} text-amber-100 font-bold shadow-[0_0_8px_${m.glowColor}]`
                    : 'text-stone-400 hover:text-stone-200 bg-stone-900/40 border border-stone-800/80'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tag Filter Row */}
        {allTags.length > 0 && (
          <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-cinzel text-[11px] text-stone-400 uppercase tracking-wider mr-1">
              Tag:
            </span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-cinzel transition-colors cursor-pointer ${
                selectedTag === 'all'
                  ? 'bg-amber-950/60 text-amber-200 border border-amber-600/50'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  chamberAudio.playChime(500);
                  setSelectedTag(selectedTag === tag ? 'all' : tag);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-cinzel transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-amber-950/60 text-amber-200 border border-amber-600/50 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Memory Vault Floating Cards Grid */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 rounded-xl border border-dashed border-stone-800 bg-stone-950/30 text-center space-y-3">
          <BookOpen className="w-10 h-10 mx-auto text-stone-600" />
          <p className="font-fell italic text-base text-stone-400">
            No memories match your query inside the Vault.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMood('all');
              setSelectedTag('all');
            }}
            className="text-xs font-cinzel text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEntries.map((entry) => {
            const moodConf = getMoodConfig(entry.mood);
            return (
              <div
                key={entry.id}
                onClick={() => {
                  chamberAudio.playPageFlip();
                  setActiveReadingEntry(entry);
                }}
                className="group relative p-5 rounded-xl border border-emerald-950/70 bg-gradient-to-b from-[#131714] via-[#0d110f] to-[#0a0d0c] hover:border-emerald-600/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_24px_rgba(16,185,129,0.25)] flex flex-col justify-between"
              >
                {/* Floating Parchment Accent Border */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: `inset 0 0 15px ${moodConf.glowColor}`,
                  }}
                />

                <div>
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-amber-300/90">{entry.date}</span>
                      <span aria-hidden="true" className="opacity-40">·</span>
                      <span className="flex items-center gap-1 font-sans" style={{ color: moodConf.colorHex }}>
                        <span>{moodConf.icon}</span>
                        <span>{moodConf.label}</span>
                      </span>
                    </div>

                    <span className="text-[11px] text-stone-600 font-mono">
                      {entry.wordCount || (entry.content ? entry.content.split(/\s+/).length : 0)}w
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-cinzel text-lg font-bold text-amber-100 group-hover:text-amber-200 transition-colors line-clamp-2">
                    {entry.title || 'Untitled Secret'}
                  </h3>

                  {/* Excerpt with preview privacy control */}
                  <div className="mt-3">
                    {hidePreviews ? (
                      <p className="font-fell italic text-stone-600 text-xs">
                        [Contents veiled by chamber privacy]
                      </p>
                    ) : (
                      <p className="font-fell italic text-stone-300/80 text-xs sm:text-sm line-clamp-4 leading-relaxed">
                        {entry.content}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags & Action Buttons */}
                <div className="mt-5 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500 overflow-hidden text-ellipsis whitespace-nowrap">
                    {(entry.tags || []).slice(0, 3).map((tag, idx) => (
                      <span key={tag}>
                        {idx > 0 && <span className="opacity-40 mr-1">·</span>}
                        #{tag}
                      </span>
                    ))}
                    {(entry.tags || []).length > 3 && <span>+{entry.tags.length - 3}</span>}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        chamberAudio.playChime(600);
                        onEditEntry(entry);
                      }}
                      className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-amber-200 transition-colors cursor-pointer"
                      title="Edit this scroll"
                      aria-label="Edit entry"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(entry.id);
                      }}
                      className="p-1.5 rounded hover:bg-rose-950/50 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Break seal / delete"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-stone-950 border border-rose-900/80 rounded-xl p-6 max-w-sm w-full text-center space-y-4 shadow-[0_0_40px_rgba(225,29,72,0.3)]">
            <Trash2 className="w-10 h-10 mx-auto text-rose-500" />
            <h4 className="font-cinzel text-lg font-bold text-amber-100">
              Break This Seal Forever?
            </h4>
            <p className="font-fell italic text-xs text-stone-400">
              Once dissolved, this private memory cannot be summoned again.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-stone-900 border border-stone-800 text-xs font-cinzel text-stone-300 hover:text-white cursor-pointer"
              >
                Keep Sealed
              </button>
              <button
                onClick={(e) => handleDelete(deleteConfirmId, e)}
                className="px-4 py-2 rounded-lg bg-rose-950 border border-rose-700 text-xs font-cinzel text-rose-200 hover:bg-rose-900 cursor-pointer font-bold"
              >
                Dissolve Scroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Diary Reading View Modal */}
      {activeReadingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#17130e] border-2 border-amber-900/60 rounded-2xl p-6 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.9)] space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setActiveReadingEntry(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-stone-400 hover:text-amber-200 border border-stone-800 transition-colors cursor-pointer"
              aria-label="Close scroll"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Reading Header */}
            <div className="border-b border-amber-900/30 pb-4 pr-8">
              <div className="flex items-center gap-3 text-xs text-amber-700/80 mb-2">
                <span className="font-cinzel">{activeReadingEntry.date}</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-sans">
                  <span>{getMoodConfig(activeReadingEntry.mood).icon}</span>
                  <span className="text-amber-300">
                    {getMoodConfig(activeReadingEntry.mood).label}
                  </span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>
                    {activeReadingEntry.wordCount || activeReadingEntry.content.split(/\s+/).length} words
                  </span>
                </span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-100 leading-snug">
                {activeReadingEntry.title || 'Untitled Secret'}
              </h2>
            </div>

            {/* Complete Content */}
            <div className="prose prose-invert max-w-none">
              <p className="font-fell italic text-base sm:text-lg text-amber-100/90 whitespace-pre-wrap leading-relaxed">
                {activeReadingEntry.content}
              </p>
            </div>

            {/* Tags list */}
            {activeReadingEntry.tags && activeReadingEntry.tags.length > 0 && (
              <div className="pt-4 border-t border-amber-900/20 flex flex-wrap gap-2">
                {activeReadingEntry.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded bg-stone-900/70 border border-amber-900/40 text-xs font-cinzel text-amber-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Footer action buttons */}
            <div className="pt-4 border-t border-amber-900/30 flex items-center justify-between">
              <button
                onClick={() => {
                  const toDelete = activeReadingEntry.id;
                  onDeleteEntry(toDelete);
                  setActiveReadingEntry(null);
                }}
                className="text-xs font-cinzel text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Scroll</span>
              </button>

              <button
                onClick={() => {
                  onEditEntry(activeReadingEntry);
                  setActiveReadingEntry(null);
                }}
                className="px-4 py-2 rounded-lg font-cinzel text-xs font-bold tracking-wider text-amber-200 bg-emerald-950 border border-emerald-600/50 hover:bg-emerald-900 cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit This Entry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
