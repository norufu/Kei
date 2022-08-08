import React, { useEffect, useState } from 'react';
import Everyday from '../../Components/Everyday/Everyday';
import ScaleBox from '../../Components/ScaleBox/ScaleBox';
import Timer from '../../Components/Timer/Timer';
import './Dashboard.css';


function Dashboard() {
  const [scaleMode, setScaleMode] = useState(false);
  const [gridClass, setGridClass] = useState("");

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
  }, []);

  useEffect(() => {
    if(scaleMode)
      setGridClass("grid");
    else
      setGridClass("");
  }, [scaleMode]);

  function keyPress(e:any) {
    if(e.key === 'Shift') {
      setScaleMode(scaleMode => !scaleMode);
    }
  }

  return (
    <div className={"dashboard " + gridClass}>
        <ScaleBox scaleMode={scaleMode} children={<Timer />} />
        <ScaleBox scaleMode={scaleMode} children={<Everyday tasks={["Japanese", "Mandarin"]}/>}/>
    </div>
  );
}

export default Dashboard;
