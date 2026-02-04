
import React, { useState } from 'react';
import { Button } from './Button';

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: string;
  onPageChange: (page: string) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  lockedCharts: Record<string | number, boolean>;
  operators: Record<string, string>;
  displayNames: Record<string, string>;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({ 
  isOpen, 
  onClose, 
  activePage, 
  onPageChange,
  isAdmin,
  setIsAdmin,
  currentUser,
  setCurrentUser,
  lockedCharts,
  operators,
  displayNames
}) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loginError, setLoginError] = useState(false);

  const isAnyChartLocked = Object.values(lockedCharts).some(locked => locked);

  const menuItems = [
    { id: 'home', label: 'TERMINAL' },
    { id: 'cantanti', label: 'CANTANTI' },
    { id: 'vota', label: 'VOTA' },
    { id: 'guerrieri', label: 'GUERRIERI' },
    { id: 'check', label: 'CHECK' },
    { id: 'chart', label: 'CHART', restricted: isAnyChartLocked },
  ];

  // Add Control Panel only for admin
  if (isAdmin) {
    menuItems.push({ id: 'controllo', label: 'CONTROLLO' });
  }

  const handleLogin = () => {
    const username = loginUser.toLowerCase().trim();
    const expectedCode = operators[username];
    
    if (expectedCode && adminCode === expectedCode) {
      setIsAdmin(username === 'admin');
      setCurrentUser(username);
      setShowLoginPrompt(false);
      setAdminCode('');
      setLoginUser('');
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setCurrentUser('Guest_1138');
    setShowLoginPrompt(false);
    onPageChange('home');
  };

  const isGuest = currentUser === 'Guest_1138';
  const displayUserName = displayNames[currentUser] || currentUser;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-80 bg-card border-l border-fluo/20 z-50 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <span className="hud-text text-fluo text-[10px] font-black">Menu Navigation</span>
            <button onClick={onClose} className="text-zinc-500 hover:text-fluo transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  onClose();
                }}
                className={`group relative py-4 px-6 text-left transition-all duration-300 flex items-center justify-between ${
                  activePage === item.id 
                    ? 'bg-fluo text-black' 
                    : 'text-zinc-400 hover:text-fluo hover:bg-zinc-900/50'
                }`}
              >
                <span className="relative z-10 hud-text text-lg font-black tracking-[0.2em]">
                  {item.label}
                </span>
                
                {item.id === 'chart' && isAnyChartLocked && (
                  <svg className={`w-4 h-4 ${activePage === item.id ? 'text-black' : 'text-zinc-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}

                {activePage === item.id && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-black animate-pulse"></div>
                )}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-fluo scale-y-0 group-hover:scale-y-100 transition-transform"></div>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-zinc-900 space-y-6">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isAdmin ? 'border-fluo bg-fluo/10' : !isGuest ? 'border-blue-500/50 bg-blue-500/5' : 'border-zinc-800'}`}>
                 <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-fluo animate-pulse' : !isGuest ? 'bg-blue-400' : 'bg-zinc-800'}`}></div>
              </div>
              <div className="flex flex-col">
                 <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Auth Protocol</span>
                 <span className={`text-[10px] font-mono uppercase ${isAdmin ? 'text-fluo' : !isGuest ? 'text-blue-400' : 'text-zinc-500'}`}>
                   {isAdmin ? 'COMMANDER' : !isGuest ? 'OPERATIVE' : 'GUEST'}: {displayUserName}
                 </span>
              </div>
            </div>

            <div className="space-y-3">
              {isGuest ? (
                <>
                  {!showLoginPrompt ? (
                    <button 
                      onClick={() => setShowLoginPrompt(true)}
                      className="w-full py-2 border border-dashed border-zinc-800 text-[10px] font-mono text-zinc-500 hover:text-fluo hover:border-fluo transition-all uppercase tracking-widest"
                    >
                      [ Identify Personnel ]
                    </button>
                  ) : (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="space-y-2">
                        <input 
                          type="text"
                          placeholder="OPERATOR NAME"
                          value={loginUser}
                          onChange={(e) => setLoginUser(e.target.value)}
                          className={`w-full bg-black border ${loginError ? 'border-red-500' : 'border-zinc-800 focus:border-fluo'} outline-none px-3 py-2 text-xs font-mono text-white transition-all`}
                        />
                        <div className="flex gap-2">
                          <input 
                            type="password"
                            placeholder="SECURE CODE"
                            value={adminCode}
                            onChange={(e) => setAdminCode(e.target.value)}
                            className={`flex-1 bg-black border ${loginError ? 'border-red-500' : 'border-zinc-800 focus:border-fluo'} outline-none px-3 py-2 text-xs font-mono text-fluo transition-all`}
                          />
                          <button 
                            onClick={handleLogin}
                            className="bg-fluo text-black px-4 py-2 text-[10px] font-black uppercase hover:bg-white transition-colors"
                          >
                            VERIFY
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setShowLoginPrompt(false); setAdminCode(''); setLoginUser(''); }}
                        className="text-[8px] font-mono text-zinc-700 hover:text-zinc-500 uppercase"
                      >
                        Cancel Transmission
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button 
                  onClick={handleLogout}
                  className={`w-full py-2 border ${isAdmin ? 'border-fluo/20 text-fluo' : 'border-blue-500/20 text-blue-400'} text-[10px] font-mono hover:bg-current hover:text-black transition-all uppercase tracking-widest transition-colors duration-300`}
                >
                  [ Terminate Session ]
                </button>
              )}
            </div>

            <p className="text-[8px] text-zinc-700 font-mono italic leading-tight">
              {isAdmin 
                ? `Authorized command access for ${displayUserName}. Sector override engaged.`
                : !isGuest 
                  ? `Authenticated session for ${displayUserName}. Standard clearance active.`
                  : "Accessing encrypted sectors requires Level 5 clearance from the High Council."}
            </p>
          </div>
        </div>

        <div className="absolute top-1/4 -left-3 transform -rotate-90">
           <span className="hud-text text-[8px] text-fluo/20 whitespace-nowrap">SECTOR_ACCESS_LOGS // RECOVERY_MODE</span>
        </div>
      </div>
    </>
  );
};
