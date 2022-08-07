import React, { useEffect, useState } from 'react';
import './ScaleBox.css';


function ScaleBox(props : any) {
    const [scaleMode, setScaleMode] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [c, setC] = useState("");

    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);

    const [position, setPosition] = useState({x: 0, y: 0});

    useEffect(()=> {
        document.addEventListener("keydown", keyPress);

    },[]);

    useEffect(()=> {
        if(scaleMode)
            setC(" editMode")
        else {
            setC("")
        }

    },[scaleMode]);

    function keyPress(e: any) {
        if(e.key === 'Shift') {
            setScaleMode(scaleMode => !scaleMode);
            setDragging(false);
        }
    }

    function resize(e: any) {
        if(scaleMode) {
            let dir = e.nativeEvent.wheelDelta > 0 ? 1 : 0;
            console.log(dir);
            let box = e.currentTarget;
            if(dir === 1) {
                box.style="transform: scale(" + (scaleX + 0.1) + ")";
                console.log(position);
                box.style.left = position.x + "px";
                box.style.top = position.y + "px";
                setScaleX(scaleX => scaleX + 0.1)
            }
            else {
                box.style="transform: scale(" + (scaleX - 0.1) + ")";
                box.style.left = position.x + "px";
                box.style.top = position.y + "px";
                if(scaleX - 0.1 >= 0.2) {
                    setScaleX(scaleX => scaleX - 0.1)  
                }
            }
        }
    }

    function mouseDown(e: any) {
        setDragging(dragging => true);
    }
    function mouseUp(e: any) {
        setDragging(dragging => false);
    }
    function move(e:any) {
        if(dragging && scaleMode) {
            const x =  e.clientX - (e.currentTarget.clientWidth/2)
            const y =  e.clientY - (e.currentTarget.clientHeight/2)

            e.currentTarget.style.left = x + "px";
            e.currentTarget.style.top = y + "px";
            setPosition({x: x, y: y})
            console.log(x, y);
        }
    }
// var scaleX = element.getBoundingClientRect().width / element.offsetWidth;

    return (
        <div onMouseDown={mouseDown} onMouseUp={mouseUp} onMouseMove={move} onWheel={resize} onClick={move} className={'scaleBox' + c}>
            {props.children}
        </div>
    );
}

export default ScaleBox;
