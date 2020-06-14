import { Spacetime } from "./Spacetime.js";
import { SpacetimeView } from "./SpacetimeView.js";
import { Rule } from "./Rule.js";
import { FpsMeter } from "./FpsMeter.js";
import { getDigitsFromNumber } from "./utils/misc.js";
import ParkMiller from "park-miller";

export class Application {
    random = new ParkMiller(4242);
    spacetime = new Spacetime(500, 800);
    rule = new Rule(2, getDigitsFromNumber(31245, 2, Array.from({length: 16})));

    fpsMeter = new FpsMeter();
    upsMeter = new FpsMeter(); 
    
    update(time: number) {
        this.upsMeter.update(time);
        this.spacetime.performStep();
        this.rule.fillSpace(
            this.spacetime, 
            this.spacetime.timeSize - 1 + this.spacetime.timeOffset);
    }
    
    fpsDisplay = document.getElementById("fps") as HTMLDivElement;
    upsDisplay = document.getElementById("ups") as HTMLDivElement;
    stepDisplay = document.getElementById("step") as HTMLDivElement;
    spacetimeView = new SpacetimeView(this.spacetime);

    render(time: number) {
        this.fpsMeter.update(time);

        function renderFpsText(fps: number | undefined) {
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
        
        let lastUpdateTime: number | undefined = undefined;
        const requestAnimationFrameCallback = (time: number) => {
            if ("undefined" !== typeof lastUpdateTime) {
                while (lastUpdateTime < time) {
                    this.update(lastUpdateTime);
                    lastUpdateTime += 1000 / targetUps;
                }
            } else {
                lastUpdateTime = time;
            }
            this.render(time);
            requestAnimationFrame(requestAnimationFrameCallback);
        }

        requestAnimationFrame(requestAnimationFrameCallback);
    }
}
