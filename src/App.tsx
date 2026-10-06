import React, { useState, useEffect } from 'react';
import { ChamberTab, DiaryEntry, ChamberSettings } from './types/diary';
import {
  loadEntries,
  saveSingleEntry,
  deleteEntry as removeEntry,
  saveEntries,
  loadSettings,
  saveSettings,
  getHasEnteredChamber,
  setHasEnteredChamber,
} from './utils/storage';
import { chamberAudio } from './utils/audio';
import { ParticleBackground } from './components/ParticleBackground';
import { MagicalNavbar } from './components/MagicalNavbar';
import { LandingPage } from './components/LandingPage';
import { ChamberDashboard } from './components/ChamberDashboard';
import { DiaryEditor } from './components/DiaryEditor';
import { MemoryVault } from './components/MemoryVault';
import { MagicalCalendar } from './components/MagicalCalendar';
import { SecretStats } from './components/SecretStats';
import { SettingsPanel } from './components/SettingsPanel';
import { LockScreen } from './components/LockScreen';
import { EasterEggsModal } from './components/EasterEggsModal';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [settings, setSettings] = useState<ChamberSettings>({
    pinCode: null,
    isLocked: false,
    soundEnabled: true,
    particlesEnabled: true,
    hidePreviews: false,
  });

  const [activeTab, setActiveTab] = useState<ChamberTab>('chamber');
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [initialEditorPrompt, setInitialEditorPrompt] = useState<string | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedEntries = loadEntries();
    const loadedSettings = loadSettings();
    const previouslyEntered = getHasEnteredChamber();

    setEntries(loadedEntries);
    setSettings(loadedSettings);
    chamberAudio.setMuted(!loadedSettings.soundEnabled);

    // If already entered and has PIN, lock on initial page load for privacy
    if (previouslyEntered) {
      setHasEntered(true);
      if (loadedSettings.pinCode) {
        setSettings((prev) => ({ ...prev, isLocked: true }));
      }
    }
  }, []);

  const handleEnterChamber = () => {
    setHasEntered(true);
    setHasEnteredChamber(true);
    if (settings.pinCode) {
      setSettings((prev) => ({ ...prev, isLocked: true }));
    }
  };

  const handleUpdateSettings = (newSettings: ChamberSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    chamberAudio.setMuted(!newSettings.soundEnabled);
  };

  const handleToggleMute = () => {
    const nextMuted = !chamberAudio.getMuted();
    chamberAudio.setMuted(nextMuted);
    handleUpdateSettings({ ...settings, soundEnabled: !nextMuted });
  };

  const handleLockChamber = () => {
    if (settings.pinCode) {
      handleUpdateSettings({ ...settings, isLocked: true });
    } else {
      setActiveTab('settings');
    }
  };

  const handleUnlockChamber = () => {
    handleUpdateSettings({ ...settings, isLocked: false });
  };

  const handleSaveEntry = (entry: DiaryEntry) => {
    const updated = saveSingleEntry(entry);
    setEntries(updated);
    setEditingEntry(null);
    setInitialEditorPrompt(null);
    setActiveTab('vault');
  };

  const handleDeleteEntry = (id: string) => {
    const updated = removeEntry(id);
    setEntries(updated);
  };

  const handleClearAllEntries = () => {
    saveEntries([]);
    setEntries([]);
  };

  const handleStartNewSecret = (initialText?: string) => {
    setEditingEntry(null);
    if (initialText) {
      setEditingEntry({
        id: `entry-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: 'Whisper of the Chamber',
        content: `Prompt: ${initialText}\n\n`,
        mood: 'thoughtful',
        tags: ['Secret', 'Memories'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSealed: false,
      });
    }
    setActiveTab('diary');
  };

  const handleStartNewEntryForDate = (dateStr: string) => {
    setEditingEntry({
      id: `entry-${Date.now()}`,
      date: dateStr,
      title: 'Memories of ' + dateStr,
      content: '',
      mood: 'enchanted',
      tags: ['Memories'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSealed: false,
    });
    setActiveTab('diary');
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setActiveTab('diary');
  };

  // If user hasn't entered through the door yet
  if (!hasEntered) {
    return (
      <>
        <ParticleBackground enabled={settings.particlesEnabled} />
        <LandingPage
          onEnter={handleEnterChamber}
          isMuted={!settings.soundEnabled}
          onToggleMute={handleToggleMute}
        />
      </>
    );
  }

  // If chamber is PIN locked
  if (settings.isLocked && settings.pinCode) {
    return (
      <>
        <ParticleBackground enabled={settings.particlesEnabled} />
        <LockScreen pinCode={settings.pinCode} onUnlock={handleUnlockChamber} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b09] text-amber-100 flex flex-col font-sans selection:bg-emerald-950 selection:text-emerald-200">
      {/* Floating Canvas Particles */}
      <ParticleBackground enabled={settings.particlesEnabled} />

      {/* Top Navigation Bar with Top Bar Contract */}
      <MagicalNavbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'diary' && activeTab !== 'diary') {
            setEditingEntry(null);
          }
          setActiveTab(tab);
        }}
        isMuted={!settings.soundEnabled}
        onToggleMute={handleToggleMute}
        hasPin={Boolean(settings.pinCode)}
        onLockChamber={handleLockChamber}
        onNewSecretClick={() => handleStartNewSecret()}
      />

      {/* Main Chamber Viewport Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-20">
        {activeTab === 'chamber' && (
          <ChamberDashboard
            entries={entries}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNewDiary={handleStartNewSecret}
            onSelectEntry={(entry) => {
              setEditingEntry(entry);
              setActiveTab('diary');
            }}
            onTriggerEasterEgg={() => setShowEasterEgg(true)}
          />
        )}

        {activeTab === 'diary' && (
          <DiaryEditor
            initialEntry={editingEntry}
            onSave={handleSaveEntry}
            onCancel={() => {
              setEditingEntry(null);
              setActiveTab('chamber');
            }}
          />
        )}

        {activeTab === 'vault' && (
          <MemoryVault
            entries={entries}
            hidePreviews={settings.hidePreviews}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onOpenNewDiary={() => handleStartNewSecret()}
          />
        )}

        {activeTab === 'calendar' && (
          <MagicalCalendar
            entries={entries}
            onSelectEntry={(entry) => {
              setEditingEntry(entry);
              setActiveTab('diary');
            }}
            onNewEntryForDate={handleStartNewEntryForDate}
          />
        )}

        {activeTab === 'stats' && <SecretStats entries={entries} />}

        {activeTab === 'settings' && (
          <SettingsPanel
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClearAllEntries={handleClearAllEntries}
            onTriggerEasterEgg={() => setShowEasterEgg(true)}
          />
        )}
      </main>

      {/* Atmospheric Chamber Footer */}
      <footer className="border-t border-emerald-950/60 bg-black/90 py-6 text-xs text-stone-500 font-cinzel relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">🐍</span>
            <span>Chamber of Secrets · Ancient Castle Sanctuary</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <button
              onClick={() => setShowEasterEgg(true)}
              className="hover:text-amber-300 transition-colors cursor-pointer text-[11px]"
            >
              Whisper Lore ᚛
            </button>
            <span aria-hidden="true">·</span>
            <span>Local Browser Isolation</span>
          </div>
        </div>
      </footer>

      {/* Easter Egg Lore & Spell Modal */}
      <EasterEggsModal isOpen={showEasterEgg} onClose={() => setShowEasterEgg(false)} />
    </div>
  );
}
