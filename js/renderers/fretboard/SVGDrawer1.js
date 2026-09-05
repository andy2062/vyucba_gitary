class SVGDrawer {

    static NS = "http://www.w3.org/2000/svg";

   
    constructor(svg) {

        this.svg = svg;

    }

    static createSVG(type) {

        return document.createElementNS(

            SVGDrawer.NS,

            type

        );

    }

    clear() {

        this.svg.replaceChildren();

    }

    drawLabel(text, x, y, style = {}) {

    return this.drawText(

        text,

        x,

        y,

        style

    );

}

    append(node) {

        this.svg.appendChild(node);

        return node;

    }

    setSize(width, height) {

        this.svg.setAttribute("width", width);
        this.svg.setAttribute("height", height);

    }

    setViewBox(x, y, width, height) {

        this.svg.setAttribute(

            "viewBox",

            `${x} ${y} ${width} ${height}`

        );

    }

    get width() {

        return Number(

            this.svg.getAttribute("width")

        ) || 0;

    }

    get height() {

        return Number(

            this.svg.getAttribute("height")

        ) || 0;

    }

    static setAttributes(element, attrs) {

    Object.entries(attrs).forEach(

        ([key, value]) =>

            element.setAttribute(key, value)

    );

    return element;

}

    applyStyle(node, style = {}) {

    Object.entries(style).forEach(

        ([key, value]) =>

            node.setAttribute(key, value)

    );

    return node;

}

//==================
// Core
//==================

drawLine(

    x1,
    y1,

    x2,
    y2,

    style = {}

) {

    const line = SVGDrawer.createSVG("line");

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);

    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    this.applyStyle(line, {

        stroke: Theme.COLORS.stroke,
"stroke-width": Theme.STROKE.default,

        ...style

    });

    return this.append(line);

}

drawCircle(

    x,
    y,

    r,

    style = {}

) {

    const circle = SVGDrawer.createSVG("circle");

    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);

    this.applyStyle(circle, {

        stroke: Theme.COLORS.stroke,

    "stroke-width": Theme.STROKE.default,

    fill: Theme.COLORS.fill,

        ...style

    });

    return this.append(circle);

}


drawRect(

    x,
    y,

    width,
    height,

    style = {}

) {

    const rect = SVGDrawer.createSVG("rect");

    rect.setAttribute("x", x);
    rect.setAttribute("y", y);

    rect.setAttribute("width", width);
    rect.setAttribute("height", height);

    this.applyStyle(rect, {

        stroke: Theme.COLORS.stroke,

        "stroke-width":
    Theme.STROKE.default,

        fill: Theme.COLORS.transparent,

        ...style

    });

    return this.append(rect);

}

drawPath(
    d,
    style = {}
) {

    const path = SVGDrawer.createSVG("path");

    path.setAttribute("d", d);

    this.applyStyle(path, {

        stroke: Theme.COLORS.stroke,

        fill: Theme.COLORS.transparent,

        "stroke-width":
            Theme.STROKE.default,

        ...style

    });

    return this.append(path);

}

drawNoteName(x, y, text) {

    const offset =
        Theme.SIZE.noteLabelOffset;

    const cx = x + offset;
    const cy = y - offset;

    // biely kruh názvu tónu
    this.drawCircle(

        cx,
        cy,

        Theme.SIZE.noteLabelRadius,

        {
            fill: "#ffffff",
            stroke: "#bbb",
            "stroke-width": 1
        }

    );

    // názov tónu
    return this.drawText(

        text,

        cx,
        cy,

        {
            fill: "#111",
            "font-size":
                Theme.FONT.noteName,

            "font-weight":
                "bold"
        }

    );

}


drawText(

    text,

    x,
    y,

    style = {}

) {

    const node = SVGDrawer.createSVG("text");

    node.textContent = text;

    node.setAttribute("x", x);
    node.setAttribute("y", y);

    this.applyStyle(node, {

        "font-size": Theme.FONT.default,

        "text-anchor": "middle",

        "dominant-baseline": "middle",

        ...style

    });

    return this.append(node);

}



//-----------hudobné primitíva---------

