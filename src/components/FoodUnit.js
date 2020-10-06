import React from 'react';

import { arrayIncrementVal, arraysCombos } from "../utils/mathUtils"

const foodLayout = (topLeftFoodUnitX, topLeftFoodUnitY, foodUnitWidth) => {

  const foodUnitXs = arrayIncrementVal(topLeftFoodUnitX, foodUnitWidth, 3)
  const foodUnitYs = arrayIncrementVal(topLeftFoodUnitY, foodUnitWidth, 3)

  return arraysCombos(foodUnitXs, foodUnitYs)

}

const FoodUnit = ({ bowlWidth, bowlLeftCornerX, bowlSvgTop }) => {
  const allFoodWidth = bowlWidth * 0.7
  const foodUnitWidth = (allFoodWidth / 3)

  const topLeftFoodUnitX = bowlLeftCornerX + bowlWidth * 0.1
  const topLeftFoodUnitY = bowlSvgTop - allFoodWidth // food is square so width is cool

  const foodUnitLayout = foodLayout( topLeftFoodUnitX, topLeftFoodUnitY, foodUnitWidth )

  
  return (
    <>
      {foodUnitLayout.map( (a, i) => <rect
          key={i}
          x={a.x}
          y={a.y}
          width={foodUnitWidth}
          height={foodUnitWidth}
          fill='white'
          stroke='black'
        />
      )
    } 
    </>
  )
}



export default FoodUnit;

