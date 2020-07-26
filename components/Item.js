const Joi = require('@hapi/joi');
const utils = require('./Utils');

const ItemInstance = require('./ItemInstance');

// ----- Schemas -----
/**
 * Character schema
 */
const itemSchema = Joi.object().keys({
  name: Joi.string().required().trim().error(() => new Error('Missing or invalid item name')),
  description: Joi.string().required().error(() => new Error('Missing or invalid item description')),
  type: Joi.string().required().error(() => new Error('Missing or invalid item type')),
  influences: Joi.array().required().error(() => new Error('Missing or invalid item influences')),
  level: Joi.number().required().error(() => new Error('Missing or invalid item level')),
  equipable: Joi.bool().optional().error(() => new Error('Invalid item equipable flag')),
  numSlots: Joi.number().required().error(() => new Error('Missing or invalid item number of slots')),
  size: Joi.number().required().error(() => new Error('Missing or invalid item size')),
  capacity: Joi.number().optional().error(() => new Error('Invalid capacity')),
});
// ----- End of schemas -----

class Item {
  constructor(itemData) {
    // Validate item data structure
    utils.validateObject(itemSchema, itemData);
    this._data = itemData;
  }

  getInstance() {
    return new ItemInstance(this);
  }

  get info() {
    return { ...this._data };
  }
}

module.exports = Item;
