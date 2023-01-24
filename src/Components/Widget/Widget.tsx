import React, { useEffect, useState } from 'react';
import Everyday from '../Everyday/Everyday';
import ScaleBox from '../ScaleBox/ScaleBox';
import Timer from '../Timer/Timer';
import './Widget.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateWidget } from '../../Actions/Index';
import March from '../March/March';

interface scaleBoxData {
  posX: number;
  posY: number;
  w: number;
  h: number;
  scaleX: number;
  scaleY: number;
}

function Widget({wid, save, type, posX, posY, w, h, scaleX, scaleY, data} : {wid: number, save:Function, type:string, posX:number, posY:number, w:number, h:number, scaleX:number, scaleY:number, data:any}) {
  const dispatch = useDispatch();

  const [comp, setComp] = useState<JSX.Element>();
  const [scaleBoxData, setScaleBoxData] = useState<scaleBoxData>({posX: posX, posY: posY, w: w, h: h, scaleX: scaleX, scaleY: scaleY});
  const [widgetData, setWidgetData] = useState<any>(data);
  const [minDimensions, setMinDimensions] = useState<{w:number,h:number}>({w:-1, h:-1});

  useEffect(() => {
    let newWidget;
    switch(type.toLowerCase()) {
        case "timer":
          newWidget = <Timer dataHandler={getWidgetData} data={data}/>
          setMinDimensions({w:300, h:80});

          //set default values if not set
          if(scaleBoxData.w == 0 || scaleBoxData.h == 0) {

            w = 300;
            h = 80;
          }
          break;
        case "everyday":
          newWidget = <Everyday dataHandler={getWidgetData} data={data}/>
          setMinDimensions({w:200, h:200});
          break;
        case "march":
          newWidget = <March dataHandler={getWidgetData} data={data}/>
          setMinDimensions({w:230, h:185});
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


  


  return (
      <>{comp ? <ScaleBox dataHandler={getScaleBoxData} w={w} h={h} posX={posX} posY={posY} scaleX={scaleX} scaleY={scaleY} minD={minDimensions} children={comp}></ScaleBox> : <></> }</>
      
  );
}


export default Widget;
