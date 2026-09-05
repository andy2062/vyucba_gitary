let songs = [];
let currentCategory = null;
let currentAuthor = null;
let searchText = "";
let transpose = 0;
let useFlats = false; // false = #, true = b
let rhythmsDB = {};

// načítanie songs.json
function loadSongs() {
  fetch("./data/songs1.json")
    .then(res => res.json())
    .then(data => {
      songs = data.songs;

      renderCategories();
      renderAuthors();
      renderSongs();
    });
}

function loadRhythms() {
  fetch("./data/rhythms.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(r => rhythmsDB[r.name] = r);
    });
}

function showRhythm(name) {
  const r = rhythmsDB[name];
  if (!r) return;

  const rhythmBox = document.getElementById("rhythmBox");

  rhythmBox.innerHTML = `
    <div style="margin-top:10px;">
      <b>${r.label}</b>
      <img src="${r.image}" style="height:100%; max-height:150px; border-radius:10px;">

      <audio controls src="${r.audio}"></audio>
    </div>
  `;
}

// 🎵 KATEGÓRIE
function renderCategories() {
    
  const elem = document.getElementById("categories"); // alebo ako sa volá to tvoje ID
  if (!elem) return; // POISTKA: Ak div neexistuje, funkcia okamžite skončí a nevyhodí chybu
  
  // ... tvoj pôvodný kód, ktorý robí elem.innerHTML = ...
  select.innerHTML = "";

  let allCategories = [];

  songs.forEach(song => {
    if (!song.category) return;

    song.category.forEach(cat => {
      if (!allCategories.includes(cat)) {
        allCategories.push(cat);
      }
    });
  });

  allCategories.sort();

  // 🔹 možnosť "všetky"
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Všetky kategórie";
  select.appendChild(defaultOption);

  // 🔹 kategórie
  allCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // 🔥 onchange (rovnako ako autori)
  select.onchange = () => {
    currentCategory = select.value || null;
    renderSongs();
  };
}


// 🎤 AUTORI
function renderAuthors() {
  
  const elem = document.getElementById("authors"); // uprav podľa tvojho ID
  if (!elem) return; // POISTKA
  
  // ... tvoj pôvodný kód
  select.innerHTML = "";

  let allAuthors = [];

  songs.forEach(song => {
    if (!song.author) return;

    if (!allAuthors.includes(song.author)) {
      allAuthors.push(song.author);
    }
  });

  allAuthors.sort();

  // možnosť "všetci"
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Všetci autori";
  select.appendChild(defaultOption);

  allAuthors.forEach(author => {
    const option = document.createElement("option");
    option.value = author;
    option.textContent = author;
    select.appendChild(option);
  });

  // zmena výberu
  select.onchange = () => {
    currentAuthor = select.value || null;
    renderSongs();
  };
}

// 🔍 VYHĽADÁVANIE
function setupSearch() {
  const input = document.getElementById("search");

  if (!input) return;

  input.addEventListener("input", (e) => {
    searchText = e.target.value.toLowerCase();
    renderSongs();
  });
}


// 🎵 ZOZNAM PIESNÍ
function renderSongs() {
  
  const elem = document.getElementById("songList"); // tvoje ID zo zoznamu
  if (!elem) return; // POISTKA
  
  // ... tvoj pôvodný kód
  list.innerHTML = "";

  let filtered = songs.filter(song => {
    let ok = true;

    if (currentCategory) {
      ok = ok && song.category?.includes(currentCategory);
    }

    if (currentAuthor) {
      ok = ok && song.author === currentAuthor;
    }

    if (searchText) {
      ok = ok && song.title.toLowerCase().includes(searchText);
    }

    return ok;
  });

  filtered.sort((a, b) => a.title.localeCompare(b.title));

  filtered.forEach(song => {
    const btn = document.createElement("button");
    btn.textContent = song.title;

    btn.onclick = () => showSong(song);

    list.appendChild(btn);
   
    });
  }

// ===============================
// 🎸 SVG TABULÁTOR – NOVÝ ENGINE
// ===============================

// nakreslí 6 strún
/* ============================
   TAB ENGINE – FINÁLNA VERZIA
   ============================ */

const NOTES_PER_LINE = 18;
const STRING_NAMES = ["e", "h", "g", "d", "a", "e"]; // 1 → 6

