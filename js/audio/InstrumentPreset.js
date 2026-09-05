class InstrumentPreset {

    constructor() {

        this.waveform = "triangle";

        this.volume = 0.20;

        this.attack = 0.01;

        this.release = 0.35;

        this.filterFrequency = 3500;

        this.filterQ = 1;

        this.detune = 0;

    }

}

window.InstrumentPreset = InstrumentPreset;