drawString(x1, y, x2, style = {}) {

    return this.drawLine(

        x1,
        y,

        x2,
        y,

        {
            stroke: Theme.COLORS.string,

            "stroke-width":
                Theme.STROKE.string,
            ...style
        }

    );

}

drawFret(x, y1, y2, style = {}) {

    return this.drawLine(

        x,
        y1,

        x,
        y2,

        {
            stroke: Theme.COLORS.fret,
            "stroke-width": Theme.STROKE.fret,
            ...style
        }

    );

}

drawBarre(barre, style = {}) {

    if (!barre) return;

    const x = barre.x;
    const y = barre.y;

    const height =
        barre.height ??
        Theme.SIZE.barreHeight;

    const width =
        barre.width ??
        Theme.SIZE.barreWidth;

    const color =
        Theme.FINGER_COLORS[String(barre.finger)]
        ?? Theme.COLORS.barre;

    this.drawRect(

        x - width / 2,

        y,

        width,

        height,

        {

            rx: Theme.SIZE.barreRadius,

            fill: color,

            opacity: Theme.SIZE.barreOpacity,

            stroke: "none",

            ...style

        }

    );

}

drawMeasureBar(
    x,
    y1,
    y2,
    style = {}
) {

    return this.drawLine(

        x,
        y1,

        x,
        y2,

        {

            stroke:
                Theme.COLORS.staff,

            "stroke-width":
                Theme.STROKE.measureBar,

            ...style

        }

    );

}


drawPosition(position, style = {}) {

   if (!position) return;

    return this.drawText(

        position.label,

        position.x,

        position.y,

        {

            fill: Theme.COLORS.text,

            "font-size":
                Theme.FONT.stringName,

            ...style

        }

    );

}

drawTabLine(left, y, right, style = {}) {

    return this.drawLine(

        left,
        y,

        right,
        y,

        {
            stroke: Theme.COLORS.staff,

            "stroke-width":
                Theme.STROKE.staff,
            ...style
        }

    );

}

drawStaffLine(left, y, right, style = {}) {

    return this.drawLine(

        left,
        y,

        right,
        y,

        {
            stroke: Theme.COLORS.staff,

            "stroke-width":
                Theme.STROKE.staff,
            ...style
        }

    );

}

drawFinger(x, y, finger, active = false, root = false) {

    // =========================
    // Tieň
    // =========================
    console.log(
        "DRAW FINGER:",
        "finger =", finger,
        "active =", active,
        "x =", x,
        "y =", y
    );


    this.drawCircle(

        x + Theme.SIZE.noteShadowOffset,
        y + Theme.SIZE.noteShadowOffset,

        root
            ? Theme.SIZE.rootRadius
            : Theme.SIZE.fingerRadius,

        {
            fill: "rgba(0,0,0,0.15)",
            stroke: "none"
        }

    );


    // =========================
    // Hlavný kruh
    // =========================

    const color = active
        ? (
            Theme.FINGER_COLORS[String(finger)]
            ?? Theme.COLORS.finger
          )
        : "#bdbdbd";


    this.drawCircle(

        x,
        y,

        root
            ? Theme.SIZE.rootRadius
            : Theme.SIZE.fingerRadius,

        {

            fill: color,

            stroke:
                root
                    ? "#111"
                    : Theme.COLORS.stroke,

            "stroke-width":
                root
                    ? 4
                    : Theme.STROKE.default

        }

    );


    // =========================
    // Číslo prstu
    // =========================

   // if (active) {

        this.drawText(

            finger,

            x,
            y,

            {

                fill: Theme.COLORS.fingerText,

                "font-size":
                    Theme.FONT.finger,

                "font-weight":
                    "bold"

            }

        );

   // }

}

drawMarker(x, y, style = {}) {

    return this.drawCircle(

        x,

        y,

        Theme.SIZE.markerRadius,

        {
            fill: Theme.COLORS.root,

            stroke: Theme.COLORS.stroke,

            "stroke-width":
                Theme.STROKE.marker,
            ...style
        }

    );

}

}

window.SVGDrawer = SVGDrawer;