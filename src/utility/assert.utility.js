/**
 * [assert.utility]{@link https://github.com/miiwu/domalet}
 *
 * @namespace assert.utility
 * @version 0.0.1
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

import { typeof_source, typeof_nullish, typeof_prototype } from "./typeof.utility.js";

const assert = {
    type(source, { callback, candidate }) {
        this.argument.candidate(candidate);

        let packet = { candidate };

        packet.type = callback?.type?.operator?.(source, ...(callback?.type?.argument?.(packet) ?? []));

        packet.index = candidate.findIndex((element) => RegExp(element).test(packet.type));
        packet.assert = Boolean(packet.index + 1);

        callback?.assertion?.(packet);

        return packet.assert;
    },
    property(source, structure, { any, path, format, callback }) {
        this.argument.source(source);

        structure = format?.object?.(structure, path.alias) ?? structure; // 格式化对象结构

        let set = new Set(Object.keys(structure)),
            packet = { info: {}, unit: {}, path },
            { info, unit } = packet;

        if (set.delete(any)) callback?.key?.(source)?.forEach((key) => set.add(key)); // 如果 structure 属性键中含有 any，存入 source 属性键

        set.forEach((key) => {
            Object.assign(info, { parent: source, key, value: source[key] });

            unit.parent = structure[(unit.key = key)] ?? structure[(unit.key = any)];
            unit.parent = format?.key?.(unit.parent, [...path.alias, unit.key]) ?? unit.parent; // 格式化属性键结构

            this.type(info.value, {
                callback: {
                    type: { operator: typeof_source },
                    assertion: ({ type }) => {
                        unit.value = unit.parent[(unit.type = type)] ?? unit.parent[(unit.type = any)];
                        unit.value = format?.value?.(unit.value, [...path.alias, unit.key, unit.type]) ?? unit.value; // 格式化属性值结构

                        info.type = type;
                        info.alias = callback?.alias?.(packet); // 配置别名

                        path?.info?.push?.(info); // 路径入栈
                        path?.alias?.push?.(info.alias);

                        callback?.nest?.push?.(packet); // 嵌套

                        switch (typeof unit.value) {
                            case "object":
                                callback?.node?.branch?.(packet); // 树杈节点

                                this.property(info.value, unit.value, arguments[2]); // 递归
                                break;
                            case "function":
                                callback?.node?.leaf?.(packet); // 叶子节点

                                unit.value(packet); // 执行自定义函数
                                break;
                            default:
                                callback?.fail?.(packet);
                                break;
                        }

                        path?.info?.pop?.(); // 路径出栈
                        path?.alias?.pop?.();

                        callback?.nest?.pop?.(packet); // 解嵌套
                    }, // 选取 structure 中合适的类型定义单元
                },
                candidate: Object.keys(unit.parent),
            }); // 获取属性类型
        }); // 遍历属性名称
    },
    argument: {
        source(source, name = "source") {
            if (source !== (source ?? !source)) {
                throw TypeError(`${name} can not be null or undefined`);
            }
        },
        candidate(source) {
            if (!(source instanceof Array)) {
                throw TypeError("candidate is not an array");
            }

            source.forEach((element, index) => {
                if (!(element instanceof RegExp || "string" === typeof element)) {
                    throw TypeError(`candidate[${index}] is not a regexp or string`);
                }
            });
        },
        structure(source, message) {
            this.source(source, "structure");

            if (!Object.keys(source).length) {
                throw TypeError(message);
            }
        },
    },
};

function assert_type(source, { callback, candidate } = {}) {
    return assert.type(source, {
        callback: {
            type: {
                operator: typeof_source,
                argument: (packet) => [
                    {
                        nullish: (type) => ((packet.detail = { type }), (packet.category = "nullish")),
                        prototype: (detail) => ((packet.detail = detail), (packet.category = "prototype")),
                    },
                ],
            },
            assertion({ type, index, assert, detail, category }) {
                if (!assert) {
                    callback?.fail?.(detail);
                } else if ("nullish" === category) {
                    callback?.nullish?.({ type, index });
                } else if ("prototype" === category) {
                    callback?.prototype?.({ type, index, prototype: detail.prototype });
                }
            },
        },
        candidate,
    });
}

function assert_property(source, structure, callback) {
    assert.property(source, structure, {
        any: "=",
        path: { info: [], alias: ["root"] },
        format: {
            object: (source, path) => {
                assert.argument.structure(source, `have no object unit, path: [${path.join(" -> ")}]`);
            },
            key(source, path) {
                let property = {};

                assert.argument.structure(source, `have no key unit, path: [${path.join(" -> ")}]`);

                source.forEach((element) => {
                    property[element.type ?? "="] = element.value ?? (() => {});
                });

                return property;
            }, // 使 key unit 支持数组，防止 key unit, value unit 均为对象，不便区分
            value: (source, path) => {
                if ("object" === typeof source) {
                    assert.argument.structure(source, `have no value unit, path: [${path.join(" -> ")}]`);
                }
            },
        },
        callback: Object.assign(
            {
                key: (source) => Object.keys(source),
                fail: ({ path }) => {
                    throw TypeError(`assert failed, path: [${path.alias.join(" -> ")}]`);
                },
                alias: ({ info, unit }) => `${info.key}@[${info.type}, ${unit.type}]`,
            },
            callback
        ),
    });
}

function assert_nullish(source, { callback, candidate } = {}) {
    return assert.type(source, {
        callback: {
            type: {
                operator: typeof_nullish,
                argument: (packet) => [(detail) => (packet.detail = detail)],
            },
            assertion: ({ type, assert }) => {
                if (assert) {
                    callback?.pass?.(type);
                } else {
                    callback?.fail?.();
                }
            },
        },
        candidate: candidate ?? [/^null$|^undefined$/],
    });
}

function assert_prototype(source, { callback, candidate } = {}) {
    assert.argument.source(source);

    return assert.type(source, {
        callback: {
            type: {
                operator: typeof_prototype,
                argument: (packet) => [(detail) => (packet.detail = detail)],
            },
            assertion: ({ type, index, assert, detail }) => {
                let packet = { type, index, prototype: detail.prototype };

                if (assert) {
                    callback?.pass?.(packet);
                } else {
                    callback?.fail?.(packet);
                }
            },
        },
        candidate,
    });
}

export { assert_type, assert_property, assert_nullish, assert_prototype };

export default {
    type: assert_type,
    property: assert_property,
    nullish: assert_nullish,
    prototype: assert_prototype,
};
