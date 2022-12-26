import React, { useEffect, useRef, useState } from 'react';

import './Paint.css';


function Paint() {
    const [mousePos, setMousePos] = useState({x:-1, y:-1});
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    let mc = {x:-1, y:-1}
    const thisCanvas = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        if(thisCanvas.current){
            console.log(thisCanvas.current.getContext("2d") as CanvasRenderingContext2D);
            setCtx(thisCanvas.current.getContext("2d") as CanvasRenderingContext2D);
        }
    }, [])

    useEffect(() => {
        if(thisCanvas.current && ctx !== undefined){
            thisCanvas.current.addEventListener('mousemove', draw);
            thisCanvas.current.addEventListener('mousedown', setPos);
            thisCanvas.current.addEventListener('mouseenter', setPos);
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.rect(0, 0, thisCanvas.current.width, thisCanvas.current.height);
            ctx.fill();
        }
    }, [ctx])

    function draw(e:MouseEvent) {

        if(e.buttons !== 1 || ctx === undefined) return;
        console.log(e)
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#c0392b';
      
        ctx.moveTo(mc.x, mc.y); // from
        // setPos(e);
        mc.x = e.offsetX;
        mc.y = e.offsetY;
        ctx.lineTo(mc.x, mc.y); // to
      
        ctx.stroke(); // draw it!
    }

    function setPos(e:MouseEvent) {
        console.log("yuh")
        mc.x = e.offsetX;
        mc.y = e.offsetY;
        // setMousePos({x:e.clientX, y:e.clientY});
    }

    return (
        <div className='paintDiv'>
            <canvas  ref={thisCanvas} className="paint" width="100%" height="100%"></canvas>
        </div>
    );
}

export default Paint;
