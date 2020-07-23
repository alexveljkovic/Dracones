const Character = require('./components/Character');
const Item = require('./components/Item');
const { availableStats, dice } = require('./setups/dnd_setup');

try {
  const characterData = {
    name: 'Litizard',
    stats: {
      Strength: 13,
      Dexterity: 7,
      Constitution: 14,
    },
  };

  const character = new Character(
    characterData,
    availableStats,
  );

  // console.log(character.getStat('strength'));
  // console.log(character.getStat('dexterity'));
  character.setStatValue('Strength', 17);
  // console.log(character.getAllStats());
  // console.log(character.getStatModifier('strength'));
  console.log(JSON.stringify(character.getCharacterSheet(), null, 2));
  // console.log(dice.d20.name);
  // console.log(dice.d20.roll());
  //
  // console.log('Strength check: ', dice.d20.roll() + character.getStatModifier('Strength'));


  const sword = new Item({
    name: 'The Sword',
    description: 'Sword of a thousand truths',
    type: 'weapon',
    influences: [{
      stat: 'Constitution',
      value: +3,
    },
    {
      stat: 'Damage',
      value: +1,
      equipmentRequired: true,
    },
    ],
    level: 3,
    equipable: true,
  });

  const oneSword = sword.getInstance();
  // console.log(JSON.stringify(oneSword.info, null, 2));

  console.log(character.getStatValue('Constitution'));
  console.log(character.getStatValue('Damage'));
  character.addToInventory(oneSword);
  console.log(character.getStatValue('Constitution'));
  console.log(character.getStatValue('Damage'));
  character.equipItem(oneSword.id);
  console.log(character.getStatValue('Constitution'));
  console.log(character.getStatValue('Damage'));
  character.unequipItem(oneSword.id);
  console.log(character.getStatValue('Constitution'));
  console.log(character.getStatValue('Damage'));
  character.removeFromInventory(oneSword.id);
  console.log(character.getStatValue('Constitution'));
  console.log(character.getStatValue('Damage'));
} catch (err) {
  console.log(err);
}
