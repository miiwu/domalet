/**
 * [typeof.utility]{@link https://github.com/miiwu/domalet}
 *
 * @namespace typeof.utility
 * @version 0.0.1
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

const category = {
    nullish(source, callback) {
        let type = source !== (source ?? !source) ? String(source) : "prototype";

        callback?.(type);

        return type;
    },
    prototype(source, callback) {
        let prototype = Object.getPrototypeOf(source), // 获取原型
            type = prototype.constructor.name;

        callback?.({ type, prototype });

        return type;
    },
};

function typeof_source(source, callback) {
    let type;

    typeof_nullish(source, (value) => {
        if ("prototype" === value) {
            type = category.prototype(source, callback?.prototype);
        } else {
            type = value;
            callback?.nullish(type);
        }
    });

    return type;
}

const typeof_nullish = category.nullish;

function typeof_prototype(source, callback) {
    if ("prototype" !== typeof_nullish(source)) {
        throw TypeError(`source have no prototype, may be undefine or null`);
    }

    return category.prototype(source, callback);
}

export { typeof_source, typeof_nullish, typeof_prototype };

export default { source: typeof_source, nullish: typeof_nullish, prototype: typeof_prototype };
