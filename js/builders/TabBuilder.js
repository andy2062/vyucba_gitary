class TabBuilder {

    static build(model) {

 return {

    type: model.type,
   layout:

    LayoutBuilder.tab(),

   strings: 6,

    tuning: [

        "E",
        "A",
        "D",
        "G",
        "B",
        "E"

    ],

    columns: this.buildColumns(model),

    meta: {

        title: model.title,

        description: model.description

    }

};

    }

    static buildColumns(model) {

        switch (model.type) {

            case "exercise":
            case "scale":
                return model.notes.map(note => ({
                    notes: [note]
                }));

            case "interval":
                return model.notes.map(interval => ({
                    notes: interval
                }));

            case "chord":
                return [{
                    notes: model.notes
                }];

            default:
                return [];

        }

    }

}

window.TabBuilder = TabBuilder;