import React, {useState, useEffect} from 'react';
import { petState } from '../data/petState';
import { calcHeadLoc, getLineCoordinates } from '../utils/mathUtils'
import { Pet } from '../petObj'
// import gsap from 'gsap';
import { moveToFood } from '../utils/petActions';

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
const useCoordinatesManager = ( svgDims, initialPetState = petState[pet.petState] ) => {

  const petTallness = svgDims.height * .9;
  const initialDistance = svgDims.width * .1;
  
  // swap around: find head loc from feet
  const { feetLocX, slope } = initialPetState;

  const feetLoc = {x2: feetLocX, y2: svgDims.height - 5}

  const headLoc = calcHeadLoc( feetLoc, petTallness, slope, svgDims)

  const yCoords = { y1: headLoc.y1, y2: feetLoc.y2 }

  // this needs to set head and foot x coords of new loc
  const [ xCoords, setXCoords ] = useState({ x1: headLoc.x1, x2: feetLoc.x2 })
    
  //const coordinates = getLineCoordinates( headLoc, feetLoc )
        
    useEffect(() => {
      const moveId = setInterval(() => {
        if (pet.hunger > 1 ) {
          moveToFood( xCoords, setXCoords, 400, 90 );
        } else {
          let distance = calcNextMove( initialDistance, xCoords.x2, svgDims.width )
          takeUnrealStep( distance, xCoords, setXCoords )
        }
    }, 5000 );

    return () => clearInterval( moveId );

  })

  return { xCoords, yCoords }
}

const takeUnrealStep = (distance, xCoords, setXCoords) => {
  setXCoords( { x1: xCoords.x1 + distance, x2: xCoords.x2 + distance } )
}

// const takeStep = (duration, distance) => {
//   TweenLite.to("#pet-line", duration, {x: distance})
// }

const calcNextMove = (distance, x, svgWidth) => {
  const distToRightEdge = svgWidth - x;
  const gettingTooCloseToRight = distance > 0 && distToRightEdge < distance;
  const gettingTooCloseToLeft = distance < 0 && x + distance < 0;

  if ( gettingTooCloseToRight || gettingTooCloseToLeft ) { 
      return distance * -1;
    } 
      
  return distance

}


const Line = ({ svgDims }) => {

  const { xCoords, yCoords } = useCoordinatesManager( svgDims )

  const { shade } = petState[pet.petState];

  console.log( 'pet state', pet.petState, 'hunger:', pet.hunger )


  return (
    <line 
      id='pet-line'
      x1={xCoords.x1} 
      y1={yCoords.y1}  
      x2={xCoords.x2}  
      y2={yCoords.y2}  
      style={{stroke: shade, strokeWidth: 4}} />
  )
}

export default Line;