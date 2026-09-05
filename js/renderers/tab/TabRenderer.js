class TabRenderer extends BaseRenderer {

    constructor(svg){

        super(svg);

        this.painter =

            new TabPainter(

                this.drawer

            );

    }

    renderModel(model){

        const tab = TabBuilder.build(model);

        super.render(tab);

    }

}

window.TabRenderer = TabRenderer;