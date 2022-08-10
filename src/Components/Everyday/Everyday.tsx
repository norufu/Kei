import React, { useEffect, useState } from 'react';
import './Everyday.css';
import Task from './Task';


function Everyday({tasks, title} : {tasks: string[], title:string}) {
    const [taskObjects, setTaskObjects] = useState<any>();

    useEffect(() => {
        let tempArr = [];
        for(let i = 0; i < tasks.length; i++) {
            let o = <Task task={tasks[i]}></Task>
            tempArr.push(o);
        }
        setTaskObjects(tempArr);
    },[]);

  return (
    <div className="everyday">
        <p className='everydayTitle'>{title}</p>
        <div className='taskWrapper'>
          {taskObjects}
        </div>
    </div>
  );
}

export default Everyday;
