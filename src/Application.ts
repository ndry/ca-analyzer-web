import { SpacetimeView } from "./SpacetimeView.js";
import { FpsMeter } from "./utils/FpsMeter.js";
import { tap } from "./utils/misc.js";
import { MyTweakpane } from "./utils/MyTweakpane.js";
import { RuleExecutionContext } from "./RuleExecutionContext.js";
import { Rule } from "./Rule.js";

export class Application {
    targetUps = 100;
    ruleExecuitonContext = new RuleExecutionContext();
    fpsMeter = new FpsMeter();
    upsMeter = new FpsMeter();
    
    update(time: number) {
        this.upsMeter.update(time);
        this.ruleExecuitonContext.update();
    }

    render(time: number) {
        this.fpsMeter.update(time);
        this.gui.refresh();
        this.spacetimeView.render();
    }
    
    spacetimeView = new SpacetimeView(this.ruleExecuitonContext.spacetime);

    setRule(table: number[]) {
        this.ruleExecuitonContext.setRule(table);
    }

    run() {
        let lastUpdateTime: number | undefined = undefined;
        const requestAnimationFrameCallback = (time: number) => {
            if ("undefined" !== typeof lastUpdateTime) {
                while (lastUpdateTime < time) {
                    this.update(lastUpdateTime);
                    lastUpdateTime += 1000 / this.targetUps;
                }
            } else {
                lastUpdateTime = time;
            }
            this.render(time);
            requestAnimationFrame(requestAnimationFrameCallback);
        }

        requestAnimationFrame(requestAnimationFrameCallback);
    }

    gui = tap(new MyTweakpane({
        title: "Expand/Collapse"
    }), gui => {
        const fpstext = (fps: number | undefined) => fps?.toFixed(2) ?? "n/a";
        const renderFpsMeterText = (fpsMeter: FpsMeter) => 
            `${fpstext(fpsMeter.fpsHistorical)} (${fpstext(fpsMeter.fps)})`;

        gui.addOutput("fps", () => renderFpsMeterText(this.fpsMeter));
        gui.addOutput("ups", () => renderFpsMeterText(this.upsMeter));
        gui.addOutput("step", () => 
            this.ruleExecuitonContext.spacetime.timeOffset.toString());
        gui.addOutput("ruleCode", () => 
            this.ruleExecuitonContext.rule.code.toString());
        gui.addOutput("ruleTable", () => 
            this.ruleExecuitonContext.rule.tableDesc);
        gui.addInput(this, "targetUps");
        gui.addInput(this.ruleExecuitonContext, "bordersFill", {
            options: {
                "random": "random",
                "zeros": "zeros",
                "cycle": "cycle",
            }
        });
        gui.addInput(this.ruleExecuitonContext, "startFill", {
            options: {
                "random": "random",
                "zeros": "zeros",
                "skip": "skip",
            }
        });
    });

    constructor() {
        window.addEventListener("keypress", ev => {
            console.log(ev.key);
            if (ev.key === "r") {
                const stateCount = this.ruleExecuitonContext.ruleStateCount;
                const table: number[] = Array.from(
                    { length: Rule.getRuleSpaceSizePower(stateCount) },
                    () => Math.floor(Math.random() * stateCount));
                this.setRule(table);
            }
        });
    }
}
