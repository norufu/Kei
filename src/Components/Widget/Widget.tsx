import React, { useEffect, useState } from 'react';
import Everyday from '../Everyday/Everyday';
import ScaleBox from '../ScaleBox/ScaleBox';
import Timer from '../Timer/Timer';
import './Widget.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateWidget } from '../../Actions/Index';

interface scaleBoxData {
  posX: number;
  posY: number;
  w: number;
  h: number;
}

function Widget({wid, save, type, posX, posY, w, h, data} : {wid: number, save:Function, type:string, posX:number, posY:number, w:number, h:number, data:any}) {
  const dispatch = useDispatch();

  const [comp, setComp] = useState<JSX.Element>();
  const [scaleBoxData, setScaleBoxData] = useState<scaleBoxData>({posX: posX, posY: posY, w: w, h: h});
  const [widgetData, setWidgetData] = useState<any>(data);

  function getScaleBoxData(updateX : number, updateY: number, updateW:number, updateH: number) {
    setScaleBoxData({posX: updateX, posY: updateY, w: updateW, h: updateH});
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
        data: widgetData
    }));
  }, [scaleBoxData, widgetData]);


  useEffect(() => {
      let newWidget;
      switch(type.toLowerCase()) {
          case "timer":
            newWidget = <Timer dataHandler={getWidgetData} data={data}/>
            break;
          case "everyday":
            newWidget = <Everyday dataHandler={getWidgetData} data={data}/>
            break;
          default:
            newWidget = null;
            break;
      }
      if(newWidget!=null)
          setComp(newWidget);

  }, []);
  


  return (
      <>{comp ? <ScaleBox dataHandler={getScaleBoxData} w={w} h={h} posX={posX} posY={posY} children={comp}></ScaleBox> : <></> }</>
      
  );
}


export default Widget;
