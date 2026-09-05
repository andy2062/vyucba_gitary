class NotationRenderer {

    constructor(container) {

        this.container = container;

        this.layout =
        new NotationLayout();

    }

    render(frame) {

        if (!this.container) return;
        if (!frame.notation) return;

        this.clear();

        const notation = frame.notation;

        const renderer =
            this.createRenderer();

        const context =
            renderer.getContext();

        let x = 10;

notation.measures.forEach((measure, index) => {

    x = this.drawMeasure(

        context,
        measure,
        notation,
        x,
        index === 0

    );

});

    }

    clear() {

        this.container.innerHTML = "";

    }

    createRenderer() {

        const renderer =
            new Vex.Flow.Renderer(

                this.container,

                Vex.Flow.Renderer.Backends.SVG

            );

        renderer.resize(1000,150);

        return renderer;

    }

    drawMeasure(
        context,
        measure,
        notation,
        x,
        firstMeasure
    ) {

        const stave =
            this.createStave(

                context,
                notation,
                x,
                firstMeasure

            );

        const voice =
            this.createVoice(
                notation
            );

        const notes =
            this.createNotes(
                measure
            );

        voice.addTickables(
            notes
        );

        new Vex.Flow.Formatter()

            .joinVoices([voice])

            .format([voice],260);

        voice.draw(
            context,
            stave
        );

        return x + 280;

    }

    createStave(
    context,
    notation,
    x,
    firstMeasure
) {

    const stave =
        new Vex.Flow.Stave(

            x,
            20,
            260

        );

    if (firstMeasure) {

        stave
            .addClef(notation.clef)
            .addTimeSignature(notation.time);

        // neskôr sem pridáme aj:
        // .addKeySignature(notation.key)

    }

    stave
        .setContext(context)
        .draw();

    return stave;

}

    createVoice(
        notation
    ) {

        return new Vex.Flow.Voice({

            num_beats:
                parseInt(
                    notation.time.split("/")[0]
                ),

            beat_value:
                parseInt(
                    notation.time.split("/")[1]
                )

        });

    }

    createNotes(
        measure
    ) {

        return measure.notes.map(note =>

            new Vex.Flow.StaveNote({

                keys:
                    note.keys,

                duration:
                    note.duration

            })

        );

    }

}

window.NotationRenderer = NotationRenderer;