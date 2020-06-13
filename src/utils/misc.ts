export function tap<T>(
    x: T,
    ...fns: Array<((x: T) => void)>
): T {
    for (const fn of fns) {
        fn(x);
    }
    return x;
}

export function getRandomElement<T>(array: T[], getRandomFloat = Math.random): T {
    return array[Math.floor(getRandomFloat() * array.length)];
}

export function setTimeoutAsync(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
