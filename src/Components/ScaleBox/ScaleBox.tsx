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
    const [borderW, setBorderW] = useState(2);
    const [resizeBuffer, setResizeBuffer] = useState(20);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState({x:-1, y:-1, spotClicked:""});

    // const [resizingX, setResizingX] = useState(-1);
    // const [resizingY, setResizingY] = useState(-1);
    
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
            setResizing({x:-1, y:-1, spotClicked:""})
            // setResizingX(-1);
            // setResizingY(-1);
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
        let mouseInArea = {x:-1, y:-1, spotClicked:''}
        
        //left/top are 0, right/bottom are 1
        if(rect.left < mx && mx < rect.left + resizeBuffer) {
            //left side
            mouseInArea.x = 0
            mouseInArea.spotClicked = 'left';

            //check if it's top or bottom half
            if(my - rect.top > rect.height/2) mouseInArea.y = 1;
            else mouseInArea.y = 0;
        }
        else if (rect.right > mx && mx > rect.right - resizeBuffer) {
            mouseInArea.x = 1
            mouseInArea.spotClicked = 'right';
            //check if it's top or bottom half
            if(my - rect.top > rect.height/2) mouseInArea.y = 1;
            else mouseInArea.y = 0;
        }
        else if(rect.top < my && my < rect.top + resizeBuffer) {
            //top side
            mouseInArea.y = 0
            mouseInArea.spotClicked = 'top';

            //check if it's left or right half
            if(mx - rect.left > rect.width/2) mouseInArea.x = 1;
            else mouseInArea.x = 0;
        }
        else if (rect.bottom > my && my > rect.bottom - resizeBuffer) {
            //bottom side
            mouseInArea.y = 1
            mouseInArea.spotClicked = 'bottom';

            //check if it's left or right half
            if(mx - rect.left > rect.width/2) mouseInArea.x = 1;
            else mouseInArea.x = 0;
        }
        return(mouseInArea);
    }

    function mouseDown(e:any) {
        if(!scaleMode)
            return;

        let isResizing = false;
        let mInArea = checkResizeEdges(e); //left/top are 0, right/bottom are 1

        if(mInArea.x >= 0 || mInArea.y >=0) {setResizing(mInArea); isResizing=true;}
        // if(mInArea.y >= 0) {setResizingY(mInArea); isResizing=true;}

        //drag
        if(isResizing === false) {
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
        setResizing({x:-1, y:-1, spotClicked:""});
        // setResizingX(-1)
        // setResizingY(-1)
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
        if(!scaleMode || !thisBox.current) {
            e.preventDefault();
            return;
        }
        let mx = e.clientX;
        let my = e.clientY;

        // console.log(resizingX, resizingY)
        //ondrag at the end snaps it to 0,0 for a frame. not sure why
        if(mx === 0 && my === 0)
        return;
        let newX = -1;
        let newY =-1;
        let newW = -1;
        let newH = -1;

        if(dragging && scaleMode) { //dragging the box
            if(dragOffset.offX === -1 || dragOffset.offY === -1) return
            
            let x = mx - dragOffset.offX ;
            let y = my - dragOffset.offY ;

            newX = x;
            newY = y;
        }
        else if ((resizing.x > -1 || resizing.y > -1) && scaleMode) {
            let childElement = thisBox.current;
            console.log(thisBox.current)
            let rect = childElement?.getBoundingClientRect();
            console.log('resizing')
            if(resizing.spotClicked === 'right') { //right
                newW = mx - rect.left;
                let delta = newW - rect.width + borderW;

                if(resizing.y === 0) { //right-top
                    newH = rect.height-borderW + delta; //change height
                    newY = rect.top - delta; //change ypos so it scales up not down
                }
                else { //right-bottom
                    newH = rect.height-borderW + delta;
                }
            }
            else if(resizing.spotClicked === 'left')  { //left

                // let w = rect.width-borderW;
                let delta = mx-rect.left;
                newW = rect.width - delta;
                newX = rect.left + delta - borderW;

                if(resizing.y === 0) { //left-top
                    newH = rect.height - delta; //change height
                    newY = rect.top + delta - borderW; //change ypos so it scales up not down
                }
                else { //left-bottom
                    newH = rect.height - delta; //change height
                }
            }
            else if(resizing.spotClicked === 'bottom') {
                newH = my - rect.top;
                let delta = my - rect.top - rect.height + borderW;

                if(resizing.x === 0) { //bottom-left
                    newW = rect.width - borderW + delta;
                    newX = rect.left - delta;
                }
                else { //bottom-right
                    newW = rect.width - borderW + delta;
                }
            }
            else if (resizing.spotClicked === 'top') {
                let delta = my-rect.top;
                newH = rect.height - delta;
                newY = rect.top + delta - borderW;

                if(resizing.x === 0) { //top-left
                    newW = rect.width - delta;
                    newX = rect.left + delta - borderW;
                }
                else { //top-right
                    newW = rect.width - delta;
                }
            }
        }

        //ensure bigger than mininum
        if(newW < minDimensions.w || newH < minDimensions.h) {newW = minDimensions.w; newH = minDimensions.h;}
        //position update
        if(newX > 0) thisBox.current.style.left = newX + "px";
        else newX = position.x;
        if(newY > 0) thisBox.current.style.top = newY + "px";
        else newY = position.y;
        //dimensions update
        if(newW > 0) thisBox.current.style.width = newW + "px";
        if(newH > 0) thisBox.current.style.height = newH + "px";
        //Update states
        setPosition({x:newX, y:newY});
        setDimensions({w: newW, h:newH})
        


        //scale component
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
        if(!thisBox.current) return
        if(!scaleMode) 
        {
            thisBox.current.style.cursor = "auto";
            return;
        }
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
        // else if(mInArea.x === 1) {
        //     //e-resize
        //     thisBox.current.style.cursor = "e-resize";
        // }
        // else if(mInArea.y === 1) {
        //     //s-resize
        //     thisBox.current.style.cursor = "s-resize";
        // }
        // else if(mInArea.x === 0) {
        //     //w-resize
        //     thisBox.current.style.cursor = "w-resize";
        // }
        // else if(mInArea.y === 0) {
        //     //n-resize
        //     thisBox.current.style.cursor = "n-resize";
        // }
        else {
            //grab
            thisBox.current.style.cursor = "grab";
        }
    }

    function hideDragImage(e:any) {
        if(!scaleMode){
            e.preventDefault();
            return;
        }
        var img = document.createElement('img')
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        e.dataTransfer.setDragImage(img, 0, 0)  
    }



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



    return (
        <div ref={thisBox} 
        onMouseDown={mouseDown} 
        draggable={true} 
        onDragStart={hideDragImage} 
        onDrag={move} 
        onDragEnd={move} 
        onMouseMove={changeCursor}
        onMouseLeave={changeCursor}
        className={'scaleBox' + editClass}>
            {children}
        </div>
    );
}

export default ScaleBox;
