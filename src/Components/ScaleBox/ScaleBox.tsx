import React, { useEffect, useState, useContext } from 'react';
import './ScaleBox.css';
import { scaleContext } from "../../Views/Dashboard/Dashboard"

interface ScaleBoxProps {
    children: JSX.Element;
}

function ScaleBox({ children }: ScaleBoxProps) {
    // const [scaleMode, setScaleMode] = useState(false);
    // const { scaleMode } = props.scaleMode;
    const {scaleMode} = useContext(scaleContext);
    const [gridSnap, setGridSnap] = useState(20);
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({offX:-1, offY:-1});

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
            setDragOffset({offX:-1, offY:-1});
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

    function changeDragOffset(e:any) { //calculate offset for moving function
        const w = e.currentTarget.clientWidth;
        const divRX = position.x + w;

        const h = e.currentTarget.clientHeight;
        const divRY = position.y + h;
        setDragOffset({offX: w - (divRX - e.clientX), offY: h - (divRY - e.clientY)});
    }

    function mouseDown(e:any) {
        setDragging(dragging => true);
        changeDragOffset(e);
    }
    function mouseUp() {
        setDragging(dragging => false);
        setDragOffset({offX:-1, offY:-1});
        console.log("yuuh")
    }
    function move(e:any) {
        if(dragging && scaleMode && e !== null) {
            if(dragOffset.offX === -1 || dragOffset.offY === -1) {
                return
            }

            const x =  e.clientX - dragOffset.offX - ((e.clientX - (e.currentTarget.clientWidth/2)) % gridSnap);
            const y =  e.clientY - dragOffset.offY - ((e.clientY - (e.currentTarget.clientHeight/2)) % gridSnap);

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
