export class Rule {
    constructor(stateCount, table) {
        this.stateCount = stateCount;
        this.table = table;
        this.spaceNeighbourhoodRadius = 1;
        this.timeNeighbourhoodRadius = 2;
        console.log(table);
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
    }
}
//# sourceMappingURL=Rule.js.map