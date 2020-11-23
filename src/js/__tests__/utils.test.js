import { calcTileType } from '../utils';

test('should calculate tile type', () => {
  expect(calcTileType(0, 12)).toBe('top-left');
});

test('should calculate tile type 2', () => {
  expect(calcTileType(90, 10)).toBe('bottom-left');
});

test('should calculate tile type 3', () => {
  expect(calcTileType(24, 6)).toBe('left');
});

test('should calculate tile type 4', () => {
  expect(calcTileType(5, 6)).toBe('top-right');
});

test('should calculate tile type 5', () => {
  expect(calcTileType(5, 7)).toBe('top');
});

test('should calculate tile type 6', () => {
  expect(calcTileType(48, 7)).toBe('bottom-right');
});

test('should calculate tile type 7', () => {
  expect(calcTileType(17, 9)).toBe('right');
});

test('should calculate tile type 8', () => {
  expect(calcTileType(59, 8)).toBe('bottom');
});

test('should calculate tile type 9', () => {
  expect(calcTileType(31, 9)).toBe('center');
});
