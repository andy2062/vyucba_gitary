class NotationRenderer {
    

    constructor(container) {

        this.container = container;
        
    }

    render(frame) {
       
    if (!this.container) return;
    if (!frame.notation) return;

    this.clear();

    const factory = this.createFactory();

    const system = this.createSystem(factory);

    this.drawNotation(

        factory,
        system,
        frame.notation

    );

}


createFactory() {

    
    return new Vex.Flow.Factory({
        

        renderer: {
            

            elementId: this.container.id,

             width: 2200,

            height: 480

        }

    });

}

createSystem(factory) {

    return factory.System({

        x: 10,
        y: 20,
        width: 480

    });

}



    clear() {

        this.container.innerHTML = "";

    }

    createRenderer() {

        const renderer =
            new Vex.Flow.Renderer(

                this.container,

                Vex.Flow.Renderer.Backends.SVG

            );

        renderer.resize(1000,180);

        return renderer;

    }


drawNotation(factory, system, notation) {

    notation.measures.forEach(

        (measure, index) => {

            this.drawMeasure(

                factory,
                system,
                measure,
                notation,
                index === 0

            );

        }

    );

    factory.draw();

}

    drawMeasure(

    factory,
    system,
    measure,
    notation,
    firstMeasure

) {

    const voice =
        this.createVoice(factory, notation);

    voice.addTickables(

        this.createNotes(factory, measure)

    );

    const stave = system.addStave({

        voices: [voice]

    });

    if (firstMeasure) {

        stave

            .addClef(notation.clef)

            .addTimeSignature(notation.time);

    }

}


   createVoice(factory, notation) {

    return factory.Voice({

        time: notation.time

    });

}

    createNotes(factory, measure) {

    return measure.notes.map(note =>

        factory.StaveNote({

            keys: note.keys,

            duration: note.duration

        })

    );

}

}

window.NotationRenderer = NotationRenderer;