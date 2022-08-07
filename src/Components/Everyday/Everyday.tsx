import React, { useEffect, useState } from 'react';
import './Everyday.css';
import Task from './Task';


function Everyday({tasks} : {tasks: string[]}) {
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
        {taskObjects}
    </div>
  );
}

export default Everyday;
