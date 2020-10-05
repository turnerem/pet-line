import React from 'react';
import { useState, useEffect } from 'react'
import './App.css';
import { petState } from './data/petState';
import { calcFeetLoc, getLineCoordinates } from './mathUtils'
import { Pet } from './petObj'
import { TweenLite } from 'gsap/all';

const pet = new Pet();



const useClock = (initialTime = new Date()) => {

  const [time, setTime] = useState( initialTime );

  useEffect(() => {
    const timeId = setInterval(() => {
      setTime(() => new Date())
    }, 1000);

    return () => clearInterval( timeId );
  })

  return time
}

function useMovement ( initialDistance, x, svgWidth ) {

  let aStep = new TweenLite({paused: true});

  console.log(aStep)

  const [ distance, setDistance ] = useState( initialDistance );

  const duration = 3;

  const nextMove = calcNextMove( distance, x, svgWidth )

  setDistance( nextMove )

  useEffect(() => {
    takeStep( duration, distance )
    // const moveId = setInterval(() => {
    // }, 1100 * duration);

    // return () => clearInterval( moveId )
  })

}

const takeStep = (duration, distance) => {
  TweenLite.to("#pet-line", duration, {x: distance})
}

const calcNextMove = (distance, x, svgWidth) => {
  const distToRightEdge = svgWidth - x;

  if ( (distance > 0 && distToRightEdge < distance) || 
    (distance < 0 && x + distance > 0) ) {
      return distance;
    } 
      
  return distance * -1

}

const displayTime = (time) => {
  const minutesPad = time.getMinutes() < 10 ? "0" : "";
  const secondsPad = time.getSeconds() < 10 ? "0" : "";

  return `${time.getHours()}:${minutesPad}${time.getMinutes()}:${secondsPad}${time.getSeconds()}`
}

const Line = ({ coordinates, shade }) => {
  return (
    <line 
      id='pet-line'
      x1={coordinates.x1} 
      y1={coordinates.y1}  
      x2={coordinates.x2}  
      y2={coordinates.y2}  
      style={{stroke: shade, strokeWidth: 4}} />
  )
}


const Ground = ({ svgDims }) => {
  return (
    <line 
      x1='0'
      y1={ svgDims.height + 2 }
      x2={ svgDims.width }
      y2={ svgDims.height + 2 } 
      style={{stroke: 'black', strokeWidth: 1}} 
    />
  )
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

const arrayIncrementVal = ( a, increment, times ) => {
  const arr = Array( times );
  let arrVal = a;

  for ( let i = 0; i < times; i++ ) {
    arr[i] = arrVal;
    arrVal += increment;
  }
  return arr
}

const arraysCombos = (arr1, arr2) => {
  const arr3 = Array(9)
  let k = 0;

  for(let j = 0; j < 3; j++){
    for( let i = 0; i < 3; i++ ){
      arr3[k] = {x: arr1[i], y: arr2[j]}
      k++
    }
  }

  return arr3

}

const foodLayout = (topLeftFoodUnitX, topLeftFoodUnitY, foodUnitWidth) => {

  const foodUnitXs = arrayIncrementVal(topLeftFoodUnitX, foodUnitWidth, 3)
  const foodUnitYs = arrayIncrementVal(topLeftFoodUnitY, foodUnitWidth, 3)

  return arraysCombos(foodUnitXs, foodUnitYs)

}

const FoodUnit = ({ bowlWidth, bowlLeftCornerX, bowlSvgTop }) => {
  const allFoodWidth = bowlWidth * 0.8
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

const FoodBowl = ({ filter, svgDims }) => {
  const foodBowlDims = {
    height: 15,
    width: 58,
    baseWidth: 44,
    leftCornerX: 440
  }

  return (
    <>
      <polygon
        points={foodBowlCoordinates(foodBowlDims.height, foodBowlDims.width, foodBowlDims.baseWidth, foodBowlDims.leftCornerX, svgDims)}
        fill='#65350F'
        filter={`url(#${filter})`}
      />
      <FoodUnit 
        bowlWidth={foodBowlDims.width}
        bowlLeftCornerX={foodBowlDims.leftCornerX}
        bowlSvgTop={svgDims.height - foodBowlDims.height}
      />
    </>
  )
}

// hunger, wakefulness, engaged (playtime), weather (might need to provide shelter), tickle. Overall mood (random generation + starsign)
// a way to slide from one colour to another
// a way to rouge the cheeks of line
// line wiggle (giggling, sneezing)
// sneexing, laughing, humph, salad fingers sounds
// swallowing a cube

// set hunger periodically - at set interval: update line mood/feelings

// if there's shift in petState, make sound (some ominous)


function App() {

    const svgDims = {height: 210, width: 500};
    const petTallness = 190;
  
    const { shade, headLoc, leanDir } = petState[pet.petState];
    const feetLoc = calcFeetLoc(headLoc, petTallness, leanDir, svgDims);
    const lineCoordinates = getLineCoordinates( headLoc, feetLoc )

    const time = useClock();

    // const pet = new Pet;
    takeStep(2, 50);
    
    lineCoordinates.x2 += 50;

    takeStep(2, 100);
    //useMovement( 50, feetLoc.x2, svgDims.width )

    return (
      <div className="App">
        <header className="App-header">
          <p>
            <code>I am a pet line {displayTime(time)}</code>.
          </p>
        </header>
        <svg height={svgDims.height} width={svgDims.width} className="App-pet">
          <defs>
            <filter id="feDisplace">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="warp"></feTurbulence>
              <feDisplacementMap xChannelSelector="A" scale="15" in="SourceGraphic" in2="warp" />
            </filter>
          </defs>
          <Line
            coordinates={lineCoordinates}
            shade={shade}
          />
          <Ground svgDims={svgDims} />
          <FoodBowl 
            filter={"feDisplace"}
            // foodBowlDims={foodBowlDims}
            svgDims={svgDims}
          />
        </svg>
      </div>
    );

  }



export default App;
