import { typeof_source, typeof_nullish, typeof_prototype } from "../src/utility/typeof.utility.js";

export let source = (function () {
    typeof_source(null, {
        nullish: (type) => console.log(type, `<- typeof_source of null, from callback.nullish`),
        prototype: ({ type }) => console.log(type, `<- typeof_source of null, from callback.prototype`),
    });
    typeof_source([], {
        nullish: (type) => console.log(type, `<- typeof_source of [], from callback.nullish`),
        prototype: ({ type }) => console.log(type, `<- typeof_source of [], from callback.prototype`),
    });

    console.log(`------------------------------------`);

    // console.log(typeof_prototype(null)); // source have no prototype, may be undefine or null
    console.log(typeof_prototype(""));
    console.log(typeof_prototype([]));

    typeof_prototype({}, ({ type }) => {
        console.log(type, `<- typeof_prototype of {}`);
    });

    console.log(`------------------------------------`);

    console.log(typeof_nullish(null));
    console.log(typeof_nullish(undefined));

    typeof_nullish("undefined", (type) => {
        console.log(type, `<- typeof_nullish of "undefined"`);
    });
})();
