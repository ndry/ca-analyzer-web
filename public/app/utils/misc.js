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
    for (let x = digits.length - 1; x >= 0; x--) {
        n = (n - (digits[x] = n % base)) / base;
    }
    return digits;
}
export function getNumberFromDigits(digits, base) {
    let n = 0;
    for (let x = 0; x < digits.length; x++) {
        n *= base;
        n += digits[x];
    }
    return n;
}
//# sourceMappingURL=misc.js.map