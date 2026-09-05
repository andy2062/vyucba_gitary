class ClefPainter {

    constructor(drawer) {

        this.drawer = drawer;

    }

    paint(clef, layout) {

        if (!layout) return;

        const type =
            clef?.type ?? "treble";

        if (type !== "treble") {
            return;
        }

        const x =
            layout.left +
            18;

        const y =
            layout.top + 8 +
            2 * layout.lineSpacing;

        this.drawer.drawText(

            "𝄞",

            x,
            y,

            {

                fill:
                    Theme.COLORS.text,

                "font-size":
                    78,

                "font-family":
                    "serif",

                "text-anchor":
                    "middle",

                "dominant-baseline":
                    "middle"

            }

        );

    }

}

window.ClefPainter = ClefPainter;