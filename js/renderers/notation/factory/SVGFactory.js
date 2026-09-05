class SVGFactory {

    static create(

        container,

        options = {}

    ) {

        if (!container) {

            throw new Error("SVGFactory: container is null.");

        }

        container.innerHTML = "";

        const svg = SVGDrawer.createSVG("svg");

        const width =
            options.width ?? "100%";

        const height =
            options.height ?? 180;

        const viewBox =
            options.viewBox ??
            `0 0 600 ${height}`;

        SVGDrawer.setAttributes(svg, {

            width,
            height,
            viewBox,

            xmlns:
                "http://www.w3.org/2000/svg",

            preserveAspectRatio:
                "xMinYMin meet"

        });

        container.appendChild(svg);

        return svg;

    }

}

window.SVGFactory = SVGFactory;