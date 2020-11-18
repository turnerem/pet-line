export const millisToMins = ( milliseconds, round = 0 ) => {
  const mins = milliseconds / ( 1000 * 60 )
  
  if( round === 0 ) {
    return Math.round( mins )
  }
  
  const rounder = Math.pow( 10, round )
  
  return Math.round( mins * rounder ) / rounder
}

export const now = () => {
  return Date.now()
}

export const waitRecalcWant = 2 * 60 * 1000

export const durFourHours = 4 * 60 * 60 * 1000