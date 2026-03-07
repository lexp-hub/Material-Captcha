const ICON_DATA = {
    car: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2 M7 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M13 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
    bus: "M8 6v6M16 6v6M2 9h20M2 15h20M4 18h2M18 18h2M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z",
    bike: "M15 17.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0 M4 17.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0 M12 17.5V14l-3-3 4-3 2 3h2 M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
    traffic: "M12 2v20M9 5h6M9 11h6M9 17h6",
    plane: "M15.5 21.5 14 15l3.5-4c1.2-1.3 1.7-3 .7-3.7-.9-.7-2.3-.2-3.5 1L11 12 5.5 11c-.5 0-.9.2-1.1.6l-.3.6c-.2.4 0 .9.3 1.1L8 15l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
    gem: "M6 3h12l4 6-10 12L2 9z",
    ghost: "M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    rocket: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.71-2.13.09-2.91a2.18 2.18 0 0 0-3.09-.09z M12 15l-3-3m3 3l2 2m-2-2l2-2 M20 4s-7 0-10 10l2 2c10-3 10-10 10-10z",
    sun: "M12 4V2M12 22v-2M4.22 4.22 5.64 5.64M18.36 18.36 19.78 19.78M2 12h2M20 12h2M4.22 19.78 5.64 18.36M18.36 5.64 19.78 4.22M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8z",
    cloud: "M17.5 19a4.5 4.5 0 0 0-.5-9h-1A6 6 0 1 0 7 15h10.5z",
    leaf: "M12 2v20M19 5c-4 6-10 8-14 8c0 4 2 6 6 6c8 0 10-8 8-14z",
    umbrella: "M4 12a8 8 0 0 1 16 0H4Zm8 0v7a2 2 0 1 0 4 0",
    anchor: "M12 2v14m0-7a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-7 3a7 7 0 0 0 14 0M5 12H3m16 0h2",
    music: "M9 18V5l12-2v13M9 18a3 3 0 1 0 0 6a3 3 0 0 0 0-6Zm12-2a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z",
    coffee: "M3 8h13v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z M16 10h2a3 3 0 0 1 0 6h-2",
    paw: "M11 6a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0ZM5 11a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm14 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0ZM12 12c-2 0-4 2-4 4c0 2 1.5 4 4 4s4-2 4-4c0-2-2-4-4-4Z",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V5.5A2.5 2.5 0 0 1 6.5 3H20v14h-13.5A2.5 2.5 0 0 0 4 19.5Z",
    key: "M21 7a5 5 0 1 0-9.58 1.65L5 15v4h4l6.42-6.42A5 5 0 0 0 21 7Zm-5 0a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"
};

const LABELS = { 
    car: 'Auto', bus: 'Bus', bike: 'Bici', traffic: 'Semafori',
    plane: 'Aerei', gem: 'Gemme', ghost: 'Fantasmi',
    moon: 'Lune', star: 'Stelle', heart: 'Cuori', rocket: 'Razzi',
    sun: 'Soli', cloud: 'Nuvole', leaf: 'Foglie', umbrella: 'Ombrelli', anchor: 'Ancore',
    music: 'Note', coffee: 'Caffè', paw: 'Impronte', book: 'Libri', key: 'Chiavi'
};

const MODES = {
    HUNT: { name: 'Ricerca', icon: 'layout-grid', desc: 'Trova icone specifiche' },
    ROTATE: { name: 'Allineamento', icon: 'rotate-cw', desc: 'Raddrizza le immagini' },
    ODD: { name: 'L\'Intruso', icon: 'search', desc: 'Trova l\'icona diversa' },
    SPEED: { name: 'Click Rapido', icon: 'zap', desc: 'Tocca prima che sparisca' },
    MEMORY: { name: 'Memoria', icon: 'brain', desc: 'Ricorda la posizione' },
    FLASH: { name: 'Flash', icon: 'highlighter', desc: 'Memorizza i lampeggi e tocca' },
    PAIRS: { name: 'Coppie', icon: 'grid', desc: 'Trova le coppie uguali' },
    SEQUENCE: { name: 'Sequenza', icon: 'list-ordered', desc: 'Riproduci l\'ordine mostrato' },
    SLIDE: { name: 'Scivolo', icon: 'arrow-down-circle', desc: 'Tocca le icone in caduta' },
    MIX: { name: 'Mix Caotico', icon: 'shuffle', desc: 'Sottogiochi casuali!' }
};
