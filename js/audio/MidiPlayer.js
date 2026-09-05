class MidiPlayer {

    constructor() {

        this.context = null;

        this.enabled = true;

        this.volume = 0.20;

        this.waveform = "triangle";

         this.voice = null;


    }


    getContext() {

    if (!this.context) {

        this.context = new AudioContext();

        this.voice =
            new GuitarVoice(
                this.context
            );

    }

    if (this.context.state === "suspended") {

        this.context.resume();

    }

    return this.context;

}


  play(frame) {

    console.log(
        "========== MIDI PLAY =========="
    );

    if (!this.enabled || !frame) {
        return;
    }

    const notes =
        frame.notes ?? [];

    const highlighted =
        notes.filter(
            note => note.highlight
        );

    console.log(
        "MIDI TYPE:",
        frame.type
    );

    console.log(
        "MIDI NOTES COUNT:",
        notes.length
    );

    console.log(
        "MIDI HIGHLIGHTED COUNT:",
        highlighted.length
    );

    console.log(
        "MIDI HIGHLIGHTED:",
        highlighted
    );

    const duration =
        (frame.duration ?? 900) / 1000;

    highlighted.forEach(note => {

        console.log(
            "MIDI PLAY NOTE:",
            note.note,
            "string:",
            note.string,
            "fret:",
            note.fret
        );

        this.playNote(
            note,
            duration
        );

    });

}

  playNote(note, duration) {

    console.log(
        "MIDI playNote:",
        note.string,
        note.fret
    );

    if (note.fret < 0) {

        console.warn(
            "MIDI fret < 0"
        );

        return;

    }

    const tone =
        MusicDatabase.get(
            note.string,
            note.fret
        );

    console.log(
        "MIDI TONE:",
        tone
    );

    if (!tone) {

        console.error(
            "MIDI TONE NOT FOUND:",
            "string =",
            note.string,
            "fret =",
            note.fret
        );

        return;

    }

    console.log(
        "MIDI FREQUENCY:",
        tone.frequency
    );

    this.getContext();

    console.log(
        "MIDI AUDIO CONTEXT:",
        this.context.state
    );

    console.log(
        "MIDI VOICE:",
        this.voice
    );

    this.voice.play(
        tone.frequency,
        duration
    );

}

/*
applyEnvelope(gain,duration){

    const now =
        this.context.currentTime;

    gain.gain.cancelScheduledValues(now);

    gain.gain.setValueAtTime(
        0,
        now
    );

    gain.gain.linearRampToValueAtTime(

        this.volume,

        now+0.01

    );

    gain.gain.exponentialRampToValueAtTime(

        0.001,

        now+duration

    );

}
*/
setVolume(volume) {

        this.volume = volume;

        if (this.voice) {

            this.voice.volume =
                volume;

        }

    }

setWaveform(type){

    this.waveform = type;

}

setEnabled(enabled){

    this.enabled = enabled;

}

setPreset(preset) {

        this.voice?.setPreset(
            preset
        );

    }

resume() {

        if (
            this.context &&
            this.context.state ===
            "suspended"
        ) {

            this.context.resume();

        }

    }

}


window.MidiPlayer = MidiPlayer;