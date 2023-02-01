import React, { useEffect, useState, useRef } from 'react';
import './Task.css';
import { TaskData } from '../DataTypeInterfaces';

function Task({taskData, taskIndex, changeHandler}:{taskData:TaskData, taskIndex:number, changeHandler:Function}) {
    const checkOne = useRef<SVGPathElement>(null);
    const checkTwo = useRef<SVGPathElement>(null);

    const [checkedValue, setCheckedValue] = useState(taskData.value);
    const [taskName, setTaskName] = useState(taskData.task);

    useEffect(() => {
      //return any changes to be saved
      changeHandler({task: taskName, value: checkedValue}, taskIndex);
    },[taskName, checkedValue]);

    useEffect(() => {
      //check any already checked boxes
      if(checkOne.current && checkTwo.current)
      if(taskData.value ==1) { //half tick
        checkOne.current.setAttribute('style', 'fill: green');
      }
      else if (taskData.value== 2) { //full tick
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

    function labelChange(e: React.FocusEvent<HTMLInputElement>) {
      let updatedText = e.target.innerHTML
      setTaskName(updatedText);
    }

  return (
    <div className="task">
      <div className="taskText">
        <p contentEditable={true} spellCheck={false} onBlur={labelChange}>{taskName}</p>
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
