import { Application } from "./Application.js";
const app = new Application();
if (env.debug) {
    Object.assign(window, {
        app
    });
}
app.run();
//# sourceMappingURL=index.js.map