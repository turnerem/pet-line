import React, {useState, useEffect, useRef} from 'react';
import { petState } from '../data/petState';
import { calcHeadLoc } from '../utils/mathUtils'
import { Pet } from '../petObj'
import gsap from 'gsap';
import { moveToFood, eat } from '../utils/petActions';

const pet = new Pet();


// function useMovement ( initialDistance, x, svgWidth ) {

//   let aStep = gsap.timeline();


//   const [ distance, setDistance ] = useState( initialDistance );

//   const duration = 1;

//   const nextMove = calcNextMove( distance, x, svgWidth )

//   setDistance( nextMove )


//   aStep.to("#pet-line", { duration: duration, x: distance})

//   aStep.repeat(false, false);

//   console.log(aStep)

//   // useEffect(() => {
//   //   takeStep( duration, distance )
//   //   // const moveId = setInterval(() => {
//   //   // }, 1100 * duration);

//   //   // return () => clearInterval( moveId )
//   // })

// }

// how to change coordinates when mood changes, 
// and also periodically trigger footsteps?
const useCoordinatesManager = ( svgDims, foodUnits, setFoodUnits, initialPetState = petState[pet.petState] ) => {

  const petTallness = svgDims.height * .9;
  const initialStepMvmt = svgDims.width * .1;
  
  // swap around: find head loc from feet
  const { feetLocX, slope } = initialPetState;

  const feetLoc = {x2: feetLocX, y2: svgDims.height - 5}

  // this is recalculating at every interval. Make custom hook and only recalculate when pet changes direction
  const headLoc = calcHeadLoc( feetLoc, petTallness, slope, svgDims)

  const yCoords = { y1: headLoc.y1, y2: feetLoc.y2 }

  // this needs to set head and foot x coords of new loc
  const [ xCoords, setXCoords ] = useState({ x1: headLoc.x1, x2: feetLoc.x2 })
    
  const [ stepMvmt, setStepMvmt ] = useState(initialStepMvmt)
        
  const [ petting, setPetting ] = useState( false )

//   pet state alert hunger: 9.11
// petObj.js:22 Uncaught TypeError: Cannot set property hunger of #<Pet> which has only a getter
//     at Pet.incrementHunger (petObj.js:22)
//     at Line.js:72

    useEffect(() => {
      const moveId = setInterval(() => {
        // improve these line with a boolean that says whether moveToFood is required - so moveToFood is not calculated each time here.
        if( !petting ) {
          if (pet.hunger > 3 ) {
            console.log('hungry now')
            if( !moveToFood( xCoords, setXCoords, 400, 90 ) ){
              // if already at bowl, then eat
  
              if (eat(foodUnits, setFoodUnits)) {
                pet.incrementHunger(-1)
                pet.resetTimeSince( 'lastMeal' )
                // pet.
              } else {
                pet.incrementHunger(8)
              }
            }
          } else {
            if( redirectNextMove( stepMvmt, xCoords.x2, svgDims.width ) ){
              takeUnrealStep( stepMvmt * -1, xCoords, setXCoords )
              setStepMvmt( stepMvmt * -1 )
            } else {
              takeUnrealStep( stepMvmt, xCoords, setXCoords )
            }
          }
        } else {
          console.log( 'petting! ')
        }
    }, 1800 * (1 + 3 * Math.random() ) );

    return () => clearInterval( moveId );

  })

  return { xCoords, yCoords, setPetting }
}

const takeUnrealStep = (stepMvmt, xCoords, setXCoords) => {
  setXCoords( { x1: xCoords.x1 + stepMvmt, x2: xCoords.x2 + stepMvmt } )
}

// const takeStep = (duration, distance) => {
//   TweenLite.to("#pet-line", duration, {x: distance})
// }

// return true if time to change direction
const redirectNextMove = (stepMvmt, x, svgWidth) => {
  let distToRightEdge = svgWidth - x;
  let gettingTooCloseToRight = stepMvmt > 0 && distToRightEdge < stepMvmt;
  let gettingTooCloseToLeft = stepMvmt < 0 && x + stepMvmt < 0;

  if ( gettingTooCloseToRight || gettingTooCloseToLeft ) { 
    return true
  } 
  return false
}

const pettingLine = ( setPetting, turb ) => {

  setPetting( true )

  console.log('the turb', turb)

  const turbVal = { val: 0.000001 }

  const tl = gsap.timeline({ paused: true, onUpdate: 
    function() {
      turb.setAttribute('baseFrequency', '0 ' + turbVal.val);
    } 
  });

  tl.to(turbVal, { duration: 0.2, val: 0.3 });
  tl.to(turbVal, { duration: 0.2, val: 0.000001 });

  tl.restart()

}


const Line = ({ svgDims, foodUnits, setFoodUnits }) => {

  const { xCoords, yCoords, setPetting } = useCoordinatesManager( svgDims, foodUnits, setFoodUnits )

  // const petRef = useRef(null)

  const { shade } = petState[pet.petState];

  const turb = document.querySelector('#tickle');

  console.log('the turb in Line', turb)

  return (
    <>
      <filter id="tickle">
        <feTurbulence type="fractalNoise" baseFrequency="0.00001 0.00001" numOctaves="1" result="warp"></feTurbulence>
        <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset" />
      </filter>
      <line 
        id='pet-line'
        x1={xCoords.x1} 
        y1={yCoords.y1}  
        x2={xCoords.x2}  
        y2={yCoords.y2}  
        style={{stroke: shade, strokeWidth: 4}} 
        filter='url(#tickle)'
        onMouseEnter={() => { pettingLine( setPetting, turb ) }}
        onMouseLeave={() => { setPetting( false ) }}
      />
    </>
  )
}

export default Line;