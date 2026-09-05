class GuitarVoice extends Voice {

    constructor(context) {

        super(context);

        this.waveform = "triangle";

        this.volume = 0.20;

        this.preset = new GuitarPreset();

    }

    play(frequency, duration) {

    const osc =
        this.createOscillator(frequency);

    const gain =
        this.createGain();

    this.connect(osc, gain);

    this.applyEnvelope(
        gain,
        duration
    );

    this.start(osc);

    this.stop(
        osc,
        duration
    );

}

createOscillator(frequency) {

    const osc =
        this.context.createOscillator();

    osc.type = this.preset.waveform;

 osc.detune.value =
            Math.random() *
            this.preset.detune * 2 -
            this.preset.detune;

        osc.frequency.value =
            frequency;

        return osc;

    }

createGain() {

    return this.context.createGain();

}

connect(osc, gain) {

    osc.connect(gain);

    gain.connect(
    this.getOutput()
);

}

getOutput() {

    return this.context.destination;

}

applyEnvelope(gain, duration) {

    const now =
        this.context.currentTime;

    const attack = 0.01;

    const release =
        Math.max(
            duration - attack,
            0.05
        );

    gain.gain.cancelScheduledValues(
        now
    );

    gain.gain.setValueAtTime(
        0,
        now
    );

    gain.gain.linearRampToValueAtTime(
        this.volume,
        now + attack
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + release
    );

}

start(osc) {

    osc.start();

}

stop(osc, duration) {

    osc.stop(
        this.context.currentTime +
        duration
    );

}


}
window.GuitarVoice = GuitarVoice;