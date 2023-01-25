import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../..';

import './Paint.css';


function Paint({data, dataHandler} : {data:any, dataHandler:Function}) {
    const thisDiv = useRef<HTMLDivElement>(null);
    const scaleMode = useSelector((state: RootState) => state.scaleMode);


    const [canvasDimensions, setCanvasDimensions] = useState({w:200, h:200});
    const [scaleOffset, setScaleOffset] = useState({x:1, y:1});
    const [canvasSave, setCanvasSave] = useState<ImageData>();

    const [mousePos, setMousePos] = useState({x:-1, y:-1});
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    let mc = {x:-1, y:-1}
    const thisCanvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(thisCanvas.current){
            setCtx(thisCanvas.current.getContext("2d") as CanvasRenderingContext2D);
        }
        if(thisDiv.current)
            observer.observe(thisDiv.current, { attributes : true, attributeFilter : ['style'] });

    }, [])

    useEffect(() => { //when the context is created add the event listeners
        console.log('ctx update')
        if(thisCanvas.current && ctx){
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, thisCanvas.current.width, thisCanvas.current.height);
            ctx.fill();
            ctx.save()
        }
    }, [ctx])

    useEffect(() => {
        if(!ctx || !thisCanvas.current) return;
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, thisCanvas.current.width, thisCanvas.current.height);
        ctx.fill();
        if(ctx && canvasSave){ //redraw past save if there is one
            ctx.putImageData(canvasSave, 0, 0);
        }
    }, [canvasDimensions])


    let observer = new MutationObserver(function(mutations) { //check for style updates to adjust canvas size
        mutations.forEach(function(mutationRecord) {
            if(thisDiv.current) {
                var rect = thisDiv.current.getBoundingClientRect();
                let xScale = parseFloat(thisDiv.current.style.transform.split(',')[0].slice(6));
                let yScale = parseFloat(thisDiv.current.style.transform.split(',')[1].slice(1,-1));
                setScaleOffset({x: xScale, y:yScale});
                setCanvasDimensions({w:rect.width, h:rect.height});
            }
        });    
    });

    function draw(e:React.MouseEvent) {
        // console.log(e); //NEED TO UPDATE THIS WITH THE REACT MOUSE EVENT STUFF
        if(e.buttons !== 1 || ctx === undefined) return;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#c0392b';
      
        ctx.beginPath()
        mc.x = e.nativeEvent.offsetX * scaleOffset.x;
        mc.y = e.nativeEvent.offsetY * scaleOffset.y;
        ctx.lineTo(mc.x, mc.y); // to
      
        ctx.stroke(); // draw it!
        
        //save incase resize!
        if(thisCanvas.current && !scaleMode)
            setCanvasSave(ctx.getImageData(0,0, thisCanvas.current.height, thisCanvas.current.width));

    }

    function setPos(e:React.MouseEvent) {
        //set mouse cords and draw
        mc.x = e.nativeEvent.offsetX;
        mc.y = e.nativeEvent.offsetY;
        setMousePos({x:e.clientX, y:e.clientY});
        draw(e);
    }

    return (
        <div ref={thisDiv} className='paintDiv'> 
            <canvas  ref={thisCanvas} className="paint" width={canvasDimensions.w} height={canvasDimensions.h} onMouseDown={setPos} onMouseMove={draw} onMouseEnter={setPos}></canvas>
        </div>
    );
}

export default Paint;
