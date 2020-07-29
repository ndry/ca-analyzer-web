import { Rule } from "./rule/Rule.js";
export class FullRuleSpace {
    constructor(stateCount) {
        this.stateCount = stateCount;
        this.sizePower = this.stateCount ** 4;
        this.size = BigInt(this.stateCount) ** BigInt(this.sizePower);
    }
    generateRandomRule() {
        const table = Array.from({ length: this.sizePower }, () => Math.floor(Math.random() * this.stateCount));
        return new Rule(this.stateCount, table);
    }
}
//# sourceMappingURL=FullRuleSpace.js.map