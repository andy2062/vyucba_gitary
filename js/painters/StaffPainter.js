class StaffPainter {

    constructor(drawer) {

        this.drawer = drawer;

    }

    paint(layout) {

        if (!layout) return;

        for (let i = 0; i < 5; i++) {

            const y =
                layout.top +
                i * layout.lineSpacing;

            this.drawer.drawStaffLine(

                layout.left,

                y,

                layout.right

            );

        }

    }

}

window.StaffPainter = StaffPainter;