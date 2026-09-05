class ExercisesRepository extends BaseRepository {

    constructor(database) {

        super(

            database.get("Exercises"),

            new ExerciseAdapter()

        );

    }

}

window.ExercisesRepository = ExercisesRepository;