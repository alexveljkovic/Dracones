const utils = require('./Utils');

/**
 * Base dice class, generates dice object with given number of sides
 */
class Dice {
  /**
   * Create new dice with the given number of sides
   * @param {Number} numSides - Number of sides
   */
  constructor(numSides) {
    this._valueRange = [1, numSides];
  }

  get name() {
    return `d${this._valueRange[1]}`;
  }

  /**
   * Roll dice
   * @return {Number} Rolled dice value
   */
  roll() {
    const [fromNum, toNum] = this._valueRange;
    return utils.getRandomInteger(fromNum, toNum);
  }
}

module.exports = Dice;
