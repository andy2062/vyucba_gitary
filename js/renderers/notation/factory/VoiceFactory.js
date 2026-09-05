class VoiceFactory {

    create(notation) {

        const [

            beats,

            beatValue

        ] = notation.time

            .split("/")

            .map(Number);

        return new Vex.Flow.Voice({

            num_beats: beats,

            beat_value: beatValue

        });

    }

}

window.VoiceFactory = VoiceFactory;