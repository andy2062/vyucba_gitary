class Voice {

    constructor(context) {

        this.context = context;

        this.volume = 0.20;

    }

    play(frequency, duration) {

        throw new Error(
            "play() must be implemented."
        );

    }

    setVolume(volume) {

        this.volume = volume;

    }

}

window.Voice = Voice;