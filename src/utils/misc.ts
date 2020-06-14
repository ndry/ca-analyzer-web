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

export function getDigitsFromNumber(
    n: number, 
    base: number,
    digits: number[],
) {
    for (let x = digits.length - 1; x >= 0; x--) {
        n = (n - (digits[x] = n % base)) / base;
    }

    return digits;
}

export function getNumberFromDigits(
    digits: number[],
    base: number
) {
    let n = 0;

    for (let x = 0; x < digits.length; x++) {
        n *= base;
        n += digits[x];
    }

    return n;
}
