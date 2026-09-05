class Player {

    constructor() {

        this.timer = null;

        this.bpm = 80;

        this.playing = false;

        this.sequence = null;

        this.cursor = null;

       // this.onFrame = null;
        this.listeners = [];

    }


    load(sequence) {

        this.stop();

        this.sequence = sequence;

        this.cursor =
            new PlaybackCursor(sequence);

    }

    addListener(listener) {

        this.listeners.push(listener);

    }

    notify(frame) {

        this.listeners.forEach(listener => {

            listener(frame);

        });

    }
/*
    setOnFrame(callback) {

        this.onFrame = callback;

    }
*/
    play() {

        if (this.playing) return;

        if (!this.cursor) return;

        this.playing = true;

        this.playNext();

    }

    playNext() {

        if (!this.cursor) {

            this.stop();

            return;

        }

        const frame =
            this.cursor.next();

        if (!frame) {

            this.stop();

            return;

        }
/*
        if (this.onFrame) {

            this.onFrame(frame);

        }
*/
 this.notify(frame);
 
        this.timer =
            setTimeout(
                () => this.playNext(),
                frame.duration ?? this.getDelay()
            );

    }

    stop() {

        clearTimeout(this.timer);

        this.timer = null;

        this.playing = false;

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

        if (this.playing) {

            this.stop();

            this.play();

        }

    }

    isPlaying() {

        return this.playing;

    }

    getDelay() {

        return 60000 / this.bpm;

    }

}

window.Player = Player;