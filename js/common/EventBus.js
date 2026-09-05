class EventBus {

    static events = new Map();

    static on(event, callback) {

        if (!this.events.has(event)) {

            this.events.set(event, []);

        }

        this.events.get(event).push(callback);

    }

    static off(event, callback) {

        if (!this.events.has(event)) return;

        this.events.set(

            event,

            this.events
                .get(event)
                .filter(cb => cb !== callback)

        );

    }

    static emit(event, data) {

        if (!this.events.has(event)) return;

        this.events
            .get(event)
            .forEach(cb => cb(data));

    }

    static clear() {

        this.events.clear();

    }

    static dump() {

        console.table(

            [...this.events.keys()]

        );

    }

}

window.EventBus = EventBus;