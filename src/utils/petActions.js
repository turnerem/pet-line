
// export const eat = () => {
//   if( foodUnits > 0 ) {
//     setFoodUnits( foodUnits - 1 )
//     // where to trigger moods? Moods are triggered by health stats
//   } else {
//     pet.incrementHunger(20)
//   }
// }

// This functionshould JUST do the moving. Another function should check whether move is necessary
export const moveToFood = (xCoords, setXCoords, foodBowlLocX, foodBowlWidth ) => {
  const distLeft = foodBowlLocX - xCoords.x2;
  const distRight = distLeft + foodBowlWidth;

  if( Math.abs( distLeft ) > 20 && Math.abs( distRight ) > 20 ) {
    console.log( 'distLeft and distRight:', distLeft, distRight )
    const destination = Math.random() * foodBowlWidth + foodBowlLocX

    setXCoords({ x1: destination - xCoords.x2 + xCoords.x1, x2: destination })

    // timeline.to("#pet-line", { duration: 1, x: destination - currentLocX })
  }
}