// Kreslí jeden riadok strún
function drawTabLine(svg, lineOffset, totalWidth) {
    const svgNS = "http://www.w3.org/2000/svg";

    for (let i = 0; i < 6; i++) {
        let y = lineOffset + 20 + i * 25;

        // názov struny
        let label = document.createElementNS(svgNS, "text");
        label.setAttribute("x", 5);
        label.setAttribute("y", y + 5);
        label.setAttribute("font-size", "16");
        label.setAttribute("font-family", "monospace");
        label.textContent = STRING_NAMES[i];
        svg.appendChild(label);

        // čiara struny
        let line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", 20);
        line.setAttribute("y1", y);
        line.setAttribute("x2", totalWidth);
   line.setAttribute("y2", y);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
    }
}

// Kreslí jednu notu
function drawNote(svg, stringIndex, fret, x, lineOffset) {
    const svgNS = "http://www.w3.org/2000/svg";

    let y = lineOffset + 20 + stringIndex * 25 + 5;

    let text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y+2);
    text.setAttribute("font-size", "22");
    text.setAttribute("font-family", "monospace");
    text.textContent = fret;

    svg.appendChild(text);
}

// Taktová čiara
function drawBar(svg, x, lineOffset) {
    const svgNS = "http://www.w3.org/2000/svg";

    let line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", lineOffset + 20);
    line.setAttribute("x2", x);
    line.setAttribute("y2", lineOffset + 145);
    line.setAttribute("stroke", "#555");
    line.setAttribute("stroke-width", "2");

    svg.appendChild(line);
}

// Hlavná funkcia – zalamovanie, akordy, taktové čiary
function renderTabFromJSON(tabArray) {
    
    const svg = document.getElementById("tab");
    svg.innerHTML = "";

    let totalLines = Math.ceil(tabArray.length / NOTES_PER_LINE);
    let totalWidth = NOTES_PER_LINE  * 40;
    

    svg.setAttribute("width", totalWidth );
    svg.setAttribute("height", totalLines * 180);

    for (let line = 0; line < totalLines; line++) {
        let lineOffset = line * 180;

        // nakreslí struny pre tento riadok
        drawTabLine(svg, lineOffset, totalWidth);

        for (let i = 0; i < NOTES_PER_LINE; i++) {
            let index = line * NOTES_PER_LINE + i;
            if (index >= tabArray.length) break;

            let item = tabArray[index];
            let x = 40 + i * 40;

            // taktová čiara
            if (item.bar) {
                drawBar(svg, x, lineOffset);
                continue;
            }

            // akord (viac nôt pod sebou)
            if (item.chord) {
                item.chord.forEach(n => {
                    drawNote(svg, n.string - 1, n.fret, x, lineOffset);
                });
                continue;
            }

            // jedna nota
            if (item.string !== undefined && item.fret !== undefined) {
                drawNote(svg, item.string - 1, item.fret, x, lineOffset);
                continue;
            }

            console.warn("NEZNÁMY TAB OBJEKT:", item);
        }
    }
}


// 🎸 ZOBRAZENIE PIESNE

