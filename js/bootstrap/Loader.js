class Loader {

    static async loadModules(manifest) {

        for (const files of Object.values(manifest)) {

            await this.load(files);

        }

    }

    static async load(files) {

        for (const file of files) {

            await this.loadScript(file);

        }

    }

    static loadScript(src) {

    return new Promise((resolve, reject) => {

        const script = document.createElement("script");

        script.src = src;

        script.onload = () => {

        resolve();

        };

        script.onerror = () => {

            reject(new Error("Nepodarilo sa načítať: " + src));

        };

        document.head.appendChild(script);

    });

}

}

window.Loader = Loader;