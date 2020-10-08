import React, { useState } from 'react';
import './App.css';
import Header from "./components/Header"
import Line from "./components/Line"
import FoodBowl from './components/FoodBowl'

export const ConfigContext = React.createContext();

// const configs = {
//   svgHeight: 210,
//   svgWidth: 500,
// }

// the ground outside should be shimmering green grass
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
 
    //takeStep(2, 100);
    //useMovement( 50, feetLoc.x2, svgDims.width )


    // alternative to this, if it's causing extra rerendering, is to have a food bowl data manager
    const [ foodUnits, setFoodUnits ] = useState(9)

    return (
      <div className="App">
        <Header />
        <svg height={svgDims.height} width={svgDims.width} className="App-pet">
          <defs>
            <filter id="feDisplace">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" result="warp"></feTurbulence>
              <feDisplacementMap xChannelSelector="A" scale="15" in="SourceGraphic" in2="warp" />
            </filter>
            <filter id="tickle">
              <feTurbulence type="fractalNoise" baseFrequency="0.00001 0.00001" numOctaves="1" result="warp"></feTurbulence>
              <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="60" in="SourceGraphic" in2="warpOffset" />
            </filter>
          </defs>

          <Line
            svgDims={svgDims}
            foodUnits={foodUnits}
            setFoodUnits={setFoodUnits}
          />
          <Ground svgDims={svgDims} />
          <FoodBowl 
            filter={"feDisplace"}
            // foodBowlDims={foodBowlDims}
            foodUnits={foodUnits}
            setFoodUnits={setFoodUnits}
            svgDims={svgDims}
          />
        </svg>
      </div>
    );

  }



export default App;
