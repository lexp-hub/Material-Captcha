# 🛡️ Captcha Chaos
(veramente un fantastico nome XD, mi ricorda i nomi dei smartphone nel 2019 )

> **"Sei un robot o un umano?"** Metti alla prova i tuoi riflessi e la tua velocità mentale in una sfida ispirata ai test CAPTCHA più famosi, trasformati in un gioco arcade frenetico.


## 🚀 Panoramica

**Captcha Chaos** è un'applicazione web interattiva costruita con **React** e **Tailwind CSS**. Il gioco sfida l'utente a risolvere mini-puzzle basati su icone nel minor tempo possibile. Più sei veloce, più alto sarà il punteggio!

### 🎮 Modalità di Gioco

Il gioco include 6 modalità uniche per testare diverse abilità cognitive:

* **🔍 Ricerca (HUNT):** Seleziona tutte le icone specifiche in una griglia.
* **🔄 Allineamento (ROTATE):** Ruota le icone finché non sono tutte orientate correttamente.
* **🕵️ L'Intruso (ODD):** Identifica l'unica icona diversa tra una folla di simili.
* **⚡ Click Rapido (SPEED):** Tocca l'icona prima che scompaia!
* **🧠 Memoria (MEMORY):** Ricorda la posizione dell'icona target dopo che è stata nascosta.
* **🔀 Mix Caotico (MIX):** Una rotazione casuale di tutte le modalità precedenti per i veri esperti.


## ✨ Caratteristiche Principali

* **Interfaccia Premium:** Design moderno e pulito basato su **Material Design 3** con effetti di trasparenza (Glassmorphism).
* **Sistema di Livelli:** Difficoltà progressiva e bonus di punteggio basati sul tempo rimanente.
* **Radio Integrata:** Player YouTube integrato per ascoltare musica (es. Lo-Fi radio) durante le sessioni di gioco, con visualizzatore animato.
* **Persistenza Dati:** I tuoi record personali e il profilo utente vengono salvati automaticamente nel `localStorage` del browser.
* **Responsive Design:** Ottimizzato per desktop, tablet e smartphone grazie a Tailwind CSS.
* **Simboli SVG:** Sono codici SVG (Scalable Vector Graphics) che descrivono forme, comunemente usate in interfacce web e app. 


## 🛠️ Tecnologie Utilizzate

* **Frontend:** [React.js](https://reactjs.org/) (Hooks: `useState`, `useEffect`, `useRef`).
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) per il layout e animazioni custom.
* **Iconografia:** [Lucide Icons](https://lucide.dev/) per un look vettoriale nitido.
* **Grafica:** HTML5 **Canvas API** per il rendering fluido dei puzzle.
* **Audio:** YouTube IFrame Player API.


## 📂 Struttura dei File

* `index.html`: Punto di ingresso, include le librerie esterne e definisce il container della YouTube API.
* `app.js`: Il cuore pulsante del gioco. Gestisce la logica dei puzzle, il timer e lo stato della UI.
* `constants.js`: Contiene i dati delle icone (path SVG) e le configurazioni delle modalità di gioco.
* `style.css`: Personalizzazioni CSS, variabili di colore e animazioni (float, bounce, fade-in).


## 🛠️ Installazione e Utilizzo

1. Clona il repository.
2. Assicurati che tutti i file siano nella stessa cartella.
3. Apri `index.html` direttamente nel tuo browser (o usa un server locale come *Live Server* su VS Code).

Non è necessaria alcuna compilazione (grazie a Babel standalone)!


## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT.
