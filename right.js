/*
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/right.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Chyba pri načítaní JSON: ${response.status}`);
      return response.json();
    })
    .then((data) => renderExercises(data.exercises))
    .catch((error) => console.error("Chyba:", error));
});
*/
document.addEventListener("DOMContentLoaded", () => {
  fetch("data/right.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Chyba pri načítaní JSON: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      // Nájde všetky elementy s ID začínajúcim na "exercise-" (napr. exercise-1, exercise-5)
      const targetContainers = document.querySelectorAll("[id^='exercise-']");

      targetContainers.forEach((container) => {
        // Získa číslo z ID (zo reťazca "exercise-1" spraví číslo 1)
        const exerciseId = parseInt(container.id.replace("exercise-", ""), 10);
        
        // Nájde príslušné dáta v JSON
        const exerciseData = data.exercises.find((ex) => ex.id === exerciseId);

        if (exerciseData) {
          drawExerciseScore(exerciseData, container);
        } else {
          console.warn(`Cvičenie s ID ${exerciseId} nebolo v JSON nájdené.`);
        }
      });
    })
    .catch((error) => console.error("Chyba pri načítavaní:", error));
});

function renderExercises(exercises) {
  const container = document.getElementById("exercises-container");
  container.innerHTML = "";

  exercises.forEach((exercise) => {
    const card = document.createElement("div");
    card.className = "exercise-card";

    const title = document.createElement("h3");
    title.textContent = `Cvičenie #${exercise.id}: ${exercise.pattern || ""}`;
    card.appendChild(title);

    const scoreDiv = document.createElement("div");
    scoreDiv.id = `exercise-score-${exercise.id}`;
    card.appendChild(scoreDiv);

    container.appendChild(card);

    drawExerciseScore(exercise, scoreDiv);
  });
}

