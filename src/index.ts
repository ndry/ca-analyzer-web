// import {Application} from "./Application.js";

// const app = new Application();
// if (env.debug) {
//     Object.assign(window, {
//         app
//     });
// }
// app.run();

import "./utils/dragPage.js";
import { generate, StartFill, BordersFill } from "./generate.js";
import { render } from "./render.js";
import { NtSymRuleSpace } from "./rule/NtSymRule.js";
import { CacheMap } from "./utils/CacheMap.js";
import { Rule } from "./rule/Rule.js";
import { getNumberFromDigits } from "./utils/misc.js";
import { MyTweakpane } from "./utils/MyTweakpane.js";


const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasCtx = canvas.getContext("2d")!;
canvasCtx.imageSmoothingEnabled = false;

const colors = [
    0xFF000000,
    0xFF00FF00,
    0xFFFF0000,
    0xFF0000FF,
    0xFFFF00FF,
];

function getSpacePairHash(spacePair: number[][], margin: number) {
    let hash = 0;
    for (let x = margin; x < spacePair[0].length - margin; x++) {
        hash += spacePair[0][x] + spacePair[1][x];
    }
    return hash;
}
function getSpacePairEquals(
    spacePair1: number[][], 
    spacePair2: number[][], 
    margin: number
) {
    for (let x = margin; x < spacePair1[0].length - margin; x++) {
        if (spacePair2[0][x] !== spacePair1[0][x] 
            || spacePair2[1][x] !== spacePair1[1][x]) {
            return false;
        }
    }
    return true;
}

export class SpacePairHashSet extends CacheMap<number, Set<number[][]>> {
    constructor(
    ) {
        super(() => new Set<number[][]>());
    }

    public add(spacePair: number[][], margin: number) {
        this.contains(spacePair, margin, true);
    }

    public contains(spacePair: number[][], margin: number, add = false) {
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


export function hasBlackFloorAtTime(
    spacetime: number[][],
    t: number,
) {
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
        } else {
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

function getBorderFriendness(fullTable: number[], stateCount: number) {
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

const inputArgs: {
    stateCount: number,
    timeSize: number,
    spaceSize: number,
    startFill: StartFill,
    bordersFill: BordersFill,
    randomSeed: number,
} = {
    stateCount: 3,
    timeSize: 8000,
    spaceSize: 800,
    startFill: "zeros",
    bordersFill: "random",
    randomSeed: 4242,
}

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
        const ruleSpace = new NtSymRuleSpace(stateCount);
        const rule = ruleSpace.createRandomRule();
        code = rule.code;
        const fullRule = new Rule(stateCount, rule.getSymRule().getFullTable());
        console.log(
            "rule space code", 
            rule.code, 
            "of",
            ruleSpace.size);
        console.log(getNumberFromDigits(fullRule.table, stateCount), fullRule.table.join(""));
        // console.log("revSymTable", revSymTable.join("")); 
        triedCode++;
            localTriedCode++;
        const bf = getBorderFriendness(fullRule.table, stateCount);
        if (bf < 1 || fullRule.table[0] !== 0) {
            if (localTriedCode > 1000) {
                return;
            } else {
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
            analyze(spacetime: number[][], t: number) {
                if (abortCountdown == 0) {
                    return true;
                } else if (abortCountdown > 0) {
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

function doitOnceAndLight() {
    const stateCount = inputArgs.stateCount;
    const ruleSpace = new NtSymRuleSpace(stateCount);
    const rule = ruleSpace.createRandomRule();
    code = rule.code;
    const fullRule = new Rule(stateCount, rule.getSymRule().getFullTable());
    console.log(
        "rule space code", 
        rule.code, 
        "of",
        ruleSpace.size);
    console.log(getNumberFromDigits(fullRule.table, stateCount), fullRule.table.join(""));
    const spacetime = generate({
        timeSize: inputArgs.timeSize,
        spaceSize: inputArgs.spaceSize,
        rule: fullRule,
        startFill: inputArgs.startFill,
        bordersFill: inputArgs.bordersFill,
        randomSeed: inputArgs.randomSeed,
    });
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
    doitOnceAndLight();
});
gui.addButton({
    title: "Play",
}).on("click", () => {
    window.open(
        `http://127.0.0.1:45245/public/index.html?code=${code}`, 
        "_blank");
});