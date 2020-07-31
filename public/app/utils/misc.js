export function tap(x, ...fns) {
    for (const fn of fns) {
        fn(x);
    }
    return x;
}
export function getRandomElement(array, getRandomFloat = Math.random) {
    return array[Math.floor(getRandomFloat() * array.length)];
}
export function setTimeoutAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function getDigitsFromNumber(n, base, digits) {
    const basen = BigInt(base);
    for (let x = digits.length - 1; x >= 0; x--) {
        digits[x] = Number(n % basen);
        n = n / basen;
    }
    return digits;
}
export function getDigitsFromNumberReversed(n, base, digits) {
    const basen = BigInt(base);
    for (let x = 0; x < digits.length; x++) {
        digits[x] = Number(n % basen);
        n = n / basen;
    }
    return digits;
}
export function getNumberFromDigits(digits, base) {
    const basen = BigInt(base);
    let n = 0n;
    for (let x = 0; x < digits.length; x++) {
        n *= basen;
        n += BigInt(digits[x]);
    }
    return n;
}
export function getNumberFromDigitsReversed(digits, base) {
    const basen = BigInt(base);
    let n = 0n;
    for (let x = digits.length - 1; x >= 0; x--) {
        n *= basen;
        n += BigInt(digits[x]);
    }
    return n;
}
//# sourceMappingURL=misc.js.map