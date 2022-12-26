import React, { useEffect, useState } from 'react';
import DropdownMenu from '../../Components/DropdownMenu/DropdownMenu';
import Everyday from '../../Components/Everyday/Everyday';
import ScaleBox from '../../Components/ScaleBox/ScaleBox';
import Timer from '../../Components/Timer/Timer';
import { toggleScale } from '../../Actions/Index';
import { useDispatch, useSelector } from 'react-redux';
import './Dashboard.css';
import { RootState } from '../..';
import axios from 'axios'; 
import internal from 'stream';
import Widget from '../../Components/Widget/Widget';
import Paint from '../../Components/Paint/Paint';


function Dashboard() {
  const scaleMode = useSelector((state: RootState) => state.scaleMode);
  const [showMenu, setShowMenu] = useState(false);
  const [menuCords, setMenuCords] = useState({x:0, y:0});
  const [widgets, setWidgets] = useState<JSX.Element[]>([]);

  const [gridClass, setGridClass] = useState("");
  const dispatch = useDispatch();

  const [serverData, setServerData] = useState<any[]>([]);


  useEffect(() => {
    console.log("DASHBAORD LOADED")
    axios.get("http://127.0.0.1:8000")
    .then((response : any) => {
      console.log(response.data);
      setServerData(response.data);
    })

    document.addEventListener("keydown", keyPress);

    document.addEventListener("contextmenu", (e) => {
      openMenu(e)
    });
  }, []);

  useEffect(() => {
    //generate widgets from serverdata
    if(serverData != undefined){
      console.log("SERVER DATA UPDATED")

      for(let i = 0; i < serverData.length; i++) {
        console.log(serverData[i])
        addWidget(serverData[i].type, serverData[i].posX, serverData[i].posY, serverData[i].w, serverData[i].h, serverData[i].data)
      }

    }
  }, [serverData]);

  //save board state

  const dataCallback = (widgetData : {}) =>{
    console.log(widgetData);
  }

  function saveToServer() {
    console.log(widgets[0].props.children);

    
    let saveData = []

  }

  //show/hide grid
  useEffect(() => {
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

  function openMenu(e:any) { // on right click open menu to add
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
    addWidget(e.currentTarget.id, 0, 0, 0, 0, {});
  }

  function addWidget(type:string, posX:number, posY:number, w:number, h:number, data:any) {
    let k = widgets.length;
    let newWidget = <Widget key={k} save={dataCallback} type={type} posX={posX} posY={posY} w={w} h={h} data={data} ></Widget>;
    setWidgets(oldData => {
      if(oldData) return [...oldData, newWidget]; 
      else return [newWidget]; 
    })
  }

  return (
    <div className={"dashboard " + gridClass}>
        {showMenu && <DropdownMenu options={[{text:"Timer", handler:menuAddWidget}, {text:"Everyday", handler:menuAddWidget}]} cords={menuCords} closeHandler={closeHandler}/>}
        {/* <Widget type="timer" posX={500} posY={100} w={150} h={300} data={{}}></Widget> */}
        {widgets}
        <button onClick={saveToServer}>Save Test</button>
    </div>
  );
}

export default Dashboard;
