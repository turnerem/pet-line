import { useEffect, useState } from "react"


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

export default useClock;