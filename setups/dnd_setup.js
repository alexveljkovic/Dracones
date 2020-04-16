const utils = require('../components/Utils');
const Dice = require('../components/Dice');
const Stat = require('../components/BaseStat');

const strengthStat = new Stat({
  name: 'strength',
  modifiers: utils.constants.DND_MODIFIERS,
});

const dexterityStat = new Stat({
  name: 'dexterity',
  modifiers: utils.constants.DND_MODIFIERS,
});

const healthStat = new Stat({
  name: 'health',
  modifiers: utils.constants.DND_MODIFIERS,
});

const availableStats = [
  strengthStat,
  dexterityStat,
  healthStat,
];

module.exports = {
  dice: {
    d20: new Dice(20),
    d11: new Dice(12),
    d10: new Dice(10),
    d8: new Dice(8),
    d6: new Dice(6),
    d4: new Dice(4),
  },
  availableStats,
};
