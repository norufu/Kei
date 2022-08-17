import React, { useEffect, useState } from 'react';
import DropdownMenu from '../../Components/DropdownMenu/DropdownMenu';
import Everyday from '../../Components/Everyday/Everyday';
import ScaleBox from '../../Components/ScaleBox/ScaleBox';
import Timer from '../../Components/Timer/Timer';
import { toggleScale } from '../../Actions/Index';
import { useDispatch, useSelector } from 'react-redux';
import './Dashboard.css';
import { RootState } from '../..';


function Dashboard() {
  const scaleMode = useSelector((state: RootState) => state.scaleMode);
  const [showMenu, setShowMenu] = useState(false);
  const [menuCords, setMenuCords] = useState({x:0, y:0});
  const [widgets, setWidgets] = useState<JSX.Element[]>([]);

  const [gridClass, setGridClass] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    // document.addEventListener("mousedown", mouseHandler);
    document.addEventListener("contextmenu", (e) => {
      openMenu(e)
    });
  }, []);

  useEffect(() => {
    console.log(scaleMode)
    if(scaleMode)
      setGridClass("grid");
    else
      setGridClass("");
  }, [scaleMode]);

  function keyPress(e:any) {
    if(e.key === 'Shift') {
      dispatch(toggleScale());
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
        newWidget = <Everyday tasks={[]} title="title" width={100} height={200}/>
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
    <div className={"dashboard " + gridClass}>
        {showMenu && <DropdownMenu options={[{text:"Timer", handler:menuAddWidget}, {text:"Everyday", handler:menuAddWidget}]} cords={menuCords} closeHandler={closeHandler}/>}
        {/* <ScaleBox children={<Timer></Timer>}></ScaleBox> */}
        <ScaleBox children={<Everyday tasks={["Japanese", "Mandarin", "Workout"]} title={"Everyday"} width={100} height={200}></Everyday>}></ScaleBox>
        <ScaleBox children={<div className='test'><p>Tilted</p></div>}></ScaleBox>

        {widgets}
    </div>
  );
}

export default Dashboard;
