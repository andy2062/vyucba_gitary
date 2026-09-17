class CadenceController extends BaseController {

    constructor(
        repository,
        chordsRepository,
        player,
        engine,
        midi,
        ui
    ) {

        super(
            repository,
            player,
            engine,
            midi,
            ui
        );

        this.chordsRepository =
            chordsRepository;

    }


    show(itemId = null) {

        this.ui.setController(this);

        this.updateFilters();

        this.updateItemSelect();


        // ==========================================
        // PRIAMY VÝBER KADENCIE Z URL
        // ==========================================

        if (itemId) {

            const items =
                this.repository.getAll();


            const index =
                items.findIndex(
                    item => item.id === itemId
                );


            if (index !== -1) {

                console.log(
                    "DIRECT CADENCE:",
                    itemId,
                    "index:",
                    index
                );


                this.repository.setIndex(index);

                this.ui.setItemIndex(index);

            }

        }


        // ==========================================
        // ZAČIATOK KADENCIE
        // ==========================================

        const cadence =
            this.repository.current();


        if (cadence) {

            cadence.stepIndex = 0;

        }


        this.render();

    }


render() {

    const cadence =
        this.repository.current();

    if (!cadence) return;


    const step =
        cadence.steps[
            cadence.stepIndex ?? 0
        ];

    if (!step) return;


    const chord =
        this.chordsRepository.getById(
            step.chordId
        );


    if (!chord) {

        console.warn(
            "CADENCE CHORD NOT FOUND:",
            step.chordId
        );

        return;

    }


    console.log(
        "CADENCE RENDER:",
        cadence.id,
        "step:",
        cadence.stepIndex,
        "chord:",
        chord.id
    );


    const model = {

        // --------------------------------------
        // CHORD DATA
        // --------------------------------------

        ...chord,


        // --------------------------------------
        // CADENCE DATA
        // --------------------------------------

        type: "cadence",

        cadenceId:
            cadence.id,

        cadenceTitle:
            cadence.title,

        cadenceDescription:
            cadence.description,

        stepIndex:
            cadence.stepIndex,

        stepText:
            step.text,


        // --------------------------------------
        // UI INFO
        // --------------------------------------

        title:
            cadence.title,

        description:
            cadence.description,

        extra:
            step.text

    };


    this.ui.setInfo(model);

    this.engine.render(model);

    this.loadPlayback(model);

}


    next() {

        const cadence =
            this.repository.current();


        if (!cadence) return;


        if (
            cadence.stepIndex <
            cadence.steps.length - 1
        ) {

            cadence.stepIndex++;

            this.render();

            return;

        }


        // ==========================================
        // KONIEC KADENCIE
        // ==========================================

        console.log(
            "CADENCE: LAST STEP"
        );

    }


    previous() {

        const cadence =
            this.repository.current();


        if (!cadence) return;


        if (
            cadence.stepIndex > 0
        ) {

            cadence.stepIndex--;

            this.render();

            return;

        }


        console.log(
            "CADENCE: FIRST STEP"
        );

    }


play() {

    console.log(
        "========== CADENCE PLAY / STOP =========="
    );

    // Ak už hrá → STOP
    if (this.player.isPlaying()) {

        console.log(
            "CADENCE PLAYER → STOP"
        );

        this.player.stop();

        return;
    }

    const cadence =
        this.repository.current();

    if (!cadence) {

        console.warn(
            "NO CURRENT CADENCE"
        );

        return;
    }

    console.log(
        "CADENCE PLAY:",
        cadence.id
    );

    const sequence =
        new PlaybackSequence();

    cadence.steps.forEach(
        (step, stepIndex) => {

            const chord =
                this.chordsRepository.getById(
                    step.chordId
                );

            if (!chord) {

                console.warn(
                    "CADENCE CHORD NOT FOUND:",
                    step.chordId
                );

                return;
            }

            if (!chord.playback) {

                console.warn(
                    "CHORD HAS NO PLAYBACK:",
                    chord.id
                );

                return;
            }

            console.log(
                "CADENCE PLAY STEP:",
                stepIndex,
                chord.id
            );

            /*
             * Akord má jeden PlaybackFrame,
             * takže ho jednoducho pridáme
             * do spoločnej sekvencie kadencie.
             */

            for (
                let i = 0;
                i < chord.playback.count();
                i++
            ) {

                const frame =
                    chord.playback.get(i);

                sequence.add(frame);

            }

        }
    );

    if (sequence.isEmpty()) {

        console.warn(
            "CADENCE PLAYBACK IS EMPTY"
        );

        return;
    }

    console.log(
        "CADENCE PLAYBACK:",
        sequence.count(),
        "frames"
    );

    /*
     * Načítame celú kadenciu
     * do existujúceho Playera.
     */

    this.player.load(sequence);

    /*
     * Spustenie:
     *
     * F → B → C7 → F
     * → F → B → C7 → F ...
     *
     * PlaybackEngine už slučku
     * rieši automaticky.
     */

    this.player.play();

}


    select(index) {

        this.repository.setIndex(index);


        const cadence =
            this.repository.current();


        if (cadence) {

            cadence.stepIndex = 0;

        }


        this.render();

    }

}


window.CadenceController =
    CadenceController;
