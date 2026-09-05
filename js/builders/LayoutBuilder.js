class LayoutBuilder {

    //=========================
    // TAB
    //=========================

    static tab() {

        return {

            left: 40,
            right: 520,

            top: 30,
            bottom: 130,

            strings: 6,

            stringSpacing: 20,

            columnSpacing: 40

        };

    }

    //=========================
    // NOTATION
    //=========================

    static notation() {

        return {

            left: 40,
            right: 520,

            top: 40,
            bottom: 88,

            lineSpacing: 12,

            headerWidth: 80,

            baseBeatWidth: 55,

            minNoteGap: 30,

            noteInset: 40,
            
            measureSpacing: 180,

             measureBarInsetRatio: 45 / 180,

            ledgerLineWidth: 24,

           noteSpacing: 45,

           

           stemLength: 35,

           measurePaddingRight: 18


        };

    }

    //=========================
    // FRETBOARD
    //=========================

    static fretboard(model) {

        const left = 70;
        const top = 60;

        const fretSpacing = 100;
        const stringSpacing = 45;

       const notes = model.notes ?? [];

const maxFret = Math.max(
    ...notes.map(n => n.fret),
    5
);

const frets = maxFret + 2;
        const strings = 6;

        return {

            left,

            top,

            right:
                left +
                frets * fretSpacing,

            bottom:
                top +
                (strings - 1) *
                stringSpacing,

            strings,

            frets,

            stringSpacing,

            fretSpacing

            
        };

    }

}

window.LayoutBuilder = LayoutBuilder;