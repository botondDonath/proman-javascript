import { dom } from "./dom.js";

// This function is to initialize the application
function init() {
    Number.prototype.isBetween = function(a, b, inclusive) {
        const min = Math.min(a, b);
        const max = Math.max(a, b);
        return inclusive ? this >= min && this <= max : this > min && this < max;
    };
    // init data
    dom.init();
    // loads the boards to the screen
    dom.loadBoards();

}

init();
