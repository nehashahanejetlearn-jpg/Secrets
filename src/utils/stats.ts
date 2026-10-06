import { DiaryEntry, MoodType } from '../types/diary';
import { getMoodConfig } from './constants';

export interface SecretStatsData {
  totalSecrets: number;
  currentStreak: number;
  longestStreak: number;
  entriesThisMonth: number;
  mostCommonMood: {
    mood: MoodType | null;
    label: string;
    icon: string;
    count: number;
  };
  mostUsedTag: {
    tag: string | null;
    count: number;
  };
  totalWords: number;
  moodCounts: Record<MoodType, number>;
  tagCounts: Record<string, number>;
}

export const calculateStats = (entries: DiaryEntry[]): SecretStatsData => {
  const totalSecrets = entries.length;

  if (totalSecrets === 0) {
    return {
      totalSecrets: 0,
      currentStreak: 0,
      longestStreak: 0,
      entriesThisMonth: 0,
      mostCommonMood: { mood: null, label: 'None', icon: '✨', count: 0 },
      mostUsedTag: { tag: null, count: 0 },
      totalWords: 0,
      moodCounts: {} as Record<MoodType, number>,
      tagCounts: {},
    };
  }

  // Word count & mood & tag counts
  let totalWords = 0;
  const moodCounts: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  let entriesThisMonth = 0;

  // Set of dates with entries (normalized YYYY-MM-DD)
  const entryDateSet = new Set<string>();

  entries.forEach((e) => {
    // Word count estimation
    const words = e.content ? e.content.trim().split(/\s+/).filter(Boolean).length : 0;
    totalWords += words;

    // Moods
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;

    // Tags
    (e.tags || []).forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });

    // Date
    if (e.date) {
      entryDateSet.add(e.date);
      const [year, month] = e.date.split('-').map(Number);
      if (year === currentYear && month === currentMonth + 1) {
        entriesThisMonth++;
      }
    }
  });

  // Calculate Most Common Mood
  let topMood: MoodType = 'enchanted';
  let topMoodCount = 0;
  Object.entries(moodCounts).forEach(([m, count]) => {
    if (count > topMoodCount) {
      topMoodCount = count;
      topMood = m as MoodType;
    }
  });
  const topMoodConf = getMoodConfig(topMood);

  // Calculate Most Used Tag
  let topTag: string | null = null;
  let topTagCount = 0;
  Object.entries(tagCounts).forEach(([tag, count]) => {
    if (count > topTagCount) {
      topTagCount = count;
      topTag = tag;
    }
  });

  // Calculate Streaks
  // Sort distinct dates descending
  const sortedDates = Array.from(entryDateSet).sort(); // chronological ascending

  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  sortedDates.forEach((dStr) => {
    const cur = new Date(dStr + 'T00:00:00');
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((cur.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = cur;
  });

  // Calculate Current Streak from today or yesterday
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let checkDate = entryDateSet.has(todayStr)
    ? new Date(todayStr + 'T00:00:00')
    : entryDateSet.has(yesterdayStr)
    ? new Date(yesterdayStr + 'T00:00:00')
    : null;

  if (checkDate) {
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (entryDateSet.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return {
    totalSecrets,
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    entriesThisMonth,
    mostCommonMood: {
      mood: topMood,
      label: topMoodConf.label,
      icon: topMoodConf.icon,
      count: topMoodCount,
    },
    mostUsedTag: {
      tag: topTag,
      count: topTagCount,
    },
    totalWords,
    moodCounts: moodCounts as Record<MoodType, number>,
    tagCounts,
  };
};
