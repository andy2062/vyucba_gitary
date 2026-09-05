class ScaleRenderer extends BaseRenderer {

    draw(frame) {

        const notes =
    this.flattenNotes(frame.notes);

        this.drawPlaybackNotes(
            frame.notes,
            frame.highlight
        );

    }
  
}

window.ScaleRenderer = ScaleRenderer;