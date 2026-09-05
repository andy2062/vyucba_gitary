class NotationBuilder {

    static build(model){

        return{

           layout:

    LayoutBuilder.notation(),

            measures:model.measures ?? [],

            key:model.key ?? "C",

            time:model.time ?? "4/4",

            clef:model.clef ?? "treble",

            cursor:0,

            visible:true

        };

    }

}

window.NotationBuilder = NotationBuilder;
