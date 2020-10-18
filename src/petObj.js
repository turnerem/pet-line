// Pet object does not deal with pet location or movement
const { millisToMins, now } = require( './utils/timeUtils.js' )
const { unmetWantsImpact } = require( './data/unmetWantsImpact.js' )

const durationFiveMins = 5 * 1000 * 60;

const getUnmetWantsImpact = ( wants, multipliers ) => {
  let multiplier = 1;
  for( let key in wants ){
    if( wants[ key ] ) {
      multiplier *= multipliers[ key ]
    }
  }

  return multiplier
}

class Pet {
  constructor() {
    this.state = "newborn"
    this.lastNap = now()
    this.lastStateChange = now()

    this.moodNum = 50;
    this.lastMoodUpdate = now()
    this.unmetWant = { tv: false, tickle: false, food: false, nap: false };

    // feeding
    this.recentMealTimes = Array(12).fill( now() )
    this.hungerLastRecalc = 0;
    this.hungerLev = 0;

    // telly
    this.timeStartedTv = null;

    // console.log("Pet is born")
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

  // before calling this action, check there's food
  eat( foodBowl ) {    
    if( foodBowl.foodUnits > 0 ) {
      this.recentMealTimes.unshift( now() )

      foodBowl.foodUnits --
  
      // tidy up recentMealTimes array if it's getting too long
      while( this.recentMealTimes.length > 20 ) {
        this.recentMealTimes.pop();
      }
    } else {
      // if there's no food, shift the latest meal time, because sheer annoyance of pet has ratched up the hunger
      this.recentMealTimes.shift();
    }
  }

 
  // pet watching tv: what parts of this does pet object manage? 
  // bool for currently watching. Timer for total watch time
  // pet movement is handled elsewhere


  // handles want when pet is and is not watching it
  wantsTv() {
    // if tired
    // if it's a certain time
    // if bored
    // if binging

    if( this.state === 'watchingTv' ) {

      const tvMillis = now() - this.timeStartedTv;
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

  tryWatchTv( tvObj = {} ) {
    if( this.state === 'watchingTv' ) return;

    if( !tvObj.available ) {
      this.unmetWant.tv = true;
      return;
    }
      
    this.startWatchingTv()
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

  
  // maybe this is the only place where mood increments are managed. 
  // but what about one-off incidents, such as TV unavailable?
      // perhaps use variables like unavailableWantTv
  // looks at wants and needs
  // updateMood( ) {
  //   if( now() - this.lastMoodUpdate < durationFiveMins ) return;

  //   const unmetWants = getUnmetWantsImpact( this.unavailableWant, unmetWantsImpact )

  //   this.moodNum;
  // }
  
  
  sleep() {
    if ( this.lastNap === null ) {
      console.log( 'already sleeping' )
      return;
    }
    if (( now() - this.lastNap ) > timeUntilNapReady ) {
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