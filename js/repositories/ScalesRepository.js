class ScalesRepository extends BaseRepository {

    constructor(database) {

        super(

            database.get("Scales"),

            new ScaleAdapter()

        );

    }

}

window.ScalesRepository =
    ScalesRepository;