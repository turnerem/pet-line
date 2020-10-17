// Pet object does not deal with pet location or movement

const timeUntilNapReady = 1000 * 60 * 10;



const millisToMins = ( milliseconds, round = 0 ) => {
  const mins = milliseconds / ( 1000 * 60 )
  
  if( round === 0 ) {
    return Math.round( mins )
  }
  
  const rounder = Math.pow( 10, round )
  
  return Math.round( mins * rounder ) / rounder
}


class Pet {
  constructor() {
    this.state = "newborn"
    this.lastNap = Date.now()
    this.lastStateChange = Date.now()

    // feeding
    this.recentMealTimes = Array(12).fill( Date.now() )
    this.hungerLastRecalc = 0;
    this.hungerLev = 0;

    // console.log("Pet is born")
  }

  set hunger( hungerLevel ) {
    this.hungerLev = hungerLevel
  }

  get hunger() {
    if( Date.now() - this.hungerLastRecalc < 5 * 60 * 1000 ) {
      return this.hungerLev
    }

    const fullnessArr = this.recentMealTimes.map( a => {
      const minsSince = millisToMins( Date.now() - a )
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
    console.log('setting new hungerLev?', hunger, 'fullness', fullness)
    this._hungerLev = hunger;
    this.hungerLastRecalc = Date.now();

    // max hunger is 100 so to get a number between 0 and 1:
    return ( hunger > 0 ) ? ( hunger * 5 / 100 ) : 0
  }

  get isHungry() {
    return this.hunger > 10;
  }

  // before calling this action, check there's food
  eat() {
    // TODO: Pet.eat(): change pet state to 'eating' and change back to previous state after 5 seconds
    
    this.recentMealTimes.unshift( Date.now() )

    // tidy up recentMealTimes array if it's getting too long
    if( this.recentMealTimes.length > 20 ) {
      this.recentMealTimes.slice( 0, 20 );
    }
  }

  // TODO: anxiety level will be a random walk

  get petState() {
    if( this.lastNap === null ) {
      return 'asleep'
    }
    if( this.hunger > 30 ) {
      return 'annoyed'
    }
    if( this.energy > 900 ) {
      return 'alert'
    } else if( this.energy < 300 ) {
      return 'tired'
    }
    if( this.timeSince( 'lastNap' ) > 20 ) {
      return 'bored'
    }

    return 'average'
  }
  
  
  sleep() {
    if ( this.lastNap === null ) {
      console.log( 'already sleeping' )
      return;
    }
    if (( Date.now() - this.lastNap ) > timeUntilNapReady ) {
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
    this[ activity ] = Date.now()
  }

  timeSince( activity ) {
    let secondsSinceLast = ( Date.now() - this[ activity ] ) / 6000;
    return Math.round(secondsSinceLast * 100) / 100;
  }

}

module.exports = { Pet }