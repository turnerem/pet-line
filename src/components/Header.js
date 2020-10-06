import React from 'react';
import useClock from "./useClock"

const displayTime = (time) => {
  const minutesPad = time.getMinutes() < 10 ? "0" : "";
  const secondsPad = time.getSeconds() < 10 ? "0" : "";

  return `${time.getHours()}:${minutesPad}${time.getMinutes()}:${secondsPad}${time.getSeconds()}`
}

const Header = () => {
  const time = useClock();

  return (
    <header className="App-header">
      <p>
        <code>I am a pet line {displayTime(time)}</code>.
      </p>
    </header>
  );
};

export default Header;