class BaseRegistry {

    static register(name, value) {

        this.items.set(name, value);

    }

    static get(name) {

        return this.items.get(name);

    }

    static has(name) {

        return this.items.has(name);

    }

    static remove(name) {

        this.items.delete(name);

    }

    static clear() {

        this.items.clear();

    }

    static dump() {

        console.table(

            [...this.items.keys()]

        );

    }

}

window.BaseRegistry = BaseRegistry;