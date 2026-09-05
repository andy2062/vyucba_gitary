class BaseRepository {

    constructor(items, adapter = null) {

    this.adapter = adapter;

    this.items = adapter
        ? items.map(item => adapter.adapt(item))
        : [...items];

    this.filtered = [...this.items];

    this.index = 0;

}

getById(id) {

    return this.items.find(

        item => item.id === id

    ) ?? null;

}

    getAll() {
   
        return this.filtered;

    }

    current() {

        return this.filtered[this.index];

    }

    currentIndex() {

        return this.index;

    }

    setIndex(index) {

        this.index = index;

    }

    next() {

        if (this.index < this.filtered.length - 1) {

            this.index++;

        }

        return this.current();

    }

    previous() {

        if (this.index > 0) {

            this.index--;

        }

        return this.current();

    }

    filter(filters = {}) {

    this.filtered = this.items.filter(item =>

        (!filters.group || item.group === filters.group) &&
        (!filters.quality || item.quality === filters.quality)

    );

   this.index = 0;

}

    getGroups() {

    return [...new Set(
        this.items
            .map(item => item.group)
            .filter(Boolean)
    )];

}

getQualities() {

    return [...new Set(
        this.items
            .map(item => item.quality)
            .filter(Boolean)
    )];

}


}

window.BaseRepository = BaseRepository;
