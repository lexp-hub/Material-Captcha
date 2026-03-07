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

    useEffect(() => {
        window.onYouTubeIframeAPIReady = () => {
            if (!window.player) {
                window.player = new YT.Player('youtube-player', {
                    height: '0', 
                    width: '0', 
                    videoId: getYouTubeId(ytUrl) || 'n61ULEU7CO0',
                    playerVars: { 
                        'autoplay': 0, 
                        'controls': 0, 
                        'modestbranding': 1, 
                        'rel': 0,
                        'enablejsapi': 1,
                        'origin': window.location.origin,
                        'mute': 0
                    },
                    events: {
                        'onReady': function(event) {
                            event.target.setVolume(100);
                        }
                    }
                });
            }
        };

        const s = localStorage.getItem('captcha_ultra_scores');
        if (s) setBestScores(JSON.parse(s));
        const p = localStorage.getItem('captcha_ultra_profile');
        if (p) setProfile(JSON.parse(p));
        const y = localStorage.getItem('captcha_ultra_yt');
        if (y) setYtUrl(y);

        // Ripristina l'ultima partita salvata
        const savedState = localStorage.getItem('captcha_ultra_state');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.view) setView(parsed.view);
                if (parsed.activeMode !== undefined) setActiveMode(parsed.activeMode);
                if (parsed.currentGameType !== undefined) setCurrentGameType(parsed.currentGameType);
                if (parsed.score !== undefined) setScore(parsed.score);
                if (parsed.timer !== undefined) setTimer(parsed.timer);
                if (parsed.level !== undefined) setLevel(parsed.level);
                if (parsed.gameData) setGameData(parsed.gameData);
            } catch (e) {
                console.error('Errore nel ripristino dello stato', e);
            }
        }
    }, []);

    // Salvataggio continuo dei progressi di gioco in locale
    useEffect(() => {
        const stateToPersist = {
            view,
            activeMode,
            currentGameType,
            score,
            timer,
            level,
            gameData
        };
        try {
            localStorage.setItem('captcha_ultra_state', JSON.stringify(stateToPersist));
        } catch (e) {
            console.error('Impossibile salvare lo stato locale', e);
        }
    }, [view, activeMode, currentGameType, score, timer, level, gameData]);

    const getYouTubeId = (url) => {
        try {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : 'n61ULEU7CO0';
        } catch { return 'n61ULEU7CO0'; }
    };

    useEffect(() => {
        const controlPlayer = () => {
            try {
                if (window.player && typeof window.player.playVideo === 'function') {
                    if (radioOn) {
                        window.player.playVideo();
                        if (typeof window.player.unMute === 'function') window.player.unMute();
                    } else {
                        window.player.pauseVideo();
                    }
                }
            } catch (e) { console.error(e); }
        };
        controlPlayer();
        if (window.lucide) setTimeout(() => window.lucide.createIcons(), 100);
    }, [radioOn]);

    useEffect(() => {
        if (window.player && typeof window.player.loadVideoById === 'function') {
            window.player.loadVideoById(getYouTubeId(ytUrl));
            if (!radioOn) window.player.pauseVideo();
        }
    }, [ytUrl]);

    useEffect(() => {
        if (view === 'game' && timer > 0) {
            timerInterval.current = setInterval(() => setTimer(t => t - 1), 1000);
        } else if (timer <= 0 && view === 'game') {
            handleGameOver();
        }
        return () => clearInterval(timerInterval.current);
    }, [view, timer]);

    useEffect(() => {
        const updateIcons = () => {
            try { if (window.lucide) window.lucide.createIcons(); } catch (e) {}
        };
        if (view === 'game') drawCanvas();
        updateIcons();
        const timeoutId = setTimeout(updateIcons, 100);
        return () => clearTimeout(timeoutId);
    }, [view, gameData, radioOn, showProfileModal]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, rect.width, rect.height);

        gameData.tiles.forEach(tile => {
            ctx.save();
            ctx.fillStyle = tile.selected ? '#F0E7F6' : (tile.hidden ? '#F5F5F5' : '#FFFFFF');
            ctx.beginPath();
            ctx.roundRect(tile.x, tile.y, tile.w, tile.h, 20);
            ctx.fill();
            if (tile.selected) {
                ctx.strokeStyle = '#6750A4';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            if (!tile.hidden) {
                ctx.translate(tile.x + tile.w/2, tile.y + tile.h/2);
                if (tile.rotation) ctx.rotate(tile.rotation * Math.PI / 180);
                const path = new Path2D(ICON_DATA[tile.iconType]);
                ctx.strokeStyle = tile.selected ? '#6750A4' : '#49454F';
                ctx.lineWidth = 2.5;
                ctx.lineCap = 'round';
                ctx.scale(1.4, 1.4);
                ctx.translate(-12, -12);
                ctx.stroke(path);
            } else {
                ctx.fillStyle = '#CAC4D0';
                ctx.font = 'bold 20px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('?', tile.x + tile.w/2, tile.y + tile.h/2 + 7);
            }
            ctx.restore();
        });
    };

    const generateLevel = (mode) => {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const margin = 10;
        const icons = Object.keys(ICON_DATA);
        let type = mode === 'MIX' ? Object.keys(MODES).filter(m => m !== 'MIX')[Math.floor(Math.random()*5)] : mode;
        setCurrentGameType(type);
        let tiles = [];
        if (type === 'HUNT') {
            const target = icons[Math.floor(Math.random()*icons.length)];
            const size = (rect.width - margin*4) / 3;
            for(let i=0; i<9; i++){
                const isT = Math.random() > 0.6;
                tiles.push({ id: i, iconType: isT ? target : icons.filter(x=>x!==target)[Math.floor(Math.random()*(icons.length-1))], isTarget: isT, x: margin + (i%3)*(size+margin), y: margin + Math.floor(i/3)*(size+margin), w: size, h: size });
            }
            if(!tiles.some(t => t.isTarget)) tiles[0].isTarget = true;
            setGameData({ tiles, targetLabel: `Seleziona tutti i: ${LABELS[target]}` });
        } else if (type === 'ROTATE') {
            const icon = icons[Math.floor(Math.random()*icons.length)];
            const size = (rect.width - margin*3) / 2;
            for(let i=0; i<4; i++){
                tiles.push({ id: i, iconType: icon, rotation: [90, 180, 270][Math.floor(Math.random()*3)], x: margin + (i%2)*(size+margin), y: margin + Math.floor(i/2)*(size+margin), w: size, h: size });
            }
            setGameData({ tiles, targetLabel: 'Allinea correttamente le icone' });
        } else if (type === 'ODD') {
            const base = icons[Math.floor(Math.random()*icons.length)];
            const odd = icons.filter(x=>x!==base)[Math.floor(Math.random()*(icons.length-1))];
            const size = (rect.width - margin*4) / 3;
            const oddIdx = Math.floor(Math.random()*9);
            for(let i=0; i<9; i++){
                tiles.push({ id: i, iconType: i === oddIdx ? odd : base, isTarget: i === oddIdx, x: margin + (i%3)*(size+margin), y: margin + Math.floor(i/3)*(size+margin), w: size, h: size });
            }
            setGameData({ tiles, targetLabel: 'Trova l\'icona diversa dalle altre' });
        } else if (type === 'SPEED') {
            const icon = icons[Math.floor(Math.random()*icons.length)];
            const size = 80;
            tiles.push({ id: 0, iconType: icon, isTarget: true, x: Math.random()*(rect.width-size), y: Math.random()*(rect.height-size), w: size, h: size });
            setGameData({ tiles, targetLabel: 'Tocca l\'icona prima che sia tardi!' });
        } else if (type === 'MEMORY') {
            const icon = icons[Math.floor(Math.random()*icons.length)];
            const size = (rect.width - margin*4) / 3;
            const targetIdx = Math.floor(Math.random()*9);
            for(let i=0; i<9; i++){
                tiles.push({ id: i, iconType: icon, isTarget: i === targetIdx, hidden: true, x: margin + (i%3)*(size+margin), y: margin + Math.floor(i/3)*(size+margin), w: size, h: size });
            }
            setGameData({ tiles, targetLabel: 'Dov\'era l\'icona?' });
            setTimeout(() => {
                setGameData(d => ({ ...d, tiles: d.tiles.map((t, idx) => idx === targetIdx ? {...t, hidden: false} : t) }));
                setTimeout(() => setGameData(d => ({ ...d, tiles: d.tiles.map(t => ({...t, hidden: true})) })), 600);
            }, 300);
        }
    };

    const handleCanvasClick = (e) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newTiles = [...gameData.tiles];
        let clickedId = -1;
        newTiles.forEach(t => {
            if(x >= t.x && x <= t.x+t.w && y >= t.y && y <= t.y+t.h) clickedId = t.id;
        });
        if(clickedId === -1) return;
        if(currentGameType === 'HUNT'){
            newTiles[clickedId].selected = !newTiles[clickedId].selected;
            setGameData({...gameData, tiles: newTiles});
        } else if(currentGameType === 'ROTATE'){
            newTiles[clickedId].rotation = (newTiles[clickedId].rotation + 90) % 360;
            setGameData({...gameData, tiles: newTiles});
            if(newTiles.every(t => t.rotation === 0)) setTimeout(handleWin, 150);
        } else {
            if(newTiles[clickedId].isTarget) handleWin();
            else setTimer(t => Math.max(0, t - 4));
        }
    };

    const handleWin = () => {
        setScore(s => s + 100 + (timer * 2));
        setTimer(t => Math.min(40, t + 4));
        setLevel(l => l + 1);
        generateLevel(activeMode);
    };

    const handleGameOver = () => {
        setView('results');
        const currentMode = activeMode || 'MIX';
        const newBests = { ...bestScores, [currentMode]: Math.max(bestScores[currentMode] || 0, score) };
        setBestScores(newBests);
        localStorage.setItem('captcha_ultra_scores', JSON.stringify(newBests));
    };

    const startGame = (m) => {
        setActiveMode(m);
        setScore(0);
        setTimer(30);
        setLevel(1);
        setView('game');
        setTimeout(() => generateLevel(m), 100);
    };

    const saveProfile = () => {
        localStorage.setItem('captcha_ultra_profile', JSON.stringify(profile));
        localStorage.setItem('captcha_ultra_yt', ytUrl);
        setShowProfileModal(false);
    };

    return (
        <div className="w-full h-full flex flex-col fade-in">
            <header className="pattern-bg p-6 sm:p-8 pt-10 sm:pt-12 pb-12 sm:pb-16 rounded-b-[40px] sm:rounded-b-[60px] shadow-2xl relative z-30">
                <div className="flex justify-between items-center text-white max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-3 sm:gap-6">
                        <button onClick={() => setView('menu')} className="w-10 h-10 sm:w-14 sm:h-14 glass-panel flex items-center justify-center text-white border-white/20 hover:bg-white/30 active:scale-90 transition-all">
                            <i data-lucide={view === 'game' ? "arrow-left" : "shield-check"} className="w-5 h-5 sm:w-7 sm:h-7"></i>
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-3xl font-black tracking-tight">Captcha Ultra</h1>
                            <p className="text-[8px] sm:text-xs font-bold text-white/60 uppercase tracking-[0.2em] mt-0.5 sm:mt-1">{profile.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {view === 'game' && <button onClick={() => setView('menu')} className="px-3 py-1.5 sm:px-6 sm:py-3 glass-panel text-white font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-white/20">Menu</button>}
                        <button onClick={() => setShowProfileModal(true)} className="w-10 h-10 sm:w-14 sm:h-14 glass-panel flex items-center justify-center text-white border-white/20 hover:bg-white/30"><i data-lucide="settings" className="w-5 h-5 sm:w-7 sm:h-7"></i></button>
                    </div>
                </div>
                {view === 'menu' && (
                    <div className="mt-6 sm:mt-10 bg-black/30 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 flex items-center justify-between border border-white/10 max-w-2xl mx-auto w-full shadow-2xl">
                        <div className="flex items-center gap-3 sm:gap-5">
                            <button key={`radio-${radioOn}`} onClick={() => setRadioOn(!radioOn)} className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all ${radioOn ? 'bg-green-400 text-black shadow-[0_0_20px_rgba(74,222,128,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}><i data-lucide={radioOn ? "volume-2" : "volume-x"} className="w-5 h-5 sm:w-6 sm:h-6"></i></button>
                            <div><p className="text-[8px] sm:text-[10px] font-black text-green-400 uppercase tracking-widest mb-0.5 sm:mb-1">Live Stream</p><p className="text-xs sm:text-sm font-bold text-white">YouTube Player</p></div>
                        </div>
                        {radioOn && <div className="radio-visualizer pr-2 sm:pr-4 space-x-0.5 sm:space-x-1">{[1,2,3,4,5,6].map(i => <div key={i} className="bar w-0.5 sm:w-1 bg-green-400" style={{animationDelay: `${i*0.1}s`, height: '15px'}} />)}</div>}
                    </div>
                )}
            </header>

            <main className="flex-1 px-4 sm:px-8 -mt-8 sm:-mt-10 overflow-hidden relative z-20 max-w-6xl mx-auto w-full">
                {view === 'menu' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 h-full overflow-y-auto custom-scroll pb-20 pt-4 px-1">
                        <div className="sm:col-span-2 lg:col-span-3 bg-white/80 backdrop-blur-md game-card p-6 sm:p-10 text-center border-none shadow-2xl mb-1 sm:mb-2">
                            <h2 className="text-2xl sm:text-4xl font-black text-[#21005D]">Pronto alla sfida?</h2>
                            <p className="text-sm sm:text-lg text-gray-500 font-medium italic mt-2 sm:mt-3">Metti alla prova i tuoi riflessi!</p>
                        </div>
                        {Object.entries(MODES).map(([key, data]) => (
                            <button key={key} onClick={() => startGame(key)} className={`game-card p-5 sm:p-8 w-full flex sm:flex-col items-center text-center gap-4 sm:gap-6 border-none group transition-all ${key === 'MIX' ? 'bg-[#6750A4] text-white shadow-purple-500/20' : 'bg-white hover:bg-purple-50/50'}`}>
                                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[32px] flex items-center justify-center shrink-0 transition-transform sm:group-hover:scale-110 sm:group-hover:rotate-3 ${key === 'MIX' ? 'bg-white/20' : 'bg-purple-100 text-[#6750A4]'}`}><i data-lucide={data.icon} className="w-7 h-7 sm:w-10 sm:h-10"></i></div>
                                <div className="text-left sm:text-center space-y-1 sm:space-y-2">
                                    <h3 className="font-black text-lg sm:text-2xl tracking-tight">{data.name}</h3>
                                    <div className={`px-3 py-0.5 sm:px-4 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold inline-block ${key === 'MIX' ? 'bg-white/20 text-white' : 'bg-purple-50 text-[#6750A4]'}`}>Record: {bestScores[key] || 0}</div>
                                    <p className={`text-[10px] sm:text-xs leading-relaxed opacity-60 hidden sm:block ${key === 'MIX' ? 'text-white' : 'text-gray-500'}`}>{data.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {view === 'game' && (
                    <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 mt-4 sm:mt-6 h-full pb-10 overflow-y-auto custom-scroll sm:overflow-hidden">
                        <div className="flex-1 min-h-fit">
                            <div className="game-card overflow-hidden bg-white/90 backdrop-blur-md border-none shadow-2xl h-fit">
                                <div className="bg-[#6750A4] p-4 sm:p-8 text-white flex justify-between items-center">
                                    <h2 className="text-base sm:text-2xl font-black tracking-tight truncate pr-2">{gameData.targetLabel}</h2>
                                    <div className={`text-xl sm:text-3xl font-black px-4 py-1 sm:px-6 sm:py-2 rounded-xl sm:rounded-2xl backdrop-blur-md ${timer < 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20'}`}>{timer}s</div>
                                </div>
                                <div className="p-4 sm:p-10 bg-gray-50/50 flex justify-center">
                                    <div className="w-full max-w-[550px] aspect-square relative rounded-[24px] sm:rounded-[40px] overflow-hidden border-[6px] sm:border-[12px] border-white shadow-2xl">
                                        <canvas id="game-canvas" ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full cursor-pointer bg-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-96 flex flex-col gap-4 sm:gap-8 mb-10 sm:mb-0">
                            {currentGameType === 'HUNT' && (
                                <button onClick={() => { if(gameData.tiles.every(t => (t.isTarget && t.selected) || (!t.isTarget && !t.selected))) handleWin(); else setTimer(t => Math.max(0, t-5)); }} className="w-full bg-[#6750A4] text-white py-5 sm:py-8 rounded-[20px] sm:rounded-[32px] font-black text-xl sm:text-3xl shadow-xl active:scale-95 transition-all uppercase">Verifica</button>
                            )}
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 bg-white/80 backdrop-blur-md p-4 sm:p-8 rounded-[32px] sm:rounded-[48px] shadow-xl">
                                <div className="flex items-center justify-between p-3 sm:p-6 bg-purple-50/50 rounded-2xl sm:rounded-3xl">
                                    <div><p className="text-[10px] sm:text-xs font-black text-purple-400 uppercase tracking-widest">Livello</p><p className="text-2xl sm:text-4xl font-black text-[#21005D]">{level}</p></div>
                                    <i data-lucide="layers" className="hidden sm:block w-6 h-6 text-[#6750A4]"></i>
                                </div>
                                <div className="flex items-center justify-between p-3 sm:p-6 bg-purple-50/50 rounded-2xl sm:rounded-3xl">
                                    <div><p className="text-[10px] sm:text-xs font-black text-purple-400 uppercase tracking-widest">Score</p><p className="text-2xl sm:text-4xl font-black text-[#6750A4]">{score}</p></div>
                                    <i data-lucide="award" className="hidden sm:block w-6 h-6 text-green-500"></i>
                                </div>
                            </div>
                            <button onClick={() => setView('menu')} className="w-full py-2 sm:py-4 text-gray-400 font-bold flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest hover:text-red-400">Esci</button>
                        </div>
                    </div>
                )}

                {view === 'results' && (
                    <div className="bg-white/90 backdrop-blur-md rounded-[40px] sm:rounded-[60px] p-8 sm:p-16 text-center mt-6 sm:mt-10 shadow-2xl max-w-2xl mx-auto w-full">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-yellow-400 rounded-2xl sm:rounded-[32px] flex items-center justify-center mx-auto mb-6 sm:mb-10 shadow-xl"><i data-lucide="trophy" className="w-8 h-8 sm:w-12 sm:h-12 text-white"></i></div>
                        <h2 className="text-2xl sm:text-5xl font-black text-[#21005D] mb-2 sm:mb-4">Ottimo Lavoro!</h2>
                        <p className="text-sm sm:text-xl text-gray-500 mb-8 sm:mb-12">Punteggio finale:</p>
                        <div className="text-6xl sm:text-9xl font-black text-[#6750A4] mb-10 sm:mb-16 tracking-tighter">{score}</div>
                        <button onClick={() => setView('menu')} className="w-full bg-[#21005D] text-white py-5 sm:py-8 rounded-[20px] sm:rounded-[32px] font-black text-lg sm:text-2xl active:scale-95 transition-all shadow-xl uppercase">Continua</button>
                    </div>
                )}
            </main>

            {showProfileModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md">
                    <div className="bg-white p-8 sm:p-12 rounded-[40px] sm:rounded-[56px] w-full max-w-md shadow-2xl animate-fadeIn">
                        <div className="flex justify-between items-center mb-6 sm:mb-10"><h3 className="text-2xl sm:text-3xl font-black text-[#21005D]">Impostazioni</h3><button onClick={() => setShowProfileModal(false)} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center"><i data-lucide="x" className="w-6 h-6 text-gray-400"></i></button></div>
                        <div className="space-y-6 sm:space-y-8">
                            <div className="space-y-2 sm:space-y-3"><label className="text-[10px] sm:text-xs font-black text-purple-400 uppercase tracking-widest ml-2 sm:ml-4">Profilo</label><input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full p-4 sm:p-6 bg-purple-50/50 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl outline-none" /></div>
                            <div className="space-y-2 sm:space-y-3"><label className="text-[10px] sm:text-xs font-black text-purple-400 uppercase tracking-widest ml-2 sm:ml-4">YouTube URL</label><input type="text" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="Link radio..." className="w-full p-4 sm:p-6 bg-purple-50/50 rounded-2xl sm:rounded-3xl text-xs sm:text-sm font-bold outline-none" /></div>
                            <button onClick={saveProfile} className="w-full bg-[#6750A4] text-white py-4 sm:py-6 rounded-2xl sm:rounded-[32px] font-black text-lg sm:text-xl shadow-xl hover:bg-[#21005D] transition-all uppercase">Salva</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
