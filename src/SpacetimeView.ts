import {tap} from "./utils/misc.js";
import {ImageDataUint32} from "./utils/ImageDataUint32.js";
import { Spacetime } from "./Spacetime.js";

export class SpacetimeView {
    constructor(
        public spacetime: Spacetime,
    ) {
    }

    canvas = tap(
        document.getElementById("canvas") as HTMLCanvasElement,
        c => {
            c.width = this.spacetime.timeSize;
            c.height = this.spacetime.spaceSize;
        });
    ctx = tap(
        this.canvas.getContext("2d")!,
        ctx => {
            ctx.imageSmoothingEnabled = false;
        });
    imageData = new ImageDataUint32(
        this.ctx.createImageData(
            this.spacetime.timeSize,
            this.spacetime.spaceSize));

    getCellColor(cell: number) {
        if (cell == 0) {
            return 0xFF000000;
        } 
        const lumInt = Math.floor(0.5 * cell * 0x7F);
        return 0xFF808080 + lumInt - (lumInt << 8) - (lumInt << 16);
    }

    render() {
        const w = this.imageData.width;
        const idd = this.imageData.dataUint32;
        for (let t = 0; t < this.spacetime.timeSize; t++) {
            const space = this.spacetime.getSpaceAtTime(t + this.spacetime.timeOffset);
            for (let x = 0; x < space.length; x++) {
                idd[x * w + t] = this.getCellColor(space[x]);
            }
        }
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}
