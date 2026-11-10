const IBAN_LENGTHS: Record<string, number> = {
    HU: 28,
    DE: 22,
    AT: 20,
    FR: 27,
    GB: 22,
    IT: 27,
    ES: 24,
    CH: 21,
    NL: 18,
    BE: 16,
    PL: 28,
    RO: 24,
    SK: 24,
    CZ: 24,
    HR: 21,
    SI: 19,
    NO: 15,
    SE: 24,
    DK: 18,
    FI: 18,
    PT: 25,
    IE: 22,
    GR: 27,
    LU: 20,
};

const checkValidIban = (iban: string): boolean => {
    const cleaned = iban.replace(/\s+/g, '').toUpperCase();

    const baseRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;
    if (!baseRegex.test(cleaned)) {
        return false;
    }

    const countryCode = cleaned.slice(0, 2);
    //console.log(`Country code: ${countryCode}`);
    const expectedLength = IBAN_LENGTHS[countryCode];
    /*
    console.log(
        `Expected length: ${expectedLength}, Actual length: ${cleaned.length}`
    );
    */

    if (expectedLength && cleaned.length !== expectedLength) {
        return false;
    }

    const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);

    //console.log(`Rearranged IBAN: ${rearranged}`);

    const numericString = rearranged
        .split('')
        .map((char) => {
            const code = char.charCodeAt(0);
            return code >= 65 && code <= 90 ? (code - 55).toString() : char;
        })
        .join('');

    //console.log(`Numeric string: ${numericString}`);

    return BigInt(numericString) % 97n === 1n;
};

export default checkValidIban;
