export type MoodType =
  | 'enchanted'
  | 'joyful'
  | 'adventurous'
  | 'calm'
  | 'mysterious'
  | 'frustrated'
  | 'grateful'
  | 'thoughtful';

export interface MoodConfig {
  id: MoodType;
  label: string;
  icon: string;
  colorHex: string;
  glowColor: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isSealed?: boolean;
  wordCount?: number;
}

export interface ChamberSettings {
  pinCode: string | null;
  isLocked: boolean;
  soundEnabled: boolean;
  particlesEnabled: boolean;
  hidePreviews: boolean;
}

export type ChamberTab = 'chamber' | 'diary' | 'vault' | 'calendar' | 'stats' | 'settings';
