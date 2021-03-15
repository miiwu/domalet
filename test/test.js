import { construct_function } from "../src/utility/construct.utility.js";

export let source = (function () {
    console.log(construct_function());
    console.log(construct_function("a = a + b", "return a"));

    console.log(construct_function()("1", "2"));

    console.log(construct_function("return a + b")("1", "2"));
})();
