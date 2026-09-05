class BaseView {

    constructor(RendererClass) {

        this.RendererClass = RendererClass;

    }

    show(container, model) {

        const svg = SVGFactory.create(container);

        const renderer =

            new this.RendererClass(svg);

        renderer.renderModel(model);

    }

}

window.BaseView = BaseView;