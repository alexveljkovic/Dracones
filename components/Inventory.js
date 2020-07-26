class Inventory {
  constructor(capacity, id, sourceItemInstanceId = null) {
    this._id = id;
    this._capacity = capacity;
    this._items = [];
    this._sourceItemInstanceId = sourceItemInstanceId;
  }

  get id() {
    return this._id;
  }

  get freeSpace() {
    return this._capacity - this._items
      .reduce((total, it) => total + it.info.size, 0);
  }

  get sourceItemInstanceId() {
    return this._sourceItemInstanceId;
  }

  get numItems() {
    return this._items.length;
  }

  add(itemInstance) {
    const { id } = itemInstance;

    // Check inventory capacity
    if (this.freeSpace < itemInstance.info.size) {
      throw Error('Not enough space in inventory');
    }

    // Check if inventory is already stored
    if (this.getItem(id)) {
      throw Error('Item already in inventory');
    }

    this._items.push(itemInstance);
  }

  remove(itemInstanceId) {
    if (!this.getItem(itemInstanceId)) {
      throw Error('Item not found in inventory');
    }
    this._items = this._items.filter((it) => it.id !== itemInstanceId);
  }

  getItem(itemInstanceId) {
    return this._items.find((it) => it.id === itemInstanceId);
  }
}

module.exports = Inventory;
