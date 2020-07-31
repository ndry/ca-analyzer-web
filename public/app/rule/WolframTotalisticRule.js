import { getDigitsFromNumberReversed, getNumberFromDigitsReversed } from "../utils/misc.js";
export class WolframTotalisticRuleSpace {
    constructor(stateCount) {
        this.stateCount = stateCount;
        this.sizePower = (this.stateCount - 1) * 3 + 1;
        this.size = BigInt(this.stateCount) ** BigInt(this.sizePower);
    }
    createRandomTable() {
        return Array.from({ length: this.sizePower }, () => Math.floor(Math.random() * this.stateCount));
    }
    createEmptyTable() {
        return Array.from({ length: this.sizePower });
    }
    createRandomRule() {
        return new WolframTotalisticRule(this, this.createRandomTable());
    }
    createTable(code) {
        return getDigitsFromNumberReversed(code, this.stateCount, this.createEmptyTable());
    }
    createRule(code) {
        return new WolframTotalisticRule(this, this.createTable(code));
    }
}
export class WolframTotalisticRule {
    constructor(ruleSpace, table) {
        this.ruleSpace = ruleSpace;
        this.table = table;
        this.stateCount = this.ruleSpace.stateCount;
        this.code = getNumberFromDigitsReversed(this.table, this.stateCount);
    }
    *iterateStates() {
        const stateCount = this.stateCount;
        for (let n1 = 0; n1 < stateCount; n1++) {
            for (let n2 = 0; n2 < stateCount; n2++) {
                for (let c = 0; c < stateCount; c++) {
                    for (let pc = 0; pc < stateCount; pc++) {
                        yield { n1, c, n2, pc };
                    }
                }
            }
        }
    }
    getCombiledState(n1, c, n2, pc) {
        return n1 + c + n2;
    }
    getCombinedFullState(n1, c, n2, pc) {
        const stateCount = this.stateCount;
        let combinedState = 0;
        combinedState = combinedState * stateCount + n1;
        combinedState = combinedState * stateCount + c;
        combinedState = combinedState * stateCount + n2;
        combinedState = combinedState * stateCount + pc;
        return combinedState;
    }
    getFullTable() {
        const stateCount = this.stateCount;
        const wtTable = this.table;
        const table = Array.from({ length: stateCount ** 4 });
        for (const { n1, c, n2, pc } of this.iterateStates()) {
            table[this.getCombinedFullState(n1, c, n2, pc)] =
                wtTable[this.getCombiledState(n1, c, n2, pc)];
        }
        return table;
    }
}
//# sourceMappingURL=WolframTotalisticRule.js.map