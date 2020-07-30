import { Rule } from "./Rule.js";
import { getNumberFromDigits, getDigitsFromNumber } from "../utils/misc.js";
import { SymRuleSpace, SymRule } from "./SymRule.js";

export function createRandomRevSymTable(stateCount: number) {
    const variations = variationMap[stateCount];
    const symStateCount = 1 + SymRuleSpace.symmetryMap[stateCount - 1][stateCount - 1];
    return Array.from(
        { length: stateCount * symStateCount },
        () => Math.floor(Math.random() * variations.length)
    );
}

export function createEmptyRevSymTable(stateCount: number) {
    const symStateCount = 1 + SymRuleSpace.symmetryMap[stateCount - 1][stateCount - 1];
    return Array.from({ length: stateCount * symStateCount }) as number[];
}

export function createRevSymTable(code: bigint, stateCount: number) {
    return getDigitsFromNumber(
        code, 
        variationMap[stateCount].length, 
        createEmptyRevSymTable(stateCount));
}
export function createRandomZcRevSymTable(stateCount: number) {
    const symStateCount = 1 + SymRuleSpace.symmetryMap[stateCount - 1][stateCount - 1];
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


export function revSymToSym(revSymTable: number[], stateCount: number) {
    const symRuleSpace = new SymRuleSpace(stateCount);
    const symStateCount = symRuleSpace.symStateCount;
    const variations = variationMap[stateCount];

    const symTable = symRuleSpace.createEmptyTable();
        
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
    const symStateCount = 1 + SymRuleSpace.symmetryMap[stateCount - 1][stateCount - 1];
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
    symStateCount = 1 + SymRuleSpace.symmetryMap[this.stateCount - 1][this.stateCount - 1];
    size = BigInt(this.variations.length) ** BigInt(this.stateCount * this.symStateCount);

    generateRandomRule() {
        const { stateCount, variations } = this;
        
        const revSymTable = createRandomRevSymTable(stateCount);
        const symRule = new SymRule(
            new SymRuleSpace(stateCount),
            revSymToSym(revSymTable, stateCount));
        const table = symRule.getFullTable();

        return new (class extends Rule {
            ruleSpaceCode = getNumberFromDigits(revSymTable, variations.length);
        })(stateCount, table);
    }
}