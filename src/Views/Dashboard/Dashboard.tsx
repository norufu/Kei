import React, { useEffect, useState } from 'react';
import DropdownMenu from '../../Components/DropdownMenu/DropdownMenu';
import { toggleScale } from '../../Actions/Index';
import { addWidgetData } from '../../Actions/Index';
import { useDispatch, useSelector } from 'react-redux';
import './Dashboard.css';
import { RootState } from '../..';
import axios from 'axios'; 
import Widget from '../../Components/Widget/Widget';
import widgetDimensions from '../../WidgetData.json'
import Modal from '../../Components/Modal/Modal';
import ModalWidgetBox from '../../Components/Modal/DashboardModal/ModalWidgetBox/ModalWidgetBox';

function Dashboard() {
  const scaleMode = useSelector((state: RootState) => state.scaleMode);
  const wd = useSelector((state: RootState) => state.widgetData);

  const [showMenu, setShowMenu] = useState(false);
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);
  const [menuCords, setMenuCords] = useState({x:0, y:0});
  // const [widgets, setWidgets] = useState<JSX.Element[]>([]);

  const [gridClass, setGridClass] = useState("");
  const dispatch = useDispatch();

  const [serverData, setServerData] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");
  const [widgID, setWidgID] = useState(0);

  const [showDashboardModal, setShowDashboardModal] = useState(true);

  const modalData = generateModalData();
  const widgets = generateWidgetArray();

  function generateModalData() {
    let modalDataReturn = []; 
    for(let i = 0; i < wd.length; i++) {
      modalDataReturn.push(<ModalWidgetBox widgetType={wd[i].type} id={wd[i].id}></ModalWidgetBox>)
    }
    return(modalDataReturn)
  };

  function generateWidgetArray() { //on rerender update any component changes
    let newWidgetArr = []
    for(let i = 0; i < wd.length; i++) {
      //create new widget and add to array based on widget data
      let newWidget = <Widget key={wd[i].id} wid={wd[i].id} type={wd[i].type} posX={wd[i].posX} posY={wd[i].posY} w={wd[i].w} h={wd[i].h} scaleX={wd[i].scaleX} scaleY={wd[i].scaleY} data={wd[i].data}></Widget>;
      newWidgetArr.push(newWidget);
    }
    return(newWidgetArr);
  } 


  useEffect(() => {
    console.log("DASHBAORD LOADED")
    axios.get("http://127.0.0.1:8000")
    .then((response : any) => {
      setServerData(response.data.data);
      setToken(response.data.token);
    })
  }, []);

  useEffect(() => {
    //generate widgets from serverdata
    if(serverData != undefined){
      console.log("SERVER DATA UPDATED")

      for(let i = 0; i < serverData.length; i++) {
        addWidget(i, serverData[i].type, serverData[i].posX, serverData[i].posY, serverData[i].w, serverData[i].h, serverData[i].scaleX, serverData[i].scaleY, serverData[i].data)
      }
    }
  }, [serverData]);

  useEffect(() => {
  }, [widgets]);

  useEffect(() => {
  }, [showDashboardModal]);

  //Save updates to server
  function saveToServer() {
    console.log(wd);
    axios({
      method: "POST",
      url:"http://127.0.0.1:8000",
      data: wd,
      headers: {
        'X-CSRF-Token': token
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

  function keyPress(e:React.KeyboardEvent) {
    if(e.key === 'Shift') {
      dispatch(toggleScale());
    }
  }

  function openMenu(e:any) { // on right click open menu to add
    e.preventDefault()

    console.log(e.target);
    if(e.target.id === 'dashboard') {
      let mx = e.clientX;
      let my = e.clientY;
      setShowMenu(true);
      setShowWidgetMenu(false);
      setMenuCords({x:mx-10,y:my-10});
    }
    else {
    }
  }

  function closeHandler() {
    setShowMenu(false)
    setShowWidgetMenu(false);
  }
 
  function menuAddWidget(e: React.MouseEvent<HTMLElement>) {
    let w = 0;
    let h = 0;
    let widgetType = e.currentTarget.id.toLowerCase().toString()
    //set default w/h values      - ideally figure out to do widgetDimensions[variable] in typescript
    switch(e.currentTarget.id.toLowerCase()) {
      case "timer": 
        w=widgetDimensions.timer.w;
        h=widgetDimensions.timer.h;
        break;
      case "everyday":
        w=widgetDimensions.everyday.w;
        h=widgetDimensions.everyday.h;
        break;
      case "march":
        w=widgetDimensions.march.w;
        h=widgetDimensions.march.h;
        break;
      case "paint":
        w=widgetDimensions.paint.w;
        h=widgetDimensions.paint.h;
        break;
      default:
        break;
    }
    addWidget(-1, e.currentTarget.id, 0, 0, w, h, 1, 1, {});
  }


  function addWidget(id:number, type:string, posX:number, posY:number, w:number, h:number, scaleX:number, scaleY: number, data:any) {


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

  function openModal() {
    setShowDashboardModal(true);
  }

  const closeModal = (e:React.MouseEvent<HTMLElement>) => {
    setShowDashboardModal(false);
  }
  return (
    <div id='dashboard' className={"dashboard " + gridClass} onKeyUp={keyPress} onContextMenu={openMenu} tabIndex={0}>
      <Modal closeHandler={closeModal} show={showDashboardModal}><>{modalData}</></Modal>
        {showMenu && <DropdownMenu options={[{text:"Timer", handler:menuAddWidget}, {text:"Everyday", handler:menuAddWidget}, {text:"March", handler:menuAddWidget},  {text:"Paint", handler:menuAddWidget}, {text:"SEPARATOR", handler:menuAddWidget}, {text:"Options", handler:openModal} ]} cords={menuCords} closeHandler={closeHandler}/>}
        {widgets}
        <button onClick={saveToServer}>Save Test</button>
        {/* <Paint data={{}}></Paint> */}
    </div>
  );
}

export default Dashboard;
