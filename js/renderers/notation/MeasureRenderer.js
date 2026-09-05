class MeasureRenderer {

    constructor() {

        this.voiceFactory =
            new VoiceFactory();

        this.noteFactory =
            new NoteFactory();

    }

    render(

        context,
        rect,
        measure,
        notation,
        index

    ) {

        const stave =
            new Vex.Flow.Stave(

                rect.x,
                rect.y,
                rect.width

            );

        if(index === 0){

            stave
                .addClef(notation.clef)
                .addTimeSignature(notation.time);

        }

        stave
            .setContext(context)
            .draw();

        const voice =
            this.voiceFactory.create(

                notation

            );

        const notes =
            this.noteFactory.create(

                measure

            );

        voice.addTickables(notes);

        new Vex.Flow.Formatter()

            .joinVoices([voice])

            .formatToStave(

                [voice],
                stave

            );

        voice.draw(

            context,
            stave

        );

    }

}

window.MeasureRenderer = MeasureRenderer;