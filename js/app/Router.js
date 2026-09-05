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

        let route =
            location.hash.replace("#/", "");
         this.app.ui.setCategory(route);

       if (!route) {

    location.hash = "#/" + this.defaultRoute;
    
    return;

}

        const controller = this.routes[route];

        if (!controller) {

            console.warn(
                "Unknown route:",
                route
            );

            return;

        }

        controller.show();

    }

}

window.Router = Router;