class NotePainter {

    constructor(drawer) {

        this.drawer = drawer;

        this.ledgerLinePainter = 
        new LedgerLinePainter(drawer);

        this.stemPainter =
    new StemPainter(drawer);

    }

    paint(note, measureIndex, noteIndex, layout) {
        
       
        if (!note || !layout) { 
            return; }

        const pitch = note.keys[0]; 
        if (!pitch) { return; }

        const x =
        this.getX( noteIndex,
            measureIndex, layout );

       const y =     
       NotationUtils.pitchToStaffY(
        pitch, layout );

        if (y === null) { return; }

        /* * Pomocné čiary * kreslíme ako prvé, * aby boli pod hlavičkou noty. */

        this.ledgerLinePainter.paint( pitch,
            x, layout );

            /* * Hlavička noty */
            this.paintHead( x, y );

            //----- 3. nožička ---------
            this.stemPainter.paint( note,
                    x,
                    y,
                    layout);


            /* * Neskôr: * * this.paintStem(...) * this.paintFlags(...) */

            }

            getX( noteIndex, measureIndex, layout ) {

                const measureX =
        layout.left +
        (layout.headerWidth ?? 0) +
        measureIndex *
        layout.measureSpacing;

    return (
        measureX +
        (layout.noteInset ?? 0) +
        noteIndex *
        layout.noteSpacing
    );
                    
               }
               
            paintHead(x, y) {
                
              this.drawer.drawCircle( x, y, 6, {
                  fill: Theme.COLORS.note,
                    stroke: Theme.COLORS.note
                } );
                
            }

            } 
            window.NotePainter = NotePainter;


