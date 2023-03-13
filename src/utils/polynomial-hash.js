const DEFAULT_BASE = 37;
const DEFAULT_MODULUS = 101;

export default class PolynomialHash {
  constructor({ base = DEFAULT_BASE, modulus = DEFAULT_MODULUS } = {}) {
    this.base = base;
    this.modulus = modulus;
  }

  hash(word) {
    const charCodes = Array.from(word).map(char => this.charToNumber(char));

    let hash = 0;
    for (let charIndex = 0; charIndex < charCodes.length; charIndex += 1) {
      hash *= this.base;
      hash += charCodes[charIndex];
      hash %= this.modulus;
    }

    return hash;
  }

  roll(prevHash, prevWord, newWord) {
    let hash = prevHash;

    const prevValue = this.charToNumber(prevWord[0]);
    const newValue = this.charToNumber(newWord[newWord.length - 1]);

    let prevValueMultiplier = 1;
    for (let i = 1; i < prevWord.length; i += 1) {
      prevValueMultiplier *= this.base;
      prevValueMultiplier %= this.modulus;
    }

    hash += this.modulus;
    hash -= (prevValue * prevValueMultiplier) % this.modulus;

    hash *= this.base;
    hash += newValue;
    hash %= this.modulus;

    return hash;
  }

  charToNumber(char) {
    let charCode = !!char && char.codePointAt(0);

    const surrogate = !!char && char.codePointAt(1);
    if (surrogate !== undefined) {
      const surrogateShift = 2 ** 16;
      charCode += surrogate * surrogateShift;
    }

    return charCode;
  }
}
