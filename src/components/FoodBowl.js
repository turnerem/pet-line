import React from 'react';
import FoodUnit from "./FoodUnit"


const FoodBowl = ({ filter, foodUnits, setFoodUnits, svgDims }) => {
  const foodBowlDims = {
    height: 20,
    width: 90,
    baseWidth: 52,
    leftCornerX: 400
  }

  const foodBowlCoordinates = (height, width, baseWidth, leftCornerX, svgDims) => {

    const svgHeight = svgDims.height
    const svgWidth = svgDims.width
    const baseUndercut = (width - baseWidth)/2;
  
    const x1 = ( (leftCornerX + width) <= svgWidth ) ? leftCornerX : svgWidth - width
    const topLeft = {x: x1, y: svgHeight - height};
    const topRight = {x: x1 + width, y: svgHeight - height};
    const bottomRight = {x: topRight.x - baseUndercut, y: svgHeight};
    const bottomLeft = {x: x1 + baseUndercut, y: svgHeight};
  
    return `
      ${topLeft.x}, ${topLeft.y} 
      ${topRight.x}, ${topRight.y} 
      ${bottomRight.x}, ${bottomRight.y} 
      ${bottomLeft.x}, ${bottomLeft.y}
    `
  }

  return (
    <>
      <polygon
        points={foodBowlCoordinates(foodBowlDims.height, foodBowlDims.width, foodBowlDims.baseWidth, foodBowlDims.leftCornerX, svgDims)}
        fill='#765648'
        filter={`url(#${filter})`}
        onClick={() => { setFoodUnits( 9 ) }}
      />
      <FoodUnit 
        bowlWidth={foodBowlDims.width}
        bowlLeftCornerX={foodBowlDims.leftCornerX}
        bowlSvgTop={svgDims.height - foodBowlDims.height}
        foodUnits={foodUnits}
      />
    </>
  )
}




export default FoodBowl;

