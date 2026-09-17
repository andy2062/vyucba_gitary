class CadenceAdapter extends BaseAdapter {

    get type() {

        return "cadence";

    }


    adapt(item) {

        const model =
            new PresentationModel({

                ...item,

                type: this.type,

                steps: item.steps.map(step => ({

                    chordId: step.chordId,

                    text: step.text

                }))

            });


        return model;

    }

}


window.CadenceAdapter =
    CadenceAdapter;
