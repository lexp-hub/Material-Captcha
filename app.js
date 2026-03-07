const { useState, useEffect, useRef } = React;

function App() {
    const [view, setView] = useState('menu'); 
    const [activeMode, setActiveMode] = useState(null);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30);
    const [bestScores, setBestScores] = useState({});
    const [level, setLevel] = useState(1);
    const [gameData, setGameData] = useState({ 
        tiles: [], 
        targetLabel: '', 
        type: '', 
        sequence: [], 
        currentStep: 0, 
        isShowing: false 
    });
    const [profile, setProfile] = useState({ name: 'ELITE_PLAYER' });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [ytUrl, setYtUrl] = useState('https://www.youtube.com/watch?v=n61ULEU7CO0');
    const [radioOn, setRadioOn] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    
    const canvasRef = useRef(null);
    const timerInterval = useRef(null);
    const slideInterval = useRef(null);

    // Inizializzazione dati e salvataggi
    useEffect(() => {
        const s = localStorage.getItem('captcha_hc_scores');
        if (s) setBestScores(JSON.parse(s));
        const p = localStorage.getItem('captcha_hc_profile');
        if (p) setProfile(JSON.parse(p));
    }, []);

    // Gestione Timer e Loop di Gioco
    useEffect(() => {
        if (view === 'game' && timer > 0) {
            timerInterval.current = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
        } else if (timer <= 0 && view === 'game') {
            handleGameOver();
        }
        return () => {
            clearInterval(timerInterval.current);
            clearInterval(slideInterval.current);
        };
    }, [view, timer]);

    useEffect(() => { if (view === 'game') drawCanvas(); }, [gameData]);

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
            ctx.fillStyle = tile.selected ? '#EADDFF' : (tile.hidden ? '#E7E0EC' : '#FFFFFF');
            ctx.beginPath();
            ctx.roundRect(tile.x, tile.y, tile.w, tile.h, 16);
            ctx.fill();
            if (tile.selected) { ctx.strokeStyle = '#6750A4'; ctx.lineWidth = 4; ctx.stroke(); }
            
            if (!tile.hidden) {
                ctx.translate(tile.x + tile.w/2, tile.y + tile.h/2);
                if (tile.rotation) ctx.rotate(tile.rotation * Math.PI / 180);
                const path = new Path2D(ICON_DATA[tile.iconType] || ICON_DATA.star);
                ctx.strokeStyle = tile.selected ? '#21005D' : '#444';
                ctx.lineWidth = 3; ctx.lineCap = 'round';
                const scale = (tile.w / 64);
                ctx.scale(scale, scale); ctx.translate(-12, -12);
                ctx.stroke(path);
            } else {
                ctx.fillStyle = '#6750A4'; ctx.font = `bold ${tile.w/3}px sans-serif`; ctx.textAlign = 'center';
                ctx.fillText('?', tile.x + tile.w/2, tile.y + tile.h/2 + (tile.w/10));
            }
            ctx.restore();
        });
    };

    const generateLevel = (mode, currentLevel) => {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const margin = 10;
        const validIcons = Object.keys(ICON_DATA);
        
        let type = mode === 'MIX' ? Object.keys(MODES).filter(m => m !== 'MIX')[Math.floor(Math.random()*7)] : mode;
        let tiles = [];
        const gridSize = currentLevel < 4 ? 3 : (currentLevel < 10 ? 4 : 5);

        if (type === 'HUNT') {
            const target = validIcons[Math.floor(Math.random()*validIcons.length)];
            const size = (rect.width - margin*(gridSize+1)) / gridSize;
            for(let i=0; i < gridSize * gridSize; i++){
                const isT = Math.random() > 0.7;
                tiles.push({ 
                    id: i, iconType: isT ? target : validIcons.filter(x=>x!==target)[Math.floor(Math.random()*(validIcons.length-1))], 
                    isTarget: isT, x: margin + (i%gridSize)*(size+margin), y: margin + Math.floor(i/gridSize)*(size+margin), w: size, h: size 
                });
            }
            if(!tiles.some(t => t.isTarget)) { tiles[0].isTarget = true; tiles[0].iconType = target; }
            setGameData({ tiles, targetLabel: `Trova: ${LABELS[target]}`, type: 'HUNT' });

        } else if (type === 'SEQUENCE') {
            const size = (rect.width - margin*4) / 3;
            const seqLen = Math.min(8, 3 + Math.floor(currentLevel/3));
            const sequence = [];
            for(let i=0; i<9; i++) {
                tiles.push({ id: i, iconType: validIcons[i % validIcons.length], x: margin+(i%3)*(size+margin), y: margin+Math.floor(i/3)*(size+margin), w: size, h: size });
            }
            for(let j=0; j<seqLen; j++) sequence.push(Math.floor(Math.random()*9));
            
            setGameData({ tiles, targetLabel: 'Memorizza...', type: 'SEQUENCE', sequence, currentStep: 0, isShowing: true });
            
            let idx = 0;
            const showInt = setInterval(() => {
                if (idx >= sequence.length) {
                    clearInterval(showInt);
                    setGameData(d => ({ ...d, isShowing: false, targetLabel: 'Ripeti!' }));
                    return;
                }
                const cur = sequence[idx];
                setGameData(d => ({ ...d, tiles: d.tiles.map(t => t.id === cur ? {...t, selected: true} : {...t, selected: false}) }));
                setTimeout(() => setGameData(d => ({ ...d, tiles: d.tiles.map(t => ({...t, selected: false})) })), 400);
                idx++;
            }, 800);

        } else if (type === 'SLIDE') {
            setGameData({ tiles: [], targetLabel: 'Prendile tutte!', type: 'SLIDE' });
            clearInterval(slideInterval.current);
            slideInterval.current = setInterval(() => {
                const icon = validIcons[Math.floor(Math.random()*validIcons.length)];
                const size = 70;
                setGameData(d => ({
                    ...d,
                    tiles: [...d.tiles, { id: Date.now(), iconType: icon, x: Math.random()*(rect.width-size), y: -size, w: size, h: size, speed: 2.5 + (currentLevel*0.3) }]
                }));
            }, Math.max(300, 1000 - currentLevel*60));

            const move = () => {
                setGameData(d => d.type === 'SLIDE' ? { ...d, tiles: d.tiles.map(t => ({...t, y: t.y + t.speed})).filter(t => t.y < rect.height) } : d);
                if (view === 'game') requestAnimationFrame(move);
            };
            requestAnimationFrame(move);

        } else if (type === 'ROTATE') {
            const icon = validIcons[Math.floor(Math.random()*validIcons.length)];
            const size = (rect.width - margin*3) / 2;
            const step = currentLevel > 10 ? 45 : 90;
            for(let i=0; i<4; i++){
                tiles.push({ id: i, iconType: icon, rotation: (Math.floor(Math.random()*3)+1)*step, x: margin+(i%2)*(size+margin), y: margin+Math.floor(i/2)*(size+margin), w: size, h: size });
            }
            setGameData({ tiles, targetLabel: 'Raddrizza', type: 'ROTATE' });

        } else if (type === 'ODD') {
            const base = validIcons[Math.floor(Math.random()*validIcons.length)];
            const odd = validIcons.filter(x=>x!==base)[Math.floor(Math.random()*(validIcons.length-1))];
            const size = (rect.width - margin*(gridSize+1)) / gridSize;
            const targetIdx = Math.floor(Math.random()*(gridSize*gridSize));
            for(let i=0; i < gridSize*gridSize; i++){
                tiles.push({ id: i, iconType: i === targetIdx ? odd : base, isTarget: i === targetIdx, x: margin+(i%gridSize)*(size+margin), y: margin+Math.floor(i/gridSize)*(size+margin), w: size, h: size });
            }
            setGameData({ tiles, targetLabel: 'Trova l\'intruso', type: 'ODD' });

        } else if (type === 'SPEED') {
            const icon = validIcons[Math.floor(Math.random()*validIcons.length)];
            const size = Math.max(50, 100 - currentLevel * 4);
            tiles.push({ id: 0, iconType: icon, isTarget: true, x: Math.random()*(rect.width-size), y: Math.random()*(rect.height-size), w: size, h: size });
            setGameData({ tiles, targetLabel: 'TOCCA!', type: 'SPEED' });
            setTimeout(() => setGameData(d => d.type === 'SPEED' ? { ...d, tiles: [] } : d), Math.max(300, 1500 - currentLevel * 80));

        } else if (type === 'MEMORY') {
            const icon = validIcons[Math.floor(Math.random()*validIcons.length)];
            const size = (rect.width - margin*(gridSize+1)) / gridSize;
            const targetIdx = Math.floor(Math.random()*(gridSize*gridSize));
            for(let i=0; i < gridSize*gridSize; i++){
                tiles.push({ id: i, iconType: icon, isTarget: i === targetIdx, hidden: true, x: margin+(i%gridSize)*(size+margin), y: margin+Math.floor(i/gridSize)*(size+margin), w: size, h: size });
            }
            setGameData({ tiles, targetLabel: 'Dov\'era?', type: 'MEMORY' });
            setTimeout(() => {
                setGameData(d => ({ ...d, tiles: d.tiles.map((t, idx) => idx === targetIdx ? {...t, hidden: false} : t) }));
                setTimeout(() => setGameData(d => ({ ...d, tiles: d.tiles.map(t => ({...t, hidden: true})) })), Math.max(200, 800 - currentLevel * 50));
            }, 600);
        }
    };

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newTiles = [...gameData.tiles];
        let clickedId = -1;
        newTiles.forEach(t => { if(x >= t.x && x <= t.x+t.w && y >= t.y && y <= t.y+t.h) clickedId = t.id; });
        
        if(clickedId === -1) return;
        
        if(gameData.type === 'HUNT'){
            const idx = newTiles.findIndex(t => t.id === clickedId);
            newTiles[idx].selected = !newTiles[idx].selected;
            setGameData({...gameData, tiles: newTiles});
        } else if(gameData.type === 'SEQUENCE'){
            if (gameData.isShowing) return;
            if (clickedId === gameData.sequence[gameData.currentStep]) {
                const nextStep = gameData.currentStep + 1;
                if (nextStep === gameData.sequence.length) handleWin();
                else setGameData({ ...gameData, currentStep: nextStep });
            } else triggerPenalty();
        } else if(gameData.type === 'SLIDE'){
            setGameData(d => ({ ...d, tiles: d.tiles.filter(t => t.id !== clickedId) }));
            setScore(s => s + 25);
            if (score % 250 === 0) setTimer(t => Math.min(60, t + 2));
        } else if(gameData.type === 'ROTATE'){
            const idx = newTiles.findIndex(t => t.id === clickedId);
            const step = level > 10 ? 45 : 90;
            newTiles[idx].rotation = (newTiles[idx].rotation + step) % 360;
            setGameData({...gameData, tiles: newTiles});
            if(newTiles.every(t => t.rotation === 0)) setTimeout(handleWin, 150);
        } else {
            const idx = newTiles.findIndex(t => t.id === clickedId);
            if(newTiles[idx].isTarget) handleWin(); else triggerPenalty();
        }
    };

    const triggerPenalty = () => {
        setIsWrong(true);
        setTimer(t => Math.max(0, t - 8));
        setTimeout(() => setIsWrong(false), 500);
    };

    const handleWin = () => {
        clearInterval(slideInterval.current);
        const bonus = Math.floor(timer * 0.6);
        setScore(s => s + 100 + bonus);
        setTimer(t => Math.min(50, t + 5));
        setLevel(l => l + 1);
        generateLevel(activeMode, level + 1);
    };

    const handleGameOver = () => {
        clearInterval(slideInterval.current);
        const m = activeMode || 'MIX';
        const b = { ...bestScores };
        if (score > (b[m] || 0)) {
            b[m] = score; setBestScores(b);
            localStorage.setItem('captcha_hc_scores', JSON.stringify(b));
        }
        setView('results');
    };

    const startGame = (m) => {
        setActiveMode(m); setScore(0); setTimer(30); setLevel(1); setView('game');
        setTimeout(() => generateLevel(m, 1), 200);
    };

    return (
        /* UI JSX (Come implementato precedentemente ma collegata a queste logiche) */
        <div className="w-full h-full">...</div> 
    );
}

export default App;

