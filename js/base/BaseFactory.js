class BaseFactory {

    constructor() {

        if (new.target === BaseFactory) {

            throw new Error(
                "BaseFactory is abstract."
            );

        }

    }

    create(data) {

        throw new Error(
            "create() must be implemented."
        );

    }

}

window.BaseFactory = BaseFactory;