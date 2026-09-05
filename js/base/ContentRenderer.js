class ContentRenderer {

    constructor(database) {

        this.database = database;

    }

    render(root = document) {

        root.querySelectorAll("[data-render]")

            .forEach(element =>

                this.renderElement(element)

            );

    }
   

   renderElement(element) {

    const view =
        ComponentRegistry.get(
            element.dataset.render
        );

    if (!view) return;

    const model =
        this.database.getById(
            element.dataset.item
        );

    if (!model) return;

    view.show(
        element,
        model
    );

}

    /*
    renderElement(element) {

      const Renderer =
        ComponentRegistry.get(
            element.dataset.render
        );


    const model =
        this.database.getById(
            element.dataset.item
        );

    if (!model) {

        console.warn(
            "Unknown model:",
            element.dataset.item
        );

        return;

    }

    Renderer.render(
        element,
        model
    );

}
*/
    getModel(element) {

        const id =
            element.dataset.item;

        if (!id) {

            console.warn(
                "Missing data-item",
                element
            );

            return null;

        }

        const model =
            this.database.getById(id);

        if (!model) {

            console.warn(
                "Unknown item:",
                id
            );

            return null;

        }

        return model;

    }

    getRenderer(element) {

        const name =
            element.dataset.render;

        if (!ComponentRegistry.has(name)) {

            console.warn(
                "Unknown renderer:",
                name
            );

            return null;

        }

        return ComponentRegistry.get(name);

    }

    renderAll(root = document) {

    this.render(root);

}

}

window.ContentRenderer = ContentRenderer;

