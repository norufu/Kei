import React, { useEffect, useRef, useState } from 'react';
import './Everyday.css';
import Task from './Task';

// tasks, title, width, height
function Everyday({posX, posY, w, h, data} : {posX:number, posY:number, w:number, h:number, data:any}) {
    const thisDiv = useRef<HTMLDivElement>(null);

    const [taskArr, setTaskArr] = useState<any[]>([]);
    const [title, setTitle] = useState("Title");

    const [taskObjects, setTaskObjects] = useState<any>();
    const [showAdd, setShowAdd] = useState(false);


    console.log("uhh")

    useEffect(() => {
      if(thisDiv.current) {
        console.log(data.title);

        if(data.title != undefined) 
          setTitle(data.title);

        console.log(data.tasks);
        setTaskArr(data.tasks);
        thisDiv.current.style.width = w + "px";
        thisDiv.current.style.height = h + "px";
      }
    },[]);

    useEffect(() => {
      if(taskArr==undefined) return;
        let tempArr = [];
        for(let i = 0; i < taskArr.length; i++) {
            console.log(taskArr[i])
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
