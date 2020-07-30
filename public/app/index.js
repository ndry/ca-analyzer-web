// import {Application} from "./Application.js";
// const app = new Application();
// if (env.debug) {
//     Object.assign(window, {
//         app
//     });
// }
// app.run();
import "./utils/dragPage.js";
import { generate, startSpacetime, fillStartedSpacetime } from "./generate.js";
import { render } from "./render.js";
import { CacheMap } from "./utils/CacheMap.js";
import { Rule } from "./rule/Rule.js";
import { getNumberFromDigits } from "./utils/misc.js";
import { MyTweakpane } from "./utils/MyTweakpane.js";
import ParkMiller from "park-miller";
import { SymRuleSpace } from "./rule/SymRule.js";
const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext("2d");
canvasCtx.imageSmoothingEnabled = false;
const colors = [
    0xFF000000,
    0xFF00FF00,
    0xFFFF0000,
    0xFF0000FF,
    0xFFFF00FF,
];
function getSpacePairHash(spacePair, margin) {
    let hash = 0;
    for (let x = margin; x < spacePair[0].length - margin; x++) {
        hash += spacePair[0][x] + spacePair[1][x];
    }
    return hash;
}
function getSpacePairEquals(spacePair1, spacePair2, margin) {
    for (let x = margin; x < spacePair1[0].length - margin; x++) {
        if (spacePair2[0][x] !== spacePair1[0][x]
            || spacePair2[1][x] !== spacePair1[1][x]) {
            return false;
        }
    }
    return true;
}
export class SpacePairHashSet extends CacheMap {
    constructor() {
        super(() => new Set());
    }
    add(spacePair, margin) {
        this.contains(spacePair, margin, true);
    }
    contains(spacePair, margin, add = false) {
        const hash = getSpacePairHash(spacePair, margin);
        const set = this.get(hash);
        const contains = [...set]
            .some(sp => getSpacePairEquals(sp, spacePair, margin));
        if (add) {
            set.add(spacePair);
        }
        return contains;
    }
}
export function hasBlackFloorAtTime(spacetime, t) {
    const prevSpace = spacetime[t - 1];
    const space = spacetime[t];
    const spaceSize = space.length;
    if (!space) {
        return false;
    }
    let acc = 0;
    let maxAcc = -1;
    for (let x = 0; x < spaceSize; x++) {
        if (space[x] === 0 && prevSpace[x] === 0) {
            acc++;
        }
        else {
            if (acc > maxAcc) {
                maxAcc = acc;
                if (maxAcc > 0.2 * spaceSize) {
                    return true;
                }
            }
            acc = 0;
        }
    }
    if (acc > maxAcc) {
        maxAcc = acc;
        if (maxAcc > 0.2 * spaceSize) {
            return true;
        }
    }
    return maxAcc > 0.2 * spaceSize;
}
function getBorderFriendness(fullTable, stateCount) {
    let acc = 0;
    let acc2 = 0;
    let acc3 = 0;
    let acc4 = 0;
    let acc5 = 0;
    let acc6 = 0;
    const n1 = 0;
    for (let n2 = 1; n2 < stateCount; n2++) {
        for (let pc = 0; pc < stateCount; pc++) {
            for (let c = 0; c < stateCount; c++) {
                let combinedState = 0;
                combinedState = combinedState * stateCount + n1;
                combinedState = combinedState * stateCount + c;
                combinedState = combinedState * stateCount + n2;
                combinedState = combinedState * stateCount + pc;
                const s = fullTable[combinedState];
                if (c === 0 && pc === 0) {
                    if (s === 0) {
                        acc++;
                    }
                    acc2++;
                }
                if (pc === 0) {
                    if (s === 0) {
                        acc3++;
                    }
                    acc4++;
                }
                if (c === 0) {
                    if (s === 0) {
                        acc5++;
                    }
                    acc6++;
                }
            }
        }
    }
    console.log(acc, acc2, acc3, acc4, acc5, acc6);
    return acc;
}
const inputArgs = {
    stateCount: 3,
    timeSize: 8000,
    spaceSize: 800,
    startFill: "zeros",
    bordersFill: "random",
    randomSeed: 4242,
};
let code = 0n;
let triedCode = 0;
let tried = 0;
let found = 0;
function doit() {
    let takeThis = false;
    let localTriedCode = 0;
    let localTried = 0;
    do {
        const stateCount = inputArgs.stateCount;
        // const ruleSpaceSize = getZcRevSymRuleSpaceSize(stateCount);
        // const revSymTable = createRandomZcRevSymTable(stateCount);
        // const symTable = revSymToSym(revSymTable, stateCount);
        const ruleSpace = new SymRuleSpace(stateCount);
        const rule = ruleSpace.createRandomRule();
        code = rule.code;
        fullRule = new Rule(stateCount, rule.getFullTable());
        console.log("rule space code", rule.code, "of", ruleSpace.size);
        console.log(getNumberFromDigits(fullRule.table, stateCount), fullRule.table.join(""));
        // console.log("revSymTable", revSymTable.join("")); 
        triedCode++;
        localTriedCode++;
        const bf = getBorderFriendness(fullRule.table, stateCount);
        if (bf < 1 || fullRule.table[0] !== 0) {
            if (localTriedCode > 1000) {
                return;
            }
            else {
                continue;
            }
        }
        // console.log("getBorderFriendness", getBorderFriendness(fullTable, stateCount));
        const margin = fullRule.spaceNeighbourhoodRadius;
        const hashMap = new SpacePairHashSet();
        let cycledAt = -1;
        let hasFloor = false;
        let abortCountdown = -1;
        const spacetime = generate({
            timeSize: inputArgs.timeSize,
            spaceSize: inputArgs.spaceSize,
            rule: fullRule,
            startFill: inputArgs.startFill,
            bordersFill: inputArgs.bordersFill,
            randomSeed: inputArgs.randomSeed,
            analyze(spacetime, t) {
                if (abortCountdown == 0) {
                    return true;
                }
                else if (abortCountdown > 0) {
                    abortCountdown--;
                    return false;
                }
                const space = spacetime[t];
                if (hasFloor) {
                    const spacePair = [spacetime[t - 1], spacetime[t]];
                    if (t > space.length / 2) {
                        if (hashMap.contains(spacePair, margin, true)) {
                            cycledAt = t;
                            console.log("cycledAt", cycledAt);
                            abortCountdown = 100;
                        }
                    }
                }
                if (t === space.length * 4 || t === space.length * 8) {
                    if (hasBlackFloorAtTime(spacetime, t)) {
                        hasFloor = true;
                        console.log("hasFloor");
                    }
                }
                return false;
            }
        });
        // code++;
        tried++;
        localTried++;
        if (cycledAt < 0) {
            takeThis = true;
            render(spacetime, canvasCtx, colors);
        }
        if (localTried > 150) {
            return;
        }
    } while (!takeThis);
    found++;
    console.log(triedCode, tried, found, found / triedCode, found / tried);
}
window.addEventListener("keypress", ev => {
    switch (ev.code) {
        case "KeyR":
            doit();
            break;
    }
});
// doit();
let spacetime = undefined;
let random = undefined;
let fullRule = undefined;
function generateFirstPage({ stateCount, timeSize, spaceSize, randomSeed, startFill, bordersFill, }) {
    if (!spacetime
        || spacetime.length !== timeSize
        || spacetime[0].length !== spaceSize) {
        spacetime = Array.from({ length: timeSize }, () => Array.from({ length: spaceSize }));
    }
    const r = random = new ParkMiller(randomSeed);
    const getRandomState = () => r.integer() % fullRule.stateCount;
    const ruleSpace = new SymRuleSpace(stateCount);
    const rule = ruleSpace.createRandomRule();
    fullRule = new Rule(stateCount, rule.getFullTable());
    console.log("rule space code", rule.code, "of", ruleSpace.size);
    console.log(getNumberFromDigits(fullRule.table, stateCount), fullRule.table.join(""));
    startSpacetime(spacetime, getRandomState, fullRule, startFill);
    fillStartedSpacetime(spacetime, getRandomState, fullRule, bordersFill);
    render(spacetime, canvasCtx, colors);
}
function generateNextPage({ timeSize, bordersFill, }) {
    const getRandomState = () => random.integer() % fullRule.stateCount;
    spacetime.unshift(spacetime.pop());
    spacetime.unshift(spacetime.pop());
    fillStartedSpacetime(spacetime, getRandomState, fullRule, bordersFill);
    render(spacetime, canvasCtx, colors);
}
const gui = new MyTweakpane();
gui.addInput(inputArgs, "timeSize");
gui.addInput(inputArgs, "spaceSize");
gui.addInput(inputArgs, "startFill", {
    options: {
        "zeros": "zeros",
        "random": "random",
    }
});
gui.addInput(inputArgs, "bordersFill", {
    options: {
        "zeros": "zeros",
        "random": "random",
        "cycle": "cycle",
    }
});
gui.addInput(inputArgs, "randomSeed");
gui.addButton({
    title: "Generate",
}).on("click", () => {
    generateFirstPage(inputArgs);
});
gui.addButton({
    title: "Generate next page",
}).on("click", () => {
    generateNextPage(inputArgs);
});
gui.addButton({
    title: "Play",
}).on("click", () => {
    window.open(`http://127.0.0.1:45245/public/index.html?code=${fullRule.code}`, "_blank");
});
//# sourceMappingURL=index.js.map