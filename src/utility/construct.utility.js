/**
 * [construct.utility]{@link https://github.com/miiwu/domalet}
 *
 * @namespace construct.utility
 * @version 0.0.1
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

function construct_function(line = "return [...arguments]", ...extra) {
    return new Function(...["a", "b", "c", "d", "e", "f", "g", "h"], ["\t", line, ...extra, ";"].join(";\n\t"));
}

export { construct_function };

export default { function: construct_function };
