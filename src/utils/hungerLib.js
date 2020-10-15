
// returns an integer. Large number means it really wants this
// hungerLevel in [0, 1]
// petAnxiety in [0, 1]
export const getFoodWant = ( hungerLevel, petAnxiety ) => {
  // max anxiety will increase hunger by .5
  const anxietyMultiplier = 1 + petAnxiety / 2;

  return hungerLevel * anxietyMultiplier;
}

// is eating not an instantaneous action?? Make it last a few seconds
// this should be an action on pet object
export const isEating = ( pet ) => {
  return pet.state === 'eating'
}

export const updateMoodGivenFoodWant = ( petMood, wantsFood, canEat ) => {}

export const updateBehaviourGivenFoodWant = () => {}

const canEat = ( foodLevel, isAwake ) => {}

const millisToMins = ( milliseconds, round = 0 ) => {
  const mins = milliseconds * 1000 * 60
  
  if( round = 0 ) {
    return mins
  }
  
  const rounder = Math.pow( 10, round )
  
  return Math.round( mins * rounder ) / rounder
}

// recentMealTimes is an array of times. Each meal is one unit, and it may be that they were eaten in quick succession
// max size of recentMealTimes array: 20 (?)
// hungerLevel can return 'stuffed'
// min hunger = 0, max hunger = 1
export const getHungerLevel = ( recentMealTimes, foodLevel ) => {

  const satiationGivenMeals = recentMealTimes.map( a => { 
    // get 'time since', instead of 'time of', recent meals
    const minsSince = millisToMins( Date.now() - a.time )
    
    // quantity eaten, multiplied by fraction that gets smaller
    a.effectiveness = ( ( 4 * 60 ) - minsSince ) / 4 * 60
  } ).filter( a => { 
    // filter out meals from more than 4 hours ago
    a.effectiveness > 0
  } ).reduce( ( tot, a ) => {
    return tot + a
  }, 0)

  let hunger = 20 - satiationGivenMeals

  hunger += ( foodLevel <= 2 ) ? 5 : 0

  return ( hunger > 0 ) ? ( hunger * 4 / 100 ) : 0
}