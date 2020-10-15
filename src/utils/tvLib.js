
// isBinging should go in backpack of getWantsTv, and only update after a watching sesh ends
// returns an integer. Large number means it really wants this
export const getTvWant = ( isWatchingTv, petEnergy, isBinging, timeSinceLastWatch ) => {}

export const isWatchingTv = ( petState ) => {}

// seems like we need a mood updater for when owner interacts, and one for mood
export const updateMoodGivenTvWant = ( wantsTv, petMood ) => {}

export const updateMoodGivenOwnerOffersTv = ( wantsTv, ) => {}