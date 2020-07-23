const { v4: uuid } = require('uuid');

class ItemInstance {
  constructor(item) {
    this._item = item;
    this._id = uuid();
  }

  get id() {
    return this._id;
  }

  get info() {
    return this._item.info;
  }
}

module.exports = ItemInstance;
