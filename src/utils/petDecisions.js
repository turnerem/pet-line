const hungerThreshold = {
  'full': 30,
  'peckish': 50,
  'hungry': 60,
  'famished': 80
}

const decideEat = (hunger) => {
  if( hunger > hungerThreshold['hungry'] ){
    return true
  }
  return false
}

