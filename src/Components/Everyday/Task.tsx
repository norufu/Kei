import React, { useEffect, useState } from 'react';
import './Task.css';


function Task({task}:{task:String}) {

    useEffect(() => {
        console.log(task);
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
        <p>{task}</p>
        <svg width="50" height="50" viewBox="0 0 203 204" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path onClick={halfTick} d="M179.097 39.0347C196.138 59.3566 204.409 85.616 202.09 112.036C199.77 138.456 187.05 162.873 166.728 179.914C146.406 196.956 120.147 205.227 93.727 202.907C67.3069 200.588 42.8904 187.868 25.8488 167.546L179.097 39.0347Z" fill="#D9D9D9"/>
          <path onClick={halfTick} d="M23.9209 165.247C6.87928 144.925 -1.39152 118.666 0.927999 92.2457C3.24752 65.8257 15.9673 41.4092 36.2893 24.3676C56.6112 7.32594 82.8705 -0.944861 109.291 1.37465C135.711 3.69417 160.127 16.414 177.169 36.7359L23.9209 165.247Z" fill="#D9D9D9"/>
        </svg>
    </div>
  );
}

export default Task;
