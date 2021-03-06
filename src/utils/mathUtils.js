
export const calcHeadLoc = ( feetLoc, petTallness, slope ) => {
// find feet of pet line given head loc (relative to ground), line length, and lean (left/right)

  const { x2, y2 } = feetLoc;
  // height of head off ground

  const y1 = y2 + petTallness * slope / Math.sqrt( 1 + Math.pow(slope, 2) )

  const x1 = (y1 - y2) / slope + x2;
  console.log('headLoc: x1', x1, 'y1', y1)
  return {x1, y1}
}

export const calcRect = ( xCoords, yCoords ) => {
  // const personalSpace = 50;
  let padding = 10;

  const { x1, x2 } = xCoords;

  const { y1, y2 } = yCoords;

  const rectHeight = y2 - y1;
  let rectWidth = Math.abs( x2 - x1 );
  // padding = ( rectWidth < personalSpace ) && personalSpace / 2;

  rectWidth += padding;

  const leftLean = ( x2 > x1 ) ? true : false;

  let rectX1 = ( leftLean ) ? x1 : x2;
  rectX1 -= padding;

  return { x: rectX1, width: rectWidth, y: y1, height: rectHeight }
}

export const getLineCoordinates = ( headLoc, feetLoc ) => {
  return { ...headLoc, ...feetLoc }
}

export const lengthSideOfRightAndleTriangle = ( hypotenuse = null, length2, length3 = null ) => {
  // how to ensure no nonsense values ever get passed in?
  return hypotenuse 
    ? Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(length2, 2))
    : Math.sqrt(Math.pow(length2, 2) + Math.pow(length3, 2))
}


export const arrayIncrementVal = ( a, increment, times ) => {
  const arr = Array( times );
  let arrVal = a;

  for ( let i = 0; i < times; i++ ) {
    arr[i] = arrVal;
    arrVal += increment;
  }
  return arr
}

export const arraysCombos = (arr1, arr2) => {
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

export const roundDp = ( num, dp = 2 ) => {
  const rounder = Math.pow( 10, dp );

  return Math.round( num * rounder ) / rounder
}