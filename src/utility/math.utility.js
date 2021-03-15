/**
 * [math.utility]{@link https://github.com/miiwu/domalet}
 *
 * @namespace math.utility
 * @version 0.0.1
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

function math_gcd(lhs, rhs) {
    if ([0, NaN].includes(Number(rhs))) return lhs;
    else return math_gcd(rhs, lhs % rhs);
}

export { math_gcd };

export default { gcd: math_gcd };
