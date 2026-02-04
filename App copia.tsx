
import React, { useState, useRef, useEffect } from 'react';
import { ImageState, GlobalVotes, VotersProgress, AUTHORIZED_OPERATORS, OPERATOR_DISPLAY_NAMES, SINGERS, Singer } from './types';
import { editImage } from './services/geminiService';
import { dbService } from './services/dbService';
import { Button } from './components/Button';
import { NavDrawer } from './components/NavDrawer';
import { SingersList } from './components/SingersList';
import { VotingPage } from './components/VotingPage';
import { ChartPage } from './components/ChartPage';
import { CheckPage } from './components/CheckPage';
import { WarriorsPage } from './components/WarriorsPage';
import { ControlPanel } from './components/ControlPanel';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState('Guest_1138');
  const [isSynced, setIsSynced] = useState(false);

  // Stato globale sincronizzato dal database
  const [operators, setOperators] = useState(AUTHORIZED_OPERATORS);
  const [displayNames, setDisplayNames] = useState(OPERATOR_DISPLAY_NAMES);
  const [personnelPhotos, setPersonnelPhotos] = useState<Record<string, string>>({});
  const [singersList, setSingersList] = useState<Singer[]>(SINGERS);
  const [votes, setVotes] = useState<GlobalVotes>({ 1: {}, 2: {}, 3: {}, 4: {}, 5: {} });
  const [votersProgress, setVotersProgress] = useState<VotersProgress>({});
  const [lockedCharts, setLockedCharts] = useState<Record<string | number, boolean>>({
    'total': true, 1: true, 2: true, 3: true, 4: true, 5: true
  });
  const [lockedVoting, setLockedVoting] = useState<Record<number, boolean>>({
    1: false, 2: true, 3: true, 4: true, 5: true
  });
  const [hiddenSingers, setHiddenSingers] = useState<Record<number, number[]>>({
    1: [], 2: [], 3: [], 4: [], 5: []
  });

  // Caricamento e Sincronizzazione Realtime
  useEffect(() => {
    const unsubscribe = dbService.subscribeToData((data) => {
      if (data.operators) setOperators(data.operators);
      if (data.displayNames) setDisplayNames(data.displayNames);
      if (data.personnelPhotos) setPersonnelPhotos(data.personnelPhotos);
      if (data.singersList) setSingersList(data.singersList);
      if (data.votes) setVotes(data.votes);
      if (data.votersProgress) setVotersProgress(data.votersProgress);
      if (data.lockedCharts) setLockedCharts(data.lockedCharts);
      if (data.lockedVoting) setLockedVoting(data.lockedVoting);
      if (data.hiddenSingers) setHiddenSingers(data.hiddenSingers);
      setIsSynced(true);
    });
    return () => unsubscribe();
  }, []);

  const syncGlobalData = (updates: any) => {
    const fullData = {
      operators, displayNames, personnelPhotos, singersList,
      votes, votersProgress, lockedCharts, lockedVoting, hiddenSingers,
      ...updates
    };
    dbService.saveAllData(fullData);
  };

  const handleUpdateSingerPhoto = (id: number, photo: string) => {
    const newList = singersList.map(s => s.id === id ? { ...s, photo } : s);
    syncGlobalData({ singersList: newList });
  };

  const handleDeleteSinger = (id: number) => {
    if (!isAdmin) return;
    const newList = singersList.filter(s => s.id !== id);
    
    // Rimuovi anche i voti associati a questo cantante per pulizia
    const newVotes = { ...votes };
    [1, 2, 3, 4, 5].forEach(evening => {
      if (newVotes[evening]) {
        Object.keys(newVotes[evening]).forEach(user => {
          if (newVotes[evening][user][id]) {
            delete newVotes[evening][user][id];
          }
        });
      }
    });

    // Rimuovi dai cantanti nascosti
    const newHidden = { ...hiddenSingers };
    Object.keys(newHidden).forEach(ev => {
      newHidden[Number(ev)] = newHidden[Number(ev)].filter(sid => sid !== id);
    });

    syncGlobalData({ singersList: newList, votes: newVotes, hiddenSingers: newHidden });
  };

  const handleAddOperator = (username: string, displayName: string, code: string, photo?: string) => {
    const lowerUser = username.toLowerCase().trim();
    const newOps = { ...operators, [lowerUser]: code };
    const newNames = { ...displayNames, [lowerUser]: displayName };
    const newPhotos = photo ? { ...personnelPhotos, [lowerUser]: photo } : personnelPhotos;
    syncGlobalData({ operators: newOps, displayNames: newNames, personnelPhotos: newPhotos });
  };

  const handleDeleteOperator = (username: string) => {
    if (username === 'admin') return;
    const lowerUser = username.toLowerCase().trim();
    
    const newOps = { ...operators }; delete newOps[lowerUser];
    const newNames = { ...displayNames }; delete newNames[lowerUser];
    const newPhotos = { ...personnelPhotos }; delete newPhotos[lowerUser];

    const newVotes = { ...votes };
    [1, 2, 3, 4, 5].forEach(evening => {
      if (newVotes[evening]) {
        const eveningData = { ...newVotes[evening] };
        delete eveningData[lowerUser];
        newVotes[evening] = eveningData;
      }
    });

    const newProgress = { ...votersProgress };
    delete newProgress[lowerUser];

    syncGlobalData({ 
      operators: newOps, 
      displayNames: newNames, 
      personnelPhotos: newPhotos, 
      votes: newVotes, 
      votersProgress: newProgress 
    });
  };

  const handleUpdateOperator = (oldUsername: string, newUsername: string, newDisplayName: string, newCode: string, newPhoto?: string) => {
    const oldKey = oldUsername.toLowerCase().trim();
    const newKey = newUsername.toLowerCase().trim();
    
    if (oldKey !== newKey) {
      handleDeleteOperator(oldKey);
      handleAddOperator(newKey, newDisplayName, newCode, newPhoto);
    } else {
      const newOps = { ...operators, [newKey]: newCode };
      const newNames = { ...displayNames, [newKey]: newDisplayName };
      const newPhotos = newPhoto ? { ...personnelPhotos, [newKey]: newPhoto } : personnelPhotos;
      syncGlobalData({ operators: newOps, displayNames: newNames, personnelPhotos: newPhotos });
    }
  };

  const toggleChartLock = (viewId: string | number) => {
    if (!isAdmin) return;
    const newLocks = { ...lockedCharts, [viewId]: !lockedCharts[viewId] };
    syncGlobalData({ lockedCharts: newLocks });
  };

  const toggleVotingLock = (evening: number) => {
    if (!isAdmin) return;
    const newLocks = { ...lockedVoting, [evening]: !lockedVoting[evening] };
    syncGlobalData({ lockedVoting: newLocks });
  };

  const toggleSingerVisibility = (evening: number, singerId: number) => {
    if (!isAdmin) return;
    const currentHidden = hiddenSingers[evening] || [];
    const isHidden = currentHidden.includes(singerId);
    const newHidden = isHidden 
      ? currentHidden.filter(id => id !== singerId)
      : [...currentHidden, singerId];
    const updatedHidden = { ...hiddenSingers, [evening]: newHidden };
    syncGlobalData({ hiddenSingers: updatedHidden });
  };

  const handleConfirmBallot = (evening: number, sessionVotes: Record<number, number[]>) => {
    const newVotes = {
      ...votes,
      [evening]: { ...votes[evening], [currentUser]: sessionVotes }
    };

    let newProgress = votersProgress;
    if (currentUser && currentUser !== 'Guest_1138') {
      const userEntry = votersProgress[currentUser] || {};
      newProgress = {
        ...votersProgress,
        [currentUser]: { ...userEntry, [evening]: true }
      };
    }
    syncGlobalData({ votes: newVotes, votersProgress: newProgress });
  };

  const handleDeleteVote = (username: string, evening: number) => {
    const eveningData = { ...votes[evening] };
    delete eveningData[username];
    const newVotes = { ...votes, [evening]: eveningData };

    const userProgress = { ...votersProgress[username] || {} };
    delete userProgress[evening];
    const newProgress = { ...votersProgress, [username]: userProgress };
    
    syncGlobalData({ votes: newVotes, votersProgress: newProgress });
  };

  // Image editing (Gemini)
  const [state, setState] = useState<ImageState>({ original: null, edited: null, loading: false, error: null });
  const [prompt, setPrompt] = useState('');
  const [mimeType, setMimeType] = useState('image/png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => setState(prev => ({ ...prev, original: event.target?.result as string, edited: null, error: null }));
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!state.original || !prompt.trim()) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const editedUrl = await editImage({ image: state.original, prompt: prompt, mimeType: mimeType });
      setState(prev => ({ ...prev, edited: editedUrl, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: `Darth Error: ${err.message}`, loading: false }));
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="relative aspect-video rounded-sm bg-card border border-zinc-800 overflow-hidden flex items-center justify-center group transition-all duration-500 holopad-border">
                <div className="scanline"></div>
                {!state.original && (
                  <div className="cursor-pointer flex flex-col items-center text-zinc-700 group-hover:text-fluo transition-colors z-10" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-20 h-20 mb-6 border-2 border-dashed border-current flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <span className="hud-text text-sm font-bold">Inject Visual Data Source</span>
                  </div>
                )}
                {(state.original || state.edited) && (
                  <div className="relative w-full h-full p-2">
                    <img src={state.edited || state.original || ''} className={`w-full h-full object-contain transition-all duration-500 ${state.loading ? 'blur-sm scale-95 opacity-50' : 'opacity-100 scale-100'}`} alt="Holopad Stream" />
                    {state.loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30">
                        <div className="relative w-24 h-24 mb-6 animate-spin"><div className="absolute inset-0 border-4 border-fluo border-t-transparent rounded-full"></div></div>
                        <p className="text-fluo hud-text text-lg animate-pulse">Reconfiguring Atoms...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-10">
              <div className="bg-card border border-zinc-800 p-8 space-y-8 relative overflow-hidden">
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Give your command to the Force..." className="w-full bg-black border border-zinc-800 p-5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-fluo transition-all min-h-[160px] resize-none font-mono text-sm leading-relaxed" />
                <Button onClick={handleEdit} disabled={!state.original || !prompt.trim()} loading={state.loading} className="w-full py-5 text-xl">EXECUTE COMMAND</Button>
              </div>
            </div>
          </main>
        );
      case 'cantanti': return <SingersList singers={singersList} />;
      case 'vota':
        return <VotingPage singers={singersList} onConfirmBallot={handleConfirmBallot} onDeleteVote={handleDeleteVote} isAdmin={isAdmin} hiddenSingers={hiddenSingers} onToggleVisibility={toggleSingerVisibility} lockedVoting={lockedVoting} onToggleVotingLock={toggleVotingLock} currentUser={currentUser} onOpenLogin={() => setIsMenuOpen(true)} votersProgress={votersProgress} />;
      case 'chart':
        return <ChartPage singers={singersList} votes={votes} hiddenSingers={hiddenSingers} lockedCharts={lockedCharts} isAdmin={isAdmin} onToggleLock={toggleChartLock} />;
      case 'check': return <CheckPage progress={votersProgress} operators={operators} />;
      case 'guerrieri': return <WarriorsPage progress={votersProgress} operators={operators} displayNames={displayNames} personnelPhotos={personnelPhotos} />;
      case 'controllo':
        return isAdmin ? (
          <ControlPanel lockedCharts={lockedCharts} onToggleChartLock={toggleChartLock} lockedVoting={lockedVoting} onToggleVotingLock={toggleVotingLock} hiddenSingers={hiddenSingers} onToggleSingerVisibility={toggleSingerVisibility} votes={votes} votersProgress={votersProgress} onDeleteVote={handleDeleteVote} operators={operators} displayNames={displayNames} personnelPhotos={personnelPhotos} onAddOperator={handleAddOperator} onDeleteOperator={handleDeleteOperator} onUpdateOperator={handleUpdateOperator} singers={singersList} onUpdateSingerPhoto={handleUpdateSingerPhoto} onDeleteSinger={handleDeleteSinger} />
        ) : (
          <div className="w-full flex-1 flex items-center justify-center hud-text text-red-500">ACCESS DENIED</div>
        );
      default: return <div className="hud-text text-white p-20 text-center">404 SECTOR_NOT_FOUND</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-10 space-y-8 max-w-[1600px] mx-auto relative">
      <NavDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activePage={activePage} onPageChange={setActivePage} isAdmin={isAdmin} setIsAdmin={setIsAdmin} currentUser={currentUser} setCurrentUser={setCurrentUser} lockedCharts={lockedCharts} operators={operators} displayNames={displayNames} />
      
      <div className="fixed top-6 left-6 z-30 flex items-center gap-2 px-3 py-1 bg-black/60 border border-zinc-800 backdrop-blur-md">
         <div className={`w-2 h-2 rounded-full ${isSynced ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 animate-pulse'}`}></div>
         <span className="text-[8px] font-mono text-zinc-500 uppercase">{isSynced ? 'Synced' : 'Connecting...'}</span>
      </div>

      <div className="fixed top-6 right-6 md:top-10 md:right-10 z-30">
        <button onClick={() => setIsMenuOpen(true)} className="group flex flex-col gap-1.5 p-4 border border-fluo/20 hover:border-fluo/60 transition-all bg-black/60 backdrop-blur-md jedi-glow active:scale-95">
          <div className="w-8 h-0.5 bg-fluo"></div>
          <div className="w-8 h-0.5 bg-fluo"></div>
          <div className="w-8 h-0.5 bg-fluo"></div>
          <span className="mt-1 text-[8px] font-black text-fluo/40 uppercase tracking-widest group-hover:text-fluo transition-colors">Menu</span>
        </button>
      </div>

      <header className="w-full flex flex-col md:flex-row justify-between items-start border-b border-fluo/20 pb-6 gap-4 pr-24 md:pr-32">
        <div className="flex items-center gap-5">
          <div className="relative group cursor-pointer" onClick={() => setActivePage('home')}>
             <div className="relative w-14 h-14 border-2 border-fluo flex items-center justify-center text-fluo font-black text-2xl bg-black">
                <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current"><path d="M50 0 L100 50 L50 100 L0 50 Z" /></svg>
             </div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-[0.2em] text-white uppercase italic">HOLO<span className="text-fluo">PAD</span></h1>
            <p className="text-[10px] text-fluo/60 hud-text">Galactic Reconstruction Unit // Model G-2.5</p>
          </div>
        </div>
      </header>
      {renderContent()}
    </div>
  );
};

export default App;
