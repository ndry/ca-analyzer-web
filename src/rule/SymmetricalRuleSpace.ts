import { Rule } from "./Rule.js";
import { getNumberFromDigits, getDigitsFromNumber } from "../utils/misc.js";

export const symmetryMap = [
    [0, 1, 3, 6, 10],
    [1, 2, 4, 7, 11],
    [3, 4, 5, 8, 12],
    [6, 7, 8, 9, 13],
    [10, 11, 12, 13, 14],
];

export function createRandomSymTable(stateCount: number) {
    const symStateCount = 1 + symmetryMap[stateCount - 1][stateCount - 1];
    const sizePower = (stateCount ** 2) * symStateCount;
    return Array.from(
        { length: sizePower },
        () => Math.floor(Math.random() * stateCount)
    );
}

export function createEmptySymTable(stateCount: number) {
    const symStateCount = 1 + symmetryMap[stateCount - 1][stateCount - 1];
    const sizePower = (stateCount ** 2) * symStateCount;
    return Array.from({ length: sizePower }) as number[];
}

export function createRandomRevSymTable(stateCount: number) {
    const variations = variationMap[stateCount];
    const symStateCount = 1 + symmetryMap[stateCount - 1][stateCount - 1];
    return Array.from(
        { length: stateCount * symStateCount },
        () => Math.floor(Math.random() * variations.length)
    );
}

export function createEmptyRevSymTable(stateCount: number) {
    const symStateCount = 1 + symmetryMap[stateCount - 1][stateCount - 1];
    return Array.from({ length: stateCount * symStateCount }) as number[];
}

export function createRevSymTable(code: bigint, stateCount: number) {
    return getDigitsFromNumber(
        code, 
        variationMap[stateCount].length, 
        createEmptyRevSymTable(stateCount));
}
export function createRandomZcRevSymTable(stateCount: number) {
    const symStateCount = 1 + symmetryMap[stateCount - 1][stateCount - 1];
    const variations = variationMap[stateCount];
    const zcVariations = variations
        .map((v, i) => ({v, i}))
        .filter(vi => vi.v[0] === 0);
    const table = Array.from(
        { length: stateCount * symStateCount },
        () => Math.floor(Math.random() * variations.length)
    );
    table[0] = zcVariations[Math.floor(Math.random() * zcVariations.length)].i;
    return table;
}
export function createZcRevSymTable(code: bigint, stateCount: number) {
    const variations = variationMap[stateCount];
    const zcVariations = variations
        .map((v, i) => ({v, i}))
        .filter(vi => vi.v[0] === 0);
    const table = getDigitsFromNumber(
        code, 
        variationMap[stateCount].length, 
        createEmptyRevSymTable(stateCount));
    table[0] = zcVariations[table[0]].i;
    return table;
}

export function symToFull(symTable: number[], stateCount: number) {
    const symStateCount = 1 + symmetryMap[stateCount - 1][stateCount - 1];

    const table: number[] = Array.from({ length: stateCount ** 4 });

    for (let n1 = 0; n1 < stateCount; n1++) {
        for (let n2 = 0; n2 < stateCount; n2++) {
            const n = symmetryMap[n1][n2];
            for (let pc = 0; pc < stateCount; pc++) {
                for (let c = 0; c < stateCount; c++) {
                    let combinedState = 0;
                    combinedState = combinedState * stateCount + n1;
                    combinedState = combinedState * stateCount + c;
                    combinedState = combinedState * stateCount + n2;
                    combinedState = combinedState * stateCount + pc;

                    let combinedSymState = 0;
                    combinedSymState = combinedSymState * symStateCount + n;
                    combinedSymState = combinedSymState * stateCount + c;
                    combinedSymState = combinedSymState * stateCount + pc;

                    table[combinedState] = symTable[combinedSymState];
                }
            }
        }
    }

    return table;
}

