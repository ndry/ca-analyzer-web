import { Rule } from "./Rule.js";
import { getNumberFromDigits, getDigitsFromNumber } from "../utils/misc.js";
import { SymRuleSpace } from "./SymRuleSpace";
export function createRandomRevSymTable(stateCount) {
    const variations = variationMap[stateCount];
    const symStateCount = 1 + SymRuleSpace.symmetryMap[stateCount - 1][stateCount - 1];
    return Array.from({ length: stateCount * symStateCount }, () => Math.floor(Math.random() * variations.length));
}
export function createEmptyRevSymTable(stateCount) {
    const symStateCount = 1 + SymRuleSpace.symmetryMap[stateCount - 1][stateCount - 1];
    return Array.from({ length: stateCount * symStateCount });
}
export function createRevSymTable(code, stateCount) {
    return getDigitsFromNumber(code, variationMap[stateCount].length, createEmptyRevSymTable(stateCount));
}
export function createRandomZcRevSymTable(stateCount) {
    const symStateCount = 1 + SymRuleSpace.symmetryMap[stateCount - 1][stateCount - 1];
    const variations = variationMap[stateCount];
    const zcVariations = variations
        .map((v, i) => ({ v, i }))
        .filter(vi => vi.v[0] === 0);
    const table = Array.from({ length: stateCount * symStateCount }, () => Math.floor(Math.random() * variations.length));
    table[0] = zcVariations[Math.floor(Math.random() * zcVariations.length)].i;
    return table;
}
export function createZcRevSymTable(code, stateCount) {
    const variations = variationMap[stateCount];
    const zcVariations = variations
        .map((v, i) => ({ v, i }))
        .filter(vi => vi.v[0] === 0);
    const table = getDigitsFromNumber(code, variationMap[stateCount].length, createEmptyRevSymTable(stateCount));
    table[0] = zcVariations[table[0]].i;
    return table;
}
export function revSymToSym(revSymTable, stateCount) {
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
export function getRevSymRuleSpaceSize(stateCount) {
    const variations = variationMap[stateCount];
    const symStateCount = 1 + SymRuleSpace.symmetryMap[stateCount - 1][stateCount - 1];
    const size = BigInt(variations.length) ** BigInt(stateCount * symStateCount);
    return size;
}
export function getZcRevSymRuleSpaceSize(stateCount) {
    return getRevSymRuleSpaceSize(stateCount) / BigInt(stateCount);
}
export class ReversibleSymmetricalRuleSpace {
    constructor(stateCount) {
        this.stateCount = stateCount;
        this.variations = variationMap[this.stateCount];
        this.symStateCount = 1 + SymRuleSpace.symmetryMap[this.stateCount - 1][this.stateCount - 1];
        this.size = BigInt(this.variations.length) ** BigInt(this.stateCount * this.symStateCount);
    }
    generateRandomRule() {
        const { stateCount, variations } = this;
        const revSymTable = createRandomRevSymTable(stateCount);
        const symRule = new SymRule(new SymRuleSpace(stateCount), revSymToSym(revSymTable, stateCount));
        const table = symRule.getFullTable();
        return new (class extends Rule {
            constructor() {
                super(...arguments);
                this.ruleSpaceCode = getNumberFromDigits(revSymTable, variations.length);
            }
        })(stateCount, table);
    }
}
//# sourceMappingURL=SymmetricalRuleSpace.js.map