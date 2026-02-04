
import React from 'react';
import { VotersProgress } from '../types';

interface WarriorsPageProps {
  progress?: VotersProgress;
  operators: Record<string, string>;
  displayNames: Record<string, string>;
  personnelPhotos: Record<string, string>;
}

export const WarriorsPage: React.FC<WarriorsPageProps> = ({ progress = {}, operators, displayNames, personnelPhotos }) => {
  const users = Object.keys(operators).filter(u => u !== 'admin').sort();

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-fluo/20 pb-6 gap-4">
        <div>
          <h2 className="hud-text text-3xl text-white italic font-black">I Guerrieri</h2>
          <p className="text-[10px] text-fluo font-mono uppercase tracking-[0.2em] mt-1">
            Galactic Force Deployment // Active Personnel Roster
          </p>
        </div>
        <div className="flex items-center gap-4 text-zinc-600 font-mono text-[10px] uppercase">
          <div className="flex flex-col items-end">
             <span>Database Status: Decrypted</span>
             <span>Link Strength: 100%</span>
          </div>
          <div className="w-10 h-10 border border-zinc-800 flex items-center justify-center text-fluo font-black text-lg bg-zinc-950">
            {users.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
        {users.map((username) => {
          const userProgress = progress[username] || {};
          const photo = personnelPhotos[username];
          
          return (
            <div key={username} className="group relative bg-zinc-950/50 border border-zinc-900 holopad-border p-3 sm:p-5 hover:border-fluo/40 transition-all duration-500 overflow-hidden flex flex-row gap-3 sm:gap-6 items-stretch min-h-[160px] sm:min-h-[240px]">
               <div className="absolute inset-x-0 h-[1px] bg-fluo/20 top-0 group-hover:top-full transition-all duration-1000 ease-linear pointer-events-none"></div>
               
               <div className="w-24 sm:w-48 aspect-[3/4] bg-black border border-zinc-800 flex items-center justify-center shrink-0 relative group-hover:border-fluo/50 transition-colors overflow-hidden rounded-sm">
                  {photo ? (
                    <img src={photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={username} />
                  ) : (
                    <svg className="w-12 sm:w-20 h-12 sm:h-20 text-zinc-900 group-hover:text-fluo/20 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fluo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 text-[6px] sm:text-[8px] font-mono text-zinc-700 tracking-widest uppercase">
                    {photo ? 'BIOMETRIC_LINK' : 'Visual_Data_Null'}
                  </div>
               </div>

               <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-0.5 sm:space-y-1">
                    <h4 className="hud-text text-white text-xl sm:text-4xl tracking-[0.1em] font-black group-hover:text-fluo transition-colors truncate">
                      {displayNames[username] || username}
                    </h4>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[8px] sm:text-[10px] text-zinc-500 font-mono uppercase tracking-widest">UNIT_ID:</span>
                      <span className="text-[8px] sm:text-[10px] text-fluo/60 font-mono uppercase tracking-widest font-bold truncate">{username}</span>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-4">
                     <div className="flex items-center gap-2">
                        <span className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-black tracking-[0.15em] whitespace-nowrap italic">Mission Progress</span>
                        <div className="h-px flex-1 bg-zinc-900/50"></div>
                     </div>

                     <div className="flex gap-1.5 sm:gap-3">
                        {[1, 2, 3, 4, 5].map(num => (
                          <div 
                            key={num} 
                            className={`w-8 h-8 sm:w-12 sm:h-12 border-2 flex items-center justify-center font-mono text-sm sm:text-lg font-black transition-all duration-700 relative overflow-hidden ${
                              userProgress[num] 
                                ? 'bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                                : 'bg-red-500/5 border-red-500/20 text-red-500/30'
                            }`}
                          >
                            {num}
                            <div className={`absolute top-0 left-0 w-1 sm:w-1.5 h-1 sm:h-1.5 ${userProgress[num] ? 'bg-green-500' : 'bg-red-500/30'}`}></div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="mt-auto pt-3 sm:pt-6 flex justify-between items-end border-t border-zinc-900/30">
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => <div key={i} className={`w-0.5 sm:w-1 h-2 sm:h-3 ${i < 3 ? 'bg-fluo/20' : 'bg-zinc-900'}`}></div>)}
                     </div>
                     <span className="text-[7px] sm:text-[8px] font-mono text-zinc-700 group-hover:text-fluo/40 transition-colors uppercase tracking-[0.2em] whitespace-nowrap">
                        SECURE_LINK_STABLE
                     </span>
                  </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
