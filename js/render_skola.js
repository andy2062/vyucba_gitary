// 1. Spustíme tvoje existujúce načítanie pesničiek a rytmov, ktoré už máš v JS
window.addEventListener('DOMContentLoaded', () => {
  if (typeof loadSongs === 'function') loadSongs();
  if (typeof loadRhythms === 'function') loadRhythms();
});

// 2. Hlavná funkcia, ktorá prepojí tvoje existujúce funkcie s touto stránkou
function embedSongIntoPage(songTitle, buttonElement) {
  // Nájdeme kontajner, v ktorom bolo tlačidlo stlačené
  const container = buttonElement.closest('.skola-song-container');
  const embedArea = container.querySelector('.song-embed-area');
  
  // Ak je už pieseň viditeľná, tak ju kliknutím schováme
  if (embedArea.style.display === 'block') {
    embedArea.style.display = 'none';
    buttonElement.innerText = `Zobraziť pieseň ${songTitle}`;
    return;
  }

  // Skontrolujeme, či už tvoj JS stihol načítať pole 'songs'
  if (!songs || songs.length === 0) {
    console.warn("Piesne ešte nie sú načítané z JSONu.");
    return;
  }

  // Nájdeme pieseň v tvojom existujúcom poli podľa názvu
  const foundSong = songs.find(s => s.title.toLowerCase().includes(songTitle.toLowerCase()));

  if (foundSong) {
    // 3. TRIK: Na chvíľu presmerujeme výstupy tvojich funkcií do tohto konkrétneho bloku
    
    // Nájdeme miesto pre text VNÚTRI tohto bloku
    const localSongTextDiv = embedArea.querySelector('.songText');
    const localRhythmDiv = embedArea.querySelector('.rhythmBox');

    // Zálohujeme si pôvodné globálne prvky z tvojho song.html (ak by náhodou existovali)
    const originalSongText = document.getElementById('songText');
    const originalRhythmBox = document.getElementById('rhythmBox');

    // Dočasne premapujeme document.getElementById, aby tvoje funkcie zapisovali sem
 /*   const originalGetElement = document.getElementById;
    document.getElementById = function(id) {
      if (id === 'songText' || id === 'currentSongText') return localSongTextDiv;
      if (id === 'rhythmBox') return localRhythmDiv;
      return originalGetElement.call(document, id);
    };
*/
const originalGetElement = document.getElementById;
    document.getElementById = function(id) {
      if (id === 'songText' || id === 'currentSongText') return localSongTextDiv;
      if (id === 'rhythmBox') return localRhythmDiv;
      
      // Ak tvoj kód hľadá iné elementy (title, youtubeBox, songChords, songTabs...), 
      // ktoré na tejto podstránke nechceš alebo nemáš, vrátime im náš localSongTextDiv, 
      // aby kód nezlyhal na (Cannot set properties of null), alebo vrátime prázdny umelý element:
      const existuje = originalGetElement.call(document, id);
      if (!existuje) {
        // Vytvoríme "falošný" element v pamäti, aby doňho tvoj JS mohol zapísať .innerHTML,
        // ale stránku to nerozbije a nevypíše chybu
        return document.createElement('div'); 
      }
      
      return existuje;
    };
    // 4. Zavoláme TVOJU EXISTUJÚCU funkciu na vykreslenie textu.
    // Názov funkcie uprav podľa toho, ako sa volá u teba (napr. renderSong, showSong, a pod.)
    if (typeof showSong === 'function') {
      // Ak tvoja funkcia berie ako parameter priamo objekt piesne:
      showSong(foundSong);
    } else if (typeof selectSong === 'function') {
      // Ak tvoja funkcia hľadá pieseň podľa indexu v poli:
      const songIndex = songs.indexOf(foundSong);
      selectSong(songIndex);
    }

    // 5. Ak chceš zobraziť aj rytmus pomocou tvojej funkcie showRhythm:
    if (foundSong.rhythm && typeof showRhythm === 'function') {
      showRhythm(foundSong.rhythm);
    }

    // Vrátime pôvodné správanie document.getElementById späť do normálu
    document.getElementById = originalGetElement;

    // Zobrazíme vyrenderovaný blok a zmeníme text tlačidla
    embedArea.style.display = 'block';
    buttonElement.innerText = `Schovať pieseň ${songTitle}`;
  } else {
    alert(`Pieseň "${songTitle}" sa nenašla v databáze.`);
  }
}