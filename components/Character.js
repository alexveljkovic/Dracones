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

    // Assign character data
    Object.assign(this, utils.prefixFields(processedCharacterData, '_'));

    // Initialize empty inventory
    this._inventory = [];
    this._equipedItems = [];
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
      const groupName = group || 'default'

      if (statsObj[groupName] == null) {
        statsObj[groupName] = {};
      }

      statsObj[groupName][statName] = {
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

  addToInventory(itemInstance) {
    const { id } = itemInstance;

    itemInstance.info.influences.forEach((influence) => {
      const { stat, value, equipmentRequired} = influence;
      if (this._stats[stat] == null) {
        throw Error(`Invald item influence stat: ${stat}`);
      }

      this._stats[stat].influences.push({ itemInstanceId: id, value, equipmentRequired });
    });

    this._inventory.push(itemInstance);
  }

  removeFromInventory(itemInstanceId) {
    this._inventory = this._inventory.filter((it) => it.id !== itemInstanceId);
    Object.keys(this._stats).forEach((stat) => {
      this._stats[stat].influences = this._stats[stat]
        .influences.filter((influence) => influence.itemInstanceId !== itemInstanceId);
    });
  }

  equipItem(itemInstanceId) {
    // Check if item is already equipped
    if (this._equipedItems.find(itemInstanceId) == null) {
      this._equipedItems.push(itemInstanceId);
    }
  }

  unequipItem(itemInstanceId) {
    this._equipedItems = this._equipedItems.filter((it) => it !== itemInstanceId);
  }

  hasEquiped(itemInstanceId) {
    const itemInstance = this._equipedItems.find((it) => it === itemInstanceId);
    return itemInstance != null;
  }
}

module.exports = Character;
