class FretboardBuilder {

static build(model) {

    const notes =
        (model.notes ?? []).flatMap(step =>
            Array.isArray(step)
                ? step
                : [step]
        );

    const flatModel = {
        ...model,
        notes
    };

    const layout =
        LayoutBuilder.fretboard(flatModel);

    return {

        type: flatModel.type,

        layout,

        notes:
            this.buildNotes(
                notes,
                layout
            ),

        barre:
            this.buildBarre(
                flatModel.barre,
                layout
            ),

        position:
            this.buildPosition(
                flatModel.position,
                layout
            ),

        tuning:
            flatModel.tuning ??
            [
                "e",
                "H",
                "G",
                "D",
                "A",
                "E"
            ],

        meta: {

            title: flatModel.title,
            description: flatModel.description

        }

    };

}


static buildNotes(notes, layout) {

    return notes.map(note => ({

        ...note,

        highlight:
            note.highlight ?? false,

        x:
            layout.left +
            (note.fret - 0.5) *
            layout.fretSpacing,

        y:
            layout.top +
            (note.string - 1) *
            layout.stringSpacing

    }));

}

    static buildBarre(barre, layout) {

    if (!barre) return null;

    return {

        ...barre,

        x:
            layout.left +
            (barre.fret - 0.5) *
            layout.fretSpacing,

        y:
            layout.top +
            (barre.fromString - 1) *
            layout.stringSpacing,

        height:
            (barre.toString - barre.fromString) *
            layout.stringSpacing

    };

}

static buildPosition(position, layout) {

    if (!position) return null;

    return {

        label: String(position),

        x: layout.left - 20,

        y: layout.top - 18

    };

}

   
}

window.FretboardBuilder = FretboardBuilder;
