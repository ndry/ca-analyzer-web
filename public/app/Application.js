import { Spacetime } from "./Spacetime.js";
import { SpacetimeView } from "./SpacetimeView.js";
import { Rule } from "./Rule.js";
import { FpsMeter } from "./FpsMeter.js";
import { getDigitsFromNumber } from "./utils/misc.js";
import ParkMiller from "park-miller";
export class Application {
    constructor() {
        this.random = new ParkMiller(4242);
        this.spacetime = new Spacetime(500, 800);
        this.rule = new Rule(2, getDigitsFromNumber(31245, 2, Array.from({ length: 16 })));
        this.fpsMeter = new FpsMeter();
        this.upsMeter = new FpsMeter();
        this.fpsDisplay = document.getElementById("fps");
        this.upsDisplay = document.getElementById("ups");
        this.stepDisplay = document.getElementById("step");
        this.spacetimeView = new SpacetimeView(this.spacetime);
    }
    update(time) {
        this.upsMeter.update(time);
        this.spacetime.performStep();
        this.rule.fillSpace(this.spacetime, this.spacetime.timeSize - 1 + this.spacetime.timeOffset);
    }
    render(time) {
        this.fpsMeter.update(time);
        function renderFpsText(fps) {
            return fps?.toFixed(2) ?? "n/a";
        }
        this.fpsDisplay.textContent =
            `fps: ${renderFpsText(this.fpsMeter.fpsHistorical)} (${renderFpsText(this.fpsMeter.fps)})`;
        this.upsDisplay.textContent =
            `ups: ${renderFpsText(this.upsMeter.fpsHistorical)} (${renderFpsText(this.upsMeter.fps)})`;
        this.stepDisplay.textContent =
            "step: " + this.spacetime.timeOffset;
        this.spacetimeView.render();
    }
    run() {
        const targetUps = 240;
        const prevSpace = this.spacetime.getSpaceAtTime(this.spacetime.timeOffset + this.spacetime.timeSize - 2);
        const space = this.spacetime.getSpaceAtTime(this.spacetime.timeOffset + this.spacetime.timeSize - 1);
        for (let i = 0; i < this.spacetime.spaceSize; i++) {
            prevSpace[i] = this.random.integerInRange(0, this.rule.stateCount - 1);
            space[i] = this.random.integerInRange(0, this.rule.stateCount - 1);
        }
        let lastUpdateTime = undefined;
        const requestAnimationFrameCallback = (time) => {
            if ("undefined" !== typeof lastUpdateTime) {
                while (lastUpdateTime < time) {
                    this.update(lastUpdateTime);
                    lastUpdateTime += 1000 / targetUps;
                }
            }
            else {
                lastUpdateTime = time;
            }
            this.render(time);
            requestAnimationFrame(requestAnimationFrameCallback);
        };
        requestAnimationFrame(requestAnimationFrameCallback);
    }
}
//# sourceMappingURL=Application.js.map