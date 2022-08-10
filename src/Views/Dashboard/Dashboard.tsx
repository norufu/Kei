import React, { useEffect, useState } from 'react';
import DropdownMenu from '../../Components/DropdownMenu/DropdownMenu';
import Everyday from '../../Components/Everyday/Everyday';
import ScaleBox from '../../Components/ScaleBox/ScaleBox';
import Timer from '../../Components/Timer/Timer';
import './Dashboard.css';


const scaleModeContext = {
  scaleMode: true,
}
export const scaleContext = React.createContext(scaleModeContext)

function Dashboard() {
  const [scaleMode, setScaleMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuCords, setMenuCords] = useState({x:0, y:0});
  const [widgets, setWidgets] = useState<JSX.Element[]>([]);

  const [gridClass, setGridClass] = useState("");

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    // document.addEventListener("mousedown", mouseHandler);
    document.addEventListener("contextmenu", (e) => {
      openMenu(e)
    });
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
  function openMenu(e:any) {
    let mx = e.clientX;
    let my = e.clientY;
    setShowMenu(true);
    setMenuCords({x:mx,y:my});
    e.preventDefault()
  }

  function closeHandler() {
    setShowMenu(false)
  }
// 
  function menuAddWidget(e:any) {
    console.log(e.currentTarget.id)
    addWidget(e.currentTarget.id);
  }
  function addWidget(type:string) {
    console.log(type);
    let newWidget;
    switch(type.toLowerCase()) {
      case "timer":
        newWidget = <Timer/>
        break;
      case "everyday":
        newWidget = <Everyday tasks={[]}/>
        break;
      default:
        newWidget = null;
        break;
    }
    console.log(newWidget)
    if(newWidget) { //add the new widget
      let k = widgets.length;
      let addWidget = <ScaleBox key={k} children={newWidget}></ScaleBox>
      console.log(addWidget);
      setWidgets(oldData => {
        if(oldData) return [...oldData, addWidget]; 
        else return [addWidget]; 
      })
      }

  }

  return (
    <scaleContext.Provider value={{scaleMode: scaleMode}}>
      <div className={"dashboard " + gridClass}>
          {showMenu && <DropdownMenu options={[{text:"Timer", handler:menuAddWidget}, {text:"Everyday", handler:menuAddWidget}]} cords={menuCords} closeHandler={closeHandler}/>}
          <ScaleBox children={<Timer></Timer>}></ScaleBox>
          {widgets}
      </div>
    </scaleContext.Provider>
  );
}

export default Dashboard;
