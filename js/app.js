if (window.guitarSystemInitialized) {
    console.log("GuitarSystem už existuje");
} else {
    window.guitarSystemInitialized = true;

    // =====================================================
    // COLORS
    // =====================================================
    console.log("GUITARSYSTEM LOADED");
    const gsFingerColors = {
        "1": "#43a047",
        "2": "#1e88e5",
        "3": "#fb8c00",
        "4": "#e53935",
        "0": "#8e24aa"
    };

    // =====================================================
    // DATA FILES
    // =====================================================
    let currentVariation = 0; // Pridané pre podporu variácií akordov
    let currentNoteIndex = 0;
    const dataFiles = {
        "Exercises": "./data/exercises.json",
        "Scales": "./data/scales.json",
        "Intervals": "./data/intervals.json",
        "Chords": "./data/chords1.json"
    };
    const categoryLabels = {
        "Exercises": "Cvičenia",
        "Scales": "Stupnice",
        "Intervals": "Intervaly",
        "Chords": "Akordy"
    };
    const database = {};

    // =====================================================
    // GLOBAL
    // =====================================================
    let svg = null;
    let currentCategory = "Exercises";
    let currentData = [];
    let currentIndex = 0;
    let autoplay = false;
    let timer = null;
    let speed = 900;

    // =====================================================
    // LOAD JSON
    // =====================================================
    async function loadDatabase() {
        // Prvotné načítanie referencie na SVG hmatník
        refreshDOMReferences();

        for (const category in dataFiles) {
            const response = await fetch(dataFiles[category]);
            if (!response.ok) {
                throw new Error("Nepodarilo sa nacitat " + dataFiles[category]);
            }
            database[category] = await response.json();
        }
        // Inicializácia základných dát po načítaní celej DB
        currentData = database[currentCategory] || [];
        
        initMenu();
    }

    // =====================================================
    // INIT MENU
    // =====================================================
    function initMenu() {
        const categorySelect = document.getElementById("categorySelect");

        document.getElementById("shapeSelect").addEventListener("change", () => filterData(true));
        document.getElementById("qualitySelect").addEventListener("change", () => filterData(true));
        document.getElementById("exerciseSelect").addEventListener("change", loadExercise);

        categorySelect.innerHTML = "";
        Object.keys(database).forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = categoryLabels[cat] || cat;
            categorySelect.appendChild(option);
        });

        categorySelect.value = currentCategory;

        categorySelect.addEventListener("change", () => {
            currentCategory = categorySelect.value;
            currentIndex = 0;
            currentNoteIndex = 0;
            currentVariation = 0;

            // Najprv zaktualizujeme filtre pre novú kategóriu
            updateFilterOptions();

            // Ak ide o filtrovanú kategóriu, spustíme filterData s resetom indexu
            if (currentCategory === "Chords" || currentCategory === "Scales" || currentCategory === "Intervals") {
                filterData(true); 
            } else {
                // Pre obyčajné cvičenia len naplníme dáta a menu
                currentData = database[currentCategory] || [];
                updateExerciseMenu();
                loadExercise();
            }
        });

        // Prvotné nastavenie UI komponentov bez duplicitného renderovania
        updateFilterOptions();
        updateExerciseMenu();
        loadExercise();
    }

    // Ďalší krok v cvičení
    function nextExerciseStep() {
        const item = currentData[currentIndex];
        if (!item || !item.notes) return;

        drawBase();
        drawNote(item.notes[currentNoteIndex]);
        updateInfo(item.title, item.description, "Krok " + (currentNoteIndex + 1) + "/" + item.notes.length);
        
        currentNoteIndex++;
        if (currentNoteIndex >= item.notes.length) {
            currentNoteIndex = 0;
        }
    }

    // Ďalší krok v stupnici
    function nextScaleStep() {
        const item = currentData[currentIndex];
        if (!item || !item.notes) return;

        drawBase();
        for (let i = 0; i <= currentNoteIndex; i++) {
            drawNote(item.notes[i]);
        }
        updateInfo(item.title, item.description, "Tón " + (currentNoteIndex + 1) + "/" + item.notes.length);
        
        currentNoteIndex++;
        if (currentNoteIndex >= item.notes.length) {
            currentNoteIndex = 0;
            clearInterval(timer);
            autoplay = false;
        }
    }

    // Ďalší krok v intervaloch
    function nextIntervalStep() {
        const item = currentData[currentIndex];
        if (!item || !item.notes) return;

        drawBase();
        const interval = item.notes[currentNoteIndex];
        if (Array.isArray(interval)) {
            interval.forEach(note => drawNote(note));
        }
        
        updateInfo(item.title, item.description, "Interval " + (currentNoteIndex + 1) + "/" + item.notes.length);
        
        currentNoteIndex++;
        if (currentNoteIndex >= item.notes.length) {
            currentNoteIndex = 0;
            clearInterval(timer);
            autoplay = false;
        }
    }

    function updateFilterOptions() {
        const qualitySelect = document.getElementById("qualitySelect");
        const shapeSelect = document.getElementById("shapeSelect");

        qualitySelect.innerHTML = '<option value="">Všetky druhy</option>';
        shapeSelect.innerHTML = '<option value="">Všetky skupiny</option>';

        if (currentCategory === "Exercises") {
            qualitySelect.innerHTML = '<option value="">Bez filtra</option>';
            shapeSelect.innerHTML = '<option value="">Bez filtra</option>';
            qualitySelect.disabled = true;
            shapeSelect.disabled = true;
            return;
        }

        qualitySelect.disabled = false;
        shapeSelect.disabled = false;

        if (currentCategory === "Chords") {
            ["dur", "mol", "7", "maj7"].forEach(value => {
                qualitySelect.add(new Option(value, value));
            });
            ["C", "A", "G", "E", "D"].forEach(value => {
                shapeSelect.add(new Option(value, value));
            });
        }

        if (currentCategory === "Scales") {
            ["dur", "mol"].forEach(value => {
                qualitySelect.add(new Option(value, value));
            });
            ["Ionian", "Dorian", "Phrygian", "Lyd", "Mixolydian", "Aeolian", "Locrian"].forEach(value => {
                shapeSelect.add(new Option(value, value));
            });
        }

        if (currentCategory === "Intervals") {
            ["dur", "mol"].forEach(value => {
                qualitySelect.add(new Option(value, value));
            });
            ["2", "3", "4", "5", "6", "7", "8"].forEach(value => {
                shapeSelect.add(new Option(value, value));
            });
        }
    }

    function refreshDOMReferences() {
        svg = document.getElementById("fretboard");
    }

    // =====================================================
    // UPDATE EXERCISE MENU
    // =====================================================
    function updateExerciseMenu() {
        console.log("updateExerciseMenu:", currentCategory, currentData?.length);
        const select = document.getElementById("exerciseSelect");

        let menuData = (currentCategory === "Chords" || currentCategory === "Scales" || currentCategory === "Intervals")
            ? currentData
            : database[currentCategory];

        if (!menuData || menuData.length === 0) {
            select.innerHTML = "<option>Žiadne položky</option>";
            return;
        }

        select.innerHTML = "";
        menuData.forEach((item, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = item.title || `Položka ${index + 1}`;
            select.appendChild(option);
        });

        select.value = currentIndex;
    }

    // Hlavný filter (Opravený tak, aby bral do úvahy item.caged aj item.group)
    function filterData(resetIndex = true) {
        const group = document.getElementById("shapeSelect").value;
        const quality = document.getElementById("qualitySelect").value;

        if (!database[currentCategory]) return;

        currentData = database[currentCategory].filter(item => {
            const itemGroup = item.group || item.caged;
            const groupMatch = !group || itemGroup === group;
            const qualityMatch = !quality || item.quality === quality;

            return groupMatch && qualityMatch;
        });

        if (resetIndex) {
            currentIndex = 0;
            currentNoteIndex = 0;
            currentVariation = 0;
        }

        updateExerciseMenu();

        if (currentData.length === 0) {
            updateInfo("Žiadne výsledky", "Filter nenašiel žiadne položky", "");
            if (svg) svg.innerHTML = ""; 
            return;
        }

        render(currentData[currentIndex]);
    }

    // =====================================================
    // LOAD EXERCISE
    // =====================================================
    function loadExercise() {
        if (currentCategory !== "Chords" && currentCategory !== "Scales" && currentCategory !== "Intervals") {
            currentData = database[currentCategory] || [];
        }

        if (!currentData || currentData.length === 0) return;

        const select = document.getElementById("exerciseSelect");

        if (select.options.length === 0) {
            updateExerciseMenu();
        }

        let selectedIndex = parseInt(select.value, 10);

        if (Number.isNaN(selectedIndex) || selectedIndex >= currentData.length || selectedIndex < 0) {
            selectedIndex = 0;
            select.value = 0;
        }

        currentIndex = selectedIndex;
        currentNoteIndex = 0; 
        currentVariation = 0;

        render(currentData[currentIndex]);
    }

    // =====================================================
    // MAIN RENDERER
    // =====================================================
    function render(item) {
        if (!item) return;
        switch (item.type) {
            case "exercise":
                renderExercise(item);
                break;
            case "scale":
                renderScale(item);
                break;
            case "intervalExercise":
                renderIntervalExercise(item);
                break;
            case "chord":
                renderChord(item);
                break;
        }
    }

    function renderExercise(item) {
        drawBase();
        if (item.notes) item.notes.forEach(note => drawNote(note));
        updateInfo(item.title, item.description, "Cvičenie pre prsty");
    }

    function renderScale(item) {
        drawBase();
        if (item.notes) item.notes.forEach(note => drawNote(note));
        updateInfo(item.title, item.description, "Stupnica");
    }

    function renderIntervalExercise(item) {
        drawBase();
        if (item.notes) {
            item.notes.forEach(interval => {
                if (Array.isArray(interval)) {
                    interval.forEach(note => drawNote(note));
                }
            });
        }
        updateInfo(item.title, item.description, "Stupnica v intervaloch");
    }

    function renderChord(item) {
        drawBase();

        // Podpora pre variácie (ak v objekte sú, vyberie sa aktuálna variácia)
        const chord = item.variations ? item.variations[currentVariation] : item;

        if (!chord) {
            console.error("Variácia neexistuje", currentVariation, item);
            return;
        }

        if (chord.barre) {
            drawBarre(chord.barre);
        }

        if (chord.notes) {
            chord.notes.forEach(note => drawNote(note));
        }

        updateInfo(
            item.title,
            item.description,
            chord.caged ? "CAGED: " + chord.caged : "Akordy"
        );
    }

    // =====================================================
    // UPDATE INFO
    // =====================================================
    function updateInfo(title, desc, extra) {
        const titleEl = document.getElementById("title");
        const descEl = document.getElementById("description");
        const extraEl = document.getElementById("extraInfo");

        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
        if (extraEl) extraEl.textContent = extra;
    }

    // =====================================================
    // SVG HELPER
    // =====================================================
    function createSVG(type) {
        return document.createElementNS("http://www.w3.org/2000/svg", type);
    }

    // =====================================================
    // DRAW BASE
    // =====================================================
    function drawBase() {
        if (!svg) refreshDOMReferences();
        if (!svg) return;

        svg.innerHTML = "";

        const startX = 90;
        const startY = 60;
        const fretSpacing = 74;
        const stringSpacing = 56;
        const stringNames = ["e", "H", "G", "D", "A", "E"];

        // Pražce (frets)
        for (let fret = 0; fret <= 14; fret++) {
            const x = startX + (fret * fretSpacing);
            const line = createSVG("line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", startY);
            line.setAttribute("x2", x);
            line.setAttribute("y2", startY + (5 * stringSpacing));
            line.setAttribute("stroke", fret === 0 ? "#222" : "#999");
            line.setAttribute("stroke-width", fret === 0 ? "8" : "2");
            svg.appendChild(line);

            if (fret < 14) {
                const txt = createSVG("text");
                txt.setAttribute("x", x + 37);
                txt.setAttribute("y", 30);
                txt.setAttribute("fill", "#666");
                txt.setAttribute("font-size", "15");
                txt.setAttribute("text-anchor", "middle");
                txt.textContent = fret + 1;
                svg.appendChild(txt);
            }
        }

        // Struny (strings)
        for (let s = 0; s < 6; s++) {
            const y = startY + (s * stringSpacing);
            const line = createSVG("line");
            line.setAttribute("x1", startX);
            line.setAttribute("y1", y);
            line.setAttribute("x2", startX + (14 * fretSpacing));
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "#666");
            line.setAttribute("stroke-width", 2 + (s * 0.5));
            svg.appendChild(line);

            const label = createSVG("text");
            label.setAttribute("x", 45);
            label.setAttribute("y", y + 5);
            label.setAttribute("fill", "#555");
            label.setAttribute("font-size", "18");
            label.textContent = stringNames[s];
            svg.appendChild(label);
        }
    }

    // =====================================================
    // DRAW NOTE
    // =====================================================
    function drawNote(note) {
        if (!note || !svg) return;

        const startX = 90;
        const startY = 60;
        const fretSpacing = 74;
        const stringSpacing = 56;

        const x = startX + (note.fret * fretSpacing) - (fretSpacing / 2);
        const y = startY + ((note.string - 1) * stringSpacing);

        // Tieň tónu
        const shadow = createSVG("circle");
        shadow.setAttribute("cx", x + 3);
        shadow.setAttribute("cy", y + 3);
        shadow.setAttribute("r", 22);
        shadow.setAttribute("fill", "rgba(0,0,0,0.15)");
        svg.appendChild(shadow);

        // Hlavný kruh tónu
        const circle = createSVG("circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", note.root ? 24 : 20);
        circle.setAttribute("fill", gsFingerColors[note.finger] || "#1976d2");

        if (note.root) {
            circle.setAttribute("stroke", "#111");
            circle.setAttribute("stroke-width", "4");
        }
        svg.appendChild(circle);

        // Číslo prstu
        const fingerText = createSVG("text");
        fingerText.setAttribute("x", x);
        fingerText.setAttribute("y", y);
        fingerText.setAttribute("class", "bigFinger");
        // Oprava vycentrovania textu v SVG
        fingerText.setAttribute("text-anchor", "middle");
        fingerText.setAttribute("dominant-baseline", "central");
        fingerText.textContent = note.finger;
        svg.appendChild(fingerText);

        // Kruh pre názov tónu
        const smallCircle = createSVG("circle");
        smallCircle.setAttribute("cx", x + 22);
        smallCircle.setAttribute("cy", y - 22);
        smallCircle.setAttribute("r", 14);
        smallCircle.setAttribute("fill", "white");
        smallCircle.setAttribute("stroke", "#bbb");
        svg.appendChild(smallCircle);

        // Text názvu tónu
        const noteText = createSVG("text");
        noteText.setAttribute("x", x + 22);
        noteText.setAttribute("y", y - 22);
        noteText.setAttribute("class", "smallNote");
        noteText.setAttribute("text-anchor", "middle");
        noteText.setAttribute("dominant-baseline", "central");
        noteText.textContent = note.note;
        svg.appendChild(noteText);
    }

    // =====================================================
    // DRAW BARRE
    // =====================================================
    function drawBarre(barre) {
        if (!barre || !svg) return;

        const startX = 90;
        const startY = 60;
        const fretSpacing = 74;
        const stringSpacing = 56;

        const x = startX + (barre.fret * fretSpacing) - (fretSpacing / 2) - 22;
        const y1 = startY + ((barre.fromString - 1) * stringSpacing);
        const y2 = startY + ((barre.toString - 1) * stringSpacing);

        const rect = createSVG("rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y1 - 22);
        rect.setAttribute("width", 44);
        rect.setAttribute("height", y2 - y1 + 44);
        rect.setAttribute("rx", 22);
        rect.setAttribute("fill", gsFingerColors[barre.finger] || "#1976d2");
        rect.setAttribute("opacity", "0.55");
        svg.appendChild(rect);
    }

    // =====================================================
    // NEXT / PREV VARIATION (Pre akordy)
    // =====================================================
    window.nextVariation = function() {
        const item = currentData[currentIndex];
        if (!item || !item.variations) return;
        currentVariation++;
        if (currentVariation >= item.variations.length) currentVariation = 0;
        renderChord(item);
    }

    window.prevVariation = function() {
        const item = currentData[currentIndex];
        if (!item || !item.variations) return;
        currentVariation--;
        if (currentVariation < 0) currentVariation = item.variations.length - 1;
        renderChord(item);
    }

    // =====================================================
    // NEXT / PREV ITEMS
    // =====================================================
    window.nextItem = function() { 
        if (currentData.length === 0) return;
        currentNoteIndex = 0;
        currentVariation = 0;
        currentIndex++;

        if (currentIndex >= currentData.length) currentIndex = 0;

        const select = document.getElementById("exerciseSelect");
        if (select) select.value = currentIndex;

        render(currentData[currentIndex]);
    }

    window.prevItem = function() {
        if (currentData.length === 0) return;
        currentNoteIndex = 0;
        currentVariation = 0;
        currentIndex--;

        if (currentIndex < 0) currentIndex = currentData.length - 1;

        const select = document.getElementById("exerciseSelect");
        if (select) select.value = currentIndex;

        render(currentData[currentIndex]);
    }

    // =====================================================
    // AUTOPLAY
    // =====================================================
    window.toggleAutoplay = function() {
        autoplay = !autoplay;

        if (autoplay) {
            timer = setInterval(() => {
                const item = currentData[currentIndex];
                if (!item) return;

                switch (item.type) {
                    case "scale":
                        nextScaleStep();
                        break;
                    case "exercise":
                        nextExerciseStep();
                        break;
                    case "intervalExercise":
                        nextIntervalStep();
                        break;    
                    default:
                        window.nextItem();
                        break;
                }
            }, speed);
        } else {
            clearInterval(timer);
        }
    }

    // =====================================================
    // SPEED SLIDER LISTENER
    // =====================================================
    const speedSlider = document.getElementById("speedSlider");
    if (speedSlider) {
        speedSlider.addEventListener("input", function() {
            speed = parseInt(this.value, 10);
            const speedValueEl = document.getElementById("speedValue");
            if (speedValueEl) speedValueEl.textContent = speed + " ms";

            if (autoplay) {
                clearInterval(timer);
                timer = setInterval(() => {
                    const item = currentData[currentIndex];
                    if (!item) return;
                    switch (item.type) {
                        case "scale":
                            nextScaleStep();
                            break;
                        case "exercise":
                            nextExerciseStep();
                            break;
                        case "intervalExercise":
                            nextIntervalStep();
                            break;
                        default:
                            window.nextItem();
                            break;
                    }
                }, speed);
            }
        });
    }

    // =====================================================
    // START APPLICATION
    // =====================================================
    loadDatabase().catch(error => {
        updateInfo("Chyba nacitania dat", error.message, "");
    });
}