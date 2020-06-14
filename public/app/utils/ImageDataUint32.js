export class ImageDataUint32 extends ImageData {
    constructor(imageData) {
        super(imageData.data, imageData.width, imageData.height);
        this.dataUint32 = new Uint32Array(this.data.buffer);
    }
    setPixel(x, y, abgr) {
        this.dataUint32[y * this.width + x] = abgr;
    }
}
//# sourceMappingURL=ImageDataUint32.js.map