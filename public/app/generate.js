import ParkMiller from "park-miller";
export function fillStart(space, fill, getRandomState) {
    for (let x = 0; x < space.length; x++) {
        switch (fill) {
            case "random":
                space[x] = getRandomState();
                break;
            case "zeros":
                space[x] = 0;
                break;
        }
    }
    return space;
}
export function fillBorders(space, fill, margin, getRandomState) {
    for (let x = 0; x < margin; x++) {
        switch (fill) {
            case "random":
                space[x] = getRandomState();
                space[-x + space.length - 1] = getRandomState();
                break;
            case "zeros":
                space[x] = 0;
                space[-x + space.length - 1] = 0;
                break;
            case "cycle":
                space[x] = space[-(x + margin) + space.length - 1];
                space[-x + space.length - 1] = space[x + margin];
                break;
        }
    }
}
let cachedSpacetime = undefined;
function getSpacetime(timeSize, spaceSize) {
    if (!cachedSpacetime
        || cachedSpacetime.length !== timeSize
        || cachedSpacetime[0].length !== spaceSize) {
        cachedSpacetime = Array.from({ length: timeSize }, () => Array.from({ length: spaceSize }));
    }
    return cachedSpacetime;
}
export function fillStartedSpacetime(spacetime, getRandomState, rule, bordersFill, analyze) {
    for (let t = rule.timeNeighbourhoodRadius; t < spacetime.length; t++) {
        const space = rule.fillSpace2(spacetime, t);
        fillBorders(space, bordersFill, rule.spaceNeighbourhoodRadius, getRandomState);
        const abortRequested = analyze?.(spacetime, t);
        if (abortRequested) {
            break;
        }
    }
}
export function startSpacetime(spacetime, getRandomState, rule, startFill) {
    for (let t = 0; t < rule.timeNeighbourhoodRadius; t++) {
        fillStart(spacetime[t], startFill, getRandomState);
    }
}
export function generateeee(spacetime, getRandomState, { rule, startFill, bordersFill, analyze, }) {
    startSpacetime(spacetime, getRandomState, rule, startFill);
    fillStartedSpacetime(spacetime, getRandomState, rule, bordersFill, analyze);
}
export function generate({ spaceSize, timeSize, rule, startFill, bordersFill, randomSeed, analyze, }) {
    const random = new ParkMiller(randomSeed);
    const getRandomState = () => random.integer() % rule.stateCount;
    const spacetime = getSpacetime(timeSize, spaceSize);
    generateeee(spacetime, getRandomState, {
        startFill,
        bordersFill,
        rule,
        analyze,
    });
    return spacetime;
}
//# sourceMappingURL=generate.js.map