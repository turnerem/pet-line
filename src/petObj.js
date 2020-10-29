// Pet object does not deal with pet location or movement
const { millisToMins, now } = require( './utils/timeUtils.js' )
const { wantsImpact } = require( './data/wantsImpact.js' )

const durationOneHour = 60 * 1000 * 60;
const durationOneMins = 1 * 1000 * 60;


// if pet wants something, we want to return negative impact, otw, positive impact
const getWantsImpact = ( wants, impact ) => {
  let total = 0;
  for( let key in wants ){
    if( wants[ key ] ) {
      total -= impact[ key ]
    } else {
      total += impact[ key ]
    }
  }

  return total
}

const setWant = ( wants, want, bool ) => {
  wants[ want ] = bool;
}

const calcMood = ( moodNum ) => {
  const multiplier = 1;
  if( moodNum > 150 * multiplier ) {
    return 'ecstatic'
  } else if( moodNum > 80 * multiplier ) {
    return 'happy'
  } else if( moodNum > 50 * multiplier ) {
    return 'bored'
  } else if( moodNum > 40 * multiplier ) {
    return 'restless'
  } else if( moodNum > 30 * multiplier ) {
    return 'annoyed'
  } else {
    return 'angry'
  }
}

class Pet {
  constructor() {
    this.state = "average"
    this.lastNap = now()
    this.lastStateChange = now()

    this.moodNum = 100;
    this.lastMoodUpdate = now()
    this.wants = { tv: false, tickle: false, food: false, nap: false };

    // feeding
    this.recentMealTimes = Array(12).fill( now() )
    this.hungerLastRecalc = 0;
    this.hungerLev = 0;

    // telly
    this.timeStartedTv = null;

    // console.log("Pet is born")
  }

  actionDecision( wants ) {
    // check for current active wants
      // prioritise among these wants
      // need to compare integer metrics for want food/tv/tickle/sleep
      // regularise each integer value so that we can just choose the largest value in this function
    
    // if nothing wanted, stay in current state, current mood, basically don't update anything
  }

  set hunger( hungerLevel ) {
    this.hungerLev = hungerLevel
  }

  get hunger() {
    if( now() - this.hungerLastRecalc < 5 * 60 * 1000 ) {
      return this.hungerLev
    }

    const fullnessArr = this.recentMealTimes.map( a => {
      const minsSince = millisToMins( now() - a )
      // effectiveness of recent meals:
      // quantity eaten * fraction that reduces linearly over 4 hours
      return ( ( 4 * 60 ) - minsSince ) / ( 4 * 60 )
    })
    
    fullnessArr.filter( b => {
      return b > 0
    })
    
    const fullness = ( fullnessArr.length > 0 ) ? 
      fullnessArr.reduce( ( tot, b ) => {
        return tot + b
      }) 
      : 0

    const hunger = 20 - fullness

    // cache value for quick checking
    this.hungerLev = hunger;
    this.hungerLastRecalc = now();

    return ( hunger > 0 ) ? hunger : 0
  }

  get isHungry() {
    return this.hunger > 10;
  }

  get isPeckish() {
    return this.hunger > 7;
  }

  // before calling this action, check there's food
  eat( foodBowl ) {    
    let wantsFood = true;
    if( foodBowl.foodUnits > 0 ) {
      this.recentMealTimes.unshift( now() )

      foodBowl.foodUnits --

      if( !this.isPeckish ) {
        wantsFood = false
      }

      this.updateMoodNum( 2, "just ate. +2" )
      setWant( 'food', wantsFood )
  
      // tidy up recentMealTimes array if it's getting too long
      while( this.recentMealTimes.length > 20 ) {
        this.recentMealTimes.pop();
      }
    } else {
      // if there's no food, shift the latest meal time, because sheer annoyance of pet has ratched up the hunger
      this.recentMealTimes.shift();
      this.updateMoodNum( -5, "tried eat. -5" )
      setWant( 'food', wantsFood )

    }
  }

 
  // pet watching tv: what parts of this does pet object manage? 
  // bool for currently watching. Timer for total watch time
  // pet movement is handled elsewhere


  // handles want when pet is and is not watching it
  wantsTv( state, timeStartedTv ) {
    // if tired
    // if it's a certain time
    // if bored
    // if binging

    if( state === 'watchingTv' ) {

      const tvMillis = now() - timeStartedTv;
      const tvMins = millisToMins( tvMillis )

      return ( tvMins < 5 )
    } else {

      const randomDesireMultiplier = 0.5 + Math.random();
      // const boredomMultiplier = ( this.state === 'bored')1.2;

      const time = new Date();
      const isLate = ( time.getHours() > 17 ) ? 1.5 : 1;

      return randomDesireMultiplier * isLate > 1.2
    }
  }

  watchTv ( tvObj = { available: true }) {
    if( this.wantsTv( this.state, this.timeStartedTv ) ) {
      setWant( this.wants, 'tv', true )
      if( this.state !== 'watchingTv' ) {
        this.tryWatchTv( tvObj )
      }
    } else {
      setWant( this.wants, 'tv', false )
      if( this.state === 'watchingTv' ) {
        this.stopWatchingTv()
      }
    }

  }

  tryWatchTv( tvObj = {} ) {

    if( !tvObj.available ) {
      this.updateMoodNum( -2, 'wants tv. -2')
      return;
    }
      
    this.startWatchingTv()
    this.updateMoodNum( 1, 'watching tv. +1')
  }
  
  isBinging() {}

  startWatchingTv() {
    this.state = 'watchingTv'
    this.timeStartedTv = now();
  }

  stopWatchingTv() {
    this.updateState()
    this.timeStartedTv = null;
  }

  // TODO: anxiety level will be a random walk

  get state() {
    return this._state;
  }

  set state( newState ) {
    this._state = newState;
  }

  updateState() {
    if( this.state === 'watchingTv' ) {
      this.state = 'average'
    }
  }


  get mood() {
    return calcMood();
  }
  
  // mood can change as a response to an event. 
  // It also has a general trajectory that is defined by whether line has enduring met/unmet wants
  updateMoodNum( increment = null, logging = null ) {
    if( now() - this.lastMoodUpdate < durationOneMins ) return;

    // logging for debugging over time ( is one functions calling this lad all the time, etc )
    if( logging ) {
      // log string passed in from logging arg, increment, time
    }

    if( increment === null ) {

      const wants = getWantsImpact( this.wants, wantsImpact );
      this.moodNum += wants;

      return;
    }

    this.moodNum += increment
  }
  
  
  sleep() {
    if ( this.lastNap === null ) {
      console.log( 'already sleeping' )
      return;
    }
    if (( now() - this.lastNap ) > durationOneHour ) {
      this.lastNap = null;
      console.log( 'starting nap' )
    } else {
      console.log( 'not tired!' )
    }
  }

  // checkPet(){
  //   return this.petState
  // }

  resetTimeSince( activity ) {
    this[ activity ] = now()
  }

  timeSince( activity ) {
    let secondsSinceLast = ( now() - this[ activity ] ) / 6000;
    return Math.round(secondsSinceLast * 100) / 100;
  }

}

module.exports = { Pet }