import { getDigitsFromNumber, getNumberFromDigits } from "./utils/misc.js";
export class Rule {
    constructor(stateCount, tableOrCode) {
        this.stateCount = stateCount;
        this.tableOrCode = tableOrCode;
        this.spaceNeighbourhoodRadius = 1;
        this.timeNeighbourhoodRadius = 2;
        if (Array.isArray(tableOrCode)) {
            this.table = tableOrCode;
            this.code = getNumberFromDigits(this.table, stateCount);
        }
        else {
            this.code = tableOrCode;
            this.table = getDigitsFromNumber(this.code, this.stateCount, Array.from({ length: Math.pow(this.stateCount, 4) }));
        }
        this.tableDesc = this.table.join("");
    }
    static getRuleSpaceSizePower(stateCount) {
        return stateCount ** 4;
    }
    static getRuleSpaceSize(stateCount) {
        return stateCount ** (stateCount ** 4);
    }
    fillSpace(spacetime, t) {
        const nr = this.spaceNeighbourhoodRadius;
        const table = this.table;
        const stateCount = this.stateCount;
        const prevSpace = spacetime.getSpaceAtTime(t - 1);
        const prevPrevSpace = spacetime.getSpaceAtTime(t - 2);
        const space = spacetime.getSpaceAtTime(t);
        const ss = space.length;
        let n1 = 0;
        let c = prevSpace[nr - 1];
        let n2 = prevSpace[nr];
        for (let x = nr; x < ss - nr; x++) {
            n1 = c;
            c = n2;
            n2 = prevSpace[x + 1];
            const pc = prevPrevSpace[x];
            let state = 0;
            state = state * stateCount + n1;
            state = state * stateCount + c;
            state = state * stateCount + n2;
            state = state * stateCount + pc;
            space[x] = table[state];
            console.assert(table[state] !== undefined);
        }
        return space;
    }
}
//# sourceMappingURL=Rule.js.map