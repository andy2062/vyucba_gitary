class Router {

    constructor(app) {

        this.app = app;

        this.routes = {};

        this.defaultRoute = null;

    }


    register(path, controller) {

        this.routes[path] = controller;

    }


    setDefault(path) {

        this.defaultRoute = path;

    }


    start() {

        window.addEventListener(
            "hashchange",
            () => this.navigate()
        );

        this.navigate();

    }


    navigate() {

        const hash =
            location.hash.replace("#/", "");


        // ------------------------------------------
        // Rozdelenie route na časti
        // ------------------------------------------

        const parts =
            hash.split("/");


        // ------------------------------------------
        // Klasická route
        //
        // #/exercises
        // #/scales
        // #/intervals
        // #/chords
        // #/cadences
        // ------------------------------------------

        const route =
            parts[0];


        // ------------------------------------------
        // Parametre
        //
        // #/guitarsystem/scale/C-dur
        // #/guitarsystem/cadence/cadence_f_major_barre
        //
        // parts[0] = guitarsystem
        // parts[1] = category
        // parts[2] = item
        // ------------------------------------------

        const category =
            parts[1] || null;

        const item =
            parts[2] || null;


        console.log(
            "ROUTER:",
            {
                hash,
                route,
                category,
                item
            }
        );


        // ------------------------------------------
        // Žiadna route
        // ------------------------------------------

        if (!hash) {

            location.hash =
                "#/" + this.defaultRoute;

            return;

        }


        // ------------------------------------------
        // ŠPECIÁLNA ROUTE GUITAR SYSTEM
        // ------------------------------------------

        if (route === "guitarsystem") {

            console.log(
                "GUITAR SYSTEM ROUTE:",
                category,
                item
            );


            const routeMap = {

                scale: "scales",
                scales: "scales",

                interval: "intervals",
                intervals: "intervals",

                chord: "chords",
                chords: "chords",

                exercise: "exercises",
                exercises: "exercises",

                cadence: "cadences",
                cadences: "cadences"

            };


            const controllerRoute =
                routeMap[category];


            const controller =
                this.routes[controllerRoute];


            if (!controller) {

                console.warn(
                    "Unknown Guitar System category:",
                    category
                );

                return;

            }


            console.log(
                "GUITAR SYSTEM CONTROLLER:",
                controllerRoute
            );


            if (item) {

                controller.show(item);

            } else {

                controller.show();

            }


            return;

        }


        // ------------------------------------------
        // EXISTUJÚCE ROUTES
        // ------------------------------------------

        const controller =
            this.routes[route];


        if (!controller) {

            console.warn(
                "Unknown route:",
                route
            );

            return;

        }


        // ------------------------------------------
        // Kategória pre UI
        // ------------------------------------------

        this.app.ui.setCategory(route);


        // ------------------------------------------
        // Controller
        // ------------------------------------------

        controller.show();

    }

}


window.Router = Router;
