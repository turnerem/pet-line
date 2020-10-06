const timeUntilNapReady = 180000;

export class Pet {
  constructor() {
    this.lastMeal = Date.now()
    this.lastNap = Date.now()
    this.lastStateChange = Date.now()
    this.countPlay = 0;
//    this.petState = "average"
//    this.anger = 0;
    console.log("Pet is born")
  }
  
  get hunger() {
    const timeSinceMeal = this.timeSince( 'lastMeal' )
    const hunger = (10 * timeSinceMeal + timeSinceMeal ^ 2) / 1000;
    
    return hunger
  }

  incrementHunger(increment) {
    this.hunger += increment
  }

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

  timeSince( activity ) {
    let secondsSinceLast = ( Date.now() - this[ activity ] ) / 6000;
    return secondsSinceLast.toFixed(0);
  }

}