import { Spacetime } from "./Spacetime.js";
import { Rule } from "./Rule.js";
import ParkMiller from "park-miller";
export class RuleExecutionContext {
    constructor() {
        this.startFill = "random";
        this.bordersFill = "cycle";
        this.spacetime = new Spacetime(500, 800);
        this.ruleStateCount = 3;
        this.random = new ParkMiller(4242);
        this.rule = new Rule(this.ruleStateCount, 31245n);
        this.fillStart();
    }
    setRule(table) {
        this.rule = new Rule(this.ruleStateCount, table);
        this.fillStart();
    }
    fillStart() {
        const { random, rule, spacetime } = this;
        const t = spacetime.timeSize - 1 + spacetime.timeOffset;
        const prevSpace = spacetime.getSpaceAtTime(t - 1);
        const space = spacetime.getSpaceAtTime(t);
        for (let i = 0; i < this.spacetime.spaceSize; i++) {
            switch (this.startFill) {
                case "random":
                    prevSpace[i] = random.integerInRange(0, rule.stateCount - 1);
                    space[i] = random.integerInRange(0, rule.stateCount - 1);
                    break;
                case "zeros":
                    prevSpace[i] = 0;
                    space[i] = 0;
                    break;
                case "skip":
                    break;
            }
        }
    }
    update() {
        const { random, rule, spacetime } = this;
        spacetime.performStep();
        const nr = rule.spaceNeighbourhoodRadius;
        const t = this.spacetime.timeSize - 1 + this.spacetime.timeOffset;
        const space = rule.fillSpace(spacetime, t);
        for (let x = 0; x < nr; x++) {
            switch (this.bordersFill) {
                case "random":
                    space[x] =
                        random.integerInRange(0, rule.stateCount - 1);
                    space[-x + space.length - 1] =
                        random.integerInRange(0, rule.stateCount - 1);
                    break;
                case "zeros":
                    space[x] = 0;
                    space[-x + space.length - 1] = 0;
                    break;
                case "cycle":
                    space[x] = space[-(x + nr) + space.length - 1];
                    space[-x + space.length - 1] = space[x + nr];
                    break;
            }
        }
    }
}
//# sourceMappingURL=RuleExecutionContext.js.map