function drawExerciseScore(exercise, targetDiv) {
  const VF = Vex.Flow;
  targetDiv.innerHTML = "";

  const barlineTypes = {
    single: VF.Barline.type.SINGLE,
    double: VF.Barline.type.DOUBLE,
    end: VF.Barline.type.END,
    repeat_begin: VF.Barline.type.REPEAT_BEGIN,
    repeat_end: VF.Barline.type.REPEAT_END,
    repeat_both: VF.Barline.type.REPEAT_BOTH
  };

  const lineSpacing = 270;
  const firstMeasureWidth = 340; // Širší takt kvôli kľúču
  const otherMeasureWidth = 220;

  // 1. Zistíme celkový počet riadkov pre výpočet výšky plátna
  let totalLines = 1;
  exercise.measures.forEach((m, idx) => {
    // Ak ma takt lineBreak a nie je to posledny takt, prirátame riadok
    if (m.lineBreak && idx < exercise.measures.length - 1) {
      totalLines++;
    }
  });

  // Odhad/nastavenie rozmerov SVG plátna
  const canvasWidth = 950; // Alebo šírka kontajnera
  const canvasHeight = totalLines * lineSpacing + 40;

  const renderer = new VF.Renderer(targetDiv, VF.Renderer.Backends.SVG);
  renderer.resize(canvasWidth, canvasHeight);
  const context = renderer.getContext();

  let currentX = 10;
  let currentY = 10;

  const timeSignature = exercise.time || "4/4";
  const [beats, beatValue] = timeSignature.split("/").map(Number);

  // Sledovanie, či aktuálny takt začína nový riadok
  let isStartOfLine = true;

  exercise.measures.forEach((measure, measureIndex) => {
    // Ak je takt na začiatku riadka, zvolíme širší rozmer pre kľúč
    const measureWidth = isStartOfLine ? firstMeasureWidth : otherMeasureWidth;

    // A. OSNOVA A TABULATÚRA
    const stave = new VF.Stave(currentX, currentY, measureWidth);
    const tabStave = new VF.TabStave(currentX, currentY + 110, measureWidth);

    // Notový kľúč sa pridáva na začiatok KAŽDÉHO riadka
    if (isStartOfLine) {
      stave.addClef("treble");
      tabStave.addClef("tab");

      // Taktové označenie sa dáva len na úplný začiatok skladby
      if (measureIndex === 0) {
        stave.addTimeSignature(timeSignature);
      }
    }

    // Taktové čiary
    const barType = measure.barline;
    if (barType === "repeat_begin") {
      stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      tabStave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
    } else if (barType === "repeat_both") {
      stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      stave.setEndBarType(VF.Barline.type.REPEAT_END);
      tabStave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      tabStave.setEndBarType(VF.Barline.type.REPEAT_END);
    } else if (barType && barlineTypes[barType]) {
      stave.setEndBarType(barlineTypes[barType]);
      tabStave.setEndBarType(barlineTypes[barType]);
    } else {
      stave.setEndBarType(VF.Barline.type.SINGLE);
      tabStave.setEndBarType(VF.Barline.type.SINGLE);
    }

    stave.setContext(context).draw();
    tabStave.setContext(context).draw();

    const connector = new VF.StaveConnector(stave, tabStave);
    connector.setType(VF.StaveConnector.type.SINGLE);
    connector.setContext(context).draw();

    // B. SPRACOVANIE NÔT
    const staveNotes = [];
    const tabNotes = [];

    measure.notes.forEach((item) => {
      let noteKey = item.note.replace(/^h/i, "b");

      const note = new VF.StaveNote({
        keys: [noteKey],
        duration: item.duration || "8"
      });

      const accidentalMatch = noteKey.match(/^[a-gA-G]([#b]+)\//);
      if (accidentalMatch && accidentalMatch[1]) {
        note.addModifier(new VF.Accidental(accidentalMatch[1]), 0);
      }

      if (item.fingering) {
        const annotation = new VF.Annotation(item.fingering)
          .setFont("Arial", 11, "italic")
          .setVerticalJustification(VF.Annotation.VerticalJustify.TOP);
        note.addModifier(annotation, 0);
      }

      staveNotes.push(note);

      const tabNote = new VF.TabNote({
        positions: [{ str: item.string, fret: String(item.fret) }],
        duration: item.duration || "8"
      });

      tabNotes.push(tabNote);
    });

    // Trámce
    let beamOptions = {};
    if (timeSignature === "6/8") {
      beamOptions = { groups: [new VF.Fraction(3, 8)] };
    }
    const beams = VF.Beam.generateBeams(staveNotes, beamOptions);

    // C. VYKRESLENIE VOICES
    if (staveNotes.length > 0) {
      const voice = new VF.Voice({ num_beats: beats, beat_value: beatValue }).setMode(VF.Voice.Mode.SOFT);
      voice.addTickables(staveNotes);

      const tabVoice = new VF.Voice({ num_beats: beats, beat_value: beatValue }).setMode(VF.Voice.Mode.SOFT);
      tabVoice.addTickables(tabNotes);

      new VF.Formatter()
        .joinVoices([voice, tabVoice])
        .format([voice, tabVoice], measureWidth - (isStartOfLine ? 90 : 40));

      voice.draw(context, stave);
      tabVoice.draw(context, tabStave);

      beams.forEach((beam) => beam.setContext(context).draw());
    }

    // D. POSUN SÚRADNÍC PRE ĎALŠÍ TAKT
    if (measure.lineBreak) {
      // Ak má aktuálny takt príznak lineBreak, nasledujúci takt pôjde na nový riadok
      currentX = 10;
      currentY += lineSpacing;
      isStartOfLine = true;
    } else {
      // Inak pokračujeme v rovnakom riadku
      currentX += measureWidth;
      isStartOfLine = false;
    }
  });
}

/*
function drawExerciseScore(exercise, targetDiv) {
  const VF = Vex.Flow;
  targetDiv.innerHTML = "";

  const barlineTypes = {
    single: VF.Barline.type.SINGLE,
    double: VF.Barline.type.DOUBLE,
    end: VF.Barline.type.END,
    repeat_begin: VF.Barline.type.REPEAT_BEGIN,
    repeat_end: VF.Barline.type.REPEAT_END,
    repeat_both: VF.Barline.type.REPEAT_BOTH
  };

  // === NASTAVENIE RIADKOVANIA A ZALAMOVANIA ===
  const measuresPerLine = exercise.measuresPerLine || 4; // Max taktov na riadok (alebo z JSON)
  const lineSpacing = 220; // Zvislý posun pre nový riadok (osnova + TAB)
  const firstMeasureWidth = 300;
  const otherMeasureWidth = 220;

  // Vypočítame počet riadkov a výšku/šírku plátna
  const totalLines = Math.ceil(exercise.measures.length / measuresPerLine);
  const canvasWidth = firstMeasureWidth + (measuresPerLine - 1) * otherMeasureWidth + 40;
  const canvasHeight = totalLines * lineSpacing + 40;

  const renderer = new VF.Renderer(targetDiv, VF.Renderer.Backends.SVG);
  renderer.resize(canvasWidth, canvasHeight);
  const context = renderer.getContext();

  // Dynamické súradnice pre kreslenie
  let currentX = 10;
  let currentY = 10;

  const timeSignature = exercise.time || "4/4";
  const [beats, beatValue] = timeSignature.split("/").map(Number);

  exercise.measures.forEach((measure, measureIndex) => {
    // 1. KONTROLA ZALOMENIA RIADKA
    const isStartOfLine = measureIndex % measuresPerLine === 0;
    
    if (isStartOfLine && measureIndex > 0) {
      currentX = 10;                // Reset X na začiatok riadka
      currentY += lineSpacing;      // Posun Y na ďalší riadok
    }

    const measureWidth = isStartOfLine ? firstMeasureWidth : otherMeasureWidth;

    // 2. NOTOVÁ OSNOVA A TABULATÚRA (s dynamickým currentY)
    const stave = new VF.Stave(currentX, currentY, measureWidth);
    const tabStave = new VF.TabStave(currentX, currentY + 110, measureWidth);

    // Kľúč sa pridáva na začiatku KAŽDÉHO riadka
    if (isStartOfLine) {
      stave.addClef("treble");
      tabStave.addClef("tab");

      // Taktové označenie dáme len na úplný začiatok skladby (prvý takt prvého riadka)
      if (measureIndex === 0) {
        stave.addTimeSignature(timeSignature);
      }
    }

    // Nastavenie taktových čiar
    const barType = measure.barline;
    if (barType === "repeat_begin") {
      stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      tabStave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
    } else if (barType === "repeat_both") {
      stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      stave.setEndBarType(VF.Barline.type.REPEAT_END);
      tabStave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      tabStave.setEndBarType(VF.Barline.type.REPEAT_END);
    } else if (barType && barlineTypes[barType]) {
      stave.setEndBarType(barlineTypes[barType]);
      tabStave.setEndBarType(barlineTypes[barType]);
    } else {
      stave.setEndBarType(VF.Barline.type.SINGLE);
      tabStave.setEndBarType(VF.Barline.type.SINGLE);
    }

    stave.setContext(context).draw();
    tabStave.setContext(context).draw();

    const connector = new VF.StaveConnector(stave, tabStave);
    connector.setType(VF.StaveConnector.type.SINGLE);
    connector.setContext(context).draw();

    // 3. SPRACOVANIE NÔT
    const staveNotes = [];
    const tabNotes = [];

    measure.notes.forEach((item) => {
      let noteKey = item.note.replace(/^h/i, "b");

      const note = new VF.StaveNote({
        keys: [noteKey],
        duration: item.duration || "8"
      });

      const accidentalMatch = noteKey.match(/^[a-gA-G]([#b]+)\//);
      if (accidentalMatch && accidentalMatch[1]) {
        note.addModifier(new VF.Accidental(accidentalMatch[1]), 0);
      }

      if (item.fingering) {
        const annotation = new VF.Annotation(item.fingering)
          .setFont("Arial", 11, "italic")
          .setVerticalJustification(VF.Annotation.VerticalJustify.TOP);
        note.addModifier(annotation, 0);
      }

      staveNotes.push(note);

      const tabNote = new VF.TabNote({
        positions: [{ str: item.string, fret: String(item.fret) }],
        duration: item.duration || "8"
      });

      tabNotes.push(tabNote);
    });

    // Trámce
    let beamOptions = {};
    if (timeSignature === "6/8") {
      beamOptions = { groups: [new VF.Fraction(3, 8)] };
    }
    const beams = VF.Beam.generateBeams(staveNotes, beamOptions);

    // 4. VYKRSLENIE VOICES
    if (staveNotes.length > 0) {
      const voice = new VF.Voice({ num_beats: beats, beat_value: beatValue }).setMode(VF.Voice.Mode.SOFT);
      voice.addTickables(staveNotes);

      const tabVoice = new VF.Voice({ num_beats: beats, beat_value: beatValue }).setMode(VF.Voice.Mode.SOFT);
      tabVoice.addTickables(tabNotes);

      new VF.Formatter()
        .joinVoices([voice, tabVoice])
        .format([voice, tabVoice], measureWidth - (isStartOfLine ? 90 : 40));

      voice.draw(context, stave);
      tabVoice.draw(context, tabStave);

      beams.forEach((beam) => beam.setContext(context).draw());
    }

    // Posun na ďalší takt v riadku
    currentX += measureWidth;
  });
}


function drawExerciseScore(exercise, targetDiv) {
  const VF = Vex.Flow;

  // Vyčistenie cieľového divu pred vykreslením
  targetDiv.innerHTML = "";

  // Mapa pre typy taktových čiar
  const barlineTypes = {
    single: VF.Barline.type.SINGLE,
    double: VF.Barline.type.DOUBLE,
    end: VF.Barline.type.END,
    repeat_begin: VF.Barline.type.REPEAT_BEGIN,
    repeat_end: VF.Barline.type.REPEAT_END,
    repeat_both: VF.Barline.type.REPEAT_BOTH
  };

  // Vypočítame celkovú šírku plátna podľa počtu taktov
  let totalWidth = 20;
  exercise.measures.forEach((m, idx) => {
    totalWidth += idx === 0 ? 320 : 220; // Prvý takt je širší kvôli kľúču
  });

  const renderer = new VF.Renderer(targetDiv, VF.Renderer.Backends.SVG);
  renderer.resize(totalWidth + 30, 260);
  const context = renderer.getContext();

  let currentX = 10;
  const timeSignature = exercise.time || "4/4";
  const [beats, beatValue] = timeSignature.split("/").map(Number);

  // Prechádzame jednotlivé takty (measures)
  exercise.measures.forEach((measure, measureIndex) => {
    const isFirstMeasure = measureIndex === 0;
    const measureWidth = isFirstMeasure ? 320 : 220;

    // 1. Notová osnova
    const stave = new VF.Stave(currentX, 10, measureWidth);
    if (isFirstMeasure) {
      stave.addClef("treble").addTimeSignature(timeSignature);
    }

    // 2. Tabulatúra
    const tabStave = new VF.TabStave(currentX, 120, measureWidth);
    if (isFirstMeasure) {
      tabStave.addClef("tab");
    }

    // Nastavenie taktových čiar (začiatok aj koniec taktu)
    const barType = measure.barline;
    if (barType === "repeat_begin") {
      stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      tabStave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
    } else if (barType === "repeat_both") {
      stave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      stave.setEndBarType(VF.Barline.type.REPEAT_END);
      tabStave.setBegBarType(VF.Barline.type.REPEAT_BEGIN);
      tabStave.setEndBarType(VF.Barline.type.REPEAT_END);
    } else if (barType && barlineTypes[barType]) {
      stave.setEndBarType(barlineTypes[barType]);
      tabStave.setEndBarType(barlineTypes[barType]);
    } else {
      stave.setEndBarType(VF.Barline.type.SINGLE);
      tabStave.setEndBarType(VF.Barline.type.SINGLE);
    }

    stave.setContext(context).draw();
    tabStave.setContext(context).draw();

    // Vizuálne prepojenie zvislej taktovej čiary medzi osnovou a TABom
    const connector = new VF.StaveConnector(stave, tabStave);
    connector.setType(VF.StaveConnector.type.SINGLE);
    connector.setContext(context).draw();

    // 3. Spracovanie nôt pre aktuálny takt
    const staveNotes = [];
    const tabNotes = [];

    measure.notes.forEach((item) => {
      // Podpora pre zápis 'h' namiesto 'b'
      let noteKey = item.note.replace(/^h/i, "b");

      // Notový zápis
      const note = new VF.StaveNote({
        keys: [noteKey],
        duration: item.duration || "8"
      });

      // Správna detekcia posuviek (# alebo b) – ignoruje 'b' v názve tónu b/4
      const accidentalMatch = noteKey.match(/^[a-gA-G]([#b]+)\//);
      if (accidentalMatch && accidentalMatch[1]) {
        note.addModifier(new VF.Accidental(accidentalMatch[1]), 0);
      }

      // Prstoklad pravej ruky (p, i, m, a) ako anotácia
      if (item.fingering) {
        const annotation = new VF.Annotation(item.fingering)
          .setFont("Arial", 11, "italic")
          .setVerticalJustification(VF.Annotation.VerticalJustify.TOP);
        note.addModifier(annotation, 0);
      }

      staveNotes.push(note);

      // Tabulatúrový zápis
      const tabNote = new VF.TabNote({
        positions: [{ str: item.string, fret: String(item.fret) }],
        duration: item.duration || "8"
      });

      tabNotes.push(tabNote);
    });

    // Vygenerovanie trámcov pre osminové/šestnástinové noty
    const beams = VF.Beam.generateBeams(staveNotes);
// Nastavenie pravidiel zoskupovania trámcov
let beamOptions = {};

if (timeSignature === "6/8") {
  // Spája osminové noty do skupín s dĺžkou 3/8 (t.j. 3 osminy spolu)
  beamOptions = { groups: [new VF.Fraction(3, 8)] };
}
    // 4. Vytvorenie Voice a zarovnanie
    if (staveNotes.length > 0) {
      const voice = new VF.Voice({ num_beats: beats, beat_value: beatValue }).setMode(VF.Voice.Mode.SOFT);
      voice.addTickables(staveNotes);

      const tabVoice = new VF.Voice({ num_beats: beats, beat_value: beatValue }).setMode(VF.Voice.Mode.SOFT);
      tabVoice.addTickables(tabNotes);

      new VF.Formatter()
        .joinVoices([voice, tabVoice])
        .format([voice, tabVoice], measureWidth - (isFirstMeasure ? 90 : 40));

      voice.draw(context, stave);
      tabVoice.draw(context, tabStave);

      // Vykreslenie trámcov
      // Vygenerovanie trámcov s príslušným pravidlom
const beams = VF.Beam.generateBeams(staveNotes, beamOptions);
      beams.forEach((beam) => beam.setContext(context).draw());
    }

    // Posun na ďalší takt
    currentX += measureWidth;
  });
}
*/