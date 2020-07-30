import { Spacetime } from "../Spacetime.js";
import { getDigitsFromNumber, getNumberFromDigits } from "../utils/misc.js";

export class Rule {
    public static getRuleSpaceSizePower(stateCount: number) {
        return stateCount ** 4;
    }
    public static getRuleSpaceSize(stateCount: number) {
        return stateCount ** (stateCount ** 4);
    }

    public static readonly spaceNeighbourhoodRadius = 1;
    public static readonly timeNeighbourhoodRadius = 2;

    public readonly spaceNeighbourhoodRadius = Rule.spaceNeighbourhoodRadius;
    public readonly timeNeighbourhoodRadius = Rule.timeNeighbourhoodRadius;

    public readonly table: number[];
    public readonly code: bigint;

    public readonly tableDesc: string;

    constructor(
        public readonly stateCount: number,
        public readonly tableOrCode: number[] | bigint,
    ) {
        if (Array.isArray(tableOrCode)) {
            this.table = tableOrCode;
            this.code = getNumberFromDigits(this.table, stateCount);
        } else {
            this.code = tableOrCode;
            this.table = getDigitsFromNumber(
                this.code,
                this.stateCount,
                Array.from({length: Math.pow(this.stateCount, 4)}));
        }
        this.tableDesc = this.table.join("");
    }

    fillSpace3(
        space: number[],
        prevSpace: number[],
        prevPrevSpace: number[],
    ) {
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

    fillSpace(spacetime: Spacetime, t: number) {
        const space = spacetime.getSpaceAtTime(t);
        this.fillSpace3(
            space,
            spacetime.getSpaceAtTime(t - 1),
            spacetime.getSpaceAtTime(t - 2),
        );
        return space;
    }

    fillSpace2(spacetime: number[][], t: number) {
        const space = spacetime[t];
        this.fillSpace3(
            space,
            spacetime[t - 1],
            spacetime[t - 2],
        );
        return space;
    }
}
