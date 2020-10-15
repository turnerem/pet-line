const timeUntilNapReady = 180000;

export class Pet {
  constructor() {
    this.lastMeal = Date.now()
    this.lastNap = Date.now()
    this.lastStateChange = Date.now()
    this.countPlay = 0;
    this.baselineHunger = 0;
//    this.petState = "average"
//    this.anger = 0;
    // console.log("Pet is born")
  }

  get baselineHunger() {
    return this._baselineHunger
  }

  set baselineHunger(hunger) {
    this._baselineHunger = hunger
  }

  incrementHunger(increment) {
    const newBaseline = this._baselineHunger + increment;
    this._baselineHunger = ( newBaseline < 0 ? 0 : newBaseline )
  }
  
  get hunger() {
    const timeSinceMeal = this.timeSince( 'lastMeal' )
    const hunger = (10 * timeSinceMeal + timeSinceMeal ^ 2) / 100;
    
    // console.log( 'time since meal:', timeSinceMeal, 'baseline hunger:', this.baselineHunger, 'time-dependent hunger', hunger)
    return this.baselineHunger + (hunger < 0 ? 0 : hunger)
  }

  // incrementHunger(increment) {
  //   this.hunger += increment
  // }

  get energy() {
    const timeSinceNap = this.timeSince( 'lastNap' )
    return 1000 - ( timeSinceNap + this.countPlay * 10 );
  }

  set energy( increment ) {
    this.energy += increment
  }

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
  
  speak() {
    console.log("I am your pet line. You must care for me")
  }
  feed() {
    this.lastMeal = Date.now()
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