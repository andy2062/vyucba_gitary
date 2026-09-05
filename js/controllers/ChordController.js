class ChordController extends BaseController {

    play() {

        if (!this.player.isPlaying()) {

            const sequence =
                PlaybackBuilder.merge(
                    this.repository.getAll()
                );

            console.log(
                "CHORD PLAY:",
                this.repository.getAll().length,
                "items",
                "frames:",
                sequence.count()
            );

            this.player.load(sequence);

        }

        this.player.toggle();

    }

}

window.ChordController = ChordController;