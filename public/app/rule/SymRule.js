import { getNumberFromDigits } from "../utils/misc.js";
let SymRuleSpace = /** @class */ (() => {
    class SymRuleSpace {
        constructor(stateCount) {
            this.stateCount = stateCount;
            this.symmetryMap = SymRuleSpace.symmetryMap;
            this.symStateCount = 1 + this.symmetryMap[this.stateCount - 1][this.stateCount - 1];
            this.sizePower = (this.stateCount ** 2) * this.symStateCount;
            this.size = BigInt(this.stateCount) ** BigInt(this.sizePower);
        }
        createRandomTable() {
            return Array.from({ length: this.sizePower }, () => Math.floor(Math.random() * this.stateCount));
        }
        createEmptyTable() {
            return Array.from({ length: this.sizePower });
        }
        createRandomRule() {
            return new SymRule(this, this.createRandomTable());
        }
    }
    SymRuleSpace.symmetryMap = [
        [0, 1, 3, 6, 10],
        [1, 2, 4, 7, 11],
        [3, 4, 5, 8, 12],
        [6, 7, 8, 9, 13],
        [10, 11, 12, 13, 14],
    ];
    return SymRuleSpace;
})();
export { SymRuleSpace };
export class SymRule {
    constructor(ruleSpace, table) {
        this.ruleSpace = ruleSpace;
        this.table = table;
        this.stateCount = this.ruleSpace.stateCount;
        this.code = getNumberFromDigits(this.table, this.stateCount);
    }
    getFullTable() {
        const stateCount = this.stateCount;
        const symmetryMap = this.ruleSpace.symmetryMap;
        const symStateCount = this.ruleSpace.symStateCount;
        const symTable = this.table;
        const table = Array.from({ length: stateCount ** 4 });
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
}
//# sourceMappingURL=SymRule.js.map