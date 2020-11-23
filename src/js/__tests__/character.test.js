import Character from '../Character';
import Bowman from '../Bowman';
import Undead from '../Undead';

test('should throw error', () => {
  expect(() => {
    let bowman = new Character(1);
  }).toThrow();
});

test('should create new bowman', () => {
  const received = new Bowman(2);
  const expected = {
    level: 3,
    attack: 25,
    defence: 25,
    health: 100,
    type: 'bowman',
    movementDistance: 2,
    attackDistance: 2,
  }

  expect(received).toEqual(expected);
});

test('should create new undead', () => {
  const received = new Undead(0);
  const expected = {
    level: 1,
    attack: 25,
    defence: 25,
    health: 100,
    type: 'undead',
    movementDistance: 4,
    attackDistance: 1,
  }

  expect(received).toEqual(expected);
});
