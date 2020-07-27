import { SpacetimeView } from "./SpacetimeView.js";
import { FpsMeter } from "./FpsMeter.js";
import { tap } from "./utils/misc.js";
import { MyTweakpane } from "./utils/MyTweakpane.js";
import { RuleExecutionContext } from "./RuleExecutionContext.js";
import { Rule } from "./Rule.js";
export class Application {
    constructor() {
        this.targetUps = 100;
        this.ruleExecuitonContext = new RuleExecutionContext();
        this.fpsMeter = new FpsMeter();
        this.upsMeter = new FpsMeter();
        this.spacetimeView = new SpacetimeView(this.ruleExecuitonContext.spacetime);
        this.gui = tap(new MyTweakpane({
            title: "Expand/Collapse"
        }), gui => {
            const fpstext = (fps) => fps?.toFixed(2) ?? "n/a";
            const renderFpsMeterText = (fpsMeter) => `${fpstext(fpsMeter.fpsHistorical)} (${fpstext(fpsMeter.fps)})`;
            gui.addOutput("fps", () => renderFpsMeterText(this.fpsMeter));
            gui.addOutput("ups", () => renderFpsMeterText(this.upsMeter));
            gui.addOutput("step", () => this.ruleExecuitonContext.spacetime.timeOffset.toString());
            gui.addOutput("ruleCode", () => this.ruleExecuitonContext.rule.code.toString());
            gui.addOutput("ruleTable", () => this.ruleExecuitonContext.rule.tableDesc);
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
        window.addEventListener("keypress", ev => {
            console.log(ev.key);
            if (ev.key === "r") {
                const stateCount = this.ruleExecuitonContext.ruleStateCount;
                const table = Array.from({ length: Rule.getRuleSpaceSizePower(stateCount) }, () => Math.floor(Math.random() * stateCount));
                this.setRule(table);
            }
        });
    }
    update(time) {
        this.upsMeter.update(time);
        this.ruleExecuitonContext.update();
    }
    render(time) {
        this.fpsMeter.update(time);
        this.gui.refresh();
        this.spacetimeView.render();
    }
    setRule(table) {
        this.ruleExecuitonContext.setRule(table);
    }
    run() {
        let lastUpdateTime = undefined;
        const requestAnimationFrameCallback = (time) => {
            if ("undefined" !== typeof lastUpdateTime) {
                while (lastUpdateTime < time) {
                    this.update(lastUpdateTime);
                    lastUpdateTime += 1000 / this.targetUps;
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