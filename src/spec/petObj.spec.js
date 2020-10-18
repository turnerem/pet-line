// import { petState } from '../data/petState.js';
const { Pet } = require( '../petObj.js' );
const { calcRect } = require('../utils/mathUtils.js');

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

describe('Pet State', () => {
  test('At first, pet state is "newborn"', () => {
    expect( flff.state ).toBe( 'newborn' )
  })
  test('flff.state should return "peeved" if state is set to "peeved"', () => {
    flff.state = "peeved"
    expect( flff.state ).toBe( 'peeved' )
  })

})

describe('Watching TV', () => {
  test('wantsTv: should return true if is watching TV, but only for less than 5 mins', () => {
    flff.startWatchingTv()
    
    expect( flff.wantsTv() ).toBe( true )
  })
  test('wantsTv: should return false if is watching TV, but only for less than 5 mins', () => {
    flff.startWatchingTv()
    flff.timeStartedTv = 0;

    expect( flff.wantsTv() ).toBe( false )
  })
  test('wantsTv: if not currently watching tv, multiple calls to this function should return different answers (true or false)', () => {
    flff.state = "bored"
    const arr = Array( 40 ).fill( false )

    const tot = 
      arr.map( a => flff.wantsTv() )
        .reduce( ( tot, a ) => tot + a )
  
    expect( tot ).toBeGreaterThan( 0 )
  })
  test('tryWatchingTv: if not currently watching tv + tv available, state should change to "watchingTv"', () => {
    const tvObj = { available: true }
    flff.state = "bored"

    flff.tryWatchTv( tvObj )

    expect( flff.state ).toBe( 'watchingTv' )
  })
  test('tryWatchingTv: if not currently watching tv + tv unavailable, state should not change to "watchingTv"', () => {
    const tvObj = { available: false }
    flff.state = "bored"

    flff.tryWatchTv( tvObj )

    expect( flff.state ).not.toBe( 'watchingTv' )
  })
  test('tryWatchingTv: if not currently watching tv + tv unavailable, unmetWant for TV should be true', () => {
    const tvObj = { available: false }
    flff.lastMoodUpdate = 0;

    flff.state = "bored"

    flff.tryWatchTv( tvObj )

    expect( flff.unmetWant.tv ).toBe( true )
  })
  test('stopWatchingTv: state should change from "watchingTv" to something else', () => {
    flff.startWatchingTv()
    const oldPetState = flff.state;

    flff.stopWatchingTv()
    expect( oldPetState ).toBe( "watchingTv" )
    expect( flff.state ).not.toBe( oldPetState )
  })
})
