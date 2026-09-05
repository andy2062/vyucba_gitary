class Database {

    constructor(files = {}) {

        this.files = files;

        this.data = {};

    }

    async load() {
        

        for (const [key, path] of Object.entries(this.files)) {

            this.data[key] = await this.loadFile(path);


        }
     console.log(
    this.get("Lessons")
);

    }

    async loadFile(path) {

        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Nepodarilo sa načítať ${path}`);
        }

        return await response.json();

    }

    count(name) {

    return this.get(name).length;

}

isEmpty(name) {

    return this.count(name) === 0;

}

    get(name) {

        return this.data[name] || [];

    }

    getFirst(name) {

        const items = this.get(name);

        return items.length ? items[0] : null;

    }

    getByIndex(name, index) {

        const items = this.get(name);

        return items[index] || null;

    }

    has(name) {

        return name in this.data;

    }

    keys() {

        return Object.keys(this.data);

    }

    getById(id) {

    for (const category of Object.values(this.data)) {

        const item = category.find(

            item => item.id === id

        );

        if (item) {

            return item;

        }

    }

    return null;

}



}

window.Database = Database;