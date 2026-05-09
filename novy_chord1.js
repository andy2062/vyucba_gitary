//////////////////////////////////////////////////
// 🎨 FARBY PRSTOV
//////////////////////////////////////////////////

const fingerColors = {
  1: "#e74c3c",
  2: "#3498db",
  3: "#2ecc71",
  4: "#f1c40f"
};

//////////////////////////////////////////////////
// 📦 DATABÁZA AKORDOV (NOVÝ FORMÁT)
//////////////////////////////////////////////////

let chordsDB = {};
let chordsLoaded = false;

fetch("chords.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(ch => chordsDB[ch.name] = ch);
    chordsLoaded = true;
  });

//////////////////////////////////////////////////
// 🎸 KRESLENIE VEĽKÉHO AKORDU
//////////////////////////////////////////////////

function showChord(name, variation = 0) {

  if (!chordsLoaded) return;

  const chord = chordsDB[name];
  if (!chord) return;

  // vyber variáciu alebo základný akord
  const data = chord.variations ? chord.variations[variation] : chord;

  drawBase();

  document.getElementById("chordTitle").textContent =
    chord.variations ? `${name} – hmat ${variation + 1}` : name;

  const dots = document.getElementById("dots");
  dots.innerHTML = "";

  //////////////////////////////////////////////////
  // BASE FRET
  //////////////////////////////////////////////////
  const positive = data.positions.filter(f => f > 0);
  const minFret = positive.length ? Math.min(...positive) : 1;
  const baseFret = minFret >= 3 ? minFret : 1;

  //////////////////////////////////////////////////
  // DETEKCIA BARRE
  //////////////////////////////////////////////////
  let barreMap = {};

  for (let i = 0; i < 6; i++) {
    let fret = data.positions[i];
    let finger = data.fingering ? data.fingering[i] : null;

    if (fret > 0 && finger) {
      let key = finger + "_" + fret;
      if (!barreMap[key]) barreMap[key] = [];
      barreMap[key].push(i);
    }
  }

  //////////////////////////////////////////////////
  // KRESLENIE BARRE
  //////////////////////////////////////////////////
  Object.values(barreMap).forEach(strings => {
    if (strings.length < 2) return;

    let first = Math.min(...strings);
    let last = Math.max(...strings);

    let fret = data.positions[first];
    let finger = data.fingering[first];

    let x1 = 20 + first * 30;
    let x2 = 20 + last * 30;
    let y = 40 + (fret - baseFret + 0.5) * 30;

    let rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute("x", x1 - 10);
    rect.setAttribute("y", y - 8);
    rect.setAttribute("width", (x2 - x1) + 20);
    rect.setAttribute("height", 16);
    rect.setAttribute("rx", 8);
    rect.setAttribute("fill", fingerColors[finger] || "black");

    dots.appendChild(rect);
  });

  //////////////////////////////////////////////////
  // KRESLENIE PRSTOV
  //////////////////////////////////////////////////
  for (let i = 0; i < 6; i++) {

    let fret = data.positions[i];
    let finger = data.fingering ? data.fingering[i] : null;

    let x = 20 + i * 30;

    if (fret === -1) {
      let t = document.createElementNS("http://www.w3.org/2000/svg","text");
      t.setAttribute("x", x);
      t.setAttribute("y", 30);
      t.setAttribute("text-anchor", "middle");
      t.textContent = "X";
      dots.appendChild(t);
      continue;
    }

    if (fret === 0) {
      let c = document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute("cx", x);
      c.setAttribute("cy", 30);
      c.setAttribute("r", 6);
      c.setAttribute("fill", "white");
      c.setAttribute("stroke", "black");
      dots.appendChild(c);
      continue;
    }

    let y = 40 + (fret - baseFret + 0.5) * 30;

    let c = document.createElementNS("http://www.w3.org/2000/svg","circle");
    c.setAttribute("cx", x);
    c.setAttribute("cy", y);
    c.setAttribute("r", 10);
    c.setAttribute("fill", fingerColors[finger] || "black");
    dots.appendChild(c);

    if (finger) {
      let t = document.createElementNS("http://www.w3.org/2000/svg","text");
      t.setAttribute("x", x);
      t.setAttribute("y", y + 4);
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("font-size", "10");
      t.setAttribute("fill", "white");
      t.textContent = finger;
      dots.appendChild(t);
    }
  }

  //////////////////////////////////////////////////
  // ČÍSLO PRAŽCA
  //////////////////////////////////////////////////
  if (baseFret > 1) {
    let txt = document.createElementNS("http://www.w3.org/2000/svg","text");
    txt.setAttribute("x", 5);
    txt.setAttribute("y", 15);
    txt.setAttribute("font-size", "16");
    txt.setAttribute("font-weight", "bold");
    txt.textContent = baseFret + "fr";
    dots.appendChild(txt);
  }

  //////////////////////////////////////////////////
  // NAVIGÁCIA VARIÁCIÍ
  //////////////////////////////////////////////////
  const nav = document.getElementById("chordNav");
  if (nav) nav.innerHTML = "";

  if (chord.variations && nav) {

    if (variation > 0) {
      const prev = document.createElement("button");
      prev.textContent = "◀ Predchádzajúci";
      prev.onclick = () => showChord(name, variation - 1);
      nav.appendChild(prev);
    }

    if (variation < chord.variations.length - 1) {
      const next = document.createElement("button");
      next.textContent = "Ďalší ▶";
      next.onclick = () => showChord(name, variation + 1);
      nav.appendChild(next);
    }
  }
}