export function revSymToSym(revSymTable: number[], stateCount: number) {
    const symStateCount = 1 + symmetryMap[stateCount - 1][stateCount - 1];
    const variations = variationMap[stateCount];

    const symTable = createEmptySymTable(stateCount);
        
    for (let n = 0; n < symStateCount; n++) {
        for (let c = 0; c < stateCount; c++) {
            let combinedRevSymState = 0;
            combinedRevSymState = combinedRevSymState * symStateCount + n;
            combinedRevSymState = combinedRevSymState * stateCount + c;
            const variation = variations[revSymTable[combinedRevSymState]];
            for (let pc = 0; pc < stateCount; pc++) {
                const combinedSymState = combinedRevSymState * stateCount + pc;
                symTable[combinedSymState] = variation[pc];
            }
        }
    }

    return symTable;
}

export function getSymRuleSpaceSize(stateCount: number) {
    const symStateCount = 1 + symmetryMap[stateCount - 1][stateCount - 1];
    const sizePower = (stateCount ** 2) * symStateCount;
    return BigInt(stateCount) ** BigInt(sizePower);
}

export class SymmetricalRuleSpace {
    constructor(
        public readonly stateCount: number) {
    }

    symStateCount = 1 + symmetryMap[this.stateCount - 1][this.stateCount - 1];
    sizePower = (this.stateCount ** 2) * this.symStateCount;
    size = BigInt(this.stateCount) ** BigInt(this.sizePower);

    generateRandomRule() {
        const { stateCount } = this;

        const symTable = createRandomSymTable(stateCount);
        const table = symToFull(symTable, stateCount);

        return new (class extends Rule {
            ruleSpaceCode = getNumberFromDigits(symTable, this.stateCount);
        })(stateCount, table);
    }
}

export const variationMap = [
    [
        []
    ],
    [
        [0]
    ],
    [
        [0, 1], 
        [1, 0],
    ],
    [
        [0, 1, 2], [1, 0, 2], 
        [0, 2, 1], [1, 2, 0], 
        [2, 0, 1], [2, 1, 0],
    ],
    [
        [0, 1, 2, 3], [1, 0, 2, 3], [0, 2, 1, 3], [1, 2, 0, 3], [2, 0, 1, 3], [2, 1, 0, 3],
        [0, 1, 3, 2], [1, 0, 3, 2], [0, 2, 3, 1], [1, 2, 3, 0], [2, 0, 3, 1], [2, 1, 3, 0],
        [0, 3, 1, 2], [1, 3, 0, 2], [0, 3, 2, 1], [1, 3, 2, 0], [2, 3, 0, 1], [2, 3, 1, 0],
        [3, 0, 1, 2], [3, 1, 0, 2], [3, 0, 2, 1], [3, 1, 2, 0], [3, 2, 0, 1], [3, 2, 1, 0],
    ],
];


export function getRevSymRuleSpaceSize(stateCount: number) {
    const variations = variationMap[stateCount];
    const symStateCount = 1 + symmetryMap[stateCount - 1][stateCount - 1];
    const size = BigInt(variations.length) ** BigInt(stateCount * symStateCount);
    return size;
}

export function getZcRevSymRuleSpaceSize(stateCount: number) {
    return getRevSymRuleSpaceSize(stateCount) / BigInt(stateCount);
}

export class ReversibleSymmetricalRuleSpace {
    constructor(
        public readonly stateCount: number) {
    }

    variations = variationMap[this.stateCount];
    symStateCount = 1 + symmetryMap[this.stateCount - 1][this.stateCount - 1];
    size = BigInt(this.variations.length) ** BigInt(this.stateCount * this.symStateCount);

    generateRandomRule() {
        const { stateCount, variations } = this;
        
        const revSymTable = createRandomRevSymTable(stateCount);
        const table = symToFull(revSymToSym(revSymTable, stateCount), stateCount);

        return new (class extends Rule {
            ruleSpaceCode = getNumberFromDigits(revSymTable, variations.length);
        })(stateCount, table);
    }
}