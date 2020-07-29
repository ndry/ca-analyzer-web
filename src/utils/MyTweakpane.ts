import Tweakpane from "tweakpane";

export function  addOutput(
    target: Tweakpane | ReturnType<Tweakpane["addFolder"]>, 
    name: string, 
    getter: () => string
) {
    const model = {
        get [name]() { return getter(); },
        set [name](_: string) { /* */ },
    }
    const input = target.addInput(model, name);
    const inputEl = input.controller.view
        .element.lastChild?.firstChild?.firstChild;
    (inputEl as HTMLInputElement).disabled = true;
    return input;
}

export class MyTweakpane extends Tweakpane {
    addOutput(name: string, getter: () => string) {
        addOutput(this, name, getter);
    }
}
