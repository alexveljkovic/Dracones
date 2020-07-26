const Joi = require('@hapi/joi');
const utils = require('./Utils');
const Inventory = require('./Inventory');

// ----- Schemas -----
/**
 * Character schema
 */
const characterSchema = Joi.object().keys({
  name: Joi.string().required().trim().error(() => new Error('Missing or invalid character name')),
  stats: Joi.object().required().error(() => new Error('Missing or invalid character stats')),
  equipmentSlots: Joi.array().required().error(() => new Error('Missing or invalid character slots')),
  inventorySize: Joi.number().required().error(() => new Error('Missing or invalid inventory size')),
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

    // Process character equipment slots
    this.processEquipmentSlots(processedCharacterData.equipmentSlots);
    delete processedCharacterData.equipmentSlots;

    // Assign character data
    Object.assign(this, utils.prefixFields(processedCharacterData, '_'));

    // Initialize empty inventory
    this._inventory = [new Inventory(characterData.inventorySize, 0)];
    this._equipedItems = [];
  }

  processStats(characterStats, availableStats) {
    availableStats.forEach((stat) => {
      if (stat.type !== 'Operator') {
        stat.applyToCharacter(this, characterStats[stat.name]);
      }
    });
  }

  processEquipmentSlots(equipmentSlots) {
    this._equipmentSlots = {};
    equipmentSlots.forEach((slot) => {
      const { type, totalSlots } = slot;
      this._equipmentSlots[type] = {
        totalSlots,
        itemInstances: [],
      };
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
      const groupName = group || 'default';

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

  getStatInfluences(statName) {
    return this._stats[statName].influences.reduce(
      (total, current) => {
        if (!current.equipmentRequired || this.hasEquiped(current.itemInstanceId)) {
          return (total + current.value);
        }
        return total;
      },
      0,
    );
  }

  getCharacterSheet() {
    return {
      name: this.name,
      stats: this.getAllStats(),
    };
  }

  get inventories() {
    return this._inventories;
  }

  addToInventory(itemInstance, _inventoryId = null) {
    const { id } = itemInstance;

    let inventoryId = null;

    // Find available inventory
    if (_inventoryId == null) {
      const availableInventory = this._inventory
        .find((inventory) => inventory.freeSpace >= itemInstance.info.size);

      if (availableInventory == null) {
        throw Error('Not enough space in inventory');
      }

      inventoryId = availableInventory.id;
    } else {
      inventoryId = _inventoryId;
    }

    // Check inventory ID
    if (this._inventory[inventoryId] == null) {
      throw Error('Invalid inventory ID');
    }

    this._inventory.forEach((inventory) => {
      if (inventory.getItem(id) != null) {
        throw Error('Item already in inventory');
      }
    });

    // Add to inventory
    this._inventory[inventoryId].add(itemInstance);

    if (itemInstance.info.type === 'inventory') {
      this._inventory
        .push(new Inventory(itemInstance.info.capacity, this._inventory.length, id));
      return inventoryId;
    }

    // Add item influences
    itemInstance.info.influences.forEach((influence) => {
      const { stat, value, equipmentRequired } = influence;
      if (this._stats[stat] == null) {
        this._inventory[inventoryId].remove(id);
        throw Error(`Invalid item influence stat: ${stat}`);
      }

      this._stats[stat].influences.push({ itemInstanceId: id, value, equipmentRequired });
    });
    return inventoryId;
  }

  removeFromInventory(itemInstanceId, _inventoryId = null) {
    let inventoryId = null;

    if (_inventoryId == null) {
      const foundInventory = this
        ._inventory.find((inventory) => inventory.getItem(itemInstanceId) != null)

      if (foundInventory == null) {
        throw Error('Item not in inventory');
      }

      inventoryId = foundInventory.id;
    } else {
      inventoryId = _inventoryId;
    }

    // Check inventory ID
    if (this._inventory[inventoryId] == null) {
      throw Error('Invalid inventory ID');
    }

    const itemInfo = this.getItemInfo(itemInstanceId);

    // Check if item is inventory
    if (itemInfo.type === 'inventory') {
      const targetInventory = this._inventory
        .find((inventory) => inventory.sourceItemInstanceId === itemInstanceId);

      if (targetInventory.numItems > 0) {
        throw Error('Item inventory not empty');
      }

      this._inventory.splice(targetInventory.id, 1);
    }

    // Remove from inventory
    this._inventory[inventoryId].remove(itemInstanceId);

    // Remove item influences
    Object.keys(this._stats).forEach((stat) => {
      this._stats[stat].influences = this._stats[stat]
        .influences.filter((influence) => influence.itemInstanceId !== itemInstanceId);
    });
  }

  equipItem(itemInstanceId) {
    if (this._equipedItems.find((it) => it === itemInstanceId)) {
      throw Error('Item already equipped');
    }

    // Get item info
    const itemInfo = this.getItemInfo(itemInstanceId);

    // Check required item level
    if (itemInfo.level >= this.getStatValue('Level')) {
      throw Error('Item level higher than character level');
    }

    // Check number of available slots
    const { type, numSlots } = itemInfo;

    if (this._equipmentSlots[type] == null) {
      throw Error(`Unknown slot type ${type}`);
    }

    const occupiedSlots = this
      ._equipmentSlots[type].itemInstances.reduce(
        (total, current) => total + this.getItemInfo(current).numSlots,
        0,
      );

    if ((this._equipmentSlots[type].totalSlots - occupiedSlots) < numSlots) {
      throw Error('Insufficient number of available slots');
    }

    // Check if item is already equipped
    if (this._equipedItems.find((it) => it === itemInstanceId) == null) {
      this._equipedItems.push(itemInstanceId);
      this._equipmentSlots[type].itemInstances.push(itemInstanceId);
    }
  }

  unequipItem(itemInstanceId) {
    if (this._equipedItems.find((it) => it === itemInstanceId) == null) {
      throw Error('Item not equipped');
    }

    const { type } = this.getItemInfo(itemInstanceId);

    this._equipedItems = this._equipedItems.filter((it) => it !== itemInstanceId);
    this._equipmentSlots[type].itemInstances = this
      ._equipmentSlots[type].itemInstances.filter(
        (it) => it !== itemInstanceId,
      );
  }

  hasEquiped(itemInstanceId) {
    const itemInstance = this._equipedItems.find((it) => it === itemInstanceId);
    return itemInstance != null;
  }

  getItemInfo(itemInstanceId) {
    let itemInstance = null;
    this._inventory.forEach((inventory) => {
      const foundItem = inventory.getItem(itemInstanceId);
      if (foundItem != null) {
        itemInstance = foundItem;
      }
    });

    if (itemInstance == null) {
      throw Error('Item not found in inventory');
    }
    return itemInstance.info;
  }
}

module.exports = Character;
