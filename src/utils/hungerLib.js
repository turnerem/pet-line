
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

// this function will check things on Pet and Food objects
const canEat = ( foodLevel, isAwake ) => {}
