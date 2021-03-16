import { expire } from "../src/utility/expire.utility.js";

export let source = (function () {
    let exp = new expire({
        initial: [
            0,
            undefined, // 0
        ][0],
        interval: [() => 1, 1][0],
        validator: [
            function (secondary) {
                let primary = this.value.present <= 2;

                if (!primary) primary = Boolean(secondary);

                console.log("-------------------------------------");

                return primary;
            },
            2,
            undefined, // 1次
        ][0],
    });

    console.log(exp.validate()); // true
    console.log(exp.validate()); // true
    console.log(exp.validate()); // true
    console.log(exp.validate()); // false
    console.log(exp.validate(Math.random() > 0.5)); // random
    console.log(exp.validate(Math.random() > 0.5)); // random
    console.log(exp.validate(Math.random() > 0.5)); // random
    console.log(exp.validate(Math.random() > 0.5)); // random

    exp.recalculate();
    console.log("+++++++++++++++++++++++++++++++++++++");

    console.log(exp.validate()); // true
    console.log(exp.validate()); // true
    console.log(exp.validate()); // true
    console.log(exp.validate()); // false
    console.log(exp.validate(Math.random() > 0.5)); // random
    console.log(exp.validate(Math.random() > 0.5)); // random
    console.log(exp.validate(Math.random() > 0.5)); // random
    console.log(exp.validate(Math.random() > 0.5)); // random
})();
