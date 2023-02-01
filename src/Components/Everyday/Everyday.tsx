import React, { useEffect, useRef, useState } from 'react';
import './Everyday.css';
import Task from './Task';
import { TaskData } from '../DataTypeInterfaces';

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

        //initialize the task compnents
        let tempArr = [];
        for(let i = 0; i < data.tasks.length; i++) {
            let o = <Task key={i} taskData={data.tasks[i]} taskIndex={i} changeHandler={taskChangeHandler}></Task>
            tempArr.push(o);
        }
        setTaskObjects(tempArr);
        setTaskArr(data.tasks);
      }
    },[]);

    useEffect(() => {
      dataHandler({title: title, tasks: taskArr});
    },[taskArr]);

    function addTask() {
      //add blank task
      setTaskArr(oldData => { 
        if(oldData) return[...oldData, "______"];
        else return["______"];
      })
    }

    function taskChangeHandler(updatedTask:TaskData, taskIndex:number) {
      //update the task in the array
      setTaskArr(oldData => { 
        let updated = [...oldData];
        updated[taskIndex] = updatedTask;
        return(updated);
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
