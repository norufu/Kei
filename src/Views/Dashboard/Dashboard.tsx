import React from 'react';
import Everyday from '../../Components/Everyday/Everyday';
import ScaleBox from '../../Components/ScaleBox';
import Timer from '../../Components/Timer/Timer';
import './Dashboard.css';


function Dashboard() {
  return (
    <div className="dashboard">
        <ScaleBox><Timer></Timer></ScaleBox>
        <ScaleBox><Everyday tasks={["Japanese", "Mandarin"]}></Everyday></ScaleBox>
    </div>
  );
}

export default Dashboard;
