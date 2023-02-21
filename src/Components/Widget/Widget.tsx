import React, { useEffect, useState } from 'react';
import Everyday from '../Everyday/Everyday';
import ScaleBox from '../ScaleBox/ScaleBox';
import Timer from '../Timer/Timer';
import './Widget.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateWidget } from '../../Actions/Index';
import March from '../March/March';
import Paint from '../Paint/Paint';
import DropdownMenu from '../DropdownMenu/DropdownMenu';
import widgetDimenions from '../../WidgetData.json';
import Dashboard from '../../Views/Dashboard/Dashboard';

interface scaleBoxData {
  posX: number;
  posY: number;
  w: number;
  h: number;
  scaleX: number;
  scaleY: number;
}

function Widget({wid, save, type, posX, posY, w, h, scaleX, scaleY, data, removeHandler} : {wid: number, save:Function, type:string, posX:number, posY:number, w:number, h:number, scaleX:number, scaleY:number, data:any, removeHandler:Function}) {
  const dispatch = useDispatch();
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);
  const [menuCords, setMenuCords] = useState({x:0, y:0});

  const [comp, setComp] = useState<JSX.Element>();
  const [scaleBoxData, setScaleBoxData] = useState<scaleBoxData>({posX: posX, posY: posY, w: w, h: h, scaleX: scaleX, scaleY: scaleY});
  const [widgetData, setWidgetData] = useState<any>(data);
  const [minDimensions, setMinDimensions] = useState<{w:number,h:number}>({w:-1, h:-1});

  useEffect(() => {
    let newWidget;
    console.log(widgetDimenions)
    switch(type.toLowerCase()) {
        case "timer":
          newWidget = <Timer dataHandler={getWidgetData} data={data}/>
          setMinDimensions(widgetDimenions.timer);
          break;
        case "everyday":
          newWidget = <Everyday dataHandler={getWidgetData} data={data}/>
          setMinDimensions(widgetDimenions.everyday);
          break;
        case "march":
          newWidget = <March dataHandler={getWidgetData} data={data}/>
          setMinDimensions(widgetDimenions.march);
          break;
        case "paint":
          newWidget = <Paint dataHandler={getWidgetData} data={data}/>
          setMinDimensions(widgetDimenions.paint);
          break;
        default:
          newWidget = null;
          break;
    }
    if(newWidget!=null)
        setComp(newWidget);

}, []);

function getScaleBoxData(updateX : number, updateY: number, updateW:number, updateH: number, scaleX: number, scaleY: number) {
  setScaleBoxData({posX: updateX, posY: updateY, w: updateW, h: updateH, scaleX: scaleX, scaleY: scaleY});
}

function getWidgetData(data: any) {
  setWidgetData(data);
}

  useEffect(() => {
    dispatch(updateWidget({ 
        id: wid,
        type: type,
        posX: scaleBoxData.posX, 
        posY: scaleBoxData.posY,
        w: scaleBoxData.w,
        h: scaleBoxData.h,
        scaleX: scaleBoxData.scaleX,
        scaleY: scaleBoxData.scaleY,
        data: widgetData
    }));
  }, [scaleBoxData, widgetData]);


  function openMenu(e:React.MouseEvent<HTMLElement>) { // on right click open menu to add
    e.preventDefault()
    let mx = e.clientX;
    let my = e.clientY;
    setShowWidgetMenu(true);
    setMenuCords({x:mx-10,y:my-10});
  }
  function removeWidget(e:React.MouseEvent<HTMLElement>) {
    removeHandler(e, wid)
  }

  function closeHandler() {
    setShowWidgetMenu(false)
  }

  return (
      <div onContextMenu={openMenu}>
        {showWidgetMenu && <DropdownMenu options={[{text:"Remove Widget", handler:removeWidget}]} cords={menuCords} closeHandler={closeHandler}/>}

        {comp ? <ScaleBox dataHandler={getScaleBoxData} w={w} h={h} posX={posX} posY={posY} scaleX={scaleX} scaleY={scaleY} minD={minDimensions} children={comp}></ScaleBox> : <></> }
      </div>
      
  );
}


export default Widget;
