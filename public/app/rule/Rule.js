import { getDigitsFromNumber, getNumberFromDigits } from "../utils/misc.js";
export class Rule {
    constructor(stateCount, tableOrCode) {
        this.stateCount = stateCount;
        this.tableOrCode = tableOrCode;
        this.spaceNeighbourhoodRadius = Rule.spaceNeighbourhoodRadius;
        this.timeNeighbourhoodRadius = Rule.timeNeighbourhoodRadius;
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
    fillSpace3(space, prevSpace, prevPrevSpace) {
        const nr = this.spaceNeighbourhoodRadius;
        const table = this.table;
        const stateCount = this.stateCount;
        const ss = space.length;
        let n1 = 0;
        let c = prevSpace[nr - 1];
        let n2 = prevSpace[nr];
        for (let x = nr; x < ss - nr; x++) {
            n1 = c;
            c = n2;
            n2 = prevSpace[x + 1];
            const pc = prevPrevSpace[x];
            let combinedState = 0;
            combinedState = combinedState * stateCount + n1;
            combinedState = combinedState * stateCount + c;
            combinedState = combinedState * stateCount + n2;
            combinedState = combinedState * stateCount + pc;
            space[x] = table[combinedState];
            // console.assert(table[combinedState] !== undefined);
        }
    }
    fillSpace(spacetime, t) {
        const space = spacetime.getSpaceAtTime(t);
        this.fillSpace3(space, spacetime.getSpaceAtTime(t - 1), spacetime.getSpaceAtTime(t - 2));
        return space;
    }
    fillSpace2(spacetime, t) {
        const space = spacetime[t];
        this.fillSpace3(space, spacetime[t - 1], spacetime[t - 2]);
        return space;
    }
}
Rule.spaceNeighbourhoodRadius = 1;
Rule.timeNeighbourhoodRadius = 2;
//# sourceMappingURL=Rule.js.map