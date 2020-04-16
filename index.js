const Character = require('./components/Character');
const { availableStats, dice } = require('./setups/dnd_setup');

try {
  const characterData = {
    name: 'Litizard',
    stats: {
      strength: 13,
      dexterity: 7,
    },
  };

  const character = new Character(
    characterData,
    availableStats,
  );

  // console.log(character.getStat('strength'));
  // console.log(character.getStat('dexterity'));
  character.setStatValue('strength', 17);
  // console.log(character.getAllStats());
  // console.log(character.getStatModifier('strength'));
  console.log(character.getCharacterSheet());
  // console.log(dice.d20.name);
} catch (err) {
  console.log(err);
}
