class BasePainter {

    constructor(drawer) {

        this.drawer = drawer;

    }

    paint(model) {

       // this.drawer.clear();

        this.beforePaint(model);

        this.paintLayout(model);

        this.paintContent(model);

        this.paintOverlay(model);

        this.afterPaint(model);

    }

    beforePaint(model) {}

    paintLayout(model) {}

    paintContent(model) {}

    paintOverlay(model) {}

    afterPaint(model) {}

}

window.BasePainter = BasePainter;