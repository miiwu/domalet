import { math_gcd } from "../src/utility/math.utility.js";

export let source = (function () {
    console.log(math_gcd(NaN, NaN));
    console.log(math_gcd(0, NaN));
    console.log(math_gcd(0, 2));
    console.log(math_gcd(110, 10));
})();
