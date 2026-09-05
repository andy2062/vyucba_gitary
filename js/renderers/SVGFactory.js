class SVGFactory {

    // static create(container, width, height)
    static create(

    container,

    width = 600,

    height = 200

) {

    const svg = document.createElementNS(

        SVGDrawer.NS,

        "svg"

    );

    svg.setAttribute("width", width);

    svg.setAttribute("height", height);

    svg.setAttribute(

        "viewBox",

        `0 0 ${width} ${height}`

    );

    //container.innerHTML = "";
    container.replaceChildren(svg);

    container.appendChild(svg);

    return svg;

}


}

window.SVGFactory = SVGFactory;