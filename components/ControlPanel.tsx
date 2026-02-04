
import React, { useState, useRef } from 'react';
import { Singer, GlobalVotes, VotersProgress } from '../types';
import { Button } from './Button';

interface ControlPanelProps {
  lockedCharts: Record<string | number, boolean>;
  onToggleChartLock: (viewId: string | number) => void;
  lockedVoting: Record<number, boolean>;
  onToggleVotingLock: (evening: number) => void;
  hiddenSingers: Record<number, number[]>;
  onToggleSingerVisibility: (evening: number, singerId: number) => void;
  votes: GlobalVotes;
  votersProgress: VotersProgress;
  onDeleteVote: (username: string, evening: number) => void;
  operators: Record<string, string>;
  displayNames: Record<string, string>;
  personnelPhotos: Record<string, string>;
  onAddOperator: (username: string, displayName: string, code: string, photo?: string) => void;
  onDeleteOperator: (username: string) => void;
  onUpdateOperator: (oldUsername: string, newUsername: string, newDisplayName: string, newCode: string, newPhoto?: string) => void;
  singers: Singer[];
  onUpdateSingerPhoto: (id: number, photo: string) => void;
  onDeleteSinger: (id: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  lockedCharts,
  onToggleChartLock,
  lockedVoting,
  onToggleVotingLock,
  hiddenSingers,
  onToggleSingerVisibility,
  votes,
  votersProgress,
  onDeleteVote,
  operators,
  displayNames,
  personnelPhotos,
  onAddOperator,
  onDeleteOperator,
  onUpdateOperator,
  singers,
  onUpdateSingerPhoto,
  onDeleteSinger
}) => {
  const [activeTab, setActiveTab] = useState<'sectors' | 'units' | 'voti' | 'management' | 'personnel'>('sectors');
  const [selectedEvening, setSelectedEvening] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [targetUser, setTargetUser] = useState<string>('');
  const [targetEvening, setTargetEvening] = useState<number>(1);
  const [resetDone, setResetDone] = useState(false);

  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newPhoto, setNewPhoto] = useState<string>('');
  const [addDone, setAddDone] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const filteredSingers = singers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = Object.keys(operators).filter(u => u !== 'admin').sort();
  const unitsGridCols = "grid-cols-[2.5rem_1fr_3.5rem_3.5rem_3rem_3rem]";

  const handleResetAction = () => {
    if (!targetUser) return;
    const userName = displayNames[targetUser] || targetUser;
    
    if (confirm(`SBLOCCO TERMINALE: Confermi di voler resettare il voto di ${userName} per la serata ${targetEvening}? \nL'operazione è irreversibile.`)) {
      onDeleteVote(targetUser, targetEvening);
      setResetDone(true);
      setTimeout(() => setResetDone(false), 4000);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSingerAction = (singer: Singer) => {
    if (confirm(`ELIMINAZIONE UNITÀ: Sei sicuro di voler rimuovere permanentemente ${singer.name}? Tutti i voti associati verranno cancellati.`)) {
      onDeleteSinger(singer.id);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newDisplayName || !newCode) return;
    
    if (editingKey) {
      onUpdateOperator(editingKey, newUsername, newDisplayName, newCode, newPhoto);
    } else {
      onAddOperator(newUsername, newDisplayName, newCode, newPhoto);
    }
    
    setAddDone(true);
    setNewUsername('');
    setNewDisplayName('');
    setNewCode('');
    setNewPhoto('');
    setEditingKey(null);
    setTimeout(() => setAddDone(false), 3000);
  };

  const startEditing = (username: string) => {
    setEditingKey(username);
    setNewUsername(username);
    setNewDisplayName(displayNames[username] || '');
    setNewCode(operators[username] || '');
    setNewPhoto(personnelPhotos[username] || '');
    setAddDone(false);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleDeletePersonnel = (username: string) => {
    if (username === 'admin') return;
    const displayName = displayNames[username] || username;
    if (confirm(`ELIMINAZIONE UNITÀ: Sei sicuro di voler rimuovere permanentemente l'operatore ${displayName}?`)) {
      onDeleteOperator(username);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-fluo/20 pb-6 gap-4">
        <div>
          <h2 className="hud-text text-3xl text-white italic font-black">Command Center</h2>
          <p className="text-[10px] text-fluo font-mono uppercase tracking-[0.2em] mt-1">
            Centralized Tactical Interface // Admin Override Level 5
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-zinc-950 p-1 border border-zinc-800 w-fit overflow-x-auto no-scrollbar max-w-full">
        {['sectors', 'units', 'voti', 'management', 'personnel'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 hud-text text-[10px] whitespace-nowrap transition-all ${activeTab === tab ? 'bg-fluo text-black font-black' : 'text-zinc-600 hover:text-fluo'}`}
          >
            {tab.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === 'sectors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="bg-zinc-950 border border-zinc-900 holopad-border p-5 space-y-6 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="hud-text text-xs text-white">Evening {num}</span>
                <span className="text-[8px] font-mono text-zinc-700">ID:SEC_0{num}</span>
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <label className="text-[8px] text-zinc-500 uppercase font-black block">Voting Terminal</label>
                  <button onClick={() => onToggleVotingLock(num)} className={`w-full py-3 border text-[10px] font-black transition-all ${lockedVoting[num] ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-green-500/50 text-green-500 bg-green-500/10'}`}>
                    {lockedVoting[num] ? 'LOCKED' : 'OPEN'}
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] text-zinc-500 uppercase font-black block">Public Rankings</label>
                  <button onClick={() => onToggleChartLock(num)} className={`w-full py-3 border text-[10px] font-black transition-all ${lockedCharts[num] ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-green-500/50 text-green-500 bg-green-500/10'}`}>
                    {lockedCharts[num] ? 'HIDDEN' : 'VISIBLE'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-zinc-950 border border-fluo/20 holopad-border p-5 space-y-6 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="hud-text text-xs text-fluo font-black">TOTAL</span>
                <span className="text-[8px] font-mono text-zinc-700">ID:GLOBAL_SUM</span>
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-2 opacity-10 pointer-events-none">
                  <label className="text-[8px] text-zinc-500 uppercase font-black block">Voting Terminal</label>
                  <button className="w-full py-3 border border-zinc-800 text-[10px] font-black text-zinc-800 bg-transparent">
                    N/A
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] text-zinc-500 uppercase font-black block">Public Rankings</label>
                  <button 
                    onClick={() => onToggleChartLock('total')} 
                    className={`w-full py-3 border text-[10px] font-black transition-all ${lockedCharts['total'] ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-green-500/50 text-green-500 bg-green-500/10'}`}
                  >
                    {lockedCharts['total'] ? 'HIDDEN' : 'VISIBLE'}
                  </button>
                </div>
              </div>
          </div>
        </div>
      )}

      {activeTab === 'units' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 p-4">
            <input type="text" placeholder="FILTER_UNIT_BY_NAME" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black border border-zinc-800 focus:border-fluo outline-none p-3 text-xs font-mono text-white placeholder:text-zinc-800" />
          </div>
          <div className="bg-zinc-950 border border-zinc-900 holopad-border overflow-hidden">
            <div className={`bg-zinc-900/50 p-3 border-b border-zinc-800 grid ${unitsGridCols} items-center overflow-x-auto no-scrollbar`}>
              <span className="text-[8px] font-black text-zinc-600 uppercase text-center">ID</span>
              <span className="text-[8px] font-black text-zinc-600 uppercase px-4">UNIT_DESIGNATION</span>
              {[2, 3].map(n => <span key={n} className="text-[8px] font-black text-zinc-600 uppercase text-center">E{n}</span>)}
              <span className="text-[8px] font-black text-zinc-600 uppercase text-center">PIC</span>
              <span className="text-[8px] font-black text-zinc-600 uppercase text-center">DEL</span>
            </div>
            <div className="divide-y divide-zinc-900">
              {filteredSingers.map(singer => (
                <div key={singer.id} className={`grid ${unitsGridCols} items-center py-3 hover:bg-fluo/[0.02] group`}>
                  <span className="text-center font-mono text-[10px] text-zinc-600">#{singer.id}</span>
                  <span className="px-4 hud-text text-[10px] text-white truncate">{singer.name}</span>
                  {[2, 3].map(num => (
                    <div key={num} className="flex justify-center">
                       <button onClick={() => onToggleSingerVisibility(num, singer.id)} className={`w-8 h-8 flex items-center justify-center border transition-all ${ (hiddenSingers[num] || []).includes(singer.id) ? 'border-red-500/30 text-red-500 bg-red-500/5' : 'border-green-500/30 text-green-500 bg-green-500/5' }`}>
                          {(hiddenSingers[num] || []).includes(singer.id) ? 'H' : 'V'}
                       </button>
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <label className="cursor-pointer w-8 h-8 flex items-center justify-center border border-zinc-800 hover:border-fluo text-zinc-600 hover:text-fluo transition-all overflow-hidden">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handlePhotoUpload(e, (base64) => onUpdateSingerPhoto(singer.id, base64))}
                      />
                      {singer.photo ? (
                        <img src={singer.photo} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => handleDeleteSingerAction(singer)}
                      className="w-8 h-8 flex items-center justify-center text-zinc-800 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'voti' && (
        <div className="space-y-6">
          <div className="flex gap-2 bg-zinc-950 p-1 border border-zinc-800 w-fit">
            {[1, 2, 3, 4, 5].map(num => (
              <button key={num} onClick={() => setSelectedEvening(num)} className={`w-10 h-10 flex items-center justify-center hud-text text-xs transition-all ${selectedEvening === num ? 'bg-fluo text-black font-black' : 'text-zinc-600 hover:text-fluo'}`}>
                {num}
              </button>
            ))}
          </div>
          <div className="bg-zinc-950 border border-zinc-900 holopad-border overflow-hidden">
             <div className="bg-zinc-900/50 p-3 border-b border-zinc-800 grid grid-cols-[3rem_1fr_10rem_6rem] items-center">
                <span className="text-[8px] font-black text-zinc-600 uppercase text-center">ID</span>
                <span className="text-[8px] font-black text-zinc-600 uppercase px-4">UNIT_DESIGNATION</span>
                <span className="text-[8px] font-black text-zinc-600 uppercase text-center">VOTES</span>
                <span className="text-[8px] font-black text-zinc-600 uppercase text-center">SUM</span>
             </div>
             <div className="divide-y divide-zinc-900">
                {singers.map(singer => {
                  const eveningData = votes[selectedEvening] || {};
                  const singerVotes = Object.values(eveningData).map(uv => uv[singer.id] || []).flat();
                  const sum = singerVotes.reduce((a, b) => a + b, 0);
                  const isE4 = selectedEvening === 4;
                  return (
                    <div key={singer.id} className="grid grid-cols-[3rem_1fr_10rem_6rem] items-center py-4 hover:bg-fluo/[0.02]">
                       <span className="text-center font-mono text-[10px] text-zinc-600">#{singer.id}</span>
                       <span className="px-4 hud-text text-[10px] text-white truncate">{singer.name}</span>
                       <div className="flex flex-wrap justify-center gap-1">
                          {singerVotes.length > 0 ? singerVotes.map((v, i) => (
                            <span key={i} className={`text-[9px] font-mono px-1 border ${isE4 ? 'border-accent/40 text-accent' : 'border-fluo/40 text-fluo'}`}>
                              {isE4 ? v.toFixed(1) : v}
                            </span>
                          )) : <span className="text-[8px] font-mono text-zinc-800">EMPTY</span>}
                       </div>
                       <div className="text-center">
                          <span className={`hud-text text-xs font-black ${sum > 0 ? 'text-fluo' : 'text-zinc-800'}`}>
                             {isE4 ? (singerVotes.length > 0 ? (sum / singerVotes.length).toFixed(2) : '0.00') : sum}
                          </span>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'management' && (
        <div className="max-w-xl mx-auto space-y-12 py-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
             <h3 className="hud-text text-3xl font-black italic text-white">CENTRO GESTIONE VOTI</h3>
             <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-fluo/30 to-transparent"></div>
          </div>

          <div className="space-y-8">
             <div className="space-y-4">
                <label className="hud-text text-xs text-zinc-500 text-center block">SELEZIONA GIOCATORE</label>
                <div className="relative group">
                   <select 
                      value={targetUser}
                      onChange={(e) => setTargetUser(e.target.value)}
                      className="w-full bg-black border border-zinc-800 focus:border-fluo p-4 hud-text text-sm text-white appearance-none outline-none transition-all text-center cursor-pointer"
                   >
                      <option value="">[ MENU A TENDINA ]</option>
                      {sortedUsers.map(u => (
                         <option key={u} value={u} className="bg-black text-white">{displayNames[u] || u}</option>
                      ))}
                   </select>
                </div>
             </div>

             <div className="space-y-4">
                <label className="hud-text text-xs text-zinc-500 text-center block">SELEZIONA LA SERATA</label>
                <div className="flex justify-center gap-4">
                   {[1, 2, 3, 4, 5].map(num => (
                      <button key={num} onClick={() => setTargetEvening(num)} className={`w-14 h-14 border-2 flex items-center justify-center hud-text text-xl font-black transition-all ${targetEvening === num ? 'bg-fluo text-black border-white' : 'border-zinc-800 text-zinc-600 hover:border-fluo/40'}`}>
                         {num}
                      </button>
                   ))}
                </div>
             </div>

             <div className="pt-8">
                {resetDone ? (
                   <div className="w-full py-6 border-2 border-green-500 bg-green-500/10 text-green-500 hud-text text-center animate-in zoom-in">
                      TERMINALE SBLOCCATO
                   </div>
                ) : (
                  <button 
                     onClick={handleResetAction}
                     disabled={!targetUser}
                     className={`w-full py-6 border-2 hud-text text-lg font-black transition-all group relative overflow-hidden ${!targetUser ? 'opacity-30 border-zinc-900 text-zinc-800' : 'border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white hover:border-white'}`}
                  >
                     CANCELLA VOTAZIONE
                  </button>
                )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'personnel' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="space-y-6">
              <h3 className="hud-text text-xl text-white italic border-b border-fluo/20 pb-4">Personale Autorizzato</h3>
              <div className="bg-zinc-950 border border-zinc-900 holopad-border overflow-hidden max-h-[500px] overflow-y-auto no-scrollbar">
                 <div className="bg-zinc-900/50 p-3 border-b border-zinc-800 grid grid-cols-[1fr_1fr_3rem_6rem] items-center">
                    <span className="text-[8px] font-black text-zinc-600 uppercase">IDENTIFICATIVO</span>
                    <span className="text-[8px] font-black text-zinc-600 uppercase px-4">NOME_DISPLAY</span>
                    <span className="text-[8px] font-black text-zinc-600 uppercase text-center">CODE</span>
                    <span className="text-[8px] font-black text-zinc-600 uppercase text-center">AZIONI</span>
                 </div>
                 <div className="divide-y divide-zinc-900">
                    {Object.keys(operators).sort().map(username => (
                       <div key={username} className="grid grid-cols-[1fr_1fr_3rem_6rem] items-center py-3 hover:bg-fluo/[0.02] group px-1">
                          <span className="font-mono text-[10px] text-zinc-400 pl-2 truncate flex items-center gap-2">
                             {personnelPhotos[username] && <img src={personnelPhotos[username]} className="w-4 h-4 rounded-full object-cover border border-fluo/30" />}
                             {username}
                          </span>
                          <span className="hud-text text-[10px] text-white px-4 truncate">{displayNames[username] || '-'}</span>
                          <span className="font-mono text-[10px] text-zinc-700 text-center">{operators[username]}</span>
                          <div className="flex justify-center gap-2">
                             <button 
                              onClick={() => startEditing(username)}
                              title="Edit"
                              className="text-zinc-600 hover:text-fluo transition-colors"
                             >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                             </button>
                             {username !== 'admin' && (
                               <button 
                                onClick={() => handleDeletePersonnel(username)}
                                title="Delete"
                                className="text-zinc-800 hover:text-red-500 transition-colors"
                               >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                               </button>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-6">
              <h3 className="hud-text text-xl text-white italic border-b border-fluo/20 pb-4">
                {editingKey ? 'Modifica Unità' : 'Registrazione Unità'}
              </h3>
              <form onSubmit={handleAddSubmit} className={`bg-zinc-950 border transition-all duration-500 holopad-border p-6 space-y-6 ${editingKey ? 'border-fluo/50' : 'border-zinc-900'}`}>
                 <div className="flex justify-center mb-4">
                    <label className="relative w-24 h-24 border-2 border-dashed border-zinc-800 hover:border-fluo rounded-full flex items-center justify-center cursor-pointer transition-all overflow-hidden group">
                       <input 
                         type="file" 
                         className="hidden" 
                         accept="image/*" 
                         onChange={(e) => handlePhotoUpload(e, setNewPhoto)}
                       />
                       {newPhoto ? (
                         <img src={newPhoto} className="w-full h-full object-cover" />
                       ) : (
                         <div className="text-center">
                            <svg className="w-8 h-8 text-zinc-800 group-hover:text-fluo mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            <span className="text-[7px] text-zinc-700 uppercase font-black block mt-1 group-hover:text-fluo">Photo</span>
                         </div>
                       )}
                    </label>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Username (ID)</label>
                       <input 
                         required
                         type="text" 
                         value={newUsername}
                         onChange={(e) => setNewUsername(e.target.value)}
                         placeholder="e.g. jdoe"
                         className="w-full bg-black border border-zinc-800 focus:border-fluo outline-none p-3 font-mono text-xs text-white"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Display Name</label>
                       <input 
                         required
                         type="text" 
                         value={newDisplayName}
                         onChange={(e) => setNewDisplayName(e.target.value)}
                         placeholder="e.g. John"
                         className="w-full bg-black border border-zinc-800 focus:border-fluo outline-none p-3 font-mono text-xs text-white"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Access Code</label>
                       <input 
                         required
                         type="text" 
                         value={newCode}
                         onChange={(e) => setNewCode(e.target.value)}
                         placeholder="4 cifre"
                         className="w-full bg-black border border-zinc-800 focus:border-fluo outline-none p-3 font-mono text-xs text-fluo"
                       />
                    </div>
                 </div>

                 {addDone ? (
                   <div className="w-full py-4 bg-green-500/10 border border-green-500 text-green-500 hud-text text-center text-xs animate-pulse">
                     {editingKey ? 'UNIT_UPDATED_SUCCESSFULLY' : 'UNIT_REGISTERED_SUCCESSFULLY'}
                   </div>
                 ) : (
                   <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full py-4 text-xs">
                      {editingKey ? 'UPDATE_UNIT_DATA' : 'REGISTER_NEW_UNIT'}
                    </Button>
                    {editingKey && (
                      <button 
                        type="button" 
                        onClick={() => { setEditingKey(null); setNewUsername(''); setNewDisplayName(''); setNewCode(''); setNewPhoto(''); }}
                        className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 uppercase tracking-widest py-2"
                      >
                        [ Abort Edit ]
                      </button>
                    )}
                   </div>
                 )}
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
