import { SymRuleSpace, SymRule } from "./SymRule.js";
import { getNumberFromDigits } from "../utils/misc.js";
export class NtSymRuleSpace {
    constructor(stateCount) {
        this.stateCount = stateCount;
        this.symRuleSpace = new SymRuleSpace(this.stateCount);
        this.sizePower = this.stateCount * this.symRuleSpace.symStateCount;
        this.size = BigInt(this.stateCount) ** BigInt(this.sizePower);
    }
    createRandomTable() {
        return Array.from({ length: this.sizePower }, () => Math.floor(Math.random() * this.stateCount));
    }
    createEmptyTable() {
        return Array.from({ length: this.sizePower });
    }
    createRandomRule() {
        return new NtSymRule(this, this.createRandomTable());
    }
}
export class NtSymRule {
    constructor(ruleSpace, table) {
        this.ruleSpace = ruleSpace;
        this.table = table;
        this.stateCount = this.ruleSpace.stateCount;
        this.code = getNumberFromDigits(this.table, this.stateCount);
    }
    getSymTable() {
        const stateCount = this.stateCount;
        const symStateCount = this.ruleSpace.symRuleSpace.symStateCount;
        const ntSymTable = this.table;
        const symTable = this.ruleSpace.symRuleSpace.createEmptyTable();
        for (let n = 0; n < symStateCount; n++) {
            for (let c = 0; c < stateCount; c++) {
                let combinedNtSymState = 0;
                combinedNtSymState = combinedNtSymState * symStateCount + n;
                combinedNtSymState = combinedNtSymState * stateCount + c;
                for (let pc = 0; pc < stateCount; pc++) {
                    let combinedSymState = 0;
                    combinedSymState = combinedSymState * symStateCount + n;
                    combinedSymState = combinedSymState * stateCount + c;
                    combinedSymState = combinedSymState * stateCount + pc;
                    symTable[combinedSymState] = ntSymTable[combinedNtSymState];
                }
            }
        }
        return symTable;
    }
    getSymRule() {
        return new SymRule(this.ruleSpace.symRuleSpace, this.getSymTable());
    }
}
//# sourceMappingURL=NtSymRule.js.map