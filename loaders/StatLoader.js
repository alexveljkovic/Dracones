const fs = require('fs');
const statParser = require('../parsers/StatParser');
const BaseStat = require('../components/BaseStat');
const StatOperator = require('../components/StatOperator');
const ConstantStat = require('../components/ConstantStat');
const Stat = require('../components/Stat');

module.exports = (modifiers) => {
  const statsFile = fs.readFileSync('./test/test.stats.ds', 'utf8');

  const parsedData = statParser.parse(statsFile);

  const availableStats = {};

  function parseStatFormula(statObj) {
    const statType = statObj.type;
    let statName = null;

    switch (statType) {
      case 'stat':
        statName = statObj.value;
        if (availableStats[statName] == null) {
          throw Error(`Unknown stat in formula: ${statName}`);
        }
        return availableStats[statName];

      case 'constant':
        statName = statObj.value;
        if (availableStats[statName] == null) {
          const newStat = new ConstantStat({
            name: statName,
            defaultValue: statObj.value,
          });
          availableStats[statName] = newStat;
        }
        return availableStats[statName];

      case 'dice':
        return null;

      case 'modifier':
        statName = statObj.stat;
        if (availableStats[statName] == null) {
          throw Error(`Unknown stat in formula: ${statName}`);
        }
        return new StatOperator({
          opcode: 'MODIFIER',
          dependencies: [
            availableStats[statName],
          ],
        });

      case 'op':
        return new StatOperator(
          {
            opcode: statObj.op,
            dependencies: statObj.args.map((arg) => parseStatFormula(arg)),
          },
        );
      default:
        throw Error('Unknown stat type');
    }
  }

  parsedData.forEach((group) => {
    const { section } = group;
    switch (section) {
      case 'Stats':
        group.items.forEach((stat) => {
          const statName = stat.name;
          const statProperties = stat.properties;

          const statData = {
            name: statName,
            modifiers,
          };

          if (statProperties.length === 0) {
            // BaseStat
            const newStat = new BaseStat(statData);
            availableStats.statName = newStat;
          } else {
            const propertiesObject = {};
            statProperties.forEach((property) => {
              propertiesObject[property.key] = property.expression;
            });

            if (propertiesObject.formula == null) {
              if (propertiesObject.default != null) {
                statData.baseValue = propertiesObject.default.value;
              }
              const newStat = new BaseStat(statData);
              availableStats[statName] = newStat;
            } else {
              const dependencies = [parseStatFormula(propertiesObject.formula)];
              availableStats[statName] = new Stat({
                ...statData,
                dependencies,
              });
            }
          }
        });
        break;
      default:
        throw Error(`Invalid section type: ${section}`);
    }
  });

  return Object.keys(availableStats).map((key) => availableStats[key]);
};
