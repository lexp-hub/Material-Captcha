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
    rocket: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.71-2.13.09-2.91a2.18 2.18 0 0 0-3.09-.09z M12 15l-3-3m3 3l2 2m-2-2l2-2 M20 4s-7 0-10 10l2 2c10-3 10-10 10-10z"
};

const LABELS = { 
    car: 'Auto', bus: 'Bus', bike: 'Bici', traffic: 'Semafori',
    plane: 'Aerei', gem: 'Gemme', ghost: 'Fantasmi',
    moon: 'Lune', star: 'Stelle', heart: 'Cuori', rocket: 'Razzi'
};

const MODES = {
    HUNT: { name: 'Ricerca', icon: 'layout-grid', desc: 'Trova icone specifiche' },
    ROTATE: { name: 'Allineamento', icon: 'rotate-cw', desc: 'Raddrizza le immagini' },
    ODD: { name: 'L\'Intruso', icon: 'search', desc: 'Trova l\'icona diversa' },
    SPEED: { name: 'Click Rapido', icon: 'zap', desc: 'Tocca prima che sparisca' },
    MEMORY: { name: 'Memoria', icon: 'brain', desc: 'Ricorda la posizione' },
    SEQUENCE: { name: 'Sequenza', icon: 'list-ordered', desc: 'Riproduci l\'ordine mostrato' },
    SLIDE: { name: 'Scivolo', icon: 'arrow-down-circle', desc: 'Tocca le icone in caduta' },
    MIX: { name: 'Mix Caotico', icon: 'shuffle', desc: 'Sottogiochi casuali!' }
};
