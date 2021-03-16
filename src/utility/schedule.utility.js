/**
 * [schedule.utility]{@link https://github.com/miiwu/domalet}
 *
 * @namespace schedule.utility
 * @version 0.0.1
 * @author miiwu [i.miiwu@outlook.com]
 * @copyright miiwu
 * @license Apache License 2.0
 */

import { math_gcd } from "./math.utility.js";

function validator(source) {
    let validate = {
            count: 0,
            validate() {
                let valid = this.operator.apply(this, arguments);

                if (valid) this.count++;

                return valid;
            },
        },
        operator = function () {
            return this.count < Number(source);
        };

    validate.operator = "function" === typeof source ? source : operator;

    return validate;
}

class schedule {
    #time = function () {
        return { born: 0, life: 0 };
    };

    #stage = function (source) {
        let stage = {
            count: 0,
            queue: { raw: new Map(), archive: new Map() },
        };

        stage.period = source?.period ?? source ?? 0;

        stage.method = {
            clean: function () {
                stage.count = 0;
                stage.queue.archive.clear();
            },
            rouse: function (action) {
                stage.queue.raw.clear();
                stage.queue.effect = new Map();

                action.list.forEach((element, index) => {
                    if (
                        element.config.period.stage * element.config.rouse.count >= stage.count && // 是否到时间
                        element.config.rouse.validate(stage.count) // 是否可唤醒
                    ) {
                        stage.queue.raw.set(index, action.operator(element.source, { index, config: element.config }));
                    }
                });
            }, // 唤醒
            space: async function () {
                if (stage.queue.raw.size) {
                    stage?.callback?.prepare?.([...stage.queue.raw.keys()]);

                    await Promise.allSettled(stage.queue.raw.values()).then((result) => {
                        result.forEach(function (value, key) {
                            stage.queue.effect.set(key, value);
                        });
                    });

                    stage?.callback?.complete?.([...stage.queue.effect.values()]);

                    stage.queue.archive.set(stage.count, stage.queue.effect);
                } else {
                    stage?.callback?.idle?.(); // 空闲
                }
            }, // 间隔
            sleep: async function () {
                stage.count++;
            }, // 睡眠
        };

        stage.callback = {
            idle: source?.callback?.idle, // 空闲
            prepare: source?.callback?.prepare, // 准备，action 开始前
            complete: source?.callback?.complete, // 完成，action 完成后
        };

        return stage;
    };

    #action = function (source, stage) {
        let action = { list: [] };

        stage.period = source.list.reduce(
            (lhs, rhs) => math_gcd(lhs?.config?.period ?? lhs, rhs?.config?.period),
            stage.period
        );

        source.list.forEach((element) => {
            element.config.rouse = validator(element?.config?.rouse ?? 1);

            element.config.period = {
                time: element.config.period,
                stage: element.config.period / stage.period,
            };

            action.list.push(element);
        });

        action.method = {
            clean: function () {
                action.list.forEach((element) => {
                    element.config.rouse.count = 0;
                });
            },
        };

        action.operator = source.operator;

        return action;
    };

    #relive = function (source) {
        return validator(source ?? 0);
    };

    #lifetime = function (source) {
        let lifetime = {};

        lifetime.period = source?.period ?? source ?? Number.MAX_SAFE_INTEGER;

        lifetime.method = {
            born: function (time, stage, action) {
                time.born = Date.now();

                stage.method.clean();
                action.method.clean();

                lifetime?.callback?.born?.();
            },
            live: async function (time, stage, action) {
                while ((time.life = Date.now() - time.born) <= lifetime.period) {
                    if (stage.period * stage.count <= time.life) {
                        stage.method.rouse(action);

                        await stage.method.space();

                        stage.method.sleep();
                    }
                }

                lifetime?.callback?.expire?.(stage.queue.archive);
            },
        };

        lifetime.callback = {
            born: source?.callback?.born, // 出生
            expire: source?.callback?.expire, // 耗尽
        };

        return lifetime;
    };

    constructor(config) {
        this.#time = this.#time();

        this.#stage = this.#stage(config?.stage);

        this.#action = this.#action(config?.action, this.#stage);

        this.#relive = this.#relive(config?.relive);

        this.#lifetime = this.#lifetime(config?.lifetime);
    }

    async live() {
        do {
            this.#lifetime.method.born(this.#time, this.#stage, this.#action);

            await this.#lifetime.method.live(this.#time, this.#stage, this.#action);
        } while (this.#relive.validate());
    }
}

export { schedule };

export default schedule;
