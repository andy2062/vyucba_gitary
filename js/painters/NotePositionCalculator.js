class NotePositionCalculator {

    static calculate(
        notes = [],
        measureLayout,
        layout
    ) {

        if (!measureLayout || !layout) {
            return [];
        }

        const beatWidth =
            layout.baseBeatWidth ?? 55;

        const noteInset =
            layout.noteInset ?? 25;

        const minNoteGap =
            layout.minNoteGap ?? 30;

        const positions = [];

        let timePosition = 0;

        for (const note of notes) {

            const duration =
                NotationUtils.durationValue(
                    note.duration
                );

            // -------------------------
            // Ideálna pozícia podľa času
            // -------------------------

            let x =
                measureLayout.startX +
                noteInset +
                timePosition *
                beatWidth;

            // -------------------------
            // Minimálna vizuálna medzera
            // -------------------------

            if (positions.length > 0) {

                const previous =
                    positions[
                        positions.length - 1
                    ];

                const minimumX =
                    previous.x +
                    minNoteGap;

                if (x < minimumX) {

                    x = minimumX;

                }

            }

            // -------------------------
            // Uloženie pozície
            // -------------------------

            positions.push({

                ...note,

                x,

                timePosition,

                durationValue:
                    duration

            });

            // -------------------------
            // Posun v čase
            // -------------------------

            timePosition += duration;

        }

        return positions;

    }

}

window.NotePositionCalculator =
    NotePositionCalculator;