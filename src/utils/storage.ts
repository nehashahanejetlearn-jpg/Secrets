import { ChamberSettings, DiaryEntry } from '../types/diary';

const ENTRIES_KEY = 'chamber_of_secrets_entries_v1';
const SETTINGS_KEY = 'chamber_of_secrets_settings_v1';
const HAS_ENTERED_KEY = 'chamber_of_secrets_has_entered_v1';

const DEFAULT_SETTINGS: ChamberSettings = {
  pinCode: null,
  isLocked: false,
  soundEnabled: true,
  particlesEnabled: true,
  hidePreviews: false,
};

// Seed sample entries so the user enters a living, magical grimoire
const SEED_ENTRIES: DiaryEntry[] = [
  {
    id: 'seed-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    title: 'The Whispering Tapestry in the Astronomy Tower',
    content:
      'Late last night, while tracing constellation orbits through the brass telescope, a soft murmuring arose from the silver-threaded tapestry behind the curved stone archway. It spoke of secret doors that only reveal themselves when the moonlight strikes at an exact angle of forty-two degrees.\n\nI traced the sigil into my pocket parchment. Even in silence, this castle holds centuries of whispers that only the patient can decipher.',
    mood: 'mysterious',
    tags: ['School', 'Astronomy', 'Secret'],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isSealed: true,
    wordCount: 78,
  },
  {
    id: 'seed-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    title: 'Concocting the Draught of Quiet Peace',
    content:
      'Today in potions study, we prepared powdered moonstone and stewed mandrake root over a low turquoise flame. The steam smelled of crushed lavender and rain on dry earth.\n\nFor the first time in weeks, my turbulent thoughts settled like still water. I felt deeply grateful for quiet companions and the gentle rhythm of the mortar and pestle.',
    mood: 'calm',
    tags: ['Potions', 'Memories', 'Achievement'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    isSealed: true,
    wordCount: 65,
  },
  {
    id: 'seed-3',
    date: new Date().toISOString().split('T')[0],
    title: 'A Glimpse Beyond the Gilded Serpent Gateway',
    content:
      'I found the hidden spiral descent down through moss-covered bedrock. Behind the serpentine seal lay this hidden vault—the Chamber of Secrets itself. Dust motes shimmered like suspended emeralds in the torchlight.\n\nHere, no prying gaze can decipher my inner thoughts. Everything I dare not utter to the hall can be etched permanently onto these enchanted pages.',
    mood: 'enchanted',
    tags: ['Adventure', 'Dreams', 'Secret'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isSealed: true,
    wordCount: 68,
  },
];

export const loadEntries = (): DiaryEntry[] => {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(SEED_ENTRIES));
      return SEED_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_ENTRIES;
  } catch (err) {
    console.error('Failed to load diary entries from storage:', err);
    return SEED_ENTRIES;
  }
};

export const saveEntries = (entries: DiaryEntry[]): void => {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error('Failed to save entries to localStorage:', err);
  }
};

export const saveSingleEntry = (entry: DiaryEntry): DiaryEntry[] => {
  const current = loadEntries();
  const index = current.findIndex((e) => e.id === entry.id);
  let updated: DiaryEntry[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...entry, updatedAt: new Date().toISOString() };
  } else {
    updated = [entry, ...current];
  }

  saveEntries(updated);
  return updated;
};

export const deleteEntry = (id: string): DiaryEntry[] => {
  const current = loadEntries();
  const updated = current.filter((e) => e.id !== id);
  saveEntries(updated);
  return updated;
};

export const loadSettings = (): ChamberSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load settings:', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: ChamberSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
};

export const getHasEnteredChamber = (): boolean => {
  try {
    return localStorage.getItem(HAS_ENTERED_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setHasEnteredChamber = (val: boolean): void => {
  try {
    localStorage.setItem(HAS_ENTERED_KEY, val ? 'true' : 'false');
  } catch {}
};

export const exportData = (): string => {
  const entries = loadEntries();
  const settings = loadSettings();
  return JSON.stringify({ entries, settings, exportDate: new Date().toISOString() }, null, 2);
};

export const importData = (jsonStr: string): boolean => {
  try {
    const data = JSON.parse(jsonStr);
    if (Array.isArray(data.entries)) {
      saveEntries(data.entries);
      if (data.settings) {
        saveSettings(data.settings);
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
