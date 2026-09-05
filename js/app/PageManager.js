class PageManager {

    constructor() {

        this.pages = {};

        this.currentPage = null;

    }

    register(name, page) {

        this.pages[name] = page;

    }

    show(name) {

        const page = this.pages[name];

        if (!page) {

            console.warn("Page not found:", name);

            return;

        }

        this.currentPage = page;

        page.show();

    }

}

window.PageManager = PageManager;