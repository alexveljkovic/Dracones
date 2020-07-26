const Joi = require('@hapi/joi');
const BaseStat = require('./BaseStat');
const StatOperator = require('./StatOperator');
const utils = require('./Utils');

/**
 * Stat schema
 */
const statSchema = Joi.object().keys({
  name: Joi.string().required().trim().error(() => new Error('Missing or invalid stat name')),
  modifiers: Joi.array().optional().error(() => Error('Invalid stat modifiers')),
  dependencies: Joi.array().optional().error(() => new Error('Invalid stat dependencies')),
  group: Joi.string().optional().error(() => new Error('Invalid stat category')),
});

class Stat {
  constructor(statData) {
    utils.validateObject(statSchema, statData);
    Object.assign(this, utils.prefixFields(statData, '_'));
  }

  get type() {
    return 'Stat';
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

  // eslint-disable-next-line class-methods-use-this
  getModifier() {
    return null;
  }

  value(character) {
    return this._dependencies.reduce(
      (total, current) => (total + current.value(character)
      ),
      0,
    ) + character.getStatInfluences(this.name);
  }
}

module.exports = Stat;
