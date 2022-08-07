import React, { useEffect, useRef, useState } from 'react';
import './Timer.css';


function Timer() {
    const [time, setTime] = useState(0);
    const [rate, setRate] = useState(10);
    const [isPaused, setIsPaused] = useState(true);
      
    useInterval(() => {
        // Your custom logic here
        if(!isPaused) {
            setTime(time + 1);
        }
    }, rate);


    function startTimer() {
        setIsPaused(isPaused => false);
        console.log("start")
    }

    function stopTimer() {
        setIsPaused(isPaused => true);
    }

    function resetTimer() {
        stopTimer();
        setTime(0);
    }

    return (
    <div className='timerDiv'>
        <p className='timerP'>{(Math.floor(time / (1000 * 60 * 60))).toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping: false,}) + ":" 
        + (Math.floor((time / 1000 / 60) % 60)).toLocaleString("en-US", {minimumIntegerDigits: 2,useGrouping: false}) + ":" 
        + (Math.floor((time / 100) % 60)).toLocaleString("en-US", {minimumIntegerDigits: 2,useGrouping: false})}</p>

        <button className='timerButton' onClick={startTimer}>Start</button>

        <button className='timerButton' onClick={stopTimer}>Pause</button>
        <button className='timerButton' onClick={resetTimer}>Reset</button>

    </div>);
}

    function useInterval(callback: Function, delay: number) {
        const savedCallback = useRef(callback);
      
        // Remember the latest function.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        // Set up the interval.
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
    }

export default Timer;
