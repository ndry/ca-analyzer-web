import Tweakpane from "tweakpane";
export function addOutput(target, name, getter) {
    const model = {
        get [name]() { return getter(); },
        set [name](_) { },
    };
    const input = target.addInput(model, name);
    const inputEl = input.controller.view
        .element.lastChild?.firstChild?.firstChild;
    inputEl.disabled = true;
    return input;
}
export class MyTweakpane extends Tweakpane {
    addOutput(name, getter) {
        addOutput(this, name, getter);
    }
}
//# sourceMappingURL=MyTweakpane.js.map