export const calcFeetLoc = ( headLoc, petTallness, leanDir, svgDims ) => {
    // find feet of pet line given head loc (relative to ground), line length, and lean (left/right)
  
    const { x1, y1 } = headLoc;
    const { height } = svgDims;
    // height of head off ground
    const headToGround = height - y1;
  
    const horizDistToFeet = lengthSideOfRightAndleTriangle( petTallness, headToGround )
  
    return leanDir === 'left'
      ? { x2: x1 + horizDistToFeet, y2: height }
      : { x2: x1 - horizDistToFeet, y2: height }
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
