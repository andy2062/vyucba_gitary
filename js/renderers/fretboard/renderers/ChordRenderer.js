class ChordRenderer extends BaseRenderer {

    renderModel(model) {

        this.renderFrame(model);

    }

    renderFrame(frame) {

        this.drawPlaybackNotes(
            frame.notes,
            true
        );

        if (frame.barre) {

            this.drawer.drawBarre(
                frame.barre
            );

        }

    }

}

window.ChordRenderer = ChordRenderer;