class GuitarPreset extends InstrumentPreset {

    constructor() {

        super();

        this.waveform = "triangle";

        this.volume = 0.18;

        this.attack = 0.008;

        this.release = 0.45;

        this.filterFrequency = 3200;

        this.filterQ = 0.8;

        this.detune = 2;

    }

}

window.GuitarPreset = GuitarPreset;