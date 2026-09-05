class MeasurePainter {

    constructor(drawer) {

        this.drawer = drawer;

        this.notePainter =
            new NotePainter(drawer);

    }

    paint(measures = [], layout, time = "4/4") {

        measures.forEach(

            (measure, measureIndex) =>

                this.paintMeasure(

                    measure,
                    measureIndex,
                    layout,
                    time

                )

        );

    }

    paintMeasure(
        measure,
        measureIndex,
        layout,
        time
    ) {

       const notes = NotationUtils.calculateNotePositions( 
        measure.notes ?? [], 
        measureIndex, 
        layout, 
        time ); 
        notes.forEach( 
            (note, noteIndex) => { 
                this.notePainter.paint( 
                    note, 
                    measureIndex, 
                    noteIndex, 
                    layout 
       ); 
    } 
); 
}

}

window.MeasurePainter = MeasurePainter;
