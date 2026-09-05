class MeasureLayoutBuilder {

    static build(measure, layout) {

        const notes =
            measure.notes ?? [];

        const totalBeats =
            notes.reduce(

                (sum, note) =>

                    sum +
                    NotationUtils.durationValue(
                        note.duration
                    ),

                0

            );

        const baseBeatWidth =
            layout.baseBeatWidth ?? 55;

        const minNoteGap =
            layout.minNoteGap ?? 30;

        const timeWidth =
            totalBeats *
            baseBeatWidth;

        const minimumWidth =
            notes.length *
            minNoteGap;

        const width =
            Math.max(
                timeWidth,
                minimumWidth
            );

        return {

            totalBeats,

            width,

            notes

        };

    }

}

window.MeasureLayoutBuilder =
    MeasureLayoutBuilder;