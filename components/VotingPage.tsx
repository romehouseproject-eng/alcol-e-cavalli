
import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { Singer, VotersProgress } from '../types';

const TOTAL_TOKENS = 10;
const MAX_PER_SINGER = 4;

const UNLOCK_PASSWORDS: Record<number, string> = {
  1: "3742",
  2: "9132",
  3: "9111",
  4: "1119",
  5: "2234"
};

interface VotingPageProps {
  singers: Singer[];
  onConfirmBallot: (evening: number, sessionVotes: Record<number, number[]>) => void;
  onDeleteVote: (username: string, evening: number) => void;
  isAdmin: boolean;
  hiddenSingers: Record<number, number[]>;
  onToggleVisibility: (evening: number, singerId: number) => void;
  lockedVoting: Record<number, boolean>;
  onToggleVotingLock: (evening: number) => void;
  currentUser: string;
  onOpenLogin: () => void;
  votersProgress: VotersProgress;
}

export const VotingPage: React.FC<VotingPageProps> = ({ 
  singers,
  onConfirmBallot, 
  onDeleteVote,
  isAdmin, 
  hiddenSingers, 
  onToggleVisibility,
  lockedVoting,
  onToggleVotingLock,
  currentUser,
  onOpenLogin,
  votersProgress
}) => {
  const [selectedEvening, setSelectedEvening] = useState(1);
  const [localSessionVotes, setLocalSessionVotes] = useState<Record<number, number[]>>({});
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [isResetting, setIsResetting] = useState(false);
  const [unlockCode, setUnlockCode] = useState('');
  const [resetError, setResetError] = useState(false);

  const isLoggedOut = currentUser === 'Guest_1138';
  const hasAlreadyVoted = votersProgress[currentUser]?.[selectedEvening] === true;
  const isFourthEvening = selectedEvening === 4;
  const isCurrentEveningLocked = lockedVoting[selectedEvening];

  const totalSpentInSession = useMemo(() => {
    if (isFourthEvening) return 0;
    return Object.values(localSessionVotes).reduce((acc, valArray) => acc + (valArray[0] || 0), 0);
  }, [localSessionVotes, isFourthEvening]);

  const tokensLeftInSession = TOTAL_TOKENS - totalSpentInSession;

  const visibleSingers = useMemo(() => {
    const hiddenInEvening = hiddenSingers[selectedEvening] || [];
    if (isAdmin) return singers;
    return singers.filter(s => !hiddenInEvening.includes(s.id));
  }, [selectedEvening, hiddenSingers, isAdmin, singers]);

  const hasValidRatingInput = useMemo(() => {
    return Object.values(inputValues).some(val => {
      const num = parseFloat((val as string).replace(',', '.'));
      return !isNaN(num) && num >= 1 && num <= 10;
    });
  }, [inputValues]);

  const isCommitDisabled = useMemo(() => {
    if (isLoggedOut || hasAlreadyVoted) return true;
    if (isCurrentEveningLocked && !isAdmin) return true;
    if (isFourthEvening) {
      return !hasValidRatingInput;
    }
    return Object.keys(localSessionVotes).length === 0;
  }, [isFourthEvening, hasValidRatingInput, localSessionVotes, isCurrentEveningLocked, isAdmin, isLoggedOut, hasAlreadyVoted]);

  const handleTokenVote = (singerId: number, delta: number) => {
    if (isLoggedOut || hasAlreadyVoted) return;
    const currentTokens = localSessionVotes[singerId]?.[0] || 0;
    const nextTokens = currentTokens + delta;
    if (nextTokens < 0 || nextTokens > MAX_PER_SINGER) return;
    if (delta > 0 && totalSpentInSession >= TOTAL_TOKENS) return;
    setLocalSessionVotes(prev => ({ ...prev, [singerId]: [nextTokens] }));
  };

  const handleConfirm = () => {
    if (isLoggedOut || hasAlreadyVoted) return;
    let finalVotesToCommit: Record<number, number[]> = {};
    if (isFourthEvening) {
      Object.entries(inputValues).forEach(([singerIdStr, val]) => {
        const num = parseFloat((val as string).replace(',', '.'));
        if (!isNaN(num) && num >= 1 && num <= 10) {
          finalVotesToCommit[parseInt(singerIdStr)] = [num];
        }
      });
    } else {
      finalVotesToCommit = localSessionVotes;
    }
    onConfirmBallot(selectedEvening, finalVotesToCommit);
    setShowSuccess(true);
    setLocalSessionVotes({});
    setInputValues({});
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleResetVote = () => {
    const correctCode = UNLOCK_PASSWORDS[selectedEvening];
    if (unlockCode === correctCode) {
      onDeleteVote(currentUser, selectedEvening);
      setIsResetting(false);
      setUnlockCode('');
      setResetError(false);
    } else {
      setResetError(true);
      setTimeout(() => setResetError(false), 2000);
    }
  };

  if (isLoggedOut) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-700">
        <div className="relative w-40 h-40 border-2 border-fluo/30 flex items-center justify-center bg-black/40 backdrop-blur-md">
           <svg className="w-20 h-20 text-fluo animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
           </svg>
        </div>
        <h2 className="hud-text text-4xl font-black text-white italic">IDENTIFICATION REQUIRED</h2>
        <Button onClick={onOpenLogin} className="px-10 py-5">ESTABLISH SECURE LINK</Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in zoom-in duration-500 pb-20 relative">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-fluo text-black px-12 py-6 jedi-glow animate-bounce shadow-[0_0_50px_rgba(253,255,0,0.6)] border-4 border-white flex flex-col items-center gap-2">
            <span className="hud-text text-2xl font-black italic">VOTO INVIATO</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-fluo/20 pb-6">
        <div>
          <h2 className="hud-text text-3xl text-white">Consiglio Galattico</h2>
          <p className="text-[10px] text-fluo font-mono uppercase mt-1 italic">
            Terminal Sector {selectedEvening} {hasAlreadyVoted && <span className="text-green-500 ml-2 font-black">[REGISTERED]</span>}
          </p>
        </div>
        <div className="flex gap-2 bg-zinc-950 p-1 border border-zinc-800">
          {[1, 2, 3, 4, 5].map(num => (
            <button 
              key={num} 
              onClick={() => { setSelectedEvening(num); setIsResetting(false); }} 
              className={`w-10 h-10 flex items-center justify-center hud-text text-xs transition-all relative ${selectedEvening === num ? 'bg-fluo text-black font-black' : 'text-zinc-600 hover:text-fluo'}`}
            >
              {num}
              {votersProgress[currentUser]?.[num] && <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></div>}
            </button>
          ))}
        </div>
      </div>

      {hasAlreadyVoted ? (
        <div className="w-full py-20 bg-green-500/5 border border-green-500/20 flex flex-col items-center justify-center space-y-8">
           <div className="w-24 h-24 border-2 border-green-500 flex items-center justify-center bg-black">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
           </div>
           <h3 className="hud-text text-green-500 text-3xl font-black italic">TRANSMISSION VALIDATED</h3>
           
           {!isResetting ? (
             <button 
               onClick={() => setIsResetting(true)}
               className="px-8 py-3 border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white transition-all hud-text text-[10px] font-black"
             >
               ANNULLA VOTO
             </button>
           ) : (
             <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Inserire Codice di Sicurezza Serata {selectedEvening}</p>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    placeholder="****"
                    value={unlockCode}
                    onChange={(e) => setUnlockCode(e.target.value)}
                    className={`bg-black border ${resetError ? 'border-red-500' : 'border-zinc-800 focus:border-fluo'} outline-none px-4 py-2 text-center font-mono text-fluo w-32`}
                  />
                  <button 
                    onClick={handleResetVote}
                    className="bg-red-500 text-white px-6 py-2 hud-text text-[10px] font-black"
                  >
                    SBLOCCA
                  </button>
                </div>
                <button onClick={() => setIsResetting(false)} className="text-[8px] text-zinc-600 uppercase font-mono">Chiudi</button>
             </div>
           )}
        </div>
      ) : isCurrentEveningLocked && !isAdmin ? (
        <div className="w-full py-20 text-center text-red-500 hud-text border border-red-500/20">SECTOR BLOCKED</div>
      ) : (
        <>
          {!isFourthEvening ? (
            <div className="bg-zinc-950 border border-zinc-900 p-6 flex items-center justify-between holopad-border">
               <div>
                 <h3 className="hud-text text-zinc-500 text-[10px]">Session Credits</h3>
                 <div className="flex items-baseline gap-2">
                   <span className="text-5xl font-black text-fluo font-mono">{tokensLeftInSession.toString().padStart(2, '0')}</span>
                   <span className="text-zinc-700 font-mono text-sm">/ {TOTAL_TOKENS} GETTONI</span>
                 </div>
               </div>
               <div className="flex gap-1">
                 {Array.from({ length: TOTAL_TOKENS }).map((_, i) => (
                   <div key={i} className={`w-3 h-8 border ${i < totalSpentInSession ? 'bg-fluo border-fluo' : 'border-zinc-800'}`}></div>
                 ))}
               </div>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-fluo/20 p-6 holopad-border">
               <h3 className="hud-text text-fluo text-sm mb-2">PHASE 4: COVER NIGHT // DIRECT RATING (1-10)</h3>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleSingers.map(singer => {
              const singerVotes = localSessionVotes[singer.id] || [];
              const tokenCount = !isFourthEvening ? (singerVotes[0] || 0) : 0;
              return (
                <div key={singer.id} className={`group relative bg-zinc-950 border p-5 transition-all ${tokenCount > 0 || inputValues[singer.id] ? 'border-fluo/40' : 'border-zinc-900'}`}>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                       {singer.photo && <img src={singer.photo} className="w-10 h-10 object-cover border border-fluo/30" />}
                       <div>
                          <span className="text-[9px] font-mono text-zinc-600 block mb-0.5">ID-{singer.id.toString().padStart(2, '0')}</span>
                          <h4 className="hud-text text-white uppercase truncate text-sm sm:text-base">{singer.name}</h4>
                       </div>
                    </div>
                    <div className="shrink-0">
                      {!isFourthEvening ? (
                        <div className="flex items-center gap-4 bg-black/40 border border-zinc-800 p-2 w-[140px] justify-between">
                          <button onClick={() => handleTokenVote(singer.id, -1)} disabled={tokenCount <= 0} className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-fluo transition-colors font-bold text-xl">-</button>
                          <span className="text-xl font-black text-fluo font-mono w-6 text-center">{tokenCount}</span>
                          <button onClick={() => handleTokenVote(singer.id, 1)} disabled={tokenCount >= MAX_PER_SINGER || totalSpentInSession >= TOTAL_TOKENS} className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-fluo transition-colors font-bold text-xl">+</button>
                        </div>
                      ) : (
                        <div className="w-[140px] flex justify-end">
                           <input 
                            type="text" 
                            placeholder="1-10"
                            value={inputValues[singer.id] || ''}
                            onChange={(e) => setInputValues(prev => ({ ...prev, [singer.id]: e.target.value }))}
                            className="w-20 bg-black border border-zinc-800 focus:border-fluo outline-none p-2 text-center font-mono text-fluo"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sticky bottom-6 flex justify-center z-30">
            <Button className="w-full max-w-md py-5 jedi-glow text-lg" disabled={isCommitDisabled} onClick={handleConfirm}>
              INVIA TRASMISSIONE
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
