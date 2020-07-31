import { getNumberFromDigits, getDigitsFromNumber, getDigitsFromNumberReversed, getNumberFromDigitsReversed } from "../utils/misc.js";

export class WolframTotalisticRuleSpace {
    constructor(
        public stateCount: number,
    ) {
    }

    sizePower = 
        (this.stateCount - 1) * 3 + 1;
    size = 
        BigInt(this.stateCount) ** BigInt(this.sizePower);

    createRandomTable() {
        return Array.from(
            { length: this.sizePower },
            () => Math.floor(Math.random() * this.stateCount)
        );
    }

    createEmptyTable() {
        return Array.from({ length: this.sizePower }) as number[];
    }

    createRandomRule() {
        return new WolframTotalisticRule(this, this.createRandomTable());
    }

    createTable(code: bigint) {
        return getDigitsFromNumberReversed(
            code, this.stateCount, this.createEmptyTable());
    }

    createRule(code: bigint) {
        return new WolframTotalisticRule(this, this.createTable(code));
    }
}

export class WolframTotalisticRule {
    constructor(
        public ruleSpace: WolframTotalisticRuleSpace,
        public table: number[]) {
    }

    stateCount = this.ruleSpace.stateCount;
    code = getNumberFromDigitsReversed(this.table, this.stateCount);

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

    getCombiledState(n1: number, c: number, n2: number, pc: number) {
        return n1 + c + n2;
    }

    getCombinedFullState(n1: number, c: number, n2: number, pc: number) {
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

        const table: number[] = Array.from({ length: stateCount ** 4 });

        for (const { n1, c, n2, pc } of this.iterateStates()) {
            table[this.getCombinedFullState(n1, c, n2, pc)] = 
                wtTable[this.getCombiledState(n1, c, n2, pc)];
        }

        return table;
    }
}
