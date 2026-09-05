class LedgerLinePainter {

    constructor(drawer) {

        this.drawer = drawer;

    }

    paint(pitch, x, layout) {

        if (!pitch || !layout) {
            return;
        }

        const y =
            NotationUtils.pitchToStaffY(
                pitch,
                layout
            );

        if (y === null) {
            return;
        }

        const top =
            layout.top;

        const bottom =
            layout.top +
            4 * layout.lineSpacing;

        /*
         * Tón nad osnovou
         */

        if (y < top) {

            this.paintAbove(
                y,
                x,
                layout
            );

        }

        /*
         * Tón pod osnovou
         */

        if (y > bottom) {

            this.paintBelow(
                y,
                x,
                
                layout
            );

        }

    }

    paintAbove(y, x, layout) {

        let lineY =
        layout.top - layout.lineSpacing;

        while (lineY >= y) {
            this.drawLedgerLine( x, lineY, layout );

            lineY -= layout.lineSpacing;
            }
            }

  
    paintBelow(y, x, layout) {

        const bottom =
        layout.top +
        4 * layout.lineSpacing;

        let lineY =
            bottom +
            layout.lineSpacing;

          while (lineY <= y) {
            this.drawLedgerLine( x, lineY, layout );

            lineY += layout.lineSpacing;
        }
        
        }

    drawLedgerLine(x, y, layout) {

        const width =
        layout.ledgerLineWidth ?? 24;

        this.drawer.drawStaffLine(
            x - width / 2,
            y,
            x + width / 2 );

            } 
        } 
        
        window.LedgerLinePainter = LedgerLinePainter;
