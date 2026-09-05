class IntervalAdapter extends BaseAdapter {

    get type() {

        return "interval";

    }

    adapt(item) {

        const model =
            new PresentationModel({

                ...item,

                type: this.type

            });

        /*
         * Jednotlivé intervalové kroky
         *
         * [
         *   [C,E],
         *   [D,F],
         *   [E,G],
         *   ...
         * ]
         */
        model.steps =
            item.notes ?? [];

        /*
         * Normálne zobrazenie:
         * zobrazíme CELÚ intervalovú stupnicu.
         *
         * Prvý interval bude highlight.
         */
        model.notes =
            model.steps.flatMap(
                (interval, index) =>

                    interval.map(note => ({

                        ...note,

                        highlight:
                            index === 0

                    }))

            );

        model.fretboard =
            FretboardBuilder.build(model);

        model.notation =
            NotationBuilder.build(model);

        model.tab =
            TabBuilder.build(model);

        /*
         * Playback sa vytvorí zo steps,
         * teda bude mať 8 samostatných frameov.
         */
        model.playback =
            PlaybackBuilder.build(model);

        return model;

    }

}

window.IntervalAdapter =
    IntervalAdapter;