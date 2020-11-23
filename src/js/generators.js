import Bowman from './Bowman'
import Swordsman from './Swordsman'
import PositionedCharacter from './PositionedCharacter'
import Character from './Character';
import Team from './Team';
/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
    while (true) {
      let index = Math.floor(Math.random() * allowedTypes.length);
      let type = allowedTypes[index];
      let level = Math.floor(Math.random() * maxLevel);
      let character = new type(level);
      yield character;
    }
  }

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  let team = new Team();
  let generator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i++) {
    let character = generator.next().value;
    let x;
    if (allowedTypes.indexOf(Bowman) !== -1) {
      x = Math.floor(Math.random() * 2);
    } else {
      x = Math.floor(Math.random() * 2) + 6;
    }
    let y = Math.floor(Math.random() * 8);
    let position = y*8 + x;
    function exists(c) {
      return c.position === position;
    }
    while (team.members.some(exists)) {
      y = Math.floor(Math.random() * 8);
      position = y*8 + x;
    }
    let positionedCharacter = new PositionedCharacter(character, position)
    team.members.push(positionedCharacter);
  }
  return team.members;
  // TODO: write logic here
}
