const Joi = require('@hapi/joi');
const utils = require('./Utils');

// ----- Schemas -----
/**
 * Character schema
 */
const characterSchema = Joi.object().keys({
  name: Joi.string().required().trim().error(() => new Error('Missing or invalid character name')),
  stats: Joi.object().required().error(() => new Error('Missing or invalid character stats')),
});
// ----- End of schemas -----

/**
 * Base character class, generates generic character object with given parameters
 */
class Character {
  constructor(characterData, availableStats) {
    if (availableStats == null) {
      throw Error('Missing available stats');
    }

    // Validate character data structure
    utils.validateObject(characterSchema, characterData);

    const processedCharacterData = { ...characterData };
    this._stats = {};

    // Process character stats
    this.processStats(processedCharacterData.stats, availableStats);
    delete processedCharacterData.stats;

    Object.assign(this, utils.prefixFields(processedCharacterData, '_'));
  }

  processStats(characterStats, availableStats) {
    availableStats.forEach((stat) => {
      if (stat.type !== 'Operator') {
        stat.applyToCharacter(this, characterStats[stat.name]);
      }
    });
  }

  get name() {
    return this._name;
  }

  set name(name) {
    if (name != null) {
      this._name = name;
    } else {
      throw Error('Invalid name');
    }
  }

  getStat(statName) {
    const characterStat = this._stats[statName];
    if (characterStat == null) {
      throw Error(`Missing stat ${statName}`);
    }

    return characterStat;
  }

  getStatValue(statName) {
    const characterStat = this._stats[statName];
    if (characterStat == null) {
      throw Error(`Missing stat ${statName}`);
    }

    return characterStat.stat.value(this);
  }

  getStatModifier(statName) {
    const characterStat = this._stats[statName];
    if (characterStat == null) {
      throw Error(`Missing stat ${statName}`);
    }

    return characterStat.stat.getModifier(this);
  }

  setStatValue(statName, statValue) {
    const characterStat = this._stats[statName];
    if (characterStat == null) {
      throw Error(`Missing stat ${statName}`);
    }

    if (Number.isNaN(statValue)) {
      throw Error(`Invalid value ${statValue} for stat ${statName}`);
    }

    this._stats[statName].baseValue = statValue;
  }

  getAllStats() {
    const statsObj = {};
    Object.keys(this._stats).forEach((statName) => {
      const { group } = this._stats[statName].stat;

      if (statsObj[group] == null) {
        statsObj[group] = {};
      }

      statsObj[group][statName] = {
        value: this.getStatValue(statName),
        modifier: this.getStatModifier(statName) || undefined,
        type: this._stats[statName].stat.type,
      };
    });
    return statsObj;
  }

  getCharacterSheet() {
    return {
      name: this.name,
      stats: this.getAllStats(),
    };
  }
}

module.exports = Character;
