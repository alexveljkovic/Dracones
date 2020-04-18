const utils = require('./Utils');

// TODO: Validation

class StatOperator {
  constructor(statData) {
    Object.assign(this, utils.prefixFields(statData, '_'));
  }

  get type() {
    return 'Operator';
  }

  get opcode() {
    return this._opcode;
  }

  get dependencies() {
    return this._dependencies;
  }

  value(character) {
    switch (this.opcode) {
      case '+':
        return this.dependencies.reduce((total, current) => (total + current.value(character)), 0);
      case '-':
        return this.dependencies.reduce((total, current) => (total - current.value(character)), 0);
      case '*':
        return this.dependencies.reduce((total, current) => (total * current.value(character)), 1);
      case '/':
        return this.dependencies.reduce((total, current) => (total / current.value(character)), 1);
      case 'MODIFIER':
        return this
          .dependencies.reduce((total, current) => (total + current.getModifier(character)), 0);
      default:
        throw Error(`Invalid operation ${this.opcode}`);
    }
  }
}

module.exports = StatOperator;
