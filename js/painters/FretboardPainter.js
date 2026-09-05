class FretboardPainter extends BasePainter {

    paintLayout(model){

        this.paintStrings(model.layout);

        this.paintFrets(model.layout);

         this.paintStringNames(model);

         this.paintFretNumbers(model.layout);

    }

    paintContent(model){

        this.paintNotes(model.notes);

    }

    paintOverlay(model){

        this.paintBarre(model.barre);

        this.paintPosition(model.position);

    }

    //=========================
    // Layout
    //=========================

    paintStrings(layout){

        for(let i = 0; i < layout.strings; i++){

            const y =
                layout.top +
                i * layout.stringSpacing;

            this.drawer.drawString(

                layout.left,

                y,

                layout.right

            );

        }

    }

    paintFrets(layout){

    for(let i = 0; i <= layout.frets; i++){

        const x =
            layout.left +
            i * layout.fretSpacing;

        this.drawer.drawFret(

            x,
            layout.top,
            layout.bottom,

            i === 0
                ? {
                    "stroke-width": Theme.STROKE.nut
                  }
                : {}

        );

    }

}


    paintStringNames(model){

    const layout = model.layout;

    model.tuning.forEach((name,index)=>{

        const y =
            layout.top +
            index * layout.stringSpacing;

        this.drawer.drawLabel(

            name,

            layout.left - 20,

            y,

            {

                fill: Theme.COLORS.text,

"font-size": Theme.FONT.stringName

            }

        );

    });

}

paintFretNumbers(layout){

    for(let fret = 1; fret <= layout.frets; fret++){

        const x =
            layout.left +
            (fret - 0.5) *
            layout.fretSpacing;

        this.drawer.drawLabel(

            fret,

            x,

            layout.top - 30,

            {

                fill: Theme.COLORS.fret,

                "font-size":
                    Theme.FONT.fretNumber

            }

        );

    }

}

    //=========================
    // Notes
    //=========================
paintNotes(notes = []) {

    // Najprv vykreslíme neaktívne noty
    // a až potom aktívnu notu.
    //
    // Dôležité pri playbacku:
    // aktívny prst musí byť navrchu.

    const inactive = notes.filter(
        note => !note.highlight
    );

    const active = notes.filter(
        note => note.highlight
    );

    for (const note of inactive) {

        this.paintNote(note);

    }

    for (const note of active) {

        this.paintNote(note);

    }

}

 /* 
paintNotes(notes = []) {

    const unique = new Map();

    for (const note of notes) {

        const key =
            `${note.string}-${note.fret}`;

        const existing =
            unique.get(key);

        if (!existing) {

            unique.set(
                key,
                { ...note }
            );

        } else {

            existing.highlight =
                existing.highlight ||
                note.highlight;

        }

    }

    for (const note of unique.values()) {

        this.paintNote(note);

    }

}
*/
  
  paintNote(note) {

    this.paintFinger(note);

    this.paintNoteName(note);

}

   
   paintFinger(note) {

    this.drawer.drawFinger(

        note.x,
        note.y,

        note.finger,

        note.highlight,

        note.root

    );

}

paintNoteName(note) {

    if (!note.note) return;

    this.drawer.drawNoteName(

        note.x,
        note.y,
        note.note

    );

}


    //=========================
    // Overlay
    //=========================

    paintBarre(barre){

        if(!barre) return;

        // doplníme
         this.drawer.drawBarre(

        barre

    );

    }

    paintPosition(position){

        if(!position) return;

        // doplníme
        this.drawer.drawPosition(

        position

    );

    }

}

window.FretboardPainter = FretboardPainter;
