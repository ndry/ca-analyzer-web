export class Spacetime {
    timeOffset = 0;

    data: Array<Array<number>>;

    constructor(
        public spaceSize = 770,
        public timeSize = 1920
    ) {
        this.data = Array.from({ length: timeSize }, () => 
            Array.from({ length: spaceSize }));
    }

    performStep() {
        this.timeOffset++;
    }

    getSpaceAtTime(t: number) {
        console.assert(t >= this.timeOffset);
        console.assert(t < this.timeOffset + this.timeSize);
        return this.data[t % this.timeSize];
    }
}
