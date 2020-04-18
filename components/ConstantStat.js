const utils = require('./Utils');

// TODO: Validation

class ConstantStat {
  constructor(statData) {
    Object.assign(this, utils.prefixFields(statData, '_'));
  }

  get type() {
    return 'Constant';
  }

  get group() {
    return this._group;
  }

  applyToCharacter(character, baseValue = 0) {
    // eslint-disable-next-line no-param-reassign
    character._stats[this.name] = {
      baseValue,
      stat: this,
      influences: [],
    };
  }

  get name() {
    return this._name;
  }

  getModifier() {
    return null;
  }

  value(character) {
    if (character._stats[this.name].baseValue != null) {
      return character._stats[this.name].baseValue;
    }
    throw Error(`Unset baseValue for stat ${this.name}`);
  }
}

module.exports = ConstantStat;