function showSong(song) {

const videoBox = document.getElementById("youtubeBox");
const yt = getYouTubeData(song.youtube);

if (yt) {
  videoBox.innerHTML = `
    <div id="ytThumb" style="
      position:relative;
      cursor:pointer;
      max-width:300px;
    ">
      
      <img src="${yt.thumb}" 
           style="
             
             height:250px;
             object-fit:cover;
             border-radius:10px;
             display:block;
           ">

      <div style="
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        font-size:50px;
        color:white;
        text-shadow:0 0 10px black;
        pointer-events:none;
      ">▶</div>
    </div>

    <div style="margin-top:8px;">
      <a href="${song.youtube}" target="_blank">
        ▶️ Prehrať na YouTube
      </a>
    </div>
  `;

  // 👉 klik na obrázok
  document.getElementById("ytThumb").addEventListener("click", () => {

    videoBox.innerHTML = `
      <iframe 
        
        height="250"
        src="${yt.embed}?autoplay=1"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>

      <div style="margin-top:8px;">
        <a href="${song.youtube}" target="_blank">
          ▶️ Prehrať na YouTube
        </a>
      </div>
    `;

  });

} else {
  videoBox.innerHTML = "";
}

//-----------
  window.currentSong = song;

  document.getElementById("title").textContent = song.title;

 const tabsDiv = document.getElementById("songTabs");

if (song.tabs && Array.isArray(song.tabs)) {

  tabsDiv.innerHTML = `<svg id="tab"></svg>`;

  

    renderTabFromJSON(song.tabs);

} else {
    tabsDiv.innerHTML = "";
}


const chordsDiv = document.getElementById("songChords");

if (song.chords && song.chords.length > 0) {

  chordsDiv.innerHTML = song.chords.map(ch => {

    let chordName = ch.name;
    let newChord = transposeChord(chordName, transpose);

    return `
      <div class="chordCard" onclick="showChord('${newChord}')">
        <div><b>${newChord}</b></div>
        <div class="svgHolder"></div>
      </div>
    `;

  }).join("");

  // vykreslenie SVG
  document.querySelectorAll(".svgHolder").forEach((el, i) => {

    let ch = song.chords[i];
    

    // 👉 custom hmat
    if (ch.positions) {
      el.appendChild(generateCustomChordSVG(ch));
    } 
    // 👉 default z databázy
    else {
      let name = transposeChord(ch.name, transpose);
      el.appendChild(generateChordSVG(name));
    }

  });

} else {
  chordsDiv.innerHTML = "";
}


  // rytmus box
const rhythmBox = document.getElementById("rhythmBox");

if (song.rhythm && rhythmsDB[song.rhythm]) {

  const r = rhythmsDB[song.rhythm];

  rhythmBox.innerHTML = `
    <div style="margin-top:10px;">
      🎵 <span class="rhythmLink" onclick="showRhythm('${r.name}')">
        ${r.label}
      </span>
    </div>
  `;

} else {
  rhythmBox.innerHTML = "";
}

  const textDiv = document.getElementById("songText");

  let text = song.text;

  text = text.replace(/\[(.*?)\]/g, (match, chord) => {
    let newChord = transposeChord(chord, transpose);

    return `<sup class="chord" onclick="showChord('${newChord}')">${newChord}</sup>`;
  });

  // tučné C]Toto je {i}kurzíva{/i} [G]Toto je {b}tučné{/b}
text = text.replace(/\{b\}(.*?)\{\/b\}/g, "<b>$1</b>");

// kurzíva
text = text.replace(/\{i\}(.*?)\{\/i\}/g, "<i>$1</i>");

// farba
text = text.replace(/\{color=(.*?)\}(.*?)\{\/color\}/g, "<span style='color:$1'>$2</span>");

  
  text = text.replace(/\n/g, "<br>");

  textDiv.innerHTML = text;
}

function getYouTubeEmbed(url) {
  if (!url) return null;

  // ak už je embed link → použi ho
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // klasický link: https://www.youtube.com/watch?v=VIDEOID
  let match = url.match(/v=([^&]+)/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  // skrátený link: https://youtu.be/VIDEOID
  match = url.match(/youtu\.be\/([^?]+)/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return null;
}

function getYouTubeData(url) {
  if (!url) return null;

  let match = url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  if (!match) return null;

  const id = match[1];

  return {
    id: id,
    embed: `https://www.youtube.com/embed/${id}`,
    thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  };
}

//Transponovanie

const NOTES_SHARP = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","H"];

const NOTES_FLAT = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","H"];

const FLATS_TO_SHARPS = {
  Bb: "A#",
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#"
};


function transposeChord(chord, shift) {

  let match = chord.match(/^([A-H](#|b)?)(.*)$/);
  if (!match) return chord;

  let root = match[1];
  let suffix = match[3];

  // prevedieme Bb → A#
  if (FLATS_TO_SHARPS[root]) {
    root = FLATS_TO_SHARPS[root];
  }

  let index = NOTES_SHARP.indexOf(root);
  if (index === -1) return chord;

  let newIndex = (index + shift + 12) % 12;

  // 👉 výber výstupu
  let newRoot = useFlats ? NOTES_FLAT[newIndex] : NOTES_SHARP[newIndex];

  return newRoot + suffix;
}

function changeTranspose(step) {
  transpose += step;
  renderSongs();

  // ak je otvorená pieseň → obnov ju
  if (window.currentSong) {
    showSong(window.currentSong);
  }
}

function toggleNotation() {
  useFlats = !useFlats;

  if (window.currentSong) {
    showSong(window.currentSong);
  }
}

// INIT
window.onload = () => {
  loadSongs();
  loadRhythms();
  setupSearch();
};
