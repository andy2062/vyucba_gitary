class SVGDrawer {
    

        constructor(svg){

        this.svg = svg;

    }
   
     static START_X = 90;
    static START_Y = 60;

    static FRET_SPACING = 74;
    static STRING_SPACING = 46;

     static STRING_NAMES = [
        "e",
        "H",
        "G",
        "D",
        "A",
        "E"
    ];

    static fingerColors = {
        "1": "#43a047",
        "2": "#1e88e5",
        "3": "#fb8c00",
        "4": "#e53935",
        "0": "#8e24aa"
    };

    static createSVG(type) {
        return document.createElementNS(
            "http://www.w3.org/2000/svg",
            type
        );
    }

    // =====================================================
    // DRAW TAB
    // =====================================================

      clear() {

        this.svg.innerHTML = "";

    }

    static setAttributes(element, attrs) {

    Object.entries(attrs).forEach(([key, value]) => {

        element.setAttribute(key, value);

    });

   }



   drawLine(x1, y1, x2, y2, options = {}) {
    

    const line = SVGDrawer.createSVG("line");
console.log("DRAW LINE", x1, y1, x2, y2);
    SVGDrawer.setAttributes(line, {

        x1,
        y1,
        x2,
        y2,

        stroke: options.stroke ?? "#444",

        "stroke-width": options.width ?? 1

    });

    this.svg.appendChild(line);
console.log(this.svg.innerHTML);

       // return line;

    }

    drawText(x, y, text, options = {}) {

        const node = SVGDrawer.createSVG("text");

        node.setAttribute("x", x);
        node.setAttribute("y", y);

        node.setAttribute(
            "font-size",
            options.size ?? 16
        );

        node.setAttribute(
            "text-anchor",
            options.anchor ?? "middle"
        );

        node.setAttribute(
            "dominant-baseline",
            options.baseline ?? "middle"
        );

        node.setAttribute(
            "fill",
            options.color ?? "#000"
        );

        node.textContent = text;

        this.svg.appendChild(node);

        return node;

    }

    

     // =====================================================
    // DRAW BASE
    // =====================================================
    drawBase()  {
        if (!this.svg) return;

        this.svg.innerHTML="";

              // Pražce (frets)
        for (let fret = 0; fret <= 14; fret++) {
            const x = SVGDrawer.START_X + (fret * SVGDrawer.FRET_SPACING);
            const line = SVGDrawer.createSVG("line");
            line.setAttribute("x1", x);
            line.setAttribute("y1", SVGDrawer.START_Y);
            line.setAttribute("x2", x);
            line.setAttribute("y2", SVGDrawer.START_Y + (5 * SVGDrawer.STRING_SPACING));
            line.setAttribute("stroke", fret === 0 ? "#222" : "#999");
            line.setAttribute("stroke-width", fret === 0 ? "8" : "2");
            this.svg.appendChild(line);

            if (fret < 14) {
                const txt = SVGDrawer.createSVG("text");
                txt.setAttribute("x", x + 37);
                txt.setAttribute("y", 30);
                txt.setAttribute("fill", "#666");
                txt.setAttribute("font-size", "15");
                txt.setAttribute("text-anchor", "middle");
                txt.textContent = fret + 1;
                this.svg.appendChild(txt);
            }
        }

        // Struny (strings)
        for (let s = 0; s < 6; s++) {
            const y = SVGDrawer.START_Y + (s * SVGDrawer.STRING_SPACING);
            const line = SVGDrawer.createSVG("line");
            line.setAttribute("x1", SVGDrawer.START_X);
            line.setAttribute("y1", y);
            line.setAttribute("x2", SVGDrawer.START_X + (14 * SVGDrawer.FRET_SPACING));
            line.setAttribute("y2", y);
            line.setAttribute("stroke", "#666");
            line.setAttribute("stroke-width", 2 + (s * 0.5));
            this.svg.appendChild(line);

            const label = SVGDrawer.createSVG("text");
            label.setAttribute("x", 45);
            label.setAttribute("y", y + 5);
            label.setAttribute("fill", "#555");
            label.setAttribute("font-size", "18");
            label.textContent = SVGDrawer.STRING_NAMES[s];
            this.svg.appendChild(label);
        }
    }

    // =====================================================
    // DRAW NOTE
    // =====================================================
    drawNote(note, active = false) {

        if (!note || !this.svg) return;

        // Tlmená struna sa nekreslí
    if (note.fret < 0) {

        return;

    }

    const tone = MusicDatabase.get(
        note.string,
        note.fret
    ); 

    
        const x = SVGDrawer.START_X + (note.fret * SVGDrawer.FRET_SPACING) - (SVGDrawer.FRET_SPACING / 2);
        const y = SVGDrawer.START_Y + ((note.string - 1) * SVGDrawer.STRING_SPACING);
        
        // Tieň tónu
        const shadow = SVGDrawer.createSVG("circle");
        shadow.setAttribute("cx", x + 3);
        shadow.setAttribute("cy", y + 3);
        shadow.setAttribute("r", 22);
        shadow.setAttribute("fill", "rgba(0,0,0,0.15)");
        this.svg.appendChild(shadow);

        // Hlavný kruh tónu
        const circle = SVGDrawer.createSVG("circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", note.root ? 24 : 20);
        //circle.setAttribute("fill", SVGDrawer.fingerColors[note.finger] || "#1976d2");
        circle.setAttribute("fill", active ? SVGDrawer.fingerColors[note.finger] : "#bdbdbd");

        if (note.root) {
            circle.setAttribute("stroke", "#111");
            circle.setAttribute("stroke-width", "4");
        }
        this.svg.appendChild(circle);

        // Číslo prstu
        const fingerText = SVGDrawer.createSVG("text");
        fingerText.setAttribute("x", x);
        fingerText.setAttribute("y", y);
        fingerText.setAttribute("class", "bigFinger");
        // Oprava vycentrovania textu v SVG
        fingerText.setAttribute("text-anchor", "middle");
        fingerText.setAttribute("dominant-baseline", "central");
        fingerText.textContent = note.finger;
        //this.svg.appendChild(fingerText);
        if (active) { this.svg.appendChild(fingerText);
}

        // Kruh pre názov tónu
        const smallCircle = SVGDrawer.createSVG("circle");
        smallCircle.setAttribute("cx", x + 22);
        smallCircle.setAttribute("cy", y - 22);
        smallCircle.setAttribute("r", 14);
        smallCircle.setAttribute("fill", "white");
        smallCircle.setAttribute("stroke", "#bbb");
        this.svg.appendChild(smallCircle);

        // Text názvu tónu
        const noteText = SVGDrawer.createSVG("text");
        noteText.setAttribute("x", x + 22);
        noteText.setAttribute("y", y - 22);
        noteText.setAttribute("class", "smallNote");
        noteText.setAttribute("text-anchor", "middle");
        noteText.setAttribute("dominant-baseline", "central");
        noteText.textContent = tone.note;
        // text.textContent = tone.pitch;
        this.svg.appendChild(noteText);
    }

    // =====================================================
    // DRAW BARRE
    // =====================================================
    drawBarre(barre) {
        if (!barre || !this.svg) return;

        const x = SVGDrawer.START_X + (barre.fret * SVGDrawer.FRET_SPACING) - (SVGDrawer.FRET_SPACING / 2) - 22;
        const y1 = SVGDrawer.START_Y + ((barre.fromString - 1) * SVGDrawer.STRING_SPACING);
        const y2 = SVGDrawer.START_Y + ((barre.toString - 1) * SVGDrawer.STRING_SPACING);

        const rect = SVGDrawer.createSVG("rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y1 - 22);
        rect.setAttribute("width", 44);
        rect.setAttribute("height", y2 - y1 + 44);
        rect.setAttribute("rx", 22);
        rect.setAttribute("fill", SVGDrawer.fingerColors[barre.finger] || "#1976d2");
        rect.setAttribute("opacity", "0.55");
        this.svg.appendChild(rect);
    }

    

}

window.SVGDrawer = SVGDrawer;