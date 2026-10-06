import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen, PenTool } from 'lucide-react';
import { DiaryEntry } from '../types/diary';
import { getMoodConfig } from '../utils/constants';
import { chamberAudio } from '../utils/audio';

interface MagicalCalendarProps {
  entries: DiaryEntry[];
  onSelectEntry: (entry: DiaryEntry) => void;
  onNewEntryForDate: (dateStr: string) => void;
}

export const MagicalCalendar: React.FC<MagicalCalendarProps> = ({
  entries,
  onSelectEntry,
  onNewEntryForDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Create entries by date map
  const entriesByDate = React.useMemo(() => {
    const map = new Map<string, DiaryEntry[]>();
    entries.forEach((e) => {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [entries]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate calendar grid days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    chamberAudio.playChime(460);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    chamberAudio.playChime(520);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    chamberAudio.playChime(500);
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Calendar Header Lockup */}
      <div className="border-b border-emerald-950/60 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wider">
            MAGICAL CALENDAR
          </h2>
          <p className="font-fell italic text-xs sm:text-sm text-stone-400 mt-1">
            Track secret revelations aligned with the celestial passage of time.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg border border-stone-800 bg-stone-900/80 text-xs font-cinzel text-stone-300 hover:text-amber-200 transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg border border-stone-800 bg-stone-900/80 text-stone-300 hover:text-amber-200 cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-cinzel font-bold text-sm sm:text-base text-amber-200 min-w-[130px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-stone-800 bg-stone-900/80 text-stone-300 hover:text-amber-200 cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mood Glow Legend */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-stone-950/60 border border-stone-900 text-xs font-cinzel text-stone-400">
        <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold mr-1">
          Aura Resonances:
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span>Enchanted</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
          <span>Joyful</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
          <span>Calm</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          <span>Mysterious</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.8)]" />
          <span>Adventurous</span>
        </span>
      </div>

      {/* The Calendar Grid */}
      <div className="bg-stone-950/80 border border-emerald-950/80 rounded-2xl p-4 sm:p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-2 mb-3 text-center">
          {daysOfWeek.map((day) => (
            <div key={day} className="font-cinzel text-xs uppercase tracking-wider text-stone-500 font-bold py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-2">
          {/* Days from previous month */}
          {Array.from({ length: firstDayIndex }).map((_, i) => {
            const prevDayNum = daysInPrevMonth - firstDayIndex + i + 1;
            return (
              <div
                key={`prev-${i}`}
                className="min-h-[80px] sm:min-h-[100px] p-2 rounded-xl border border-stone-900/40 bg-stone-950/20 opacity-30 select-none text-stone-600 font-cinzel text-xs"
              >
                {prevDayNum}
              </div>
            );
          })}

          {/* Current Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(dayNum).padStart(2, '0');
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            const dayEntries = entriesByDate.get(dateStr) || [];
            const hasEntry = dayEntries.length > 0;
            const isToday = dateStr === todayStr;

            // Dominant entry mood for glow
            const primaryEntry = dayEntries[0];
            const moodConf = primaryEntry ? getMoodConfig(primaryEntry.mood) : null;

            return (
              <div
                key={`curr-${dayNum}`}
                onClick={() => {
                  if (hasEntry) {
                    chamberAudio.playPageFlip();
                    onSelectEntry(dayEntries[0]);
                  } else {
                    chamberAudio.playChime(540);
                    onNewEntryForDate(dateStr);
                  }
                }}
                className={`relative min-h-[80px] sm:min-h-[105px] p-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                  hasEntry
                    ? 'border-emerald-600/50 bg-stone-900/70 hover:border-emerald-400 hover:scale-[1.02]'
                    : isToday
                    ? 'border-amber-500/50 bg-stone-950/90 hover:border-amber-400'
                    : 'border-stone-900 bg-stone-950/40 hover:border-stone-700 hover:bg-stone-900/30'
                }`}
                style={
                  hasEntry && moodConf
                    ? {
                        boxShadow: `0 0 16px ${moodConf.glowColor}`,
                      }
                    : undefined
                }
              >
                {/* Date Number and Today Tag */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-cinzel text-xs sm:text-sm font-bold ${
                      isToday
                        ? 'text-amber-300'
                        : hasEntry
                        ? 'text-amber-100'
                        : 'text-stone-400 group-hover:text-stone-200'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>

                {/* Secret Indicator / Content preview snippet */}
                {hasEntry ? (
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs" style={{ filter: `drop-shadow(0 0 4px ${moodConf?.glowColor})` }}>
                        {moodConf?.icon || '✨'}
                      </span>
                      <span className="text-[10px] font-cinzel text-amber-200/90 truncate max-w-[85%] font-medium">
                        {primaryEntry.title}
                      </span>
                    </div>

                    {dayEntries.length > 1 && (
                      <span className="text-[9px] font-mono text-emerald-400/80">
                        +{dayEntries.length - 1} more
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-auto flex items-center gap-1 text-[10px] text-stone-500 font-cinzel">
                    <PenTool className="w-2.5 h-2.5 text-emerald-500" />
                    <span>Inscribe</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
