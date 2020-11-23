import GameController from '../GameController';
import Bowman from '../Bowman';

const gameController = new GameController();
const bowman = new Bowman(0);

test('should create message', () => {
  const received = gameController.createMessage(bowman);
  const expected = `\u{1F396}${1}\u{2694}${25}\u{1F6E1}${25}\u{2764}${100}`;

  expect(received).toEqual(expected);
});
