import React, { useEffect, useState } from 'react';
import DropdownMenu from '../../Components/DropdownMenu/DropdownMenu';
import Everyday from '../../Components/Everyday/Everyday';
import ScaleBox from '../../Components/ScaleBox/ScaleBox';
import Timer from '../../Components/Timer/Timer';
import { toggleScale } from '../../Actions/Index';
import { addWidgetData } from '../../Actions/Index';
import { useDispatch, useSelector } from 'react-redux';
import './Dashboard.css';
import { RootState } from '../..';
import axios from 'axios'; 
import internal from 'stream';
import Widget from '../../Components/Widget/Widget';


function Dashboard() {
  const scaleMode = useSelector((state: RootState) => state.scaleMode);
  const wd = useSelector((state: RootState) => state.widgetData);

  const [showMenu, setShowMenu] = useState(false);
  const [menuCords, setMenuCords] = useState({x:0, y:0});
  const [widgets, setWidgets] = useState<JSX.Element[]>([]);

  const [gridClass, setGridClass] = useState("");
  const dispatch = useDispatch();

  const [serverData, setServerData] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [widgID, setWidgID] = useState(0);

  useEffect(() => {
    console.log("DASHBAORD LOADED")
    axios.get("http://127.0.0.1:8000")
    .then((response : any) => {
      console.log(response.data.token);
      setServerData(response.data.data);
      setToken(response.data.token);
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
        addWidget(i, serverData[i].type, serverData[i].posX, serverData[i].posY, serverData[i].w, serverData[i].h, serverData[i].data)
      }

    }
  }, [serverData]);

  useEffect(() => {
    //add to redux data
    console.log(widgets);
  }, [widgets]);


  //save board state
  const dataCallback = (widgetData : {}) =>{
    console.log(widgetData);
  }

  //
  function saveToServer() {
    console.log(wd);
    axios({
      method: "POST",
      url:"http://127.0.0.1:8000",
      data: wd,
      headers: {
        'X-CSRFToken': token
      }})
    .then(function (response) {
      console.log(response);
    })
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
    let w = 0;
    let h = 0;

    //set default w/h values
    switch(e.currentTarget.id.toLowerCase()) {
      case "timer":
        w=300;
        h=83;
        break;
      case "everyday":
        w=200;
        h=50;
        break;
      default:
        break;
    }
    console.log(w, h)
    addWidget(-1, e.currentTarget.id, 0, 0, w, h, {});
  }

  function addWidget(id:number, type:string, posX:number, posY:number, w:number, h:number, data:any) {

    if(id < 0) id=widgets.length;
    let newWidget = <Widget key={id} wid={id} save={dataCallback} type={type} posX={posX} posY={posY} w={w} h={h} data={data} ></Widget>;

    setWidgets(oldData => {
      if(oldData.length !== 0) {
        return [...oldData, newWidget]; 
      }
      else {
        return [newWidget]; 
      }
    })

    //add to redux data
    dispatch(addWidgetData({ 
      id: id,
      type: type,
      posX: posX, 
      posY: posY,
      w: w,
      h: h,
      data: data
    }));

    setWidgID(widgID + 1);
  }

  return (
    <div className={"dashboard " + gridClass}>
        {showMenu && <DropdownMenu options={[{text:"Timer", handler:menuAddWidget}, {text:"Everyday", handler:menuAddWidget}]} cords={menuCords} closeHandler={closeHandler}/>}
        {widgets}
        <button onClick={saveToServer}>Save Test</button>
    </div>
  );
}

export default Dashboard;
