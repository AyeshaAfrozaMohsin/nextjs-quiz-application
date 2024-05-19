import { useState, useEffect } from "react";

const Timer = ({ onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    onTimeUpdate(seconds);
  }, [seconds, onTimeUpdate]);

  return (
    <div className="timer fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-200 border border-black rounded shadow-lg p-2">
      <p>Timer : {seconds} seconds</p>
    </div>
  );
};

export default Timer;
