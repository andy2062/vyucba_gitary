class NoteFactory extends BaseFactory {

    create(measure) {

        return measure.notes.map(

            note =>

                new Vex.Flow.StaveNote({

                    keys: note.keys,

                    duration: note.duration

                })

        );

    }

}

window.NoteFactory = NoteFactory;