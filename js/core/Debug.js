const DEBUG = false;

function debug(...args) {

    if (DEBUG) {

        console.log(...args);

    }

}

window.debug = debug;