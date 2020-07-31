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
    n: bigint, 
    base: number,
    digits: number[],
) {
    const basen = BigInt(base);
    for (let x = digits.length - 1; x >= 0; x--) {
        digits[x] = Number(n % basen);
        n = n / basen;
    }

    return digits;
}

export function getDigitsFromNumberReversed(
    n: bigint, 
    base: number,
    digits: number[],
) {
    const basen = BigInt(base);
    for (let x = 0; x < digits.length; x++) {
        digits[x] = Number(n % basen);
        n = n / basen;
    }

    return digits;
}

export function getNumberFromDigits(
    digits: number[],
    base: number
) {
    const basen = BigInt(base);
    let n = 0n;

    for (let x = 0; x < digits.length; x++) {
        n *= basen;
        n += BigInt(digits[x]);
    }

    return n;
}

export function getNumberFromDigitsReversed(
    digits: number[],
    base: number
) {
    const basen = BigInt(base);
    let n = 0n;

    for (let x = digits.length - 1; x >= 0; x--) {
        n *= basen;
        n += BigInt(digits[x]);
    }

    return n;
}
