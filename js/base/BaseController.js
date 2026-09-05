class BaseController {


 constructor(repository, player, engine, midi, ui) {

    this.repository = repository;
    this.player = player;
    this.engine = engine;
    this.midi = midi;
    this.ui = ui;

}

    show() {

        this.ui.setController(this);

        this.updateFilters();

        this.updateItemSelect();

        this.render();

    }

    applyFilter() {

    this.repository.filter({

        group: this.ui.getGroup(),

        quality: this.ui.getQuality()

    });

    this.updateItemSelect();

    this.render();

}

setBpm(bpm) {

    this.player.setBpm(bpm);

    this.ui.setSpeedValue(bpm);

}
    
updateItemSelect() {

    this.ui.fillSelect(
        this.repository.getAll()
    );

    this.ui.setItemIndex(
        this.repository.currentIndex()
    );

}


updateFilters() {

    const groups =
        this.repository.getGroups();

    this.ui.showGroup(
        groups.length > 0
    );

    if (groups.length) {

        this.ui.fillGroups(groups);

    }

    const qualities =
        this.repository.getQualities();

    this.ui.showQuality(
        qualities.length > 0
    );

    if (qualities.length) {

        this.ui.fillQualities(
            qualities
        );

    }

}


render() {

    const model =
        this.repository.current();

    if (!model) return;

    console.log(
        "CONTROLLER RENDER:",
        model.type,
        model.id,
        "step:",
        model.stepIndex,
        "notes:",
        model.notes
    );

    this.ui.setInfo(model);

    this.engine.render(model);

    this.loadPlayback(model);

}

loadPlayback(model) {

    if (!model) return;

    if (!model.playback) {

        console.warn(
            "NO PLAYBACK:",
            model.type,
            model.id
        );

        return;

    }

    console.log(
        "LOAD PLAYBACK:",
        model.type,
        model.id,
        "frames:",
        model.playback.count()
    );

    this.player.load(
        model.playback
    );

}

play() {

    console.log(
        "========== PLAY / STOP CLICK =========="
    );

    const model =
        this.repository.current();

    if (!model) return;

    // =========================
    // AK PRÁVE HRÁ → STOP
    // =========================

    if (this.player.playing) {

        console.log(
            "PLAYER IS PLAYING → STOP"
        );

        this.player.stop();

        return;

    }

    // =========================
    // NIE JE AKTÍVNY → PLAY
    // =========================

    console.log(
        "PLAYER IS STOPPED → PLAY"
    );

    console.log(
        "PLAY REQUEST:",
        model.type,
        model.id,
        "frames:",
        model.playback?.count()
    );

    if (!model.playback) {

        console.warn(
            "NO PLAYBACK:",
            model.type,
            model.id
        );

        return;

    }

    this.player.load(
        model.playback
    );

    this.player.play();

}

 next() {

    const model =
        this.repository.current();


    console.log(
        "NEXT BEFORE:",
        model?.type,
        model?.id,
        model?.stepIndex,
        model?.notes
    );


    // ========================================
    // INTERVAL
    // ========================================

    if (
        model?.type === "interval" &&
        model.steps?.length
    ) {

        if (
            model.stepIndex <
            model.steps.length - 1
        ) {

            model.stepIndex++;

            model.notes =
                model.steps[
                    model.stepIndex
                ];


            console.log(
                "INTERVAL NEXT:",
                model.stepIndex,
                model.notes
            );


            this.render();

            return;

        }

    }


    // ========================================
    // ĎALŠÍ ITEM
    // ========================================

    this.repository.next();

    this.render();

}

 previous() {

    const model =
        this.repository.current();


    // ========================================
    // INTERVAL
    // ========================================

    if (
        model?.type === "interval" &&
        model.steps?.length
    ) {

        if (model.stepIndex > 0) {

            model.stepIndex--;

            model.notes =
                model.steps[
                    model.stepIndex
                ];

            this.render();

            return;

        }

    }


    // ========================================
    // PREDCHÁDZAJÚCI ITEM
    // ========================================

    this.repository.previous();

    this.render();

}


select(index) {

        this.repository.setIndex(index);
        
        this.render();

    }

}

 window.BaseController = BaseController;