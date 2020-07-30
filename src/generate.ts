import ParkMiller from "park-miller";
import { Rule } from "./rule/Rule.js";
import { Spacetime } from "./Spacetime.js";

export function fillStart(
    space: number[], 
    fill: "zeros" | "random",
    getRandomState: () => number,
) {
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
export type StartFill = Parameters<typeof fillStart>[1];

export function fillBorders(
    space: number[], 
    fill: "zeros" | "random" | "cycle",
    margin: number,
    getRandomState: () => number,
) {
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
export type BordersFill = Parameters<typeof fillBorders>[1];

let cachedSpacetime: number[][] | undefined = undefined;
function getSpacetime(timeSize: number, spaceSize: number) {
    if (!cachedSpacetime 
        || cachedSpacetime.length !== timeSize 
        || cachedSpacetime[0].length !== spaceSize
    ) {
        cachedSpacetime = Array.from(
            { length: timeSize }, 
            () => Array.from({ length: spaceSize }) as number[]
        );
    }
    return cachedSpacetime;
}

export function fillStartedSpacetime(
    spacetime: number[][],
    getRandomState: () => number,
    rule: Rule,
    bordersFill: BordersFill,
    analyze?: (spacetime: number[][], t: number) => boolean
) {
    for (let t = rule.timeNeighbourhoodRadius; t < spacetime.length; t++) {
        const space = rule.fillSpace2(spacetime, t);
        fillBorders(
            space, 
            bordersFill, 
            rule.spaceNeighbourhoodRadius, 
            getRandomState);
        const abortRequested = analyze?.(spacetime, t);
        if (abortRequested) {
            break;
        }
    }
}

export function startSpacetime(
    spacetime: number[][],
    getRandomState: () => number,
    rule: Rule,
    startFill: StartFill,
) {
    for (let t = 0; t < rule.timeNeighbourhoodRadius; t++) {
        fillStart(spacetime[t], startFill, getRandomState);
    }
}

export function generateeee(
    spacetime: number[][],
    getRandomState: () => number,
    {
        rule,
        startFill,
        bordersFill,
        analyze,
    }: {
        rule: Rule,
        startFill: StartFill,
        bordersFill: BordersFill,
        analyze?: (spacetime: number[][], t: number) => boolean
    },
) {
    startSpacetime(
        spacetime,
        getRandomState,
        rule,
        startFill,
    );

    fillStartedSpacetime(
        spacetime, 
        getRandomState,
        rule,
        bordersFill,
        analyze,
    );
}

export function generate({
    spaceSize,
    timeSize,
    rule,
    startFill,
    bordersFill,
    randomSeed,
    analyze,
}: {
    spaceSize: number,
    timeSize: number,
    rule: Rule,
    startFill: StartFill,
    bordersFill: BordersFill,
    randomSeed: number,
    analyze?: (spacetime: number[][], t: number) => boolean
}) {
    const random = new ParkMiller(randomSeed);
    const getRandomState = () => random.integer() % rule.stateCount;

    const spacetime = getSpacetime(timeSize, spaceSize);
    
    generateeee(spacetime, getRandomState, {
        startFill,
        bordersFill,
        rule,
        analyze,
    })

    return spacetime;
}