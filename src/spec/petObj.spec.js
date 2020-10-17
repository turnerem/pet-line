// import { petState } from '../data/petState.js';
const { Pet } = require( '../petObj.js' )

const flff = new Pet();


// testing hunger
describe('Pet Hunger', () => {
  // test('hunger less than 9 when born', () => {
  //   expect(flff.hunger).toBeLessThan( 9 )
  // })
  test('hunger to be 8 when born', () => {
    expect( flff.hunger ).toBe( 8 )
  })
  test('if hungerLastRecalc is less than 5 mins ago, Pet.hunger should return hungerLev', () => {
    flff.hungerLastRecalc = Date.now();
    flff.hungerLev = 20;

    expect( flff.hunger ).toBe( 20 );
  })
  test('if hungerLastRecalc is greater than 5 mins ago, Pet.Hunger should recalc hungerLev and assign his new valie to Pet.hungerLev', () => {
    flff.hungerLastRecalc = Date.now() - 1000 * 60 * 6;
    flff.hungerLev = 20;

    const newHunger = flff.hunger;

    expect( newHunger ).not.toBe( 20 );
    expect( newHunger ).toBe( flff.hungerLev )
  })
  test('pet.isHungry returns true if hunger is > 10', () => {
    flff.hungerLastRecalc = Date.now();
    flff.hungerLev = 10;

    expect( flff.isHungry ).toBe( false );
    
    flff.hungerLev = 11;

    expect( flff.isHungry ).toBe( true )
   
  })
})

describe('Pet eating', () => {
  test('before first meal, recentMealTimes array should be of length 12', () => {
    expect( flff.recentMealTimes.length ).toBe( 12 )
  })
  test('recentMealTimes array should never have more than 20 elements', () => {
    const foodBowl = { foodUnits: 12 };

    for( let i = 0; i < 10; i++ ) {
      flff.eat( foodBowl );
    }
    expect( flff.recentMealTimes.length ).toBe( 20 )
    expect( foodBowl.foodUnits ).toBe( 2)
  })
})
