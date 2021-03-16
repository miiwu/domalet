import { schedule } from "../src/utility/schedule.utility.js";

export let source = (function () {
    let scheduler = new schedule({
        stage: [
            50,
            {
                period: 50,
                callback: {
                    idle() {
                        console.log(">>> idle:", ["enter"], ":idle <<<");
                    },
                    prepare(keys) {
                        console.log(">>> prepare:", keys);
                    },
                    complete(values) {
                        console.log(values, ":complete <<<");
                    },
                },
            },
        ][1],
        action: {
            list: [
                {
                    source: { wait: 30 },
                    config: {
                        period: 50,
                        rouse: undefined, // 共激活 1 次
                    },
                },
                {
                    source: { wait: 20 },
                    config: {
                        period: 50,
                        rouse: 2, // 共激活 2 次
                    },
                },
                {
                    source: { wait: 10 },
                    config: {
                        period: 100,
                        rouse() {
                            return this.count < 3;
                        }, // 共激活 3 次
                    },
                },
                {
                    source: { wait: 0 },
                    config: {
                        period: 100,
                        rouse: (stage) => !(stage % 2), // stage 为偶数时激活
                    },
                },
            ],
            operator: [
                function (source, info) {
                    source;
                    return `action.${info.index}`;
                },
                async function (source, info) {
                    let string = `action.${info.index}`;
                    console.log(`[${Date.now()}] pending for ${source.wait}ms`);

                    return await new Promise((resolve) => {
                        setTimeout(function () {
                            console.log(`[${Date.now()}] timeout for ${source.wait}ms: ${string}`);

                            resolve(string);
                        }, source.wait);
                    });
                },
            ][1],
        },
        relive: [
            1,
            function () {
                return this.count < 1;
            }, // 共激活 3 次
        ][1],
        lifetime: [
            300,
            {
                period: 300,
                callback: {
                    born() {
                        console.log("--------------------+ BORN +--------------------");
                    },
                    expire(archive) {
                        console.log(
                            "-------------------+ EXPIRE +-------------------",
                            archive,
                            "-------------------+ EXPIRE +-------------------"
                        );
                    },
                },
            },
        ][1],
    });

    scheduler.live();
})();
