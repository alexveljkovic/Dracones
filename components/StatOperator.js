class StatOperator {
  constructor(opcode, args) {
    this._opcode = opcode;
    this._args = args;
  }

  get opcode() {
    return this._opcode;
  }

  get args() {
    return this._args;
  }

  value() {
    switch (this.opcode) {
      case '+':
        return this.args.reduce((total, current) => (total + current.value()), 0);
      case '-':
        return this.args.reduce((total, current) => (total - current.value()), 0);
      case '*':
        return this.args.reduce((total, current) => (total - current.value()), 1);
      case '/':
        return this.args.reduce((total, current) => (total - current.value()), 1);
      default:
        throw Error(`Invalid operation ${this.opcode}`);
    }
  }
}

module.exports = StatOperator;
