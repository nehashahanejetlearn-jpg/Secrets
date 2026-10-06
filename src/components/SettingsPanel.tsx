import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, Volume2, VolumeX, Sparkles, Download, Upload, Trash2, Check, AlertCircle } from 'lucide-react';
import { ChamberSettings } from '../types/diary';
import { exportData, importData } from '../utils/storage';
import { chamberAudio } from '../utils/audio';

interface SettingsPanelProps {
  settings: ChamberSettings;
  onUpdateSettings: (newSettings: ChamberSettings) => void;
  onClearAllEntries: () => void;
  onTriggerEasterEgg: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClearAllEntries,
  onTriggerEasterEgg,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPinForm, setShowPinForm] = useState(false);
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4 || !/^\d{4}$/.test(pinInput)) {
      setPinFeedback('PIN must be exactly 4 numeric digits');
      return;
    }
    chamberAudio.playLockClasp();
    onUpdateSettings({ ...settings, pinCode: pinInput, isLocked: false });
    setPinInput('');
    setShowPinForm(false);
    setPinFeedback('Rune PIN successfully bound to the Chamber.');
    setTimeout(() => setPinFeedback(null), 3000);
  };

  const handleRemovePin = () => {
    chamberAudio.playLockClasp();
    onUpdateSettings({ ...settings, pinCode: null, isLocked: false });
    setPinFeedback('Chamber seal removed. Diary is now freely accessible.');
    setTimeout(() => setPinFeedback(null), 3000);
  };

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    chamberAudio.setMuted(!next);
    if (next) chamberAudio.playChime(600);
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const handleToggleParticles = () => {
    chamberAudio.playChime(540);
    onUpdateSettings({ ...settings, particlesEnabled: !settings.particlesEnabled });
  };

  const handleTogglePreviews = () => {
    chamberAudio.playChime(500);
    onUpdateSettings({ ...settings, hidePreviews: !settings.hidePreviews });
  };

  const handleExport = () => {
    chamberAudio.playChime(640);
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chamber_of_secrets_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        chamberAudio.playSpellSeal();
        setImportStatus('Grimoire successfully restored from backup!');
        window.location.reload();
      } else {
        setImportStatus('Failed to read parchment file format.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-emerald-950/60 pb-4">
        <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-amber-100 tracking-wider">
          CHAMBER SANCTUARY SETTINGS
        </h2>
        <p className="font-fell italic text-xs sm:text-sm text-stone-400 mt-1">
          Safeguards, mystical privacy parameters, and arcane preferences.
        </p>
      </div>

      {/* Privacy Pledge Notice (Prompt Requirement) */}
      <div className="p-6 rounded-2xl border border-emerald-800/60 bg-gradient-to-r from-emerald-950/40 via-stone-950 to-emerald-950/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-300">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-cinzel text-base font-bold text-amber-200">
            “Your secrets remain inside this chamber.”
          </h3>
          <p className="font-fell italic text-xs sm:text-sm text-stone-300 leading-relaxed">
            All written entries and memories reside exclusively within this web browser’s local storage.
            No private text is ever dispatched to external servers, clouds, or third-party scribes.
          </p>
        </div>
      </div>

      {pinFeedback && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-600 text-xs font-cinzel text-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{pinFeedback}</span>
        </div>
      )}

      {/* Security & PIN Lock Configuration */}
      <div className="p-6 rounded-2xl border border-stone-900 bg-stone-950/70 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-cinzel text-sm font-bold text-amber-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Rune PIN Protection</span>
            </span>
            <p className="text-xs text-stone-400 font-sans">
              Require a 4-digit rune code to inspect or inscribe entries in this chamber.
            </p>
          </div>

          {settings.pinCode ? (
            <button
              onClick={handleRemovePin}
              className="px-3 py-1.5 rounded-lg border border-rose-900 bg-rose-950/40 text-xs font-cinzel text-rose-300 hover:bg-rose-900/60 transition-colors cursor-pointer"
            >
              Remove PIN
            </button>
          ) : (
            <button
              onClick={() => setShowPinForm(!showPinForm)}
              className="px-3 py-1.5 rounded-lg border border-emerald-700 bg-emerald-950 text-xs font-cinzel text-amber-200 hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              Set 4-Digit PIN
            </button>
          )}
        </div>

        {/* PIN Setup Form */}
        {showPinForm && (
          <form onSubmit={handleSetPin} className="pt-3 border-t border-stone-800 flex items-center gap-3">
            <input
              type="password"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              className="w-32 bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-center font-mono text-base tracking-widest text-amber-200 focus:outline-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-950 border border-emerald-600 text-xs font-cinzel text-amber-200 font-bold hover:bg-emerald-900 cursor-pointer"
            >
              Enchant PIN
            </button>
            <button
              type="button"
              onClick={() => setShowPinForm(false)}
              className="text-xs text-stone-500 hover:text-stone-300 font-cinzel cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Atmospheric & Accessibility Preferences */}
      <div className="p-6 rounded-2xl border border-stone-900 bg-stone-950/70 space-y-4">
        <h3 className="font-cinzel text-sm uppercase tracking-wider text-amber-300 font-bold">
          Chamber Atmosphere & Accessibility
        </h3>

        <div className="divide-y divide-stone-900">
          {/* Sound toggle */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-cinzel text-xs font-semibold text-stone-200">
                Mystical Soundscapes & Synthesized Chimes
              </p>
              <p className="text-[11px] text-stone-500">
                Resonant door slides, crystal bells, quill scratches, and spell seal gongs.
              </p>
            </div>
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                settings.soundEnabled
                  ? 'border-emerald-600 bg-emerald-950 text-emerald-300'
                  : 'border-stone-800 bg-stone-900 text-stone-500'
              }`}
              aria-label="Toggle audio"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Particles toggle */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-cinzel text-xs font-semibold text-stone-200">
                Floating Magical Motes & Embers
              </p>
              <p className="text-[11px] text-stone-500">
                Subtle golden particles and emerald mist floating through the interface.
              </p>
            </div>
            <button
              onClick={handleToggleParticles}
              className={`px-3 py-1 rounded-lg border text-xs font-cinzel transition-colors cursor-pointer ${
                settings.particlesEnabled
                  ? 'border-emerald-600 bg-emerald-950 text-emerald-300 font-bold'
                  : 'border-stone-800 bg-stone-900 text-stone-500'
              }`}
            >
              {settings.particlesEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Hide Previews in Vault */}
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-cinzel text-xs font-semibold text-stone-200">
                Veil Memory Snippets in Vault
              </p>
              <p className="text-[11px] text-stone-500">
                Masks text snippets on cards so glancing eyes cannot read your secrets.
              </p>
            </div>
            <button
              onClick={handleTogglePreviews}
              className={`px-3 py-1 rounded-lg border text-xs font-cinzel transition-colors cursor-pointer ${
                settings.hidePreviews
                  ? 'border-amber-600 bg-amber-950/60 text-amber-300 font-bold'
                  : 'border-stone-800 bg-stone-900 text-stone-500'
              }`}
            >
              {settings.hidePreviews ? 'Veiled' : 'Revealed'}
            </button>
          </div>
        </div>
      </div>

      {/* Backup, Export & Archival */}
      <div className="p-6 rounded-2xl border border-stone-900 bg-stone-950/70 space-y-4">
        <h3 className="font-cinzel text-sm uppercase tracking-wider text-amber-300 font-bold">
          Archival Scroll Portability
        </h3>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg border border-emerald-700 bg-emerald-950/80 hover:bg-emerald-900 text-xs font-cinzel text-amber-200 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Grimoire (JSON)</span>
          </button>

          <label className="px-4 py-2 rounded-lg border border-stone-700 bg-stone-900 hover:bg-stone-800 text-xs font-cinzel text-stone-300 flex items-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-stone-400" />
            <span>Restore From File</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>

        {importStatus && (
          <p className="text-xs font-cinzel text-amber-300 mt-2">{importStatus}</p>
        )}
      </div>

      {/* Danger Zone: Clear all secrets */}
      <div className="p-6 rounded-2xl border border-rose-950/80 bg-stone-950/40 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-cinzel text-sm font-bold text-rose-300">
              Dissolve All Chamber Records
            </h4>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Permanently purges all inscribed memories from this browser.
            </p>
          </div>

          {!clearConfirm ? (
            <button
              onClick={() => setClearConfirm(true)}
              className="px-3 py-1.5 rounded-lg border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/60 text-xs font-cinzel text-rose-400 cursor-pointer transition-colors"
            >
              Purge Vault
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setClearConfirm(false)}
                className="px-3 py-1 rounded bg-stone-900 text-xs text-stone-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  chamberAudio.playChime(300);
                  onClearAllEntries();
                  setClearConfirm(false);
                }}
                className="px-3 py-1 rounded bg-rose-800 text-xs font-bold text-white cursor-pointer"
              >
                Confirm Purge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
