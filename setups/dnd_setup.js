const utils = require('../components/Utils');
const Dice = require('../components/Dice');
const BaseStat = require('../components/BaseStat');
const StatOperator = require('../components/StatOperator');
const ConstantStat = require('../components/ConstantStat');
const Stat = require('../components/Stat');

const availableStats = require('../loaders/StatLoader')(utils.constants.modifiers.DND_MODIFIERS);
// console.log(availableStats);

//
// const strengthStat = new BaseStat({
//   name: 'strength',
//   modifiers: utils.constants.DND_MODIFIERS,
//   group: 'Stats',
// });
//
// const dexterityStat = new BaseStat({
//   name: 'dexterity',
//   modifiers: utils.constants.DND_MODIFIERS,
//   group: 'Stats',
// });
//
// const constitutionStat = new BaseStat({
//   name: 'constitution',
//   modifiers: utils.constants.DND_MODIFIERS,
//   group: 'Stats',
// });
//
// const diceStat = new ConstantStat({
//   name: 'dice',
//   group: 'General',
// });
//
// const levelStat = new BaseStat({
//   name: 'level',
//   baseValue: 1,
//   modifiers: [],
//   group: 'General',
// });
//
// const healthStat = new Stat({
//   name: 'health',
//   group: 'General',
//   dependencies: [
//
//     new StatOperator({
//       opcode: '+',
//       dependencies: [
//
//         new StatOperator({
//           opcode: 'MODIFIER',
//           dependencies: [
//             constitutionStat,
//           ],
//         }),
//
//         new StatOperator({
//           opcode: '*',
//           dependencies: [
//             levelStat,
//             diceStat,
//           ],
//         }),
//       ],
//     }),
//   ],
// });
//
// const availableStats = [
//   strengthStat,
//   dexterityStat,
//   constitutionStat,
//   levelStat,
//   diceStat,
//   healthStat,
// ];

module.exports = {
  dice: {
    d20: new Dice(20),
    d12: new Dice(12),
    d10: new Dice(10),
    d8: new Dice(8),
    d6: new Dice(6),
    d4: new Dice(4),
  },
  availableStats,
};
