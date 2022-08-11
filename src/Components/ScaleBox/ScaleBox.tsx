import React, { useEffect, useState, useContext, useRef } from 'react';
import './ScaleBox.css';
import { useSelector } from 'react-redux';
import { RootState } from '../..';

interface ScaleBoxProps {
    children: JSX.Element;
}

function ScaleBox({ children }: ScaleBoxProps) {
    const thisBox = useRef<HTMLDivElement>(null);

    const scaleMode = useSelector((state: RootState) => state.scaleMode);
    const [gridSnap, setGridSnap] = useState(20);
    const [resizeBuffer, setResizeBuffer] = useState(20);
    const [dragging, setDragging] = useState(false);
    const [resizingX, setResizingX] = useState(-1);
    const [resizingY, setResizingY] = useState(-1);

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
            setResizingX(-1);
            setResizingY(-1);
            setDragOffset({offX:-1, offY:-1});
        }

    },[scaleMode]);

    useEffect(()=> {
        console.log("YUPP")
        //update pos
        if(thisBox.current) {
            thisBox.current.style.left = position.x + "px";
            thisBox.current.style.top = position.y + "px";
        }

    },[position]);

    function resize(e: any) {
        if(scaleMode) {
            let dir = e.nativeEvent.wheelDelta > 0 ? 1 : 0;
            let box = e.currentTarget;
            if(dir === 1) {
                box.style="transform: scale(" + (scaleX + 0.1) + ")";
                box.style.left = position.x + "px";
                box.style.top = position.y + "px";
                if(scaleX + 0.1 <= 2.5) { //cap size
                    setScaleX(scaleX => scaleX + 0.1)
                }
            }
            else {
                box.style="transform: scale(" + (scaleX - 0.1) + ")";
                box.style.left = position.x + "px";
                box.style.top = position.y + "px";
                if(scaleX - 0.1 >= 0.2) { //cap size
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
        console.log(e.currentTarget.getBoundingClientRect())
        let rect = e.currentTarget.getBoundingClientRect()
        let mx = e.clientX;
        let my = e.clientY;
        let isResizing = false;

        if(rect.left < mx && mx < rect.left + resizeBuffer) {
            //left side
            setResizingX(0);
            isResizing = true;
        }
        else if (rect.right > mx && mx > rect.right - resizeBuffer) {
            setResizingX(1);
            isResizing = true;
        }
        if(rect.top < my && my < rect.top + resizeBuffer) {
            //top side
            setResizingY(0);
            isResizing = true;
        }
        else if (rect.bottom > my && my > rect.bottom - resizeBuffer) {
            setResizingY(1);
            isResizing = true;
        }

        //drag
        if(!isResizing) {
            setDragging(dragging => true);
            changeDragOffset(e);
        }
    }
    function mouseUp() {
        setDragging(false);
        setResizingX(-1)
        setResizingY(-1)
        setDragOffset({offX:-1, offY:-1});

        //snap to grid on release, < 10 snap left/up >10 snap right/down
        const x =  position.x % gridSnap <= gridSnap/2 ? position.x - position.x % gridSnap :  position.x + (gridSnap - position.x % gridSnap)
        const y =  position.y % gridSnap <= gridSnap/2 ? position.y - position.y % gridSnap :  position.y + (gridSnap - position.y % gridSnap)
        setPosition({x: x, y: y})
    }

    function checkSize() { //scale is breaking this somehow
        //fit width/height to grid
        let widgetBox = thisBox.current?.children[0] as HTMLElement | null;
        let rect = widgetBox?.getBoundingClientRect();
        let w = rect?.width;
        let h = rect?.height;
        if(w !== undefined && h !== undefined && widgetBox !== null) {
            w -=2;
            h -=2;
            console.log(rect);
            console.log(w, gridSnap)
            console.log("KDJSFLDKS " + w%gridSnap)
            console.log(w - (w % gridSnap));
            let newW, newH;
            if(w%gridSnap !== 0) {
                newW = w % gridSnap < gridSnap/2 ? w - (w % gridSnap) : w + (gridSnap - w % gridSnap);
            }
            else {
                newW = w;
            }
            if(h%gridSnap !== 0) {
                newH = h % gridSnap < gridSnap/2 ?  h - (h % gridSnap) : h + (gridSnap - h % gridSnap);
            }
            else {
                newH = h;
            }
            console.log("neww " + newW)
            widgetBox.style.width = newW + "px";
            widgetBox.style.height = newH + "px";
        }
    }

    function move(e:any) {
        let mx = e.clientX;
        let my = e.clientY;
        if(dragging && scaleMode && e !== null) {
            if(dragOffset.offX === -1 || dragOffset.offY === -1) {
                return
            }
            const x = mx - dragOffset.offX ;
            const y = my - dragOffset.offY ;

            e.currentTarget.style.left = x + "px";
            e.currentTarget.style.top = y + "px";
            setPosition({x: x, y: y})
        }
        else if (resizingX > -1 || resizingY > -1 && scaleMode && e!==null) {
            let childElement = e.currentTarget.children[0] as HTMLElement | null;
            let rect = childElement?.getBoundingClientRect();
            if(resizingX === 1) {
                if(rect !==undefined && childElement!==null) {
                    childElement.style.width = mx - rect.left + "px";
                }
            }
            else if(resizingX === 0) {
                if(thisBox.current && rect !==undefined && childElement!==null) {
                    // console.log(childElement.style.width)
                    let w = rect.width;
                    let leftS = thisBox.current.style.left.slice(0,-2);
                    let leftN = parseInt(leftS);
                    let delta = mx-leftN;

                    childElement.style.width = (w-delta) + "px";
                    thisBox.current.style.left = (leftN + delta) + "px";
                    setPosition({x:(leftN + delta), y:position.y});
                }
            }
            console.log(resizingY);
            if(resizingY === 1) {
                if(rect !==undefined && childElement!==null) {
                    childElement.style.height = my - rect.top + "px";
                }
            }
            else if(resizingY === 0) {
                if(thisBox.current && rect !==undefined && childElement!==null) {
                    // console.log(childElement.style.width)
                    let h = rect.height;
                    let topS = thisBox.current.style.top.slice(0,-2);
                    let topN = parseInt(topS);
                    let delta = my-topN;

                    childElement.style.height = (h-delta) + "px";
                    thisBox.current.style.top = (topN + delta) + "px";
                    setPosition({x:position.x, y:(topN + delta)});
                }
            }
        }
    }

    return (
        <div ref={thisBox} onMouseDown={mouseDown} onMouseUp={mouseUp} onMouseMove={move} onWheel={resize} onClick={move} className={'scaleBox' + editClass}>
            {children}
        </div>
    );
}

export default ScaleBox;
