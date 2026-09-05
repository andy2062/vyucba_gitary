class RendererEngine {

    constructor() {
        this.renderers = {};
    }

    register(type, renderer) {

        (this.renderers[type] ??= []).push(renderer);

    }

    registerMany(types, renderer) {

        types.forEach(type =>
            this.register(type, renderer)
        );

    }

    render(model) {

        if (!model) return;

        const renderers =
            this.renderers[model.type];

        if (!renderers) return;

        renderers.forEach(renderer =>
            renderer.renderModel(model)
        );

    }

    renderFrame(frame) {

        if (!frame) return;

        const renderers =
            this.renderers[frame.type];

        if (!renderers) return;

        renderers.forEach(renderer =>
            renderer.renderModel(frame)
        );

    }

}

window.RendererEngine = RendererEngine;