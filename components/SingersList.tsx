
import React from 'react';
import { Singer } from '../types';

interface SingersListProps {
  singers: Singer[];
}

export const SingersList: React.FC<SingersListProps> = ({ singers }) => {
  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-fluo/20 pb-4 sm:pb-6 gap-4">
        <div>
          <h2 className="hud-text text-2xl sm:text-3xl text-white italic font-black">Archivio Cantanti</h2>
          <p className="text-[9px] sm:text-[10px] text-fluo font-mono uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1">
            Galactic Song Contest // Database Performer 2025
          </p>
        </div>
        <div className="hidden sm:block text-right font-mono text-[10px] text-zinc-600">
          DATA_UNITS: {singers.length} REGISTERED
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-8">
        {singers.map((singer) => (
          <div 
            key={singer.id} 
            className="group flex flex-col bg-zinc-950 border border-zinc-900 transition-all duration-500 hover:border-fluo/40 hover:scale-[1.02] holopad-border overflow-hidden"
          >
            <div className="relative aspect-[3/4] bg-black overflow-hidden flex items-center justify-center">
              {singer.photo ? (
                <img src={singer.photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={singer.name} />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fdff00_1px,transparent_1px)] [background-size:12px_12px] sm:[background-size:16px_16px]"></div>
                  <svg className="w-12 h-12 sm:w-24 sm:h-24 text-zinc-900 group-hover:text-fluo/10 transition-colors duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </>
              )}

              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/80 border border-zinc-800 px-1.5 py-0.5 sm:px-2 sm:py-1 font-mono text-[7px] sm:text-[9px] text-zinc-500 group-hover:text-fluo group-hover:border-fluo/40 transition-colors">
                UNIT_0{singer.id.toString().padStart(2, '0')}
              </div>

              <div className="absolute inset-x-0 h-px bg-fluo/20 top-0 group-hover:top-full transition-all duration-1000 ease-linear pointer-events-none"></div>
              
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 text-[6px] sm:text-[8px] font-mono text-zinc-800 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {singer.photo ? 'BIOMETRIC_DATA_LINKED' : 'SIGNAL_PENDING...'}
              </div>
            </div>

            <div className="h-0.5 w-full bg-fluo/20 group-hover:bg-fluo transition-colors duration-500"></div>

            <div className="p-3 sm:p-5 bg-zinc-950 group-hover:bg-black transition-colors duration-500 flex flex-col gap-1 sm:gap-2">
              <h3 className="hud-text text-white text-[11px] sm:text-lg font-black tracking-wider uppercase group-hover:text-white transition-colors truncate">
                {singer.name}
              </h3>
              <p className="text-fluo/80 sm:text-fluo font-mono text-xs sm:text-lg italic tracking-tight group-hover:text-fluo transition-colors truncate">
                "{singer.song}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 sm:p-4 bg-zinc-900/30 border border-zinc-800 text-[8px] sm:text-[9px] font-mono text-zinc-700 flex justify-between">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-fluo animate-pulse"></span>
          <span className="hidden xs:inline">ENCRYPTED_ARCHIVE_ACCESS: </span>GRANTED
        </span>
        <span className="uppercase tracking-widest hidden sm:inline">Sector_Singers // Recovery_Unit_Active</span>
      </div>
    </div>
  );
};
