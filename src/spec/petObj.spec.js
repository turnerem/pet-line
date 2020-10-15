import { Pet } from '../petObj.js'

const jimmy = new Pet();

test('Should have a countPlay value of 0', () => {
  expect(jimmy.countPlay).toBe(0);
})

test('Can increment baselineHunger from 0 to 5', () => {

  const increment = 5;
  jimmy.incrementHunger(increment)

  expect(jimmy.baselineHunger).toBe(increment)
})

test('lastMeal is initialised to a number greater than 0', () => {
  expect(jimmy.lastMeal).toBeGreaterThan(0)
})