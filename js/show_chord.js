function formatChordsToSup(rawText) {
  if (!rawText) return "";

  // 1. RegEx, ktorý bezpečne nájde [G], [Ami], ale aj C], D7] atď.
  const chordRegex = /(?:\[([A-G][a-zA-Z0-9#]*?)\]|([A-G][a-zA-Z0-9#]*?)\])/g;

  // 2. Nahradenie akordov za <sup> tagy s transpozíciou (ak ju používaš, ak nie, stačí použiť premennú 'chord')
  let formattedText = rawText.replace(chordRegex, (match, chord1, chord2) => {
    let chord = chord1 || chord2;
    
    // Ak máš globálnu premennú 'transpose', preženieme to ňou. Ak nie, stačí dať len 'chord'
    let currentTranspose = typeof transpose !== 'undefined' ? transpose : 0;
    let newChord = typeof transposeChord === 'function' ? transposeChord(chord, currentTranspose) : chord;

    return `<sup class="chord" onclick="showChord('${newChord}')">${newChord}</sup>`;
  });

  // 3. Spracovanie tvojich formátovacích značiek (tučné, kurzíva, farby)
  formattedText = formattedText.replace(/\{b\}(.*?)\{\/b\}/g, "<b>$1</b>");
  formattedText = formattedText.replace(/\{i\}(.*?)\{\/i\}/g, "<i>$1</i>");
  formattedText = formattedText.replace(/\{color=(.*?)\}(.*?)\{\/color\}/g, "<span style='color:$1'>$2</span>");

  // 4. Prevod klasických nových riadkov na HTML zalomenia <br>
  formattedText = formattedText.replace(/\n/g, "<br>");

  return formattedText;
}