class NotationRenderer extends BaseRenderer {
    
    constructor(svg){

        super(svg);

        this.painter =
            new NotationPainter(
                this.drawer
            );

    }

   renderModel(model){

    const notation =
        NotationBuilder.build(model);

    super.render(notation);

}


}

window.NotationRenderer = NotationRenderer;
/*
ComponentRegistry.register(
    "notation",
    NotationRenderer
);
*/