class BaseBuilder {

    constructor() {

        if (new.target === BaseBuilder) {

            throw new Error(
                "BaseBuilder is abstract."
            );

        }

    }

    build(data) {

        throw new Error(
            "build() must be implemented."
        );

    }

}

window.BaseBuilder = BaseBuilder;