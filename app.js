const { useState, useEffect, useRef } = React;

function App() {
    const [view, setView] = useState('menu'); 
    const [activeMode, setActiveMode] = useState(null);
    const [currentGameType, setCurrentGameType] = useState(null);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30);
    const [bestScores, setBestScores] = useState({});
    const [level, setLevel] = useState(1);
    const [gameData, setGameData] = useState({ tiles: [], targetLabel: '' });
    const [profile, setProfile] = useState({ name: 'Utente', avatar: 'user' });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [ytUrl, setYtUrl] = useState('https://www.youtube.com/watch?v=n61ULEU7CO0');
    const [radioOn, setRadioOn] = useState(false);
    const canvasRef = useRef(null);
    const timerInterval = useRef(null);

    // Caricamento iniziale
    useEffect(() => {
        const savedScores = localStorage.getItem('captcha_best_scores');
        if (savedScores) setBestScores(JSON.parse(savedScores));
        
        const savedProfile = localStorage.getItem('captcha_profile');
        if (savedProfile) setProfile(JSON.parse(savedProfile));

        const savedUrl = localStorage.getItem('captcha_yt_url');
        if (savedUrl) setYtUrl(savedUrl);
    }, []);

    // Gestione salvataggio record quando si cambia vista (es. tornando al menu)
    const handleSetView = (newView) => {
        if (view === 'game' && activeMode) {
            checkAndSaveBestScore();
        }
        setView(newView);
    };

    const checkAndSaveBestScore = () => {
        if (score > (bestScores[activeMode] || 0)) {
            const newScores = { ...bestScores, [activeMode]: score };
            setBestScores(newScores);
            localStorage.setItem('captcha_best_scores', JSON.stringify(newScores));
        }
    };

    useEffect(() => {
        if (view === 'game') {
            startTimer();
            generateLevel();
        } else {
            clearInterval(timerInterval.current);
        }
        return () => clearInterval(timerInterval.current);
    }, [view, activeMode]);

    const startTimer = () => {
        setTimer(30);
        clearInterval(timerInterval.current);
        timerInterval.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerInterval.current);
                    checkAndSaveBestScore();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const generateLevel = () => {
        const icons = Object.keys(ICON_DATA);
        const target = icons[Math.floor(Math.random() * icons.length)];
        let tiles = [];

        if (activeMode === 'HUNT') {
            const count = 3 + Math.floor(level / 2);
            tiles = Array(12).fill(null).map((_, i) => ({
                id: i,
                icon: Math.random() > 0.6 ? target : icons[Math.floor(Math.random() * icons.length)],
                selected: false
            }));
        } else if (activeMode === 'ROTATE') {
            tiles = Array(4).fill(null).map((_, i) => ({
                id: i,
                icon: target,
                rotation: [90, 180, 270][Math.floor(Math.random() * 3)]
            }));
        } else if (activeMode === 'ODD') {
            const oddIcon = icons.find(i => i !== target);
            tiles = Array(9).fill(target).map((icon, i) => ({ id: i, icon }));
            tiles[Math.floor(Math.random() * 9)].icon = oddIcon;
        }

        setGameData({ tiles, targetLabel: target });
    };

    const handleTileClick = (tile) => {
        if (timer <= 0) return;

        if (activeMode === 'HUNT') {
            const newTiles = gameData.tiles.map(t => t.id === tile.id ? { ...t, selected: !t.selected } : t);
            setGameData({ ...gameData, tiles: newTiles });
            
            const remaining = newTiles.filter(t => t.icon === gameData.targetLabel && !t.selected).length;
            const wrong = newTiles.filter(t => t.icon !== gameData.targetLabel && t.selected).length;
            
            if (remaining === 0 && wrong === 0) {
                advanceLevel();
            }
        } else if (activeMode === 'ROTATE') {
            const newTiles = gameData.tiles.map(t => t.id === tile.id ? { ...t, rotation: (t.rotation + 90) % 360 } : t);
            setGameData({ ...gameData, tiles: newTiles });
            if (newTiles.every(t => t.rotation === 0)) advanceLevel();
        } else if (activeMode === 'ODD') {
            if (tile.icon !== gameData.targetLabel) advanceLevel();
            else setTimer(prev => Math.max(0, prev - 2));
        }
    };

    const advanceLevel = () => {
        setScore(prev => prev + (10 * level) + timer);
        setLevel(prev => prev + 1);
        generateLevel();
    };

    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const toggleRadio = () => {
        if (!window.player) return;
        if (radioOn) {
            window.player.pauseVideo();
        } else {
            window.player.playVideo();
        }
        setRadioOn(!radioOn);
    };

    const saveProfile = () => {
        localStorage.setItem('captcha_profile', JSON.stringify(profile));
        localStorage.setItem('captcha_yt_url', ytUrl);
        if (window.player) {
            window.player.loadVideoById(getYouTubeId(ytUrl));
            window.player.pauseVideo();
            setRadioOn(false);
        }
        setShowProfileModal(false);
    };

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [view, showProfileModal, radioOn]);

    return (
        <div className="w-full max-w-md mx-auto min-h-screen flex flex-col p-4 sm:p-6 bg-[#F7F2FA]">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 fade-in">
                <div onClick={() => handleSetView('menu')} className="cursor-pointer group">
                    <h1 className="text-2xl font-black tracking-tighter text-[#1D1B20] flex items-center gap-2">
                        <span className="bg-[#6750A4] text-white p-1 rounded-lg group-hover:rotate-12 transition-transform">C</span>
                        CHAOS
                    </h1>
                </div>
                <button onClick={() => setShowProfileModal(true)} className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-black/5 flex items-center justify-center hover:bg-purple-50 transition-colors">
                    <i data-lucide="user" className="w-6 h-6 text-[#6750A4]"></i>
                </button>
            </div>

            {view === 'menu' ? (
                <div className="flex-1 flex flex-col fade-in">
                    <div className="mb-8">
                        <p className="text-[#625B71] font-medium">Bentornato, <span className="text-[#6750A4] font-bold">{profile.name}</span></p>
                        <h2 className="text-3xl font-bold text-[#1D1B20]">Scegli una sfida</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {['HUNT', 'ROTATE', 'ODD', 'SPEED', 'MEMORY', 'MIX'].map((mode) => (
                            <button 
                                key={mode}
                                onClick={() => { setActiveMode(mode); setScore(0); setLevel(1); handleSetView('game'); }}
                                className="game-card p-6 flex flex-col items-center gap-3 text-center"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                                    <i data-lucide={mode === 'HUNT' ? 'search' : mode === 'ROTATE' ? 'rotate-cw' : 'fingerprint'} className="w-6 h-6 text-[#6750A4]"></i>
                                </div>
                                <div>
                                    <span className="block font-black text-xs text-purple-400 mb-1">{mode}</span>
                                    <span className="block text-lg font-bold text-[#1D1B20] leading-none">Record</span>
                                    <span className="text-sm font-medium text-[#625B71]">{bestScores[mode] || 0}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Radio Panel - Updated for Mobile */}
                    <div className="mt-auto bg-white p-4 rounded-[32px] shadow-sm border border-black/5">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={toggleRadio}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${radioOn ? 'bg-[#6750A4] text-white scale-95 shadow-lg shadow-purple-200' : 'bg-purple-50 text-[#6750A4]'}`}
                            >
                                <i data-lucide={radioOn ? 'pause' : 'play'} className="w-5 h-5"></i>
                            </button>
                            <div className="flex-1 overflow-hidden">
                                <span className="block text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Lo-Fi Radio</span>
                                <div className="relative">
                                    <span className="block text-sm font-bold text-[#1D1B20] whitespace-nowrap overflow-hidden">
                                        {radioOn ? 'Playing: Lofi Girl - Beats to relax' : 'Radio Spenta'}
                                    </span>
                                </div>
                            </div>
                            {radioOn && (
                                <div className="flex gap-1 items-end h-4">
                                    {[0.3, 0.7, 0.4, 0.9].map((h, i) => (
                                        <div key={i} className="w-1 bg-[#6750A4] rounded-full animate-pulse" style={{height: `${h*100}%`, animationDelay: `${i*0.2}s`}}></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col fade-in">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <span className="text-xs font-black text-purple-400 uppercase tracking-widest">{activeMode}</span>
                            <div className="text-5xl font-black text-[#1D1B20] tracking-tighter">{score}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-black text-purple-400 uppercase tracking-widest">Tempo</div>
                            <div className={`text-2xl font-bold ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-[#1D1B20]'}`}>{timer}s</div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="bg-white p-6 sm:p-8 rounded-[40px] shadow-xl shadow-purple-100/50 border border-black/5 mb-8">
                            <h3 className="text-center text-lg font-bold text-[#625B71] mb-6">
                                {activeMode === 'HUNT' && `Seleziona: ${gameData.targetLabel}`}
                                {activeMode === 'ROTATE' && 'Raddrizza le icone'}
                                {activeMode === 'ODD' && 'Trova l\'intruso'}
                            </h3>
                            
                            <div className={`grid gap-4 ${activeMode === 'ROTATE' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                {gameData.tiles.map((tile) => (
                                    <button 
                                        key={tile.id}
                                        onClick={() => handleTileClick(tile)}
                                        className={`aspect-square rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-300
                                            ${tile.selected ? 'bg-[#6750A4] text-white scale-90' : 'bg-purple-50 text-[#6750A4] hover:bg-purple-100'}
                                        `}
                                        style={{ transform: tile.rotation ? `rotate(${tile.rotation}deg)` : undefined }}
                                    >
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d={ICON_DATA[tile.icon]} />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {timer <= 0 && (
                            <div className="text-center mb-6">
                                <p className="text-red-500 font-bold mb-2">Tempo scaduto!</p>
                                <button onClick={() => { setScore(0); setLevel(1); startTimer(); generateLevel(); }} className="px-8 py-3 bg-[#6750A4] text-white rounded-full font-bold shadow-lg shadow-purple-200">Riprova</button>
                            </div>
                        )}
                        
                        <button onClick={() => handleSetView('menu')} className="w-full py-4 text-[#625B71] font-bold hover:text-[#6750A4] transition-colors">Torna al Menu</button>
                    </div>
                </div>
            )}

            {/* Modal Profilo */}
            {showProfileModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl fade-in">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold">Profilo</h3>
                            <button onClick={() => setShowProfileModal(false)} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"><i data-lucide="x" className="w-6 h-6 text-gray-400"></i></button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-4">Nome</label>
                                <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-4 bg-purple-50/50 rounded-3xl font-bold text-lg outline-none focus:ring-2 ring-purple-200" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-4">YouTube Radio Link</label>
                                <input type="text" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} className="w-full p-4 bg-purple-50/50 rounded-3xl text-xs font-bold outline-none" />
                            </div>
                            <button onClick={saveProfile} className="w-full bg-[#6750A4] text-white py-4 rounded-3xl font-bold shadow-lg shadow-purple-200">Salva Modifiche</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
