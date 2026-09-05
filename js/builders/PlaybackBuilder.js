class PlaybackBuilder {

    static build(model) {

        switch (model.type) {

            case "exercise":
                return this.buildSequential(model);

            case "scale":
                return this.buildSequential(model);

            case "interval":
                return this.buildInterval(model);

            case "chord":
                return this.buildChord(model);

            default:
                return new PlaybackSequence();

        }

    }

static createFrame(model, data = {}) {

    const frameModel = {

        ...model,
        ...data

    };

    const notes = frameModel.notes ?? [];

    console.log(
        "PLAYBACK FRAME:",
        frameModel.type,
        notes.map(n => ({
            note: n.note,
            fret: n.fret,
            highlight: n.highlight
        }))
    );

    return new PlaybackFrame({

        type:
            frameModel.type,

         title:
            frameModel.title,

        description:
            frameModel.description,

        extra:
            frameModel.extra,

        duration:
            frameModel.duration ?? 900,

        notes,

        fretboard:
            FretboardBuilder.build({
                ...frameModel,
                notes
            }),

        notation:
            NotationBuilder.build({
                ...frameModel,
                notes
            }),

        tab:
            TabBuilder.build({
                ...frameModel,
                notes
            }),

        barre:
            frameModel.barre,

        position:
            frameModel.position

    });

}

static buildSequential(model) {

    return this.sequence(

        ...model.notes.map((step, stepIndex) => {

            const notes =
                model.notes.flatMap(
                    (currentStep, index) => {

                        const stepNotes =
                            Array.isArray(currentStep)
                                ? currentStep
                                : [currentStep];

                        return stepNotes.map(note => ({

                            ...note,

                            highlight:
                                index === stepIndex

                        }));

                    }
                );

            return this.createFrame(model, {
                notes
            });

        })

    );

}

    // =====================================================
    // INTERVAL
    // =====================================================

 static buildInterval(model) {

    const steps =
        model.steps ?? [];

    return this.sequence(

        ...steps.map(interval =>

            this.createFrame(model, {

                notes:
                    interval.map(note => ({

                        ...note,

                        highlight: true

                    }))

            })

        )

    );

}

    // =====================================================
    // CHORD
    // =====================================================

   static buildChord(model) {

    return this.sequence(

        this.createFrame(model, {

           notes: (model.notes ?? []).map(note => ({

                ...note,

                highlight: true

            })),

            barre: model.barre,

            position: model.position

        })

    );

}


    static merge(models) {

        const sequence =
            new PlaybackSequence();

        models.forEach(model => {

            model.playback.frames.forEach(
                frame => {

                    sequence.add(frame);

                }
            );

        });

        return sequence;

    }


    // =====================================================
    // HELPERS
    // =====================================================

    static sequence(...frames) {

        return new PlaybackSequence(frames);

    }

}

window.PlaybackBuilder =
    PlaybackBuilder;