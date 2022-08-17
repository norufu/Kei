import React, { useEffect, useRef, useState } from 'react';
import './Everyday.css';
import Task from './Task';


function Everyday({tasks, title, width, height} : {tasks: string[], title:string, width:number, height:number}) {
    const thisDiv = useRef<HTMLDivElement>(null);

    const [taskArr, setTaskArr] = useState(tasks);

    const [taskObjects, setTaskObjects] = useState<any>();
    const [showAdd, setShowAdd] = useState(false);


    useEffect(() => {
      if(thisDiv.current) {
        // thisDiv.current.style.width = width + "px";
        // thisDiv.current.style.height = height + "px";
      }
    },[]);

    useEffect(() => {
        let tempArr = [];
        for(let i = 0; i < taskArr.length; i++) {
            let o = <Task key={i} task={taskArr[i]}></Task>
            tempArr.push(o);
        }
        setTaskObjects(tempArr);
    },[taskArr]);

    function addTask() {
      //add blank task
      setTaskArr(oldData => { 
        if(oldData) return[...oldData, "______"];
        else return["______"];
      })
    }

    function enterHandler() {
      setShowAdd(true);
    }
    function exitHandler() {
      setShowAdd(false);
    }

  return (
    <div ref={thisDiv} className="everyday">
        <p className='everydayTitle'>{title}</p>
        <div className='taskWrapper'>
          {taskObjects}
        </div>
        <div className='addTaskDiv' onMouseEnter={enterHandler} onMouseLeave={exitHandler}>
          {showAdd && <button className='addTaskButton' onClick={addTask}>Add Task</button>}
        </div>
    </div>
  );
}

export default Everyday;
