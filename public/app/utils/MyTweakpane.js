import Tweakpane from "tweakpane";
export class MyTweakpane extends Tweakpane {
    addOutput(name, getter) {
        const model = {
            get [name]() { return getter(); },
            set [name](_) { },
        };
        const input = this.addInput(model, name);
        const inputEl = input.controller.view
            .element.lastChild?.firstChild?.firstChild;
        inputEl.disabled = true;
        return input;
    }
    ;
}
//# sourceMappingURL=MyTweakpane.js.map