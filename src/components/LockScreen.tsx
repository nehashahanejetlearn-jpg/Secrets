import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, KeyRound } from 'lucide-react';
import { chamberAudio } from '../utils/audio';

interface LockScreenProps {
  pinCode: string;
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ pinCode, onUnlock }) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const runes = [
    { num: '1', rune: 'ᚠ' },
    { num: '2', rune: 'ᚢ' },
    { num: '3', rune: 'ᚦ' },
    { num: '4', rune: 'ᚨ' },
    { num: '5', rune: 'ᚱ' },
    { num: '6', rune: 'ᚲ' },
    { num: '7', rune: 'ᚷ' },
    { num: '8', rune: 'ᚹ' },
    { num: '9', rune: 'ᚺ' },
    { num: '0', rune: 'ᛟ' },
  ];

  const handleDigit = (digit: string) => {
    chamberAudio.playChime(500 + Number(digit) * 30);
    setErrorMsg(false);
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);

      if (next.length === 4) {
        if (next === pinCode) {
          setIsUnlocking(true);
          chamberAudio.playLockClasp();
          setTimeout(() => {
            onUnlock();
          }, 800);
        } else {
          chamberAudio.playChime(250);
          setErrorMsg(true);
          setTimeout(() => {
            setEnteredPin('');
            setErrorMsg(false);
          }, 900);
        }
      }
    }
  };

  const handleBackspace = () => {
    chamberAudio.playChime(420);
    setEnteredPin(enteredPin.slice(0, -1));
    setErrorMsg(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm rounded-2xl border border-emerald-900/80 bg-stone-950 p-8 text-center space-y-6 shadow-[0_0_60px_rgba(16,185,129,0.25)]">
        {/* Padlock Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border-2 border-amber-400/80 flex items-center justify-center text-amber-200 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
          {isUnlocking ? (
            <Unlock className="w-8 h-8 text-emerald-400 animate-bounce" />
          ) : (
            <Lock className="w-8 h-8 text-amber-400" />
          )}
        </div>

        <div>
          <h2 className="font-cinzel text-xl font-bold text-amber-100 tracking-wider">
            {isUnlocking ? 'SEAL DISENGAGED' : 'CHAMBER LOCKED'}
          </h2>
          <p className="font-fell italic text-xs text-stone-400 mt-1">
            “Your secrets remain inside this chamber.”
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex items-center justify-center gap-3 py-2">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = enteredPin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                  errorMsg
                    ? 'border-rose-500 bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                    : isFilled
                    ? 'border-amber-400 bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)] scale-110'
                    : 'border-stone-700 bg-stone-900'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <p className="text-xs font-cinzel text-rose-400 animate-shake">
            Incorrect Rune Sequence
          </p>
        )}

        {/* 10-key Rune Pad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto pt-2">
          {runes.slice(0, 9).map((r) => (
            <button
              key={r.num}
              onClick={() => handleDigit(r.num)}
              className="p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:bg-emerald-950/40 hover:border-emerald-600/60 text-amber-100 font-cinzel text-sm font-bold transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-stone-500 text-[10px] font-fell leading-none">{r.rune}</span>
              <span className="mt-0.5">{r.num}</span>
            </button>
          ))}

          {/* Empty or helper */}
          <div className="p-3 flex items-center justify-center text-stone-600 text-xs font-cinzel">
            ⚕
          </div>

          {/* 0 */}
          <button
            onClick={() => handleDigit('0')}
            className="p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:bg-emerald-950/40 hover:border-emerald-600/60 text-amber-100 font-cinzel text-sm font-bold transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center"
          >
            <span className="text-stone-500 text-[10px] font-fell leading-none">ᛟ</span>
            <span className="mt-0.5">0</span>
          </button>

          {/* Backspace */}
          <button
            onClick={handleBackspace}
            className="p-3 rounded-xl border border-stone-800 bg-stone-900/60 hover:bg-stone-800 text-stone-400 hover:text-stone-200 font-cinzel text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center"
            aria-label="Delete last digit"
          >
            ⌫
          </button>
        </div>

        <p className="text-[11px] text-stone-500 font-sans">
          Enter the 4-digit rune code you set in Sanctuary Settings.
        </p>
      </div>
    </div>
  );
};
