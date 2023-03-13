import PolynomialHash from './polynomial-hash';

export default function rabinKarp(text, word) {
  const hasher = new PolynomialHash();

  const wordHash = hasher.hash(word);

  let prevFrame = null;
  let currentFrameHash = null;

  let count = 0;
  for (
    let charIndex = 0;
    charIndex <= text.length - word.length;
    charIndex += 1
  ) {
    const currentFrame = text.substring(charIndex, charIndex + word.length);

    if (currentFrameHash === null) {
      currentFrameHash = hasher.hash(currentFrame);
    } else {
      currentFrameHash = hasher.roll(currentFrameHash, prevFrame, currentFrame);
    }

    prevFrame = currentFrame;

    if (
      wordHash === currentFrameHash &&
      text.substr(charIndex, word.length) === word
    ) {
      count += 1;
    }
  }

  return count;
}
