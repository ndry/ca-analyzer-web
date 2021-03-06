export class Spacetime {
    constructor(spaceSize, timeSize) {
        this.spaceSize = spaceSize;
        this.timeSize = timeSize;
        this.timeOffset = 0;
        this.data = Array.from({ length: timeSize }, () => Array.from({ length: spaceSize }, () => 0));
    }
    performStep() {
        this.timeOffset++;
    }
    getSpaceAtTime(t) {
        console.assert(t >= this.timeOffset);
        console.assert(t < this.timeOffset + this.timeSize);
        return this.data[t % this.timeSize];
    }
}
//# sourceMappingURL=Spacetime.js.map