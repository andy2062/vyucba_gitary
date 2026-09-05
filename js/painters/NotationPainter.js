class NotationPainter extends BasePainter {

    constructor(drawer) {

        super(drawer);

        this.staffPainter =
            new StaffPainter(drawer);

        this.clefPainter =
            new ClefPainter(drawer);

        this.measurePainter =
            new MeasurePainter(drawer);

        this.measureBarPainter =
    new MeasureBarPainter(drawer);



    }

    //=========================
    // Layout
    //=========================

    paintLayout(model) {

        this.staffPainter.paint(
            model.layout
        );

         this.clefPainter.paint(
            model.clef,
            model.layout
        );

    }

    //=========================
    // Content
    //=========================

    paintContent(model) {

        this.measurePainter.paint(
            model.measures,
            model.layout,
            model.time
        );

        this.measureBarPainter.paint(
        model.measures,
        model.layout
    );


    }

    //=========================
    // Overlay
    //=========================

    paintOverlay(model) {

         this.measureBarPainter.paint(
        model.measures,
        model.layout
    );

    }

}

window.NotationPainter = NotationPainter;