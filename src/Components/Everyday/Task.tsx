import React, { useEffect, useState } from 'react';
import './Task.css';


function Task({task}:{task:String}) {

    useEffect(() => {
        console.log(task);
        // https://stackoverflow.com/questions/1391278/contenteditable-change-events
    },[]);

    function halfTick(e: any) {
      if(e.target.getAttribute("style") === 'fill: green') {
        console.log("hsdk")
        e.target.setAttribute('style', 'fill: #D9D9D9');
      }
      else {
        e.target.setAttribute('style', 'fill: green');
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
          <path onClick={halfTick} d="M200.5 200.5V0.5L0.5 200.5H200.5Z" fill="#D9D9D9"/>
          <path onClick={halfTick} d="M0.5 0.5V200.5L200.5 0.5H0.5Z" fill="#D9D9D9"/>
        </svg>
      </div>
    </div>
  );
}

export default Task;
