import { ImageDataUint32 } from "./utils/ImageDataUint32.js";
export function render1(spacetime, imageData, colors) {
    const { width: w, height: h, dataUint32: idd } = imageData;
    for (let t = 0; t < spacetime.length; t++) {
        const space = spacetime[t];
        if (!space) {
            for (let x = 0; x < h; x++) {
                idd[x * w + t] = 0xFF101010;
            }
        }
        else {
            for (let x = 0; x < space.length; x++) {
                idd[x * w + t] = colors[space[x]];
            }
        }
    }
}
export function render(spacetime, ctx, colors) {
    const timeSize = spacetime.length;
    const spaceSize = spacetime[0].length;
    ctx.canvas.width = timeSize;
    ctx.canvas.height = spaceSize;
    const imageData = new ImageDataUint32(ctx.createImageData(ctx.canvas.width, ctx.canvas.height));
    render1(spacetime, imageData, colors);
    ctx.putImageData(imageData, 0, 0);
}
//# sourceMappingURL=render.js.map