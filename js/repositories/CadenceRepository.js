class CadenceRepository extends BaseRepository {

    constructor(database) {

        super(
            database.get("Cadences").cadences,
            new CadenceAdapter()
        );

    }

}

window.CadenceRepository =
    CadenceRepository;
