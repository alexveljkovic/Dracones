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
      Level: 4,
    },
    equipmentSlots: [
      {
        type: 'weapon',
        totalSlots: 2,
      },
      {
        type: 'armor',
        totalSlots: 1,
      },
      {
        type: 'helmet',
        totalSlots: 1,
      },
    ],
    inventorySize: 3,
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
  console.log(dice.d20.name);
  console.log(dice.d20.roll());
  //
  // console.log('Strength check: ', dice.d20.roll() + character.getStatModifier('Strength'));


  const sword = new Item({
    name: 'The Sword',
    description: 'Sword of a thousand truths',
    type: 'weapon',
    numSlots: 1,
    level: 3,
    equipable: true,
    size: 2,
    influences: [{
      stat: 'Strength',
      value: +3,
    },
    {
      stat: 'HP',
      value: +1,
    },
    {
      stat: 'Damage',
      value: +1,
      equipmentRequired: true,
    },
    ],
  });

  const pouch = new Item({
    name: 'Small pouch',
    description: 'Small inventory pouch',
    type: 'inventory',
    numSlots: 0,
    level: 1,
    equipable: false,
    size: 1,
    capacity: 5,
    influences: [],
  });

  const oneSword = sword.getInstance();
  const onePouch = pouch.getInstance();
  // const anotherSword = sword.getInstance();
  // const yetAnotherSword = sword.getInstance();
  // console.log(JSON.stringify(oneSword.info, null, 2));

  console.log('Strength: ', character.getStatValue('Strength'));
  console.log('Damage: ', character.getStatValue('Damage'));
  console.log('HP: ', character.getStatValue('HP'));
  console.log('Adding pouch to inventory ...');
  character.addToInventory(onePouch);
  console.log('Adding sword to inventory ... ');
  character.addToInventory(oneSword, 1);
  console.log('Strength: ', character.getStatValue('Strength'));
  console.log('Damage: ', character.getStatValue('Damage'));
  console.log('HP: ', character.getStatValue('HP'));
  console.log('Equipping sword ... ');
  character.equipItem(oneSword.id, 1);
  console.log('Strength: ', character.getStatValue('Strength'));
  console.log('Damage: ', character.getStatValue('Damage'));
  console.log('HP: ', character.getStatValue('HP'));
  console.log('Unequipping sword ... ');
  character.unequipItem(oneSword.id, 1);
  console.log('Strength: ', character.getStatValue('Strength'));
  console.log('Damage: ', character.getStatValue('Damage'));
  console.log('HP: ', character.getStatValue('HP'));
  console.log('Removing sword from inventory ... ');
  character.removeFromInventory(oneSword.id);
  character.removeFromInventory(onePouch.id);
  console.log('Strength: ', character.getStatValue('Strength'));
  console.log('Damage: ', character.getStatValue('Damage'));
  console.log('HP: ', character.getStatValue('HP'));
} catch (err) {
  console.log(err);
}
