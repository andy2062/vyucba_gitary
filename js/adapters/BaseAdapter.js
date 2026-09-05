class BaseAdapter {

    get type() {

        return "";

    }

    adaptAll(items) {
        return items.map(item => this.adapt(item));
    }

    adapt(item) {

        

        const model = new PresentationModel({

            ...item,

            

            type: this.type

        });

         console.log( "ADAPTER INPUT:", this.type,  item);
      //  console.log( "INTERVAL MODEL", model);

        model.fretboard = FretboardBuilder.build(model);
        model.notation = NotationBuilder.build(model);
        model.tab = TabBuilder.build(model);
        model.playback = PlaybackBuilder.build(model);

        return model;
        

    }

}

window.BaseAdapter = BaseAdapter;