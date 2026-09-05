class TabPainter extends BasePainter {

   
    // ===========================
    // Layout
    // ===========================

    paintLayout(model){

    this.paintStrings(model);

    this.paintMeasureLines(model);

    this.paintMeasureNumbers(model);

}

    paintStrings(model) {

        //const layout = model.layout;
        const { layout } = model;

        for (let i = 0; i < model.strings; i++) {

            const y =
                layout.top +
                i * layout.stringSpacing;

            this.drawer.drawTabLine(

                layout.left,
                y,
                layout.right

            );

        }

    }

    // ===========================
    // Content
    // ===========================

    paintContent(model){

    model.columns.forEach(

        (column,index)=>

            this.paintColumn(

                column,

                index,

                model.layout

            )

    );

}

paintColumn(

    column,

    index,

    layout

){

    column.notes.forEach(

        note=>

            this.paintNote(

                note,

                index,

                layout

            )

    );

}

paintNote(

    note,

    index,

    layout

){

    const x =

        layout.left +

        index *

        layout.columnSpacing;

    const y =

        layout.top +

        (note.string-1) *

        layout.stringSpacing;

    this.drawer.drawText(

    note.fret,

    x,

    y,

    note.highlight

        ? {

            fill:"#ff9800",

            "font-weight":"bold"

        }

        : {}

);

}
//-------------------------
//PLACEHOLDERS
//-----------------------

paintMeasureLines(model){

    // neskôr

}

paintMeasureNumbers(model){

    // neskôr

}

paintCursor(model){

    // neskôr

}


    // ===========================
    // Overlay
    // ===========================

    paintOverlay(model){

    this.paintCursor(model);

}

    }

window.TabPainter = TabPainter;