
class MusicDatabase {

    static FRET_COUNT = 24;

    static OPEN_STRINGS = [

        { midi:64 },  // E4
         { midi:59 }, // B3
         { midi:55 }, // G3
         { midi:50 }, // D3
         { midi:45 }, // A2
         { midi:40 } // E2

    ];

    static NOTES = [

        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B"

    ];

    static tones = [];

    static initialized = false;

    static init() {

    if (this.initialized) return;

    this.tones = [];

    this.OPEN_STRINGS.forEach((stringData,index)=>{

        const string = [];

        for(let fret=0;fret<=this.FRET_COUNT;fret++){

            const midi =
                stringData.midi + fret;

            string.push(

                this.createTone(
                    index+1,
                    fret,
                    midi
                )

            );

        }

        this.tones.push(string);

    });

    this.initialized = true;

}

static createTone(string,fret,midi){

    const octave =
        Math.floor(midi/12)-1;

    const note =
        this.NOTES[midi%12];

  /*      return new Tone(
    string,
    fret,
    midi,
    note,
    octave,
    this.midiToFrequency(midi)
);
        */
    return{

        string,

        fret,

        midi,

        note,

        octave,

        pitch:
            note+octave,

        frequency:
            this.midiToFrequency(midi)

    };

}

static midiToFrequency(midi){

    return Number(

        (

            440 *

            Math.pow(
                2,
                (midi-69)/12
            )

        ).toFixed(2)

    );

}

static get(string,fret){

    if(!this.initialized){

        this.init();

    }

    return this.tones[string-1][fret];

}

static getNote(string,fret){

    return this.get(
        string,
        fret
    ).note;

}

static getPitch(string,fret){

    return this.get(
        string,
        fret
    ).pitch;

}

static getMidi(string,fret){

    return this.get(
        string,
        fret
    ).midi;

}

static getFrequency(string,fret){

    return this.get(
        string,
        fret
    ).frequency;

}

static findPitch(pitch){

    const result=[];

    this.tones.forEach(string=>{

        string.forEach(tone=>{

            if(tone.pitch===pitch){

                result.push({

                    string:tone.string,

                    fret:tone.fret

                });

            }

        });

    });

    return result;

}

}


