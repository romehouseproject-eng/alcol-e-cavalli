
import React from 'react';
import { VotersProgress } from '../types';

interface CheckPageProps {
  progress?: VotersProgress;
  operators: Record<string, string>;
}

export const CheckPage: React.FC<CheckPageProps> = ({ progress = {}, operators }) => {
  // Get all players (excluding admin)
  const users = Object.keys(operators).filter(u => u !== 'admin');
  const TOTAL_PLAYERS = users.length;

  const eveningStats = [1, 2, 3, 4, 5].map(num => {
    // Count how many players have a record for this evening
    const doneCount = users.filter(username => progress[username]?.[num]).length;
    const todoCount = TOTAL_PLAYERS - doneCount;
    const progressPercentage = TOTAL_PLAYERS > 0 ? (doneCount / TOTAL_PLAYERS) * 100 : 0;

    return {
      num,
      doneCount,
      todoCount,
      progressPercentage,
      isSpecial: num === 4
    };
  });

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-top duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-fluo/20 pb-6 gap-4">
        <div>
          <h2 className="hud-text text-3xl text-white italic font-black">Controllo Schieramento</h2>
          <p className="text-[10px] text-fluo font-mono uppercase tracking-[0.2em] mt-1">
            Personnel Deployment Status // Mission Completion Analysis
          </p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-950 p-3 border border-zinc-800">
           <div className="w-2 h-2 bg-fluo animate-ping"></div>
           <span className="text-[9px] font-mono text-zinc-400 uppercase">Total Personnel: {TOTAL_PLAYERS} UNITS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eveningStats.map((stat) => (
          <div key={stat.num} className="bg-zinc-950 border border-zinc-900 holopad-border p-6 space-y-6 relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Deployment Sector</span>
                <h3 className="hud-text text-xl text-white mt-1">Evening {stat.num}</h3>
              </div>
              <div className={`px-2 py-1 text-[8px] font-mono border ${stat.isSpecial ? 'border-accent/40 text-accent' : 'border-fluo/40 text-fluo'}`}>
                {stat.isSpecial ? 'RATING_PROTOCOL' : 'TOKEN_PROTOCOL'}
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-[10px] font-mono uppercase">
                <span className="text-zinc-500">Participation</span>
                <span className="text-fluo font-bold">{Math.round(stat.progressPercentage)}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 overflow-hidden">
                <div 
                  className="h-full bg-fluo transition-all duration-1000 ease-out shadow-[0_0_10px_#fdff00]" 
                  style={{ width: `${stat.progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 relative z-10">
              <div className="bg-black/40 border border-zinc-900 p-4">
                <span className="block text-[8px] text-zinc-600 uppercase font-black mb-1">Operativi OK</span>
                <span className="text-3xl font-black text-white font-mono">{stat.doneCount.toString().padStart(2, '0')}</span>
                <span className="text-[10px] text-zinc-700 ml-1 font-mono">/ {TOTAL_PLAYERS}</span>
              </div>
              <div className="bg-black/40 border border-zinc-900 p-4">
                <span className="block text-[8px] text-zinc-600 uppercase font-black mb-1">In Attesa</span>
                <span className={`text-3xl font-black font-mono ${stat.todoCount > 0 ? 'text-red-500/60' : 'text-green-500/40'}`}>
                  {stat.todoCount.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900 relative z-10 flex justify-between items-center">
               <span className="text-[9px] font-mono text-zinc-600 uppercase">Ballot Submission Status:</span>
               <span className={`text-[9px] font-bold font-mono uppercase ${stat.todoCount === 0 ? 'text-green-500' : 'text-zinc-500'}`}>
                 {stat.todoCount === 0 ? 'Sector Clear' : 'Active Transmission'}
               </span>
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-4 -right-4 text-zinc-900/10 font-black text-6xl select-none pointer-events-none italic">
              0{stat.num}
            </div>
          </div>
        ))}

        {/* Legend / Info Card */}
        <div className="bg-zinc-950 border border-dashed border-zinc-800 p-6 flex flex-col justify-center gap-4">
           <h4 className="hud-text text-xs text-zinc-500">Analisi Flotta</h4>
           <div className="space-y-4">
              <div className="flex items-start gap-2">
                 <div className="w-1.5 h-1.5 bg-fluo mt-1 shrink-0"></div>
                 <p className="text-[10px] font-mono text-zinc-400 uppercase leading-relaxed">
                   Questa console monitora la partecipazione dei <span className="text-fluo">giocatori</span> per ogni singola serata.
                 </p>
              </div>
              <div className="flex items-start gap-2">
                 <div className="w-1.5 h-1.5 bg-fluo mt-1 shrink-0"></div>
                 <p className="text-[10px] font-mono text-zinc-400 uppercase leading-relaxed">
                   Un'unità è considerata "Operativa" solo dopo aver confermato il proprio voto finale sul terminale.
                 </p>
              </div>
              <div className="p-3 bg-zinc-900/30 border border-zinc-800 text-[8px] text-zinc-600 font-mono italic">
                WARNING: I dati non confermati non appaiono in questa scansione.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
