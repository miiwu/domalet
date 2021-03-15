import { assert_type, assert_nullish, assert_prototype, assert_property } from "../src/utility/assert.utility.js";

export let source = (function () {
    // assert_property(undefined, {}); // TypeError: source can not be null or undefined
    // assert_property({ property: {} }, { "=": [] }); // TypeError: have no key unit, path: [root -> =]
    // assert_property({ property: {} }, {}); // TypeError: have no object unit, path: [root]
    // assert_property({ property: {} }, { "=": [] }); // TypeError: have no key unit, path: [root -> =]
    // assert_property({ property: {} }, { "=": [{ value: {} }] }); // TypeError: have no value unit, path: [root -> = -> =]

    assert_property(
        { "property-0": { sup: "", body: [] }, "property-1": [{}, ""] }, // source
        {
            "property-0": [
                { type: "String" }, // String 类型
                {
                    type: "Object",
                    value: {
                        sup: [{ type: "String" }],
                        sub: [{ type: "String" }],
                    },
                },
            ],
            "property-1": [
                {
                    type: "Array",
                    value: {
                        "=": [{ type: "String", value: () => {} }],
                        0: [{ type: "Object", value: { str: [{ type: "String", value() {} }] } }],
                        length: [{ value: () => {} }], // 任意类型
                    },
                }, // value unit
            ], // key unit
        }, // object unit / structure
        {
            key: (source) => Object.getOwnPropertyNames(source), // 属性键回调，控制可访问到的属性名称，默认 Object.keys(source),
            fail: ({ path }) => {
                console.log("xxxxxx:", path.alias.join(" -> "));
            }, // 失败回调，默认抛异常
            nest: {
                pop({ info }) {
                    console.log("----->:", info.alias);
                }, // 出栈
                push({ info, unit }) {
                    console.log("<-----:", info.alias, `[${[unit.key, unit.type].join(", ")}]`);
                }, // 入栈
            }, // 嵌套回调
            node: {
                leaf({ path }) {
                    console.log("leaf  :", path.alias.join(" -> "));
                }, // 叶子
                branch({ path }) {
                    console.log("branch:", path.alias.join(" -> "));
                }, // 树杈
            }, // 节点回调
            alias: ({ info, unit }) => `${info.key}@[${info.type}, ${unit.type}]`, // 别名回调，自定义别名
        } // callback
    );

    console.log("-------------------------------------------------");

    // console.log(assert_type("")); // TypeError: candidate is not an array
    // console.log(assert_type(null, { candidate: [0] })); // TypeError: candidate[0] is not a regexp or string

    assert_type(null, {
        callback: {
            fail: (packet) => console.log("fail:", packet),
            nullish: (packet) => console.log("nullish:", packet),
            prototype: (packet) => console.log("prototype:", packet),
        },
        candidate: ["undefined"],
    });
    assert_type([], {
        callback: {
            fail: (packet) => console.log("fail:", packet),
            nullish: (packet) => console.log("nullish:", packet),
            prototype: (packet) => console.log("prototype:", packet),
        },
        candidate: ["undefined", "null"],
    });
    assert_type(null, {
        callback: {
            fail: (packet) => console.log("fail:", packet),
            nullish: (packet) => console.log("nullish:", packet),
            prototype: (packet) => console.log("prototype:", packet),
        },
        candidate: ["undefined", "null"],
    });
    assert_type([], {
        callback: {
            fail: (packet) => console.log("fail:", packet),
            nullish: (packet) => console.log("nullish:", packet),
            prototype: (packet) => console.log("prototype:", packet),
        },
        candidate: ["undefined", "null", "Object", "Array"],
    });

    console.log("-------------------------------------------------");

    // console.log(assert_prototype("")); // TypeError: candidate is not an array
    // console.log(assert_prototype("", { candidate: [0] })); // TypeError: candidate[0] is not a regexp or string
    // console.log(assert_prototype(null, [])); // TypeError: source can not be null or undefined

    console.log(assert_prototype("", { candidate: ["String"] }));

    assert_prototype([], {
        callback: {
            pass: (packet) => console.log("pass:", packet),
            fail: (packet) => console.log("fail:", packet),
        },
        candidate: [/object/, /array/i],
    });

    console.log("-------------------------------------------------");

    console.log(assert_nullish(0));
    console.log(assert_nullish(true));
    console.log(assert_nullish(false));

    console.log(assert_nullish(null));
    console.log(assert_nullish(undefined));

    assert_nullish(undefined, {
        callback: {
            pass: (type) => console.log("pass:", type),
            fail: (type) => console.log("fail:", type),
        },
        candidate: ["null", "undefined"],
    });
})();
