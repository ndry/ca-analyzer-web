export class SymRuleSpace {
    static symmetryMap = [
        [0, 1, 3, 6, 10],
        [1, 2, 4, 7, 11],
        [3, 4, 5, 8, 12],
        [6, 7, 8, 9, 13],
        [10, 11, 12, 13, 14],
    ];

    constructor(
        public stateCount: number,
    ) {
    }

    symmetryMap = 
        SymRuleSpace.symmetryMap;
    symStateCount = 
        1 + this.symmetryMap[this.stateCount - 1][this.stateCount - 1];
    sizePower = 
        (this.stateCount ** 2) * this.symStateCount;
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
        return new SymRule(this, this.createRandomTable());
    }
}

export class SymRule {
    constructor(
        public ruleSpace: SymRuleSpace,
        public table: number[],
    ) {
    }

    stateCount = this.ruleSpace.stateCount;

    getFullTable() {
        const stateCount = this.stateCount;
        const symmetryMap = this.ruleSpace.symmetryMap;
        const symStateCount = this.ruleSpace.symStateCount;
        const symTable = this.table;
        
        const table: number[] = Array.from({ length: stateCount ** 4 });
    
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
