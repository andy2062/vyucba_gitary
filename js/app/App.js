class App {


    static async start() {

        const app = new App();

        await app.init();

        return app;

    }

    async init() {

    this.ui.init();

    await this.loadDatabase();
    //console.log( this.database.get("Lessons"));
    console.log(this.database.keys());

    MusicDatabase.init();

    const builder =

        new ApplicationBuilder(this);

    builder.build();

    this.initCategories();
    console.log(this.lessonLoader);
    

}


    constructor() {

    this.database = new Database({

        Exercises: "./data/exercises.json",
        Scales: "./data/scales.json",
        Intervals: "./data/intervals.json",
        Chords: "./data/chords1.json",
        Lessons: "./data/lessons.json"

    });

    this.ui = new UIManager();

    this.player = new PlaybackEngine();

    this.midi = new MidiPlayer();

    this.engine = null;
    this.router = null;

    this.repositories = {};
    this.controllers = {};

}



initCategories() {

    this.ui.fillCategories(
        Modules.all
    );

    this.ui.onCategoryChange(route => {

         EventBus.emit(

        "navigate",

        route

    );

    });

}

    async loadDatabase() {


        await this.database.load();

    }

}
window.App = App;
