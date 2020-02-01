import { removeEmptyProps, getRandomInteger } from '..';

test('removeEmptyProps removes falsy values from object', () => {
  const initalObject = {
    color: 'brown',
    nickname: '',
    title: 'Admin',
    worth: 0,
    rich: false,
  };

  expect(removeEmptyProps(initalObject)).toEqual({
    color: 'brown',
    title: 'Admin',
  });
});

test('getRandomInteger returns random integer between two numbers', () => {
  const result = getRandomInteger(3, 15);
  expect(result).toBeLessThanOrEqual(15);
  expect(result).toBeGreaterThanOrEqual(3);
});
