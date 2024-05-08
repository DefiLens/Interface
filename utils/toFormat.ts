export function toCurrency(amount: number) {
    const a = amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
    return a;
}

/**
 *
 * @param num Number to convert into Dollar Notation
 * @param decimals Number of decimals to round to
 * @returns Converted amounts in Dollars
 */
export function toDollarUnits(amount: number, decimals: number): string {
    if (amount >= 1000000) {
        // Millions
        return "$" + Number((amount / 1000000).toFixed(decimals)).toLocaleString("en-US") + "M";
    } else if (amount >= 1000 && amount < 1000000) {
        // Thousands
        return "$" + Number((amount / 1000).toFixed(decimals)).toLocaleString("en-US") + "K";
    }
    // under 1k
    return "$" + Number(amount.toFixed(decimals)).toLocaleString("en-US");
}

/**
 *
 * @param num Number to convert into Dollar Notation
 * @param decimals Number of decimals to round to
 * @returns Converted amounts in Dollars
 */
export function toUnits(num: number, decimals: number): string {
    if (!num) return "0";
    if (num >= 1000000) {
        return Number((num / 1000000).toFixed(decimals)).toLocaleString("en-US") + "M";
    } else if (num >= 1000 && num < 1000000) {
        return Number((num / 1000).toFixed(decimals)).toLocaleString("en-US") + "K";
    }
    return Number(num.toFixed(decimals)).toLocaleString("en-US");
}
