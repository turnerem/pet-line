// At first, pet line will have simple wants:
  // eat
  // sleep
  // normal (just wandering about)
// each want will have a numeric integer value, updated periodically with a call to updateWants
// decideActivity periodically balances competing wants and returns ultimateWant
// setActivity changes activity to that of ultimateWant if not already doing that activity
  // when changing activity, always transition through changeover state
// updateMood
  // called periodically, trajectory determined by anxiety and unmetWants
  // called when actions taken, as response to getting its way, or not
// updateAnxiety is a random walk that looks after itself
// try incorporate poisson process and other cute probability distributions in pet line psyche

const { now, waitRecalcWant, durFourHours } = require( './utils/timeUtils.js' )

const energyBounds = {
  max: 200,
  min: 0,
  alert: 150,
  average: 60,
}

const hungerBounds = {
  max: 20,
  hungry: 17,
  peckish: 15
}

// const inverseLogit( v ) {
//   return Math.exp( v ) / ( 1 + Math.exp( v ) )
// }

const setUnmetWant = ( wants, want, bool ) => {
  wants[ want ] = bool;
}

const wantToState = ( want ) => {
  if( want === 'sleep' ) {
    return 'asleep'
  }

  return null
}

class Pet {
  constructor() {
    this.state = "average";

    // wants
    this.timeSinceLastWantCalc = now();
    this.unmetWants = { food: false, nap: false };

    
    // sleeping 
    this.energy = 100;
    this.napStartTime = null;

    // feeding
    this.recentMealTimes = Array(12).fill( now() );
    this.hungerLastRecalc = 0;
    this.hungerLev = 0;
  }


  getUltimateWant() {
    if( now() - this.timeSinceLastWantCalc < waitRecalcWant ) {
      return;
    }

    // ordering of wants is meaningful: 
      // if two wants are the same, the want that is higher up in this object will be preferred
    const wants = {
      sleep: this.sleepWant,
      food: this.foodWant,
    }

    let max = 0;
    let ultimateWant = null;

    for( let w in wants ) {
      if( wants[ w ] > max ) {
        max = wants[ w ]
        ultimateWant = w
      }
    }

    return max > 0.6 ? ultimateWant : null
  }

  // each food bite is instantaneous, and several can happen in quick succession. 
  // we don't want to wait minutes until the next bite. 
  // for all other activities, transition to a state and don't update until x mins have passed
  takeAction( want, externalObjects ) {
    if( wantToState( want ) === this.state ) {
      if( this.state === 'eating' ) {
        this.eatingActivity( externalObjects.foodBowl )
      }
      return;
    }
     this.startNewActivity( want )
  }

  // call this every 10 seconds after any action that may have need to be taken
  updateMetrics() {
    if( this.state !== 'eating' ) {
      this.updateHunger()
    }

    if( this.state !== 'sleeping' ) {
      this.updateEnergy()
    }
  }

  eatingActivity( foodBowl ) {
    if( this.hunger > hungerBounds.peckish ) {
      this.tryEat( foodBowl )
    } else {
      this.setNonActivityState()
    }
  }

  // call stopActivity before updating state
  stopActivity() {
    if( this.state === 'sleeping' ) {
      this.stopNap()
    }
    return;
  }

  // ending previous activity is inherent in starting a nwe one, so call endOldActivity inside startNewActivity
  startNewActivity( want ) {
    this.stopActivity()

    if( want === null ) {
      this.setNonActivityState()
    } else if( want === 'sleep' ) {
      this.tryNap()
    } else if( want === 'food' ) {
      this.tryEat()
    }
  }

  // when Line is not eating, sleeping, it's just hanging around, but state can be
    // average, alert, tired
  setNonActivityState() {
 
    if( this.energy > energyBounds.alert ) {
      this.state = 'alert'
    } else if( this.energy > energyBounds.average ) {
      this.state = 'average'
    } else {
      this.state = 'tired'
    }

  }

  get energy() {
    return this._energy
  }

  set energy( newEnergy ) {
    this._energy = newEnergy;
  }

  incrementEnergy( increment ){
    this.energy += increment;
    if( this.energy > energyBounds.max ) {
      this.energy = energyBounds.max
    } else if( this.energy < energyBounds.min ) {
      this.energy = energyBounds.min
    }
  }
  
  // call this lad periodically, to decrement energy if line is not sleeping
  updateEnergy() {
    if( this.state === 'sleeping' ) {
      return;
    }

    const change = -1 * ( 0.1 + 0.2 * Math.random() );

    this.incrementEnergy( change )
  }

  sleepWant() {
    return ( energyBounds.max - this.energy ) / energyBounds.max
  }

  tryNap( tvObj = { isOn: false } ) {
    // if telly on, can't nap
    if( !tvObj.isOn ) {
      this.startNap()
      this.updateMoodNum( 2, 'started napping' )
    } else {
      this.updateMoodNum( -3, 'telly preventing napping')
    }
  }

  startNap() {
    this.state = 'sleeping'
    this.napStartTime = now();
  }

  stopNap() {
    const napDuration = now() - this.napStartTime;
    // each minute of sleep boosts energy by 5
    const energyIncrement = 5 * Math.abs( napDuration / 60000 )

    this.incrementEnergy( Math.round( energyIncrement, 1 ) )
    this.napStartTime = null;
  }


  set hunger( hungerLevel ) {
    this.hungerLev = hungerLevel
  }

  get hunger() {
    return this.hungerLev
  }

  incrementHunger( increment ) {
    this.hunger += increment
  }

  // because eating is instantaneous, there is no startEating, stopEating, eating state
  updateHunger() {

    const fullnessArr = this.recentMealTimes.map( a => {
      const millisSince = now() - a 
      // effectiveness of recent meals:
      // quantity eaten * fraction that reduces linearly over 4 hours
      return ( durFourHours - millisSince ) / durFourHours
    }).filter( b => {
      return b > 0
    })
    
    const fullness = ( fullnessArr.length > 0 ) ? 
      fullnessArr.reduce( ( tot, b ) => {
        return tot + b
      }) 
      : 0

    const newHunger = hungerBounds.maxFulless - fullness

    this.hunger = newHunger;
  }

  startEating() {
    this.state = 'eating'
  }

  // before calling this action, check there's food
  tryEat( foodBowl ) {    
    if( foodBowl.foodUnits > 0 ) {
      this.startEating()

      foodBowl.foodUnits --
      this.recentMealTimes.unshift( now() )

      this.updateMoodNum( 2, "just ate. +2" )
      if( this.hunger < hungerBounds.peckish ) {
        setUnmetWant( 'food', false )
      }
  
      // tidy up recentMealTimes array if it's getting too long
      while( this.recentMealTimes.length > 20 ) {
        this.recentMealTimes.pop();
      }
    } else {
      // if there's no food, shift the latest meal time, because sheer annoyance of pet has ratched up the hunger
      this.recentMealTimes.shift();
      this.updateMoodNum( -5, "tried eat. -5" )
      setUnmetWant( 'food', true )
    }
  }


  // Line wants food if it is hungry
  // it wants food even more if they've tried to eat and there was no food there
  foodWant() {
    let want = this.hunger / hungerBounds.max
    if( this.unmetWants.food ) {
      want *= 1.4
    }

    return want
  }

  
}

module.exports = { Pet }