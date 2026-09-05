class Tone {

    constructor(string, fret, midi, note, octave, frequency) {

        this.string = string;
        this.fret = fret;
        this.midi = midi;
        this.note = note;
        this.octave = octave;
        this.pitch = note + octave;
        this.frequency = frequency;

    }

}