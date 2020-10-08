import React, {useRef} from 'react';


const TickleFilter = () => {
  const petRef = useRef(null)

  return (
    <filter id="tickle">
      <feTurbulence type="fractalNoise" baseFrequency="0.00001 0.00001" numOctaves="1" result="warp"></feTurbulence>
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset" />
    </filter>

  );
};

export default TickleFilter;