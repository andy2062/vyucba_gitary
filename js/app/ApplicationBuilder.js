class ApplicationBuilder {

    constructor(app) {

        this.app = app;

    }

    build() {

        this.createServices();

        this.createRepositories();

        this.createLessonSystem();

        this.createControllers();

        this.createRouter();

        this.createEvents();

    }

    createServices() {

        ServiceRegistry.register(
            "database",
            this.app.database
        );

        ServiceRegistry.register(
            "ui",
            this.app.ui
        );

        ServiceRegistry.register(
            "player",
            this.app.player
        );

        ServiceRegistry.register(
            "midi",
            this.app.midi
        );

       // Najprv komponenty
    this.registerComponents();

    // Až potom RendererEngine
    this.createRendererEngine();

    ServiceRegistry.register(
        "engine",
        this.app.engine
    );

        this.registerPlayback();
        
        this.app.contentRenderer =
    new ContentRenderer(
        this.app.database
    );

   
    }

    createRendererEngine() {

        const fretboard =
            document.getElementById("fretboard");

        const notation =
            document.getElementById("notation");

        const tab =
            document.getElementById("tab");

        this.app.engine =
            new RendererEngine();

        this.registerRenderers(

            fretboard,
            notation,
            tab

        );

    }

   registerRenderers(

    fretboard,
    notation,
    tab

) {

    const types = [

        "exercise",
        "scale",
        "interval",
        "chord"

    ];

    const renderTargets = {

        fretboard,
        notation,
        tab

    };

    Object.entries(renderTargets).forEach(([name, element]) => {

        if (!element) return;

        if (!ComponentRegistry.has(name)) return;

        const Renderer =
            ComponentRegistry.get(name);

        this.app.engine.registerMany(

            types,

            new Renderer(element)

        );

    });

    

}

    registerPlayback() {

        this.app.player.addListener(frame => {

            this.app.engine.render(frame);

        });

        this.app.player.addListener(frame => {

            this.app.midi.play(frame);

        });

         this.app.player.addListener(frame => {

        this.app.ui.setInfo(frame);

    });

    }
 

   createRepositories() {

    const repositories = {

    exercises: ExercisesRepository,
    scales: ScalesRepository,
    intervals: IntervalsRepository,
    chords: ChordsRepository
   // lessons: LessonsRepository

};

Object.entries(repositories).forEach(([name, Repository]) => {

    this.app.repositories[name] =
        new Repository(this.app.database);

});

}

createLessonSystem() {

    this.app.lessonRepository =
        new LessonRepository(
            this.app.database
        );

    this.app.lessonLoader =
        new LessonLoader(
            this.app.lessonRepository,
            this.app.contentRenderer
        );

}


createControllers() {
    
    const controllers = {

    exercises: ExerciseController,
    scales: ScaleController,
    intervals: IntervalController,
    chords: ChordController

};

Object.entries(controllers).forEach(([name, Controller]) => {

    this.app.controllers[name] =
        new Controller(

            this.app.repositories[name],
            this.app.player,
            this.app.engine,
            this.app.midi,
            this.app.ui

        );

});

}

createRouter() {

    this.app.router = new Router(this.app);

    Object.entries(this.app.controllers)
        .forEach(([route, controller]) => {

            this.app.router.register(
                route,
                controller
            );

        });

    this.app.router.setDefault("exercises");

    ServiceRegistry.register(
        "router",
        this.app.router
    );

    this.app.router.start();

}


createEvents() {

    // Navigácia

    EventBus.on(

        "navigate",

        route => {

            location.hash = "#/" + route;

        }

    );

  
}

registerComponents() {

    ComponentRegistry.register(
        "tab",
        TabRenderer
    );

    ComponentRegistry.register(
        "notation",
        NotationRenderer
    );

    ComponentRegistry.register(
        "fretboard",
        FretboardRenderer
    );

}

}

window.ApplicationBuilder = ApplicationBuilder;