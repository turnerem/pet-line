import React from 'react';

import { arrayIncrementVal, arraysCombos } from "../utils/mathUtils"

const foodLayout = (topLeftFoodUnitX, topLeftFoodUnitY, foodUnitWidth, nUnits) => {

  if( nUnits <= 0 ) {
    return null
  }

  // can't have more than 9 units
  if( nUnits > 9 ) {
    nUnits = 9
  }

  const foodUnitXs = arrayIncrementVal(topLeftFoodUnitX, foodUnitWidth, 3)
  const foodUnitYs = arrayIncrementVal(topLeftFoodUnitY, foodUnitWidth, 3)

  const allFood = arraysCombos(foodUnitXs, foodUnitYs);

  return allFood.slice( allFood.length - nUnits )
}

const FoodUnit = ({ bowlWidth, bowlLeftCornerX, bowlSvgTop, foodUnits }) => {
  const allFoodWidth = bowlWidth * 0.7
  const foodUnitWidth = (allFoodWidth / 3)

  const topLeftFoodUnitX = bowlLeftCornerX + bowlWidth * 0.1
  const topLeftFoodUnitY = bowlSvgTop - allFoodWidth // food is square so width is cool

  const foodUnitLayout = foodLayout( topLeftFoodUnitX, topLeftFoodUnitY, foodUnitWidth, foodUnits )

  
  return (
    <>
      {foodUnitLayout !== null && foodUnitLayout.map( (a, i) => <rect
          key={i}
          x={a.x}
          y={a.y}
          width={foodUnitWidth}
          height={foodUnitWidth}
          fill='none'
          stroke='#FFFFF1'
        />
      )
    } 
    </>
  )
}



export default FoodUnit;

