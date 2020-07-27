import Tweakpane from "tweakpane";

export class MyTweakpane extends Tweakpane {
    addOutput(name: string, getter: () => string) {
        const model = {
            get [name]() { return getter(); },
            set [name](_: string) { /* */ },
        }
        const input = this.addInput(model, name);
        const inputEl = input.controller.view
            .element.lastChild?.firstChild?.firstChild;
        (inputEl as HTMLInputElement).disabled = true;
        return input;
    };
}