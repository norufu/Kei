import React, { useEffect, useRef, useState } from 'react';
import './Everyday.css';
import Task from './Task';

// tasks, title, width, height
function Everyday({data, dataHandler} : {data:any, dataHandler: Function}) {
    const thisDiv = useRef<HTMLDivElement>(null);

    const [taskArr, setTaskArr] = useState<any[]>([]);
    const [title, setTitle] = useState("Title");

    const [taskObjects, setTaskObjects] = useState<any>();
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
      if(thisDiv.current) {
        if(data.title != undefined) 
          setTitle(data.title);

        setTaskArr(data.tasks);
      }
    },[]);

    useEffect(() => {
      if(taskArr==undefined) return;
        let tempArr = [];
        for(let i = 0; i < taskArr.length; i++) {
            let o = <Task key={i} task={taskArr[i].task} value={taskArr[i].value}></Task>
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
