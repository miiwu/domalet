/**
 * [expire.utility]{@link https://github.com/miiwu/domalet}
 *
 * @namespace expire.utility
 * @version 0.0.1
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

class expire {
    #gist = function (source) {
        let gist = { value: {} };

        let initial = Number(source?.initial ?? 0);
        if (isNaN(initial)) {
            throw TypeError(`gist.initial is not a number`);
        } else {
            gist.value.initial = initial;
            gist.value.present = gist.value.initial;
        }

        let interval =
            "function" === typeof source?.interval
                ? source?.interval // function
                : () => Number(source?.interval); // other
        gist.interval = interval;

        let validator =
            "function" === typeof source?.validator
                ? source?.validator // function
                : () => gist.value.present <= Number(source?.validator ?? gist.value.present); // other，默认运行一次过期
        gist.validator = validator;

        return gist;
    }; // 依据

    constructor(config) {
        this.#gist = this.#gist(config);
    }

    validate() {
        let valid = Boolean(this.#gist.validator.apply(this.#gist, arguments));

        if (valid) {
            let interval = this.#gist.interval();

            if ("number" !== typeof interval) throw TypeError("return of gist.interval() is not a number");

            this.#gist.value.present += interval;
        }

        return valid;
    } // 验证结果

    recalculate() {
        this.#gist.value.present = this.#gist.value.initial;
    } // 重新计算
}

export { expire };

export default expire;
