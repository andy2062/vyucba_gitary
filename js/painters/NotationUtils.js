class NotationUtils {

    // ==========================================
    // DURATION
    // ==========================================

     static durationValue(duration) {

        switch (duration) {

            case "w":
                return 4;

            case "h":
                return 2;

            case "q":
                return 1;

            case "8":
                return 0.5;

            case "16":
                return 0.25;

            case "32":
                return 0.125;

            default:
                return 1;

        }

    }

    // ==========================================
    // PITCH
    // ==========================================

    static pitchToStep(pitch) {

        if (!pitch) {
            return null;
        }

        const match =
            pitch
                .toLowerCase()
                .match(/^([a-g])\/(\d+)$/);

        if (!match) {
            return null;
        }

        const letter = match[1];
        const octave = Number(match[2]);

        const steps = {
            c: 0,
            d: 1,
            e: 2,
            f: 3,
            g: 4,
            a: 5,
            b: 6
        };

        return octave * 7 + steps[letter];

    }


    static pitchToStaffY(pitch, layout) {

        if (!pitch || !layout) {
            return null;
        }

        const step =
            this.pitchToStep(pitch);

        if (step === null) {
            return null;
        }

        // B4 je horná pomocná referenčná pozícia
        const b4 =
            this.pitchToStep("b/4");

        const stepDifference =
            step - b4;

        /*
         * Každý diatonický krok = polovica
         * medzery medzi čiarami.
         *
         * B4 je na 3. čiare.
         */

        const middleY =
            layout.top +
            2 * layout.lineSpacing;

        return (
            middleY -
            stepDifference *
            (layout.lineSpacing / 2)
        );

    }


    // ==========================================
    // RHYTHM
    // ==========================================

    static durationValue(duration) {

        const values = {

            "w": 4,
            "h": 2,
            "q": 1,
            "8": 0.5,
            "16": 0.25

        };

        return (
            values[duration] ??
            1
        );

    }


    static getTimeSignatureBeats(time) {

        if (!time) {
            return 4;
        }

        const parts =
            time.split("/");

        if (parts.length !== 2) {
            return 4;
        }

        const numerator =
            Number(parts[0]);

        const denominator =
            Number(parts[1]);

        if (
            !Number.isFinite(numerator) ||
            !Number.isFinite(denominator) ||
            denominator <= 0
        ) {
            return 4;
        }

        /*
         * Koľko štvrťových dôb obsahuje takt.
         *
         * 4/4 = 4
         * 3/4 = 3
         * 2/4 = 2
         * 6/8 = 3
         */

        return (
            numerator *
            (4 / denominator)
        );

    }


    static getMeasureDuration(
        measure,
        time = "4/4"
    ) {

        if (!measure?.notes) {
            return 0;
        }

        return measure.notes.reduce(

            (sum, note) =>

                sum +
                this.durationValue(
                    note.duration
                ),

            0

        );

    }


    // ==========================================
    // NOTE POSITIONS
    // ==========================================

    static calculateNotePositions(
    notes = [],
    measureIndex = 0,
    layout,
    time = "4/4"
) {

    if (
        !Array.isArray(notes) ||
        !layout ||
        notes.length === 0
    ) {
        return [];
    }

    const measureBeats =
        this.getTimeSignatureBeats(time);

    /*
     * Celý priestor taktu.
     */

    const measureWidth =
        layout.measureSpacing;


    /*
     * Priestor, ktorý necháme
     * pred taktovou čiarou.
     */

    const paddingRight =
        layout.measurePaddingRight ?? 18;


    /*
     * Časový priestor pre noty.
     */

    const contentWidth =
        measureWidth - paddingRight;


    /*
     * Šírka jednej štvrťovej doby.
     */

    const beatWidth =
        contentWidth / measureBeats;


    /*
     * Začiatok taktu.
     */

    const measureStart =
        layout.left + 
        (layout.headerWidth ?? 0) +
        measureIndex *
        measureWidth;


    let currentBeat = 0;


    return notes.map(note => {

        const duration =
            this.durationValue(
                note.duration
            );


        /*
         * Nota sa kreslí na ZAČIATKU
         * svojho časového priestoru.
         */

        const x =
            measureStart + 
            currentBeat *
            beatWidth;


        const result = {

            ...note,

            x,

            beat: currentBeat,

            durationValue: duration,

            width:
                duration *
                beatWidth

        };


        /*
         * Ďalšia nota začne až po
         * skončení aktuálnej.
         */

        currentBeat += duration;


        return result;

    });

}

}

window.NotationUtils =
    NotationUtils;
