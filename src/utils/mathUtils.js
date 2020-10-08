
export const calcHeadLoc = ( feetLoc, petTallness, slope ) => {
  // find feet of pet line given head loc (relative to ground), line length, and lean (left/right)
  
    const { x2, y2 } = feetLoc;
    // height of head off ground

    const y1 = y2 + petTallness * slope / Math.sqrt( 1 + Math.pow(slope, 2) )

    const x1 = (y1 - y2) / slope + x2;
    console.log('headLoc: x1', x1, 'y1', y1)
    return {x1, y1}
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