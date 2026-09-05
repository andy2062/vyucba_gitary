class LessonRepository extends BaseRepository {

    constructor(database) {

        super(

            database.get("Lessons")

        );

    }

}

window.LessonRepository = LessonRepository;

/*
class LessonRepository {

    constructor(lessons = []) {

        this.lessons = lessons;

        this.index = 0;

    }

    getAll() {

        return this.lessons;

    }

    current() {

        return this.lessons[this.index];

    }

    currentIndex() {

        return this.index;

    }

    setIndex(index) {

        if (index >= 0 && index < this.lessons.length) {

            this.index = index;

        }

    }

    next() {

        if (this.index < this.lessons.length - 1) {

            this.index++;

        }

        return this.current();

    }

    previous() {

        if (this.index > 0) {

            this.index--;

        }

        return this.current();

    }

    getById(id) {

        return this.lessons.find(

            lesson => lesson.id === id

        );
        
    }

    count() {

    return this.lessons.length;

}

isEmpty() {

    return this.lessons.length === 0;

}



}

window.LessonRepository = LessonRepository;
*/