class PlaybackSequence {

    constructor(frames = []) {

        this.frames = frames;

    }

    add(frame) {

        this.frames.push(frame);

    }

    get(index) {

        return this.frames[index] ?? null;

    }

    count() {

        return this.frames.length;

    }

    clear() {

        this.frames.length = 0;

    }

    isEmpty() {

        return this.frames.length === 0;

    }

}

window.PlaybackSequence = PlaybackSequence;