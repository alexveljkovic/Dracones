const Joi = require('@hapi/joi');
const utils = require('./Utils');
const StatOperator = require('./StatOperator');

// ----- Schemas -----
/**
 * BaseStat modifier schema
 */
const modifiersSchema = Joi.object().keys({
  threshold: Joi.number().integer().required().error(() => Error('Missing or invalid stat modifier threshold')),
  modifier: Joi.number().integer().required().error(() => Error('Missing or invalid stat modifier value')),
});

/**
 * BaseStat schema
 */
const statSchema = Joi.object().keys({
  name: Joi.string().required().trim().error(() => new Error('Missing or invalid stat name')),
  modifiers: Joi.array().items(modifiersSchema).required().error(() => Error()),
});
// ----- End of schemas -----

class BaseStat {
  constructor(statData) {
    // Validate stat data structure
    utils.validateObject(statSchema, statData);

    Object.assign(this, utils.prefixFields(statData, '_'));
  }

  value(character) {
    if (character._stats[this.name].baseValue != null) {
      return character._stats[this.name].baseValue
        + character._stats[this.name].influences.reduce(
          (total, current) => (total + current.value),
          0,
        );
    }
    throw Error(`Unset baseValue for stat ${this.name}`);
  }

  setValue(character, value) {
    if (character._stats[this.name].baseValue != null) {
      // eslint-disable-next-line no-param-reassign
      character._stats[this.name].baseValue = value;
    } else {
      throw Error(`Unset baseValue for stat ${this.name}`);
    }
  }

  applyToCharacter(character, baseValue = 0) {
    // eslint-disable-next-line no-param-reassign
    character._stats[this.name] = {
      baseValue,
      stat: this,
      influences: [],
    };
  }

  getModifier(character) {
    const statData = character._stats[this.name];

    if (statData == null) {
      throw Error(`Missing stat ${this.name} for character ${character.name}`);
    }

    let modifierValue = null;
    const numModifiers = this._modifiers.length;

    const value = this.value(character);

    for (let i = 0; i < numModifiers; i += 1) {
      if (value >= this._modifiers[i].threshold) {
        modifierValue = this._modifiers[i].modifier;
      }
    }

    return modifierValue;
  }

  get name() {
    return this._name;
  }
}

module.exports = BaseStat;
