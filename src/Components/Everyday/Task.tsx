import React, { useEffect, useState, useRef } from 'react';
import './Task.css';


function Task({task, value}:{task:string, value:number}) {
    const checkOne = useRef<SVGPathElement>(null);
    const checkTwo = useRef<SVGPathElement>(null);

    const [checkedValue, setCheckedValue] = useState(value);

    useEffect(() => {
        // https://stackoverflow.com/questions/1391278/contenteditable-change-events
    },[]);

    useEffect(() => {
      //check any already checked boxes
      if(checkOne.current && checkTwo.current)
      if(value ==1) { //half tick
        checkOne.current.setAttribute('style', 'fill: green');
      }
      else if (value== 2) { //full tick
        checkOne.current.setAttribute('style', 'fill: green');
        checkTwo.current.setAttribute('style', 'fill: green');
      }

    },[checkedValue]);

    function halfTick(e: any) {
      if(e.target.getAttribute("style") === 'fill: green') {
        e.target.setAttribute('style', 'fill: #D9D9D9');
        setCheckedValue(checkedValue-1);
      }
      else {
        e.target.setAttribute('style', 'fill: green');
        setCheckedValue(checkedValue-1);
      }
    }

    function fullTick(e: any) {
      console.log("full")
    }



  return (
    <div className="task">
      <div className="taskText">
        <p contentEditable={true}>{task}</p>
      </div>
      <div className='taskBox'>
        <svg width="25" height="25" viewBox="0 0 203 204" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path ref={checkOne} onClick={halfTick} d="M200.5 200.5V0.5L0.5 200.5H200.5Z" fill="#D9D9D9"/>
          <path ref={checkTwo} onClick={halfTick} d="M0.5 0.5V200.5L200.5 0.5H0.5Z" fill="#D9D9D9"/>
        </svg>
      </div>
    </div>
  );
}

export default Task;
