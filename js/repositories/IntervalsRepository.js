class IntervalsRepository extends BaseRepository {

    constructor(database) {

        super(

            database.get("Intervals"),

            new IntervalAdapter()

        );

    }

}

window.IntervalsRepository =
    IntervalsRepository;