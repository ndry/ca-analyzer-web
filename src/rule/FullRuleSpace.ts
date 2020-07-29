import { Rule } from "./Rule.js";
export class FullRuleSpace {
    constructor(
        public readonly stateCount: number) {
    }

    sizePower = this.stateCount ** 4;
    size = BigInt(this.stateCount) ** BigInt(this.sizePower);

    generateRandomRule() {
        const { stateCount, sizePower } = this;

        const table = Array.from(
            { length: sizePower },
            () => Math.floor(Math.random() * stateCount));

        return new (class extends Rule {
            ruleSpaceCode = this.code;
        })(stateCount, table);
    }
}
