class IntervalRenderer extends BaseRenderer {

    draw(frame) {

        this.drawPlaybackNotes(

            frame.notes,

            frame.highlight

        );

    }

}

window.IntervalRenderer = IntervalRenderer;