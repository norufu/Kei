import React, { useEffect, useState } from 'react';
import './ScaleBox.css';

interface ScaleBoxProps {
    scaleMode: boolean;
    children: JSX.Element;
}

function ScaleBox({ scaleMode, children }: ScaleBoxProps) {
    // const [scaleMode, setScaleMode] = useState(false);
    // const { scaleMode } = props.scaleMode;
    const [gridSnap, setGridSnap] = useState(20);
    const [dragging, setDragging] = useState(false);
    const [editClass, setEditClass] = useState("");

    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);

    const [position, setPosition] = useState({x: 0, y: 0});



    useEffect(()=> {
        if(scaleMode)
            setEditClass(" editMode")
        else {
            setEditClass("")
            setDragging(false);
        }

    },[scaleMode]);

    function resize(e: any) {
        if(scaleMode) {
            let dir = e.nativeEvent.wheelDelta > 0 ? 1 : 0;
            let box = e.currentTarget;
            if(dir === 1) {
                box.style="transform: scale(" + (scaleX + 0.1) + ")";
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

    function mouseDown() {
        setDragging(dragging => true);
    }
    function mouseUp() {
        setDragging(dragging => false);
    }
    function move(e:any) {
        if(dragging && scaleMode && e !== null) {
            const x =  e.clientX - (e.currentTarget.clientWidth/2) - ((e.clientX - (e.currentTarget.clientWidth/2)) % gridSnap);
            const y =  e.clientY - (e.currentTarget.clientHeight/2) - ((e.clientY - (e.currentTarget.clientHeight/2)) % gridSnap);

            e.currentTarget.style.left = x + "px";
            e.currentTarget.style.top = y + "px";
            setPosition({x: x, y: y})
        }
    }
// var scaleX = element.getBoundingClientRect().width / element.offsetWidth;

    return (
        <div onMouseDown={mouseDown} onMouseUp={mouseUp} onMouseMove={move} onWheel={resize} onClick={move} className={'scaleBox' + editClass}>
            {children}
        </div>
    );
}

export default ScaleBox;
