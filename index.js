const Character = require('./components/Character');
const { availableStats, dice } = require('./setups/dnd_setup');

try {
  const characterData = {
    name: 'Litizard',
    stats: {
      strength: 13,
      dexterity: 7,
      constitution: 14,
      dice: 8,
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
  console.log(JSON.stringify(character.getCharacterSheet(), null, 2));
  console.log(dice.d20.name);
  console.log(dice.d20.roll());

  console.log('Strength check: ', dice.d20.roll() + character.getStatModifier('strength'));
} catch (err) {
  console.log(err);
}
