class LessonLoader {

    constructor(repository, contentRenderer) {

        this.repository = repository;
        this.contentRenderer = contentRenderer;

        this.container = null;
        this.lesson = null;

    }

    async open(id, container) {

        this.container = container;

        this.lesson =
            this.repository.getById(id);

        if (!this.lesson) {

            throw new Error(
                "Unknown lesson: " + id
            );

        }

        await this.load();

    }

    async load() {

        const response =
            await fetch(this.lesson.file);

        if (!response.ok) {

            throw new Error(
                "Cannot load " + this.lesson.file
            );

        }

        const html =
            await response.text();

        this.show(html);

    }

    show(html) {

        this.container.innerHTML = html;

        this.contentRenderer.render(
            this.container
        );

    }

    next() {

    this.lesson =
        this.repository.next();

    return this.load();

}

previous() {

    this.lesson =
        this.repository.previous();

    return this.load();

}

    async reload() {

        if (!this.lesson) return;

        await this.load();

    }

}

window.LessonLoader = LessonLoader;


/*
class LessonLoader {

    constructor(contentRenderer) {

        this.contentRenderer = contentRenderer;

    }

    async load(url, container) {

        const html = await fetch(url)
            .then(r => r.text());

        container.innerHTML = html;

        this.contentRenderer.render(container);

    }

}

window.LessonLoader = LessonLoader;
*/