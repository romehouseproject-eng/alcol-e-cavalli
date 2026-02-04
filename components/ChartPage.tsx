
import React, { useMemo, useState } from 'react';
import { Singer, GlobalVotes } from '../types';

interface ChartPageProps {
  singers: Singer[];
  votes: GlobalVotes;
  hiddenSingers: Record<number, number[]>;
  lockedCharts: Record<string | number, boolean>;
  isAdmin: boolean;
  onToggleLock: (viewId: string | number) => void;
}

export const ChartPage: React.FC<ChartPageProps> = ({ 
  singers,
  votes, 
  hiddenSingers, 
  lockedCharts, 
  isAdmin, 
  onToggleLock 
}) => {
  const [view, setView] = useState<'total' | 1 | 2 | 3 | 4 | 5>('total');

  const chartData = useMemo(() => {
    const baseSingers = isAdmin 
      ? singers 
      : singers.filter(s => !(hiddenSingers[view] || []).includes(s.id));

    const computed = baseSingers.map(singer => {
      let totalPoints = 0;
      let outlierLogs = { discarded: 0 };

      const getAggregatedVotesForSinger = (evening: number) => {
        const eveningData = votes[evening] || {};
        return Object.values(eveningData).map(userVotes => userVotes[singer.id] || []).flat();
      };

      const calculateEvening4 = (ratings: number[]) => {
        if (ratings.length === 0) return 0;
        const initialMean = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        const filtered = ratings.filter(r => Math.abs(r - initialMean) <= 3);
        outlierLogs.discarded = ratings.length - filtered.length;
        if (filtered.length === 0) return 0;
        return filtered.reduce((a, b) => a + b, 0) / filtered.length;
      };

      if (view === 'total') {
        [1, 2, 3, 5].forEach(num => {
          totalPoints += getAggregatedVotesForSinger(num).reduce((a, b) => a + b, 0);
        });
      } else if (view === 4) {
        totalPoints = calculateEvening4(getAggregatedVotesForSinger(4));
      } else {
        totalPoints = getAggregatedVotesForSinger(view as number).reduce((a, b) => a + b, 0);
      }

      return {
        id: singer.id,
        name: singer.name,
        points: totalPoints,
        discarded: outlierLogs.discarded,
        isHidden: (hiddenSingers[view] || []).includes(singer.id),
        photo: singer.photo
      };
    });

    const sorted = computed.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
    return (!isAdmin && (view === 1 || view === 2 || view === 3)) ? sorted.slice(0, 3) : sorted;
  }, [votes, view, hiddenSingers, isAdmin, singers]);

  const maxPoints = Math.max(...chartData.map(d => d.points), 1);
  const isCurrentViewLocked = lockedCharts[view];

  return (
    <div className="w-full space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-fluo/20 pb-4 gap-4">
        <div>
          <h2 className="hud-text text-3xl text-white">Galactic Rankings</h2>
          <p className="text-[10px] text-fluo font-mono uppercase mt-1">
            {view === 'total' ? 'Full Mission Aggregate' : `Sector Analysis: Evening ${view}`}
          </p>
        </div>
        <div className="flex gap-2 bg-zinc-950 p-1 border border-zinc-800">
          {(['total', 1, 2, 3, 4, 5] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 hud-text text-[10px] ${view === v ? 'bg-fluo text-black font-black' : 'text-zinc-600 hover:text-fluo'}`}>
              {v === 'total' ? 'TOTAL' : `E${v}`}
            </button>
          ))}
        </div>
      </div>

      {isCurrentViewLocked && !isAdmin ? (
        <div className="w-full h-40 flex items-center justify-center border border-red-500/20 text-red-500 hud-text">SECTOR ENCRYPTED</div>
      ) : (
        <div className="bg-zinc-950 border border-zinc-900 overflow-hidden">
          <div className="divide-y divide-zinc-900">
            {chartData.map((entry, index) => (
              <div key={entry.id} className="grid grid-cols-[3rem_1fr_6rem] items-center py-4 px-4 hover:bg-fluo/5 transition-colors">
                <span className={`hud-text font-black ${index < 3 && entry.points > 0 ? 'text-fluo' : 'text-zinc-700'}`}>#{index + 1}</span>
                <div className="px-4 flex items-center gap-3">
                  {entry.photo && <img src={entry.photo} className="w-8 h-8 object-cover border border-fluo/20" />}
                  <div className="flex-1">
                    <h4 className="hud-text text-white text-sm truncate uppercase">{entry.name}</h4>
                    <div className="w-full h-1 bg-zinc-900 mt-2"><div className="h-full bg-fluo transition-all duration-1000" style={{ width: `${(entry.points / maxPoints) * 100}%` }}></div></div>
                  </div>
                </div>
                <div className="text-right font-mono font-bold text-fluo">
                  {entry.points.toLocaleString('it-IT', { maximumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
