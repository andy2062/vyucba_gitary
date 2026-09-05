class PlaybackCursor {

    constructor(sequence) {

        this.sequence = sequence;
        this.index = 0;

    }

    current() {

        return this.sequence.get(this.index);

    }

    next() {

        if (this.index >= this.sequence.count()) {

            return null;

        }

        const frame =
            this.sequence.get(this.index);

        this.index++;

        return frame;

    }

    reset() {

        this.index = 0;

    }

    isFinished() {

        return this.index >= this.sequence.count();

    }

}

window.PlaybackCursor = PlaybackCursor;