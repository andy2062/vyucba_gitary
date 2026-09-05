class ChordsRepository extends BaseRepository {

    constructor(database) {

        super(

            database.get("Chords"),

            new ChordAdapter()

        );

    }

}

window.ChordsRepository =
    ChordsRepository;