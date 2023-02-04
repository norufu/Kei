import React, { useEffect, useRef, useState } from 'react';
import './Everyday.css';
import './Task.css';

import Task from './Task';
import { TaskData } from '../DataTypeInterfaces';

// tasks, title, width, height
function Everyday({data, dataHandler} : {data:any, dataHandler: Function}) {
    const thisDiv = useRef<HTMLDivElement>(null);

    const [taskArr, setTaskArr] = useState<any[]>([]);
    const [title, setTitle] = useState("Title");

    const [showAdd, setShowAdd] = useState(false);

    const taskObjects = generateTaskObjects();

    useEffect(() => {
      if(thisDiv.current) {
        if(data.title != undefined) 
          setTitle(data.title);


        setTaskArr(data.tasks);
      }
    },[]);

    useEffect(() => {
      dataHandler({title: title, tasks: taskArr});
    },[taskArr, title]);

    function generateTaskObjects() { //creates the task components 
      let tempArr = [];
      if(taskArr) { //if loading tasks from db
        for(let i = 0; i < taskArr.length; i++) {
          let o = <Task key={i} taskData={taskArr[i]} taskIndex={i} changeHandler={taskChangeHandler}></Task>
          tempArr.push(o);
        }
      }
      else { //if creating a new widget
        tempArr.push(<Task key={0} taskData={{task: "Click to Edit", value: 0}} taskIndex={0} changeHandler={taskChangeHandler}></Task>);
      }
      return(tempArr);
    }

    function addTask() {
      //add blank task
      setTaskArr(oldData => { 
        console.log(oldData);
        if(oldData) return[...oldData, {task: "Click to Edit", value: 0}];
        else return[ {task: "Click to Edit", value: 0}];
      })

      if(thisDiv.current){
        // thisDiv.current.style.width = "auto";
        // thisDiv.current.style.height = "auto";
        // let widgetRect = thisDiv.current.getBoundingClientRect();
        // thisDiv.current.style.width = widgetRect.width + "px";
        // thisDiv.current.style.height = widgetRect.height + "px";
      }
    }

    function taskChangeHandler(updatedTask:TaskData, taskIndex:number) {
      //update the task in the array
      setTaskArr(oldData => { 
        let updated = [...oldData];
        updated[taskIndex] = updatedTask;
        return(updated);
      })
    }

    function titleChange(e: React.FocusEvent<HTMLInputElement>) {
      setTitle(e.target.innerHTML);
    }

    function enterHandler() {
      setShowAdd(true);
    }
    function exitHandler() {
      setShowAdd(false);
    }

  return (
    <div ref={thisDiv} className="everyday">
        <p className='title' contentEditable={true} spellCheck={false} onBlur={titleChange} suppressContentEditableWarning={true}>{title}</p>
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
