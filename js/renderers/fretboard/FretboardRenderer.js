class FretboardRenderer extends BaseRenderer {

    constructor(svg) {

        super(svg);

        this.painter =
            new FretboardPainter(
                this.drawer
            );

    }

renderModel(model){

    console.log(
        "FRETBOARD HIGHLIGHTS:",
        model.notes.map(n => ({
            note: n.note,
            highlight: n.highlight,
            finger: n.finger
        }))
    );

    const fretboard =
        FretboardBuilder.build(model);

    super.render(fretboard);

}


}

window.FretboardRenderer =
    FretboardRenderer;