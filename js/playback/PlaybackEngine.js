class PlaybackEngine {

    constructor() {

        this.sequence = null;

        this.index = 0;

        this.bpm = 80;

        this.timer = null;

        this.playing = false;

        this.listeners = [];

        this.onStateChange = null;
        
        this.onProgress = null;


    }

    addListener(listener) {

    this.listeners.push(listener);

}

 isPlaying() {

    return this.playing;

}
  
load(sequence) {
   
    this.stop();

    this.sequence = sequence;

    this.index = 0;

     console.log(
        "PLAYER LOAD:",
        sequence
    );

    console.log(
        "PLAYER FIRST FRAME:",
        sequence?.get(0)
    );
   
}


getDelay() {

    const bpm =
        Number(this.bpm);

    if (!bpm || bpm <= 0) {

        return 750;

    }

    return 60000 / bpm;

}

    current() {

        if (!this.sequence) {
            return null;
        }

        return this.sequence.get(this.index);

    }

    next() {

        if (!this.sequence) {
            return null;
        }

        if (this.index < this.sequence.count() - 1) {

            this.index++;

        }

        return this.current();

    }

    previous() {

        if (!this.sequence) {
            return null;
        }

        if (this.index > 0) {

            this.index--;

        }

        return this.current();

    }

    isFirst() {

        return this.index === 0;

    }

    isLast() {

    return !this.sequence ||

           this.index >= this.sequence.count() - 1;

}

    reset() {

        this.index = 0;

    }

   play() {

    if (this.playing) {

        console.log(
            "PLAYER ALREADY PLAYING"
        );

        return;
    }

    if (!this.sequence) {

        console.log(
            "PLAYER NO SEQUENCE"
        );

        return;
    }


    console.log(
        "PLAYER PLAY:",
        this.sequence
    );


    this.playing = true;

    this.index = 0;


    // prvý frame okamžite
    this.playCurrent();


    const delay =
        this.getDelay();


    console.log(
        "PLAYER TIMER START:",
        "bpm =", this.bpm,
        "delay =", delay,
        "frames =", this.sequence.count()
    );


    this.timer = setInterval(() => {

        console.log(
            "PLAYER TIMER TICK:",
            "index before =",
            this.index
        );


        this.index++;


        if (
            this.index >=
            this.sequence.count()
        ) {
/*
            console.log(
                "PLAYER END"
            );

            this.stop();

            return;
            */
           console.log(
            "PLAYER LOOP"
        );

        this.index = 0;

        }


        console.log(
            "PLAYER NEXT FRAME:",
            this.index
        );


        this.playCurrent();


    }, delay);

}

playCurrent() {

    const frame =
        this.current();

    console.log(
        "PLAY CURRENT:",
        "index =", this.index,
        "type =", frame?.type,
        "notes =", frame?.notes
    );


    this.listeners.forEach(
        (listener, index) => {

            console.log(
                "PLAYBACK LISTENER START:",
                index
            );

            try {

                listener(frame);

                console.log(
                    "PLAYBACK LISTENER OK:",
                    index
                );

            } catch (error) {

                console.error(
                    "PLAYBACK LISTENER ERROR:",
                    index,
                    error
                );

            }

        }
    );

}

   stop() {

    console.log(
        "PLAYER STOP"
    );

    if (this.timer !== null) {

        clearInterval(
            this.timer
        );

    }

    this.timer = null;

    this.playing = false;

    //this.reset();

}

   

    toggle() {

    if (this.playing) {

        this.stop();

    } else {

        this.play();

    }

}

setBpm(bpm) {

    this.bpm = bpm;

    if (!this.playing) return;

    clearInterval(this.timer);

    this.timer = setInterval(() => {

        this.index++;

        if (this.index >= this.sequence.count()) {

            this.stop();

            return;

        }

        this.playCurrent();

    }, this.getDelay());

}


}

window.PlaybackEngine = PlaybackEngine;