class PresentationModel {

    constructor(data = {}) {

        this.type = "";
        this.title = "";
        this.description = "";

        this.group = "";
        this.quality = "";
        this.family = "";

        this.position = null;
        this.barre = null;

        this.notes = [];

        this.fretboard = null;
        this.notation = null;
        this.tab = null;

        this.playback = null;

        Object.assign(this, data);

    }

}

window.PresentationModel = PresentationModel;