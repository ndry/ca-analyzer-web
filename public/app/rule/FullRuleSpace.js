import { Rule } from "./Rule.js";
export class FullRuleSpace {
    constructor(stateCount) {
        this.stateCount = stateCount;
        this.sizePower = this.stateCount ** 4;
        this.size = BigInt(this.stateCount) ** BigInt(this.sizePower);
    }
    generateRandomRule() {
        const { stateCount, sizePower } = this;
        const table = Array.from({ length: sizePower }, () => Math.floor(Math.random() * stateCount));
        return new (class extends Rule {
            constructor() {
                super(...arguments);
                this.ruleSpaceCode = this.code;
            }
        })(stateCount, table);
    }
}
//# sourceMappingURL=FullRuleSpace.js.map