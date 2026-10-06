import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Tag, Sparkles, Check, ArrowLeft, Eye, EyeOff, ShieldCheck, Feather } from 'lucide-react';
import { DiaryEntry, MoodType } from '../types/diary';
import { MOODS, SUGGESTED_TAGS, getMoodConfig } from '../utils/constants';
import { CandleFlame } from './CandleFlame';
import { chamberAudio } from '../utils/audio';

interface DiaryEditorProps {
  initialEntry?: DiaryEntry | null;
  onSave: (entry: DiaryEntry) => void;
  onCancel: () => void;
}

const PARCHMENT_IMAGE = '/src/assets/images/ancient_parchment_texture_1791302473571.jpg';

export const DiaryEditor: React.FC<DiaryEditorProps> = ({
  initialEntry,
  onSave,
  onCancel,
}) => {
  const [date, setDate] = useState<string>(
    initialEntry ? initialEntry.date : new Date().toISOString().split('T')[0]
  );
  const [mood, setMood] = useState<MoodType>(initialEntry ? initialEntry.mood : 'enchanted');
  const [title, setTitle] = useState<string>(initialEntry ? initialEntry.title : '');
  const [content, setContent] = useState<string>(initialEntry ? initialEntry.content : '');
  const [tags, setTags] = useState<string[]>(initialEntry ? initialEntry.tags || [] : ['Secret']);
  const [customTagInput, setCustomTagInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSealing, setIsSealing] = useState<boolean>(false);
  const [sealSuccess, setSealSuccess] = useState<boolean>(false);
  const [isInvisibleCloak, setIsInvisibleCloak] = useState<boolean>(false);
  const [parchmentImgError, setParchmentImgError] = useState(false);

  const typingTimeoutRef = useRef<number | null>(null);
  const activeMoodConfig = getMoodConfig(mood);

  // Handle typing activity indicator
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsTyping(true);
    chamberAudio.playQuillWrite();

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTagToggle = (tag: string) => {
    chamberAudio.playChime(600);
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customTagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      chamberAudio.playChime(680);
      setTags([...tags, clean]);
      setCustomTagInput('');
    }
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    setIsSealing(true);
    chamberAudio.playSpellSeal();

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const entryToSave: DiaryEntry = {
      id: initialEntry ? initialEntry.id : `entry-${Date.now()}`,
      date,
      title: title.trim() || 'Untitled Secret',
      content: content.trim(),
      mood,
      tags,
      createdAt: initialEntry ? initialEntry.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSealed: true,
      wordCount,
    };

    // Show satisfying sealing animation before completing
    setTimeout(() => {
      setSealSuccess(true);
      setTimeout(() => {
        onSave(entryToSave);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="relative max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Action & Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/60 pb-4">
        <button
          onClick={() => {
            chamberAudio.playChime(420);
            onCancel();
          }}
          className="inline-flex items-center gap-2 text-xs font-cinzel text-stone-400 hover:text-amber-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Sanctum</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Privacy Blur Toggle */}
          <button
            onClick={() => setIsInvisibleCloak(!isInvisibleCloak)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-800 bg-stone-950 text-xs font-cinzel text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
            title="Conceal writing with an Invisibility Cloak"
          >
            {isInvisibleCloak ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isInvisibleCloak ? 'Cloak Active' : 'Invisibility Cloak'}</span>
          </button>

          {/* Seal / Save Button */}
          <button
            onClick={handleSave}
            disabled={isSealing || (!title.trim() && !content.trim())}
            className={`px-5 py-2 rounded-lg font-cinzel text-xs font-bold tracking-wider text-amber-200 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-amber-400/60 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all cursor-pointer flex items-center gap-2 ${
              isSealing || (!title.trim() && !content.trim())
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-[1.02]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{initialEntry ? 'UPDATE SECRET' : 'SEAL SECRET'}</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Desk Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-950/70 p-4 rounded-xl border border-emerald-950/60">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-amber-400" />
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs text-stone-400 uppercase tracking-wider">Date of Inscription:</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-stone-900 border border-stone-700/80 rounded px-2.5 py-1 text-xs text-amber-200 font-cinzel focus:outline-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Typing Aura Indicator */}
        <div className="flex items-center gap-2 text-xs font-fell italic">
          <span
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isTyping ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(245,158,11,1)]' : 'bg-emerald-800'
            }`}
          />
          <span className={isTyping ? 'text-amber-300 font-semibold' : 'text-stone-400'}>
            {isTyping ? 'The Chamber is listening…' : 'Quiet in the vaults'}
          </span>
        </div>
      </div>

      {/* Mood Selector Bar */}
      <div className="space-y-2 bg-stone-950/50 p-4 rounded-xl border border-stone-900">
        <span className="font-cinzel text-xs uppercase tracking-wider text-stone-400 font-semibold block">
          Current Magical Mood
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {MOODS.map((m) => {
            const isSelected = mood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  chamberAudio.playChime(500);
                  setMood(m.id);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-cinzel transition-all cursor-pointer ${
                  isSelected
                    ? `${m.borderClass} ${m.bgClass} shadow-[0_0_15px_${m.glowColor}] text-amber-100 font-bold scale-105`
                    : 'border-stone-800/80 bg-stone-900/40 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                <span className="text-lg mb-1">{m.icon}</span>
                <span className="text-[11px] truncate w-full text-center">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Central Enchanted Parchment Desk */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-amber-900/40 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
        {/* Left and Right Flanking Torches / Candles */}
        <div className="absolute top-6 left-4 z-20 hidden md:block">
          <CandleFlame size="md" />
        </div>
        <div className="absolute top-6 right-4 z-20 hidden md:block">
          <CandleFlame size="md" />
        </div>

        {/* Parchment Background */}
        <div className="relative bg-[#16120d] min-h-[480px] p-6 sm:p-12 md:px-20 text-[#2c2219]">
          {/* Subtle antique parchment paper graphic */}
          {!parchmentImgError ? (
            <img
              src={PARCHMENT_IMAGE}
              alt="Antique parchment background"
              className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-125 opacity-30 pointer-events-none mix-blend-overlay"
              referrerPolicy="no-referrer"
              onError={() => setParchmentImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#211a14] opacity-80" />
          )}

          {/* Ancient Corner Filigree Ornaments */}
          <div className="absolute top-3 left-3 text-amber-700/30 text-xs font-cinzel pointer-events-none">╔</div>
          <div className="absolute top-3 right-3 text-amber-700/30 text-xs font-cinzel pointer-events-none">╗</div>
          <div className="absolute bottom-3 left-3 text-amber-700/30 text-xs font-cinzel pointer-events-none">╚</div>
          <div className="absolute bottom-3 right-3 text-amber-700/30 text-xs font-cinzel pointer-events-none">╝</div>

          <div className="relative z-10 space-y-4">
            {/* Title Input Field */}
            <div>
              <input
                type="text"
                placeholder="Title of Secret… (e.g. An Unexpected Adventure)"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  chamberAudio.playQuillWrite();
                }}
                className="w-full bg-transparent border-b border-amber-900/30 px-1 py-2 font-cinzel text-xl sm:text-2xl font-bold text-amber-100 placeholder:text-stone-600 focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            {/* Secret Content Textarea */}
            <div className="relative">
              <textarea
                rows={12}
                value={content}
                onChange={handleContentChange}
                placeholder="Write what happened today...&#10;Your secrets are safe inside the chamber."
                className={`w-full bg-transparent p-2 font-fell italic text-base sm:text-lg text-amber-100 placeholder:text-stone-600 focus:outline-none resize-y leading-relaxed parchment-editor ${
                  isInvisibleCloak ? 'filter blur-md select-none' : ''
                }`}
                style={{ minHeight: '260px' }}
              />

              {isInvisibleCloak && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/80 px-4 py-2 rounded-lg border border-amber-500/40 text-amber-300 font-cinzel text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Concealed by Invisibility Cloak</span>
                  </div>
                </div>
              )}
            </div>

            {/* Live Word Count & Reading Time */}
            <div className="pt-2 flex items-center justify-between text-xs text-stone-500 font-cinzel border-t border-amber-900/20">
              <span className="flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-stone-600" />
                <span>
                  {content.trim().split(/\s+/).filter(Boolean).length} Words Etched
                </span>
              </span>
              <span>
                Mood Resonance: <span style={{ color: activeMoodConfig.colorHex }}>{activeMoodConfig.label}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Magical Tags Section */}
      <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-900 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-cinzel text-xs uppercase tracking-wider text-stone-400 font-semibold flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Magical Tags</span>
          </span>
          <span className="text-[11px] text-stone-500">Attach affinities to your memory</span>
        </div>

        {/* Tag pills as interactive filter/selection buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {SUGGESTED_TAGS.map((tag) => {
            const isSelected = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-md text-xs font-cinzel transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-950 text-amber-200 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)] font-semibold'
                    : 'bg-stone-900/60 text-stone-400 border border-stone-800 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        {/* Custom Tag Input */}
        <form onSubmit={handleAddCustomTag} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Add custom rune/tag..."
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            className="bg-stone-900/80 border border-stone-800 rounded px-3 py-1 text-xs text-amber-200 font-sans focus:outline-emerald-500"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-xs font-cinzel text-stone-200 transition-colors cursor-pointer"
          >
            + Add
          </button>
        </form>
      </div>

      {/* Sealing Modal Animation */}
      {isSealing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative p-8 rounded-2xl bg-stone-950 border border-emerald-500/60 shadow-[0_0_60px_rgba(16,185,129,0.5)] max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border-2 border-amber-400 flex items-center justify-center text-amber-200 text-2xl shadow-[0_0_30px_rgba(212,175,55,0.7)] animate-gold-pulse">
              {sealSuccess ? <Check className="w-8 h-8 text-emerald-400" /> : '⚕'}
            </div>

            <h3 className="font-cinzel text-xl font-bold text-amber-100">
              {sealSuccess ? 'Secret Sealed' : 'Binding the Parchment…'}
            </h3>

            <p className="font-fell italic text-stone-300 text-sm leading-relaxed">
              “Your secret has been sealed inside the Chamber.”
            </p>

            <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full w-full animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
