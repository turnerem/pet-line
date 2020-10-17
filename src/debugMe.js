const { Pet } = require('./petObj.js')

const flff = new Pet();

const bornHunger = flff.hunger;

const checkHunger = flff.hunger;

console.log( 'bornHunger', bornHunger, 'checkHunger', checkHunger)

flff.hungerLastRecalc = Date.now() - 1000 * 60 * 6;
flff.hungerLev = 20;

const newHunger = flff.hunger

console.log( 'hungerLev', flff.hungerLev, 'newHunger', newHunger )
