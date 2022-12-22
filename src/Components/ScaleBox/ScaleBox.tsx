import React, { useEffect, useState, useContext, useRef } from 'react';
import './ScaleBox.css';
import { useSelector } from 'react-redux';
import { RootState } from '../..';

interface ScaleBoxProps {
    children: JSX.Element;
    posX: number;
    posY: number;
    w: number;
    h: number;
    dataHandler: Function; //updates the widget on positioning
}

function ScaleBox({children, posX, posY, w, h, dataHandler }: ScaleBoxProps) {
    const thisBox = useRef<HTMLDivElement>(null);

    const scaleMode = useSelector((state: RootState) => state.scaleMode);
    const [gridSnap, setGridSnap] = useState(20);
    const [resizeBuffer, setResizeBuffer] = useState(20);
    const [dragging, setDragging] = useState(false);
    const [resizingX, setResizingX] = useState(-1);
    const [resizingY, setResizingY] = useState(-1);
    const [mouseCords, setMouseCords] = useState({x:-1, y:-1});
    const [minDimensions, setMinDimensions] = useState({w:1, h:1})
    const [dragOffset, setDragOffset] = useState({offX:-1, offY:-1});

    const [editClass, setEditClass] = useState("");

    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);

    const [position, setPosition] = useState({x: 0, y: 0});
    const [dimensions, setDimensions] = useState({w: 0, h: 0});

    useEffect(()=> {
        if(thisBox.current) {
            let childElement =  thisBox.current.children[0] as HTMLElement | null;
            // console.log(childElement?.style.minWidth);
            let rect = childElement?.getBoundingClientRect();
            if(rect) setMinDimensions({w:rect.width, h:rect.height})

            //set initial position and size on load
            setPosition({x: posX, y: posY});
            setDimensions({w: w, h: h})
        }
    }, []);

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
        //update pos
        if(thisBox.current) {
            thisBox.current.style.left = position.x + "px";
            thisBox.current.style.top = position.y + "px";
        }
        //update widget component on position
        dataHandler(position.x, position.y, dimensions.w, dimensions.h);
    },[position]);

    useEffect(()=> {
        //update dimensions of the child component
        if(thisBox.current) {
            let childElement =  thisBox.current.children[0] as HTMLElement | null;
            if(childElement)  {
                childElement.style.width = w + "px";
                childElement.style.height = h + "px";
            }
        }
        //update widget component on position and dimensions
        dataHandler(position.x, position.y, dimensions.w, dimensions.h);
    },[dimensions]);

    function resize(e: any) {
        if(scaleMode && thisBox.current) {
            e.preventDefault();
            let dir = e.nativeEvent.wheelDelta > 0 ? 1 : 0;
            let box = e.currentTarget;
            // let childElement =  thisBox.current.children[0] as HTMLElement | null;
            // let rect = childElement?.getBoundingClientRect();
            if(dir === 1) {
                box.style="transform: scale(" + (scaleX + 0.1) + ")";
                // box.style.left = position.x + "px";
                // box.style.top = position.y + "px";
                if(scaleX + 0.1 <= 2.5) { //cap size
                    setScaleX(scaleX => scaleX + 0.1)
                }
            }
            else {
                box.style="transform: scale(" + (scaleX - 0.1) + ")";
                // box.style.left = position.x + "px";
                // box.style.top = position.y + "px";
                if(scaleX - 0.1 >= 0.2) { //cap size
                    setScaleX(scaleX => scaleX - 0.1)  
                }
            }


            if(thisBox.current) {
                let childElement =  thisBox.current.children[0] as HTMLElement | null;
                let rect = childElement?.getBoundingClientRect();
                // console.log(box);
                if(childElement && rect)  {
                    childElement.style.width = rect.width + "px";
                    childElement.style.height = rect.height + "px";
                    // console.log(childElement.style.width, childElement.style.height);
                }

            }
        }
    }
    // function resize(e: any) {
    //     const resizeValue = 20;
    //     console.log("YUP")
    //     if(scaleMode) {
    //         let dir = e.nativeEvent.wheelDelta > 0 ? 1 : 0;
    //         let box = e.currentTarget;

    //         if(thisBox.current) {
    //             let childElement =  thisBox.current.children[0] as HTMLElement | null;
    //             let rect = childElement?.getBoundingClientRect();
    //             let w = rect?.width;
    //             let h = rect?.height;
    //             if(dir === 1 && w && h) {
    //                 thisBox.current.style.width = (w + resizeValue) + "px";
    //                 thisBox.current.style.height = (h + resizeValue) + "px";
    //             }
    //             else if(w && h) {
    //                 thisBox.current.style.width = (w - resizeValue) + "px";
    //                 thisBox.current.style.height = (h - resizeValue) + "px";
    //             }
    //         }
    //     }
    // }

    function changeDragOffset(e:any) { //calculate offset for moving function
        const w = e.currentTarget.clientWidth;
        const divRX = position.x + w;

        const h = e.currentTarget.clientHeight;
        const divRY = position.y + h;
        setDragOffset({offX: w - (divRX - e.clientX), offY: h - (divRY - e.clientY)});
    }

    function checkResizeEdges(e:any) {
        let rect = e.currentTarget.getBoundingClientRect()
        let mx = e.clientX;
        let my = e.clientY;
        let mouseInArea = {x:-1, y:-1}

        if(rect.left < mx && mx < rect.left + resizeBuffer) {
            //left side
            mouseInArea.x = 0
        }
        else if (rect.right > mx && mx > rect.right - resizeBuffer) {
            mouseInArea.x = 1
        }
        if(rect.top < my && my < rect.top + resizeBuffer) {
            //top side
            mouseInArea.y = 0
        }
        else if (rect.bottom > my && my > rect.bottom - resizeBuffer) {
            mouseInArea.y = 1
        }
        return(mouseInArea);
    }

    function mouseDown(e:any) {
        if(!scaleMode)
            return;
        // let rect = e.currentTarget.getBoundingClientRect()

        let isResizing = false;
        let mInArea = checkResizeEdges(e); //left/top are 0, right/bottom are 1
        if(mInArea.x >= 0) {setResizingX(mInArea.x); isResizing=true;}
        if(mInArea.y >= 0) {setResizingY(mInArea.y); isResizing=true;}

        //drag
        if(isResizing === false) {
            if(thisBox.current) thisBox.current.style.cursor = "grabbing";

            setDragging(true);
            changeDragOffset(e);
        }
    }
    function mouseUp() {
        //snap to grid on release, < 10 snap left/up >10 snap right/down
        // const x =  position.x % gridSnap <= gridSnap/2 ? position.x - position.x % gridSnap :  position.x + (gridSnap - position.x % gridSnap)
        // const y =  position.y % gridSnap <= gridSnap/2 ? position.y - position.y % gridSnap :  position.y + (gridSnap - position.y % gridSnap)
        // setPosition({x: x, y: y})
        snapToGrid()
        setDragging(false);
        setResizingX(-1)
        setResizingY(-1)
        setDragOffset({offX:-1, offY:-1});
        setMouseCords({x:-1, y:-1})
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
            // console.log(rect);
            // console.log(w, gridSnap)
            // console.log("KDJSFLDKS " + w%gridSnap)
            // console.log(w - (w % gridSnap));
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
            widgetBox.style.width = newW + "px";
            widgetBox.style.height = newH + "px";
        }
    }

    function move(e:any) {

        let mx = e.clientX;
        let my = e.clientY;

        //ondrag at the end snaps it to 0,0 for a frame. not sure why
        if(mx === 0 && my === 0)
            return;

        let newX = -1;
        let newY =-1;
        let newW = -1;
        let newH= -1;
        
        let childElement = thisBox.current;
        let rect = childElement?.getBoundingClientRect();

        if(dragging && scaleMode && thisBox.current) { //dragging the box
            if(dragOffset.offX === -1 || dragOffset.offY === -1) {
                return
            }
            const x = mx - dragOffset.offX ;
            const y = my - dragOffset.offY ;
            thisBox.current.style.left = x + "px";
            thisBox.current.style.top = y + "px";
            newX = x;
            newY = y;
        }
        else if ((resizingX > -1 || resizingY > -1) && scaleMode && thisBox.current !==null) { //resize the box
            if(resizingX === 1) {
                if(rect !==undefined && childElement!==null) { //right
                    if((mx - rect.left) < minDimensions.w) {}
                    else {
                        childElement.style.width = mx - rect.left + "px";
                        newW = mx - rect.left;
                    }
                }
            }
            else if(resizingX === 0) { //left
                if(thisBox.current && rect !==undefined && childElement!==null) {
                    let w = rect.width-2;
                    let leftS = thisBox.current.style.left.slice(0,-2);
                    let leftN = parseInt(leftS);
                    let delta = mx-leftN;

                    if((w-delta) < minDimensions.w) {}
                    else {
                        childElement.style.width = (w-delta) + "px";
                        newW = w-delta;
                        thisBox.current.style.left = (leftN + delta) + "px";
                        newX = (leftN + delta);
                    }

                }
            }
            if(resizingY === 1) { //bottom
                if(rect !==undefined && childElement!==null) {
                    if((my - rect.top) < minDimensions.h) {}
                    else {
                        childElement.style.height = my - rect.top + "px";
                        newH = my - rect.top;
                    }
                }
            }
            else if(resizingY === 0) { //top
                if(thisBox.current && rect !==undefined && childElement!==null) {
                    let h = rect.height - 2;
                    let topS = thisBox.current.style.top.slice(0,-2);
                    let topN = parseInt(topS);
                    let delta = my-topN;

                    if((h-delta) < minDimensions.h) {}
                    else {
                        childElement.style.height = (h-delta) + "px";
                        thisBox.current.style.top = (topN + delta) + "px";
                        newH = topN + delta;
                        newY = topN + delta;                    
                    }

                }
            }
        }
        //if newx/y/w/h were never set, set it to last position
        if(newX < 0) newX = position.x;
        if(newY < 0) newY = position.y;
        if(newW < 0) newW = dimensions.w;
        if(newH < 0) newH = dimensions.h;
        setPosition({x:newX, y:newY});
        setDimensions({w:newW, h:newH});
        checkBounds();

        //ensure mouseup is fired
        if(e._reactName === "onDragEnd") {
            snapToGrid();
            mouseUp();
        }
    }

    function checkBounds() {
        //
        if(thisBox.current) {
            let ele = thisBox.current.children[0] as HTMLElement | null;
            if(!ele) return;
            let boxW = thisBox.current.getBoundingClientRect().width;
            let eleW = ele.getBoundingClientRect().width;
            let boxH = thisBox.current.getBoundingClientRect().height;
            let eleH = ele.getBoundingClientRect().height;

            if(scaleX == 1 && scaleY == 1) { //set default dimensions to avoid under scaling
                setMinDimensions({w:eleW, h:eleH});
            }

            let scaleValueX = (boxW-2)/eleW - 1;
            scaleValueX = scaleX + scaleValueX;

            let scaleValueY = (boxH-2)/eleH - 1;
            scaleValueY = scaleY + scaleValueY;

            //ensure ratio, if scaling too big cap it 
            let lowerScale = scaleValueX < scaleValueY ? scaleValueX : scaleValueY;
            lowerScale = lowerScale >= 2 ? 2 : lowerScale; 

            setScaleX(lowerScale)
            setScaleY(lowerScale)

            ele.style.transform = "scale(" + lowerScale + "," + lowerScale +")";

        }
    }

    function snapToGrid() {
        const x =  position.x % gridSnap <= gridSnap/2 ? position.x - position.x % gridSnap :  position.x + (gridSnap - position.x % gridSnap)
        const y =  position.y % gridSnap <= gridSnap/2 ? position.y - position.y % gridSnap :  position.y + (gridSnap - position.y % gridSnap)

        setPosition({x: x, y: y})
    }

    //grab, grabbing, nw-resize
    function changeCursor(e:any) {
        if(!thisBox.current || !scaleMode) return;
        // console.log(e);
        let mInArea = checkResizeEdges(e); //left/top are 0, right/bottom are 1
        if(mInArea.x === 1 && mInArea.y === 1) {
            //se-resize
            thisBox.current.style.cursor = "se-resize";
        }
        else if(mInArea.x === 0 && mInArea.y === 0) {
            //nw-resize
            thisBox.current.style.cursor = "nw-resize";
        }
        else if(mInArea.x === 0 && mInArea.y === 1) {
            //sw-resize
            thisBox.current.style.cursor = "sw-resize";
        }
        else if(mInArea.x === 1 && mInArea.y === 0) {
            //ne-resize
            thisBox.current.style.cursor = "ne-resize";
        }
        else if(mInArea.x === 1) {
            //e-resize
            thisBox.current.style.cursor = "e-resize";
        }
        else if(mInArea.y === 1) {
            //s-resize
            thisBox.current.style.cursor = "s-resize";
        }
        else if(mInArea.x === 0) {
            //w-resize
            thisBox.current.style.cursor = "w-resize";
        }
        else if(mInArea.y === 0) {
            //n-resize
            thisBox.current.style.cursor = "n-resize";
        }
        else {
            //grab
            thisBox.current.style.cursor = "grab";
        }
    }

    function hideDragImage(e:any) {
        var img = document.createElement('img')
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        e.dataTransfer.setDragImage(img, 0, 0)  
    }

    return (
        <div ref={thisBox} 
        onMouseDown={mouseDown} 
        draggable={true} 
        onDragStart={hideDragImage} 
        onDrag={move} 
        onDragEnd={move} 
        onMouseMove={changeCursor}
        // onMouseLeave={changeCursor}
        className={'scaleBox' + editClass}>
            {children}
        </div>
    );
}

export default ScaleBox;
