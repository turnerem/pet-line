import { Pet } from '../petObj.js'

const jimmy = new Pet();

test('Should have a countPlay value of 0', () => {
  expect(jimmy.countPlay).toBe(0);
})