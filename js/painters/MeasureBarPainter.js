class MeasureBarPainter {

    constructor(drawer) {
        this.drawer = drawer;
    }

    paint(measures = [], layout) {

        if (!layout) {
            return;
        }

        measures.forEach((measure, index) => {

            this.paintBar(
                index,
                layout
            );

        });

    }

    paintBar(index, layout) {

    const headerWidth =
        layout.headerWidth ?? 0;

    const inset =
        layout.measureSpacing *
        (layout.measureBarInsetRatio ?? 0);

    const x =
        layout.left + 
        headerWidth +
        inset +
        (index + 1) *
        layout.measureSpacing;

    this.drawer.drawLine(

        x,

        layout.top,

        x,

        layout.bottom,

        {

            stroke:
                Theme.COLORS.staff,

            "stroke-width":
                Theme.STROKE.measure

        }

    );

}

}

window.MeasureBarPainter =
    MeasureBarPainter;