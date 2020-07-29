export class FpsMeter {
    constructor() {
        this.fpsHistoricalFactor = 0.96;
        this.lastUpdate = undefined;
        this.fps = undefined;
        this.fpsHistorical = undefined;
    }
    update(time) {
        if ("undefined" !== typeof this.lastUpdate) {
            this.fps = 1000 / (time - this.lastUpdate);
            if ("undefined" === typeof this.fpsHistorical) {
                this.fpsHistorical = this.fps;
            }
            else {
                this.fpsHistorical =
                    this.fpsHistorical * this.fpsHistoricalFactor
                        + this.fps * (1 - this.fpsHistoricalFactor);
            }
        }
        this.lastUpdate = time;
    }
}
//# sourceMappingURL=FpsMeter.js.map