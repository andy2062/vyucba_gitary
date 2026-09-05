// ==========================================
// 2. VŠEOBECNÝ RENDERER PRE TABULATÚRU (Pridané data-col atribúty)
// ==========================================
// ==========================================
// 1. AUDIO SYNTEZÁTOR (Web Audio API)
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Základné frekvencie gitary v štandardnom ladení (EADGHE)
// Indexy strún v tvojom kóde: 0 = vysoké E, 1 = H/B, 2 = G, 3 = D, 4 = A, 5 = basové E
const STRING_FREQS = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41];

function playGuitarNote(stringIndex, fret, duration = 0.5) {
    if (fret === -1 || fret === undefined || fret === null) return;

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const frequency = STRING_FREQS[stringIndex] * Math.pow(2, fret / 12);
    const now = audioCtx.currentTime;

    // Spoločný ovládač hlasitosti pre oba oscilátory
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    
    // Obálka: Rýchly úder, plynulé doznievanie
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // OSCILÁTOR 1: Hlavné telo tónu (Trojuholník)
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, now);
    osc1.connect(gainNode);

    // OSCILÁTOR 2: Zvonivosť kovovej struny (Sínusoida o oktávu vyššie)
    // Oktávu vyššie dosiahneme vynásobením frekvencie dvoma (* 2)
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, now);
    
    // Samostatná nižšia hlasitosť pre druhý oscilátor, aby iba jemne prifarboval
    const osc2Gain = audioCtx.createGain();
    osc2Gain.gain.setValueAtTime(0.18, now); // 15% z celkovej sily
    
    osc2.connect(osc2Gain);
    osc2Gain.connect(gainNode);

    // Spustenie oboch naraz
    osc1.start(now);
    osc1.stop(now + duration);
    
    osc2.start(now);
    osc2.stop(now + duration);
}

// Globalný objekt na držanie stavov prehrávačov pre jednotlivé cvičenia
const activePlaybacks = {};

function togglePlayback(exerciseId, exerciseData, buttonEl, element) {
    // Ak pre toto cvičenie už beží prehrávanie, zastavíme ho
    if (activePlaybacks[exerciseId]) {
        stopPlayback(exerciseId, buttonEl, element);
        return;
    }

    const tabData = exerciseData.tabData;
    const totalColumns = tabData[0] ? tabData[0].length : 0;
    if (totalColumns === 0) return;

    // Načítanie BPM z posuvníka
    const bpmInput = element.querySelector(`#bpm-slider-${exerciseId}`);
    const bpm = bpmInput ? parseInt(bpmInput.value) : 100;

    // Základný čas jedného úderu (štvrťovej noty) v milisekundách
    // Pri 100 BPM trvá jedna štvrťová nota (0.25) presne 600 ms
    const beatDurationMs = (60 / bpm) * 1000; 

    buttonEl.innerHTML = "⏹ Zastaviť";
    buttonEl.style.background = "#e74c3c";

    const columnsDOM = element.querySelectorAll('.tab-column');
    let currentCol = 0;

    // Pomocný príznak, aby sme vedeli cyklus zvonku zastaviť
    activePlaybacks[exerciseId] = {
        isPlaying: true,
        timeoutId: null,
        columnsDOM: columnsDOM
    };

    // Hlavná asynchrónna slučka pre prehrávanie
    function playNextStep() {
        // Kontrola, či používateľ nestlačil "Zastaviť"
        if (!activePlaybacks[exerciseId] || !activePlaybacks[exerciseId].isPlaying) return;

        // Vizuálny posun kurzora
        columnsDOM.forEach(col => col.classList.remove('active-playhead'));
        if (columnsDOM[currentCol]) {
            columnsDOM[currentCol].classList.add('active-playhead');
        }

        // 1. ZISTENIE DĹŽKY NÔT PRE AKTUÁLNY STĹPEC
        // Ak v JSON pole "durations" chýba, automaticky použijeme štvrťovú notu (0.25)
        const noteLength = (exerciseData.durations && exerciseData.durations[currentCol]) 
                           ? exerciseData.durations[currentCol] 
                           : 0.25;

        // Prepočet hudobnej dĺžky na reálne milisekundy na základe BPM
        // Príklad: noteLength 0.25 (štvrťová) pri 100 BPM = (0.25 / 0.25) * 600ms = 600ms
        // Príklad: noteLength 0.5 (polová) pri 100 BPM = (0.5 / 0.25) * 600ms = 1200ms
        // noteLength 0.125 (osminová), noteLength 1 (celá)

        const currentStepDurationMs = (noteLength / 0.25) * beatDurationMs;

        // Prehranie všetkých stónov v stĺpci
        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            const fret = tabData[stringIndex][currentCol];
            if (fret !== -1 && fret !== undefined) {
                // Posielame dĺžku tónu v sekundách do audio syntetizátora (+ jemný presah pre plynulosť)
                playGuitarNote(stringIndex, fret, (currentStepDurationMs / 1000) * 1.1);
            }
        }

        // Posun na ďalší stĺpec
        currentCol = (currentCol + 1) % totalColumns;

        // Naplánujeme ďalší krok presne po uplynutí dĺžky tohto tónu
        activePlaybacks[exerciseId].timeoutId = setTimeout(playNextStep, currentStepDurationMs);
    }

    // Spustíme prvý krok
    playNextStep();
}

