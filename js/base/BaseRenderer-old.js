class BaseRenderer {

     constructor(svg, painter) {

        this.drawer = new SVGDrawer(svg);

        this.painter = painter;

    }
   
    // prehrávanie
   
    render(model) {

        this.drawer.clear();

        this.painter.paint(model);

    }


     static render(container, model) {

        const svg = SVGFactory.create(container);

        const renderer = new this(svg);

        renderer.renderModel(model);

    }
    

draw(data) {

    this.renderTab(data.tab);

}
   

    flattenNotes(notes) {

        return notes.flatMap(item =>

            Array.isArray(item)
                ? item
                : [item]

        );

    }

    drawIntervals(intervals) {

        if (!intervals) return;

        intervals.forEach(group => {

            group.forEach(note => {

                this.drawer.drawNote(note);

            });

        });

    }

    drawBarre(barre) {

        if (!barre) return;

        this.drawer.drawBarre(barre);

    }

    drawPlaybackNotes(notes) {

    const allNotes =
        this.flattenNotes(notes);

    allNotes.forEach(note => {

        this.drawer.drawNote(
            note,
            note.highlight === true
        );

    });

}

draw(frame) {

    this.drawPlaybackNotes(
        frame.notes
    );

}


/*
  drawPlaybackNotes(notes, highlight = []) {

const allNotes = this.flattenNotes(notes);

    allNotes.forEach(note => {

        const isHighlighted = highlight.some(h =>

            h.string === note.string &&
            h.fret === note.fret

        );

        this.drawer.drawNote(
            note,
           isHighlighted
        );

    });

}
*/
}

window.BaseRenderer = BaseRenderer;