import React, {useState, useEffect, useRef} from 'react';
import { petState } from '../data/petState';
import { calcHeadLoc, calcRect } from '../utils/mathUtils'
import { Pet } from '../petObj'
import gsap from 'gsap';
import { moveToFood, eat, takeUnrealStep } from '../utils/petActions';

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

  const [ stepMvmt, setStepMvmt ] = useState(svgDims.width * .1)
        
  const [ petting, setPetting ] = useState( false )


  const petTallness = svgDims.height * .9;  

  const { feetLocX, slope } = initialPetState;
  const feetLoc = {x2: feetLocX, y2: svgDims.height - 5}

  // const [ slopeFlip, setSlopeFlip ] = useState( stepMvmt < 0 ?)
  // this is recalculating at every interval. Make custom hook and only recalculate when pet changes direction
  const headLoc = calcHeadLoc( feetLoc, petTallness, slope, svgDims)

  
  const yCoords = { y1: headLoc.y1, y2: feetLoc.y2 }
  
  // this needs to set head and foot x coords of new loc
  const [ xCoords, setXCoords ] = useState({ x1: headLoc.x1, x2: feetLoc.x2 })
  
  const rectCoords = calcRect( xCoords, yCoords )


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
              setStepMvmt( stepMvmt * -1 )
            }
            takeUnrealStep( stepMvmt, xCoords, setXCoords )
          }
        } else {
          console.log( 'petting! ')
        }
    }, 1800 * (1 + 3 * Math.random() ) );

    return () => clearInterval( moveId );

  })

  return { xCoords, yCoords, rectCoords, setPetting }
}



// const takeStep = (duration, distance) => {
//   TweenLite.to("#pet-line", duration, {x: distance})
// }

// return true if time to change direction
const redirectNextMove = (stepMvmt, x, svgWidth) => {
  let distToRightEdge = svgWidth - x;
  let gettingTooCloseToRight = stepMvmt > 0 && distToRightEdge < stepMvmt * 2;
  let gettingTooCloseToLeft = stepMvmt < 0 && x + stepMvmt * 2 < 0;

  if ( gettingTooCloseToRight || gettingTooCloseToLeft ) { 
    return true
  } 
  return false
}

const pettingLine = ( setPetting, tl ) => {

  setPetting( true )

  // console.log('the turb', turb)


  // tl.to(turbVal, { duration: 0.2, val: 0.000001 });

  tl.restart()

}


// check App is loaded before defining tl
const Line = ({ svgDims, foodUnits, setFoodUnits }) => {

  const { xCoords, yCoords, rectCoords, setPetting } = useCoordinatesManager( svgDims, foodUnits, setFoodUnits )

  // const petRef = useRef(null)

  const { shade } = petState[pet.petState];

  const turb = document.querySelector('#tickle feTurbulence');

  const turbVal = { val: 0.000001 }

  const tl = gsap.timeline({ paused: true, onUpdate: 
    function() {
      turb.setAttribute('baseFrequency', '0 ' + turbVal.val);
    } 
  });

  tl.to(turbVal, { duration: 0.5, val: 0.063 });
  tl.to(turbVal, { duration: 0.5, val: 0.000001 });

  console.log('the turb in Line', turb)

  // put line on rect and adjust the rect for line diagonality
  // then put the filter on the rectangle
  return (
    <>
      <rect
        id='pet-line'
        {...rectCoords}
        transform='rotate(20)'
        style={{stroke: shade, fill: shade}} 
        filter='url(#tickle)'
        onMouseEnter={() => { pettingLine( setPetting, tl ) }}
        onMouseLeave={() => { setPetting( false ) }}
        />
      <line 
        id='pet-line'
        x1={xCoords.x1} 
        y1={yCoords.y1}  
        x2={xCoords.x2}  
        y2={yCoords.y2}  
        strokeWidth='8'
        />
    </>
  )
}

export default Line;