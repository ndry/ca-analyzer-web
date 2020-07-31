import { getNumberFromDigits } from "../utils/misc.js";
export class WolframTotalisticRuleSpace {
    constructor(stateCount) {
        this.stateCount = stateCount;
        this.sizePower = (this.stateCount - 1) * 3;
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
}
export class WolframTotalisticRule {
    constructor(ruleSpace, table) {
        this.ruleSpace = ruleSpace;
        this.table = table;
        this.stateCount = this.ruleSpace.stateCount;
        this.code = getNumberFromDigits(this.table.reverse(), this.stateCount);
    }
    getFullTable() {
        const stateCount = this.stateCount;
        const wtTable = this.table;
        const table = Array.from({ length: stateCount ** 4 });
        for (let n1 = 0; n1 < stateCount; n1++) {
            for (let n2 = 0; n2 < stateCount; n2++) {
                for (let c = 0; c < stateCount; c++) {
                    const combinedWtState = n1 + c + n2;
                    for (let pc = 0; pc < stateCount; pc++) {
                        let combinedState = 0;
                        combinedState = combinedState * stateCount + n1;
                        combinedState = combinedState * stateCount + c;
                        combinedState = combinedState * stateCount + n2;
                        combinedState = combinedState * stateCount + pc;
                        table[combinedState] = wtTable[combinedWtState];
                    }
                }
            }
        }
        return table;
    }
}
//# sourceMappingURL=WolframTotaliscticRule.js.map