//////////////////////////////////////////////////
// 🎸 KRESLENIE ZÁKLADNÉHO HMATNÍKA
//////////////////////////////////////////////////

function drawBase() {
  const strings = document.getElementById("strings");
  const frets = document.getElementById("frets");

  if (!strings || !frets) return;

  strings.innerHTML = "";
  frets.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    let x = 20 + i * 30;

    let line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", 40);
    line.setAttribute("x2", x);
    line.setAttribute("y2", 200);
    line.setAttribute("stroke", "black");

    strings.appendChild(line);
  }

  for (let i = 0; i < 5; i++) {
    let y = 40 + i * 30;

    let line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1", 20);
    line.setAttribute("y1", y);
    line.setAttribute("x2", 170);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "black");

    frets.appendChild(line);
  }
}


// ===============================
// 🎸 MALÝ SVG AKORD (CARD)
// ===============================

function generateCustomChordSVG(chord) {

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");

  svg.setAttribute("width", "120");
  svg.setAttribute("height", "160");

  const startX = 20;
  const startY = 30;
  const stringSpacing = 15;
  const fretSpacing = 25;

  let baseFret = chord.fret ? chord.fret : 1;

  // struny
  for (let i = 0; i < 6; i++) {
    let x = startX + i * stringSpacing;

    let line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", startY);
    line.setAttribute("x2", x);
    line.setAttribute("y2", startY + fretSpacing * 4);
    line.setAttribute("stroke", "black");

    svg.appendChild(line);
  }

  // ===============================
// 🎸 DETEKCIA BARRE
// ===============================

let barreMap = {};

// nájdi prsty na rovnakom pražci
for (let i = 0; i < 6; i++) {
  let fret = chord.positions[i];
  let finger = chord.fingering[i];

  if (fret > 0 && finger) {
    let key = finger + "_" + fret;

    if (!barreMap[key]) {
      barreMap[key] = [];
    }

    barreMap[key].push(i);
  }
}

// ===============================
// 🎸 KRESLENIE BARRE
// ===============================

Object.values(barreMap).forEach(strings => {

  if (strings.length < 2) return; // musí byť aspoň 2 struny

  let first = Math.min(...strings);
  let last = Math.max(...strings);

  let fret = chord.positions[first];
  let finger = chord.fingering[first];

  let x1 = startX + first * stringSpacing;
  let x2 = startX + last * stringSpacing;

  let y = startY + fretSpacing * ((fret - baseFret) + 0.5);

  let rect = document.createElementNS(svgNS, "rect");
  rect.setAttribute("stroke", "#222");
rect.setAttribute("stroke-width", "1");
  rect.setAttribute("x", x1 - 6);
  rect.setAttribute("y", y - 6);
  rect.setAttribute("width", (x2 - x1) + 12);
  rect.setAttribute("height", 12);
  rect.setAttribute("rx", 6);
  rect.setAttribute("fill", fingerColors[finger] || "black");

  svg.appendChild(rect);
});


  // pražce
  for (let i = 0; i <= 4; i++) {
    let y = startY + i * fretSpacing;

    let line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", y);
    line.setAttribute("x2", startX + stringSpacing * 5);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", i === 0 ? "black" : "#aaa");
    line.setAttribute("stroke-width", i === 0 ? "4" : "2");

    svg.appendChild(line);
  }

  // prsty
  for (let i = 0; i < 6; i++) {
    let fret = chord.positions[i];
    let finger = chord.fingering[i];
    let x = startX + i * stringSpacing;

   
    if (fret > 0) {
      let y = startY + fretSpacing * ((fret - baseFret) + 0.5);
      // ak je súčasť barre → nekresli bodku
  let isBarre = Object.values(barreMap).some(arr => arr.length > 1 && arr.includes(i));

  if (isBarre) continue;

      let c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
      c.setAttribute("r", 6);
      c.setAttribute("fill", fingerColors[finger] || "black");

      svg.appendChild(c);

      if (finger) {
        let t = document.createElementNS(svgNS, "text");
        t.setAttribute("x", x);
        t.setAttribute("y", y + 3);
        t.setAttribute("text-anchor", "middle");
        t.setAttribute("font-size", "8");
        t.setAttribute("fill", "white");
        t.textContent = finger;

        svg.appendChild(t);
      }
    }

    if (fret === 0) {
      let c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", x);
      c.setAttribute("cy", startY - 10);
      c.setAttribute("r", 4);
      c.setAttribute("stroke", "black");
      c.setAttribute("fill", "none");

      svg.appendChild(c);
    }

    if (fret === -1) {
      let t = document.createElementNS(svgNS, "text");
      t.setAttribute("x", x);
      t.setAttribute("y", startY - 5);
      t.setAttribute("text-anchor", "middle");
      t.textContent = "X";

      svg.appendChild(t);
    }
  }

  if (chord.fret) {
    let txt = document.createElementNS(svgNS, "text");
    txt.setAttribute("x", 5);
    txt.setAttribute("y", startY + 15);
    txt.textContent = chord.fret;
    svg.appendChild(txt);
  }

  return svg;
}


//////////////////////////////////////////////////
// 🌍 GLOBAL
//////////////////////////////////////////////////

window.showChord = showChord;
