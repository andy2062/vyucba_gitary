class BaseRenderer {

    constructor(svg) {

        this.drawer =
            new SVGDrawer(svg);

        this.painter = null;

    }

    render(model){

    this.drawer.clear();

    this.painter.paint(model);

}

    setPainter(painter){

    this.painter = painter;

}

}

window.BaseRenderer = BaseRenderer;