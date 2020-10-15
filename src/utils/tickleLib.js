
// ticklePatience is null when not getting tickled. 
// Is a countdown timer starting when tickled and ticklePatience is null
// will not be null if owner has literally just tickled Line

// just pass in pet, and get petMood and petState from this
// returns an integer. Large number means it really wants this
export const getTickleWant = ( isGettingTickled, ticklePatience, petMood, petState, petEnergy, playPreference ) => {}

// maybe pet can always be tickled, but at wrong time, this may worsen pet mood
export const canTickle = ( isAwake ) => {}

export const isGettingTickled = ( petState ) => {}

export const updateMoodGivenTickleWant = ( petMood, ownerTickles ) => {}

export const updateMoodGivenOwnerTickles = ( petMood, ownerTickles ) => {}