function stopPlayback(exerciseId, buttonEl, element) {
    if (activePlaybacks[exerciseId]) {
        // Nastavíme príznak na false, čím zrušíme asynchrónny cyklus
        activePlaybacks[exerciseId].isPlaying = false;
        
        // Vymažeme naplánovaný timeout
        if (activePlaybacks[exerciseId].timeoutId) {
            clearTimeout(activePlaybacks[exerciseId].timeoutId);
        }

        // Zhasneme vizuálny kurzor
        if (activePlaybacks[exerciseId].columnsDOM) {
            activePlaybacks[exerciseId].columnsDOM.forEach(col => col.classList.remove('active-playhead'));
        }

        delete activePlaybacks[exerciseId];
    }

    buttonEl.innerHTML = "▶ Prehrať cvičenie";
    buttonEl.style.background = "var(--accent, #007bff)";
}

document.addEventListener("DOMContentLoaded", () => {
    const headers = document.querySelectorAll(".accordion-header");

    headers.forEach(header => {
        header.addEventListener("click", function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;

            // Ak je už položka otvorená, zatvoríme ju
            if (item.classList.contains("active")) {
                content.style.maxHeight = null;
                item.classList.remove("active");
            } else {
                // VOLITEĽNÉ: Ak chceš, aby sa automaticky zatvorili ostatné sekcie, odkomentuj riadky nižšie:
                /*
                document.querySelectorAll(".accordion-item").forEach(el => {
                    el.classList.remove("active");
                    el.querySelector(".accordion-content").style.maxHeight = null;
                });
                */

                // Otvoríme kliknutú sekciu
                item.classList.add("active");
                // Nastavíme max-height presne podľa reálnej výšky obsahu v pixeloch
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});

// ==========================================
// 2. VŠEOBECNÝ RENDERER PRE TABULATÚRU (S podporou prstokladu) (Pridané data-col atribúty)
// ==========================================
function renderTab(tabData, fingering = null) {
    const stringNames = ['E', 'H', 'G', 'D', 'A', 'E'];
    const totalStrings = 6;
    const totalColumns = tabData[0] ? tabData[0].length : 0;
    const hasFingering = Array.isArray(fingering) && fingering.length > 0;
    
    let html = `<div class="tab-container">`;
    
    // 1. Popisy strún (ľavý panel)
    html += `<div class="tab-strings-labels">`;
    stringNames.forEach(name => {
        html += `<div class="tab-label">${name}</div>`;
    });
    
    // Ak cvičenie obsahuje prstoklad, pridáme štítok "Prst" pod popisy strún
    if (hasFingering) {
        html += `<div class="fingering-label">Prst</div>`;
    }
    html += `</div>`;
    
    // Čiary strún na pozadí (vždy 6)
    html += `<div class="tab-grid">`;
    for (let i = 0; i < 6; i++) {
        html += `<div class="tab-string-line"></div>`;
    }
    html += `</div>`;
    
    // Samotné tóny (stĺpce vykreslené vodorovne za sebou)
    html += `<div class="tab-notes-container">`;
    
    // Prechádzame stĺpce zľava doprava
    for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
        html += `<div class="tab-column" data-col="${colIndex}">`;
        
        // Pre každý stĺpec prejdeme všetkých 6 strún zhora nadol
        for (let stringIndex = 0; stringIndex < totalStrings; stringIndex++) {
            const fret = tabData[stringIndex][colIndex];
            
            if (fret === -1 || fret === undefined || fret === null) {
                html += `<div class="tab-note empty"></div>`;
            } else {
                html += `<div class="tab-note">${fret}</div>`;
            }
        }

        // Ak existuje prstoklad a pre tento stĺpec je definovaný, vykreslíme ho
        if (hasFingering) {
            const finger = fingering[colIndex];
            // Vykreslíme iba ak hodnota nie je prázdna alebo pomlčka
            if (finger && finger !== "" && finger !== "-") {
                html += `<div class="tab-finger">${finger}</div>`;
            }
        }
        
        html += `</div>`; // .tab-column
    }
    
    html += `</div>`; // .tab-notes-container
    html += `</div>`; // .tab-container
    return html;
}

// ==========================================
// 3. ASYNCHRÓNNE NAČÍTANIE S RENDEROM A OVLÁDANÍM
// ==========================================
async function initTabRenderer() {
    const tabElements = document.querySelectorAll('[data-exercise]');
    if (tabElements.length === 0) return;

    tabElements.forEach(el => {
        el.innerHTML = `<div style="color: var(--text-muted); font-style: italic; padding: 10px;">Načítavam tabulatúru...</div>`;
    });

    try {
        const response = await fetch('./data/exercises_tab.json');
        if (!response.ok) {
            throw new Error(`Nepodarilo sa stiahnuť súbor (Kód chyby: ${response.status})`);
        }

        const database = await response.json();

        tabElements.forEach(element => {
            const exerciseId = element.getAttribute('data-exercise');
            const exerciseData = database.exercises.find(ex => ex.id === exerciseId);
           
            if (exerciseData) {
                // Pozor zmena: Posielame do renderTab aj informáciu o prstoklade
                const tabHTML = renderTab(exerciseData.tabData, exerciseData.fingering || null);

                                // VYTVORENIE PREHRÁVAČA (Tlačidlo, BPM ovládanie a kontajner)
const playBtnId = `play-btn-${exerciseId}`;
const bpmSliderId = `bpm-slider-${exerciseId}`;
const bpmValueId = `bpm-value-${exerciseId}`;

let playerControlsHTML = `
    <div class="player-controls" style="
        margin: 15px 0; 
        text-align: left; 
        display: flex; 
        align-items: center; 
        gap: 20px; 
        flex-wrap: wrap;
        background: #f8f9fa;
        padding: 10px 15px;
        border-radius: 6px;
        border: 1px solid #e9ecef;
    ">
        <!-- Tlačidlo -->
        <button id="${playBtnId}" class="tab-play-btn" style="
            background: var(--accent, #007bff); 
            color: white; 
            border: none; 
            padding: 8px 16px; 
            font-size: 0.95rem; 
            border-radius: 4px; 
            cursor: pointer; 
            font-weight: bold; 
            transition: background 0.2s;
            min-width: 140px;
        ">▶ Prehrať cvičenie</button>

        <!-- BPM Ovládanie -->
        <div style="display: flex; align-items: center; gap: 10px; font-family: sans-serif; font-size: 0.9rem; color: #495057;">
            <label for="${bpmSliderId}" style="font-weight: bold;">Tempo:</label>
            <input type="range" id="${bpmSliderId}" min="40" max="640" value="100" step="5" style="
                cursor: pointer;
                accent-color: var(--accent, #007bff);
            ">
            <span style="background: #e9ecef; padding: 3px 8px; border-radius: 4px; font-weight: bold; min-width: 55px; text-align: center;">
                <span id="${bpmValueId}">100</span> BPM
            </span>
        </div>
    </div>
`;

                // Pripravíme HTML pre sprievodný text
                let infoHTML = `
                    <div class="exercise-info" style="margin-top: 15px; text-align: left;">
                        <h3 style="margin: 0 0 8px 0; color: var(--accent); font-size: 1.2rem;">${exerciseData.title}</h3>
                `;

                if (exerciseData.desc) {
                    infoHTML += `<p style="margin: 0 0 12px 0; color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">${exerciseData.desc}</p>`;
                }

                if (exerciseData.tip) {
                    infoHTML += `
                        <div class="exercise-tip" style="background: #eef7ff; border-left: 4px solid var(--accent); padding: 10px 15px; border-radius: 4px; font-size: 0.9rem; color: #1c4f80; margin-top: 10px;">
                            <strong>Tip pre techniku:</strong> ${exerciseData.tip}
                        </div>
                    `;
                }

                infoHTML += `</div>`;

                // Spojíme tabulatúru, ovládanie a popisy do elementu
                element.innerHTML = infoHTML +tabHTML + playerControlsHTML;
 
                // Naviažeme udalosť na tlačidlo prehrávania
const playButton = element.querySelector(`#${playBtnId}`);
if (playButton) {
    // Pôvodne tam bolo: togglePlayback(exerciseId, exerciseData.tabData, ... )
playButton.addEventListener('click', () => {
    togglePlayback(exerciseId, exerciseData, playButton, element); 
});
}

// --- TU JE NOVÝ PRÍDAVOK PRE PREPÍSANIE HODNOTY BPM NA OBRAZOVKE ---
const bpmSlider = element.querySelector(`#${bpmSliderId}`);
const bpmValueDisplay = element.querySelector(`#${bpmValueId}`);
if (bpmSlider && bpmValueDisplay) {
    bpmSlider.addEventListener('input', (e) => {
        bpmValueDisplay.textContent = e.target.value;
        
        // Bonus: Ak cvičenie práve hrá a žiak pohne posuvníkom, 
        // zastavíme ho, aby si ho mohol spustiť znova v novom tempe.
        if (activePlaybacks[exerciseId]) {
            stopPlayback(exerciseId, playButton, element);
        }
    });
}

            } else {
                element.innerHTML = `<div style="color: var(--accent); font-weight: bold; padding: 10px;">Cvičenie s ID "${exerciseId}" sa nenašlo v databáze.</div>`;
            }
        });

    } catch (error) {
        console.error("Chyba pri načítavaní JSON databázy:", error);
        tabElements.forEach(element => {
            element.innerHTML = `<div style="color: #e74c3c; font-weight: bold; padding: 10px;">Chyba pri načítaní príkladu.</div>`;
        });
    }
}

document.addEventListener("DOMContentLoaded", initTabRenderer);