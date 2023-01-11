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
    scaleX: number;
    scaleY: number;
    minD: {w:number, h:number};
    dataHandler: Function; //updates the widget on positioning
}

function ScaleBox({children, posX, posY, w, h, scaleX, scaleY, minD, dataHandler }: ScaleBoxProps) {
    const thisBox = useRef<HTMLDivElement>(null);

    const scaleMode = useSelector((state: RootState) => state.scaleMode);
    const [gridSnap, setGridSnap] = useState(20);
    const [borderW, setBorderW] = useState(2);
    const [edgeSize, setEdgeSize] = useState(6);         //how far from the widget the scalebox div protrudes to help with clicking to resize
    const [resizeBuffer, setResizeBuffer] = useState(20);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState({x:-1, y:-1, spotClicked:""});

    // const [resizingX, setResizingX] = useState(-1);
    // const [resizingY, setResizingY] = useState(-1);
    
    const [mouseCords, setMouseCords] = useState({x:-1, y:-1});
    const [minDimensions, setMinDimensions] = useState(minD)
    const [dragOffset, setDragOffset] = useState({offX:-1, offY:-1});

    const [editClass, setEditClass] = useState("");

    const [widgScaleX, setWidgScaleX] = useState(1);
    const [widgScaleY, setWidgScaleY] = useState(1);

    const [position, setPosition] = useState({x: 0, y: 0});
    const [dimensions, setDimensions] = useState({w: 0, h: 0});

    useEffect(()=> {
        if(thisBox.current) {
            let childElement =  thisBox.current.children[0] as HTMLElement | null;

            thisBox.current.style.width = w + "px";
            thisBox.current.style.height = h + "px";
            if(childElement)  {
                childElement.style.width = minDimensions.w + "px";
                childElement.style.height = minDimensions.h + "px";
            }
            //set initial position and size on load
            setPosition({x: posX, y: posY});
            setDimensions({w: w, h: h})
            checkBounds();
            addInitialEdge();
        }
    }, []);

    useEffect(()=> {
        if(scaleMode)
            setEditClass(" editMode")
        else {
            setEditClass("")
            setDragging(false);
            setResizing({x:-1, y:-1, spotClicked:""})
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
        dataHandler(position.x, position.y, dimensions.w, dimensions.h, widgScaleX, widgScaleY);
    },[position]);

    useEffect(()=> {
        dataHandler(position.x, position.y, dimensions.w, dimensions.h, widgScaleX, widgScaleY);
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
        shrinkDiv();
        snapToGrid()
        setDragging(false);
        setResizing({x:-1, y:-1, spotClicked:""});
        setDragOffset({offX:-1, offY:-1});
        setMouseCords({x:-1, y:-1})
    }

    function move(e:any) {
        if(!scaleMode || !thisBox.current) {
            e.preventDefault();
            return;
        }
        let mx = e.clientX;
        let my = e.clientY;

        //mouse offscreen
        if(mx < 0 || my < 0 || mx === 0 || my === 0) 
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
            let rect = childElement?.getBoundingClientRect();
            if(resizing.spotClicked === 'right') { //right
                newW = mx - rect.left;
                let delta = newW - rect.width + borderW;

                if(resizing.y === 0) { //right-top
                    newH = rect.height-borderW + delta; //change height
                    newY = rect.top - delta; //change ypos so it scales up not down
                    console.log(newW, newH)
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
        //scale component
        if(!dragging){
            //ensure bigger than mininum, if not limit size & don't move it
            if(newW < 0 || newW < minDimensions.w) {newW = minDimensions.w; newX = -1; newY = -1;}
            if(newH < 0 || newH < minDimensions.h) {newH = minDimensions.h; newY = -1; newX = -1;}
            //dimensions update
            if(newW > 0) thisBox.current.style.width = newW + "px";
            if(newH > 0) thisBox.current.style.height = newH + "px";
            //position update
            if(newX > 0) thisBox.current.style.left = newX + "px";
            else newX = position.x;
            if(newY > 0) {thisBox.current.style.top = newY + "px";console.log("yuh")}
            else newY = parseInt(thisBox.current.style.top.slice(0,-1));

            //Update states
            setPosition({x:newX, y:newY});
            setDimensions({w: newW, h:newH})
            //adjust scale
            checkBounds();
        }
        else { //drag compnoent
            if(newX > 0) thisBox.current.style.left = newX + "px";
            else newX = position.x;
            if(newY > 0) thisBox.current.style.top = newY + "px";
            else newY = parseInt(thisBox.current.style.top.slice(0,-1));
        }


        //ensure mouseup is fired
        if(e._reactName === "onDragEnd") {
            shrinkDiv();
            snapToGrid();
            mouseUp();
        }
    }

    function checkBounds() {
        //As the border gets bigger, make the widget expand to fit the boundary
        if(thisBox.current) {
            let ele = thisBox.current.children[0] as HTMLElement | null;
            if(!ele) return;
            let boxW = thisBox.current.getBoundingClientRect().width;
            let eleW = ele.getBoundingClientRect().width;
            let boxH = thisBox.current.getBoundingClientRect().height;
            let eleH = ele.getBoundingClientRect().height;

            // if(scaleX == 1 && scaleY == 1) { //set default dimensions to avoid under scaling
            //     setMinDimensions({w:eleW, h:eleH});
            //     // console.log(eleW, eleH)
            // }

            let scaleValueX = (boxW-2)/eleW - 1;
            scaleValueX = widgScaleX + scaleValueX;

            let scaleValueY = (boxH-2)/eleH - 1;
            scaleValueY = widgScaleY + scaleValueY;

            //ensure ratio, if scaling too big cap it 
            let lowerScale = scaleValueX < scaleValueY ? scaleValueX : scaleValueY;
            lowerScale = lowerScale >= 2 ? 2 : lowerScale; 

            //update scale values
            setWidgScaleX(lowerScale)
            setWidgScaleY(lowerScale)
            ele.style.transform = "scale(" + lowerScale + "," + lowerScale +")";
        }
    }
 
    function shrinkDiv() { //shrinks the scalebox to match the inner widget size
        if(thisBox.current === null) return;
        let widgetRect = thisBox.current.children[0].getBoundingClientRect();
        
        //shrink position to snap to where the widget is
        let shrunkX = Math.ceil(widgetRect.left)
        let shrunkY = Math.ceil(widgetRect.top)
        thisBox.current.style.left = shrunkX + "px";
        thisBox.current.style.top = shrunkY + "px";
        setPosition({x:shrunkX, y:shrunkY});
        //shrink dimensions 
        let shrunkW =  Math.ceil(widgetRect.width) + edgeSize;
        let shrunkH = Math.ceil(widgetRect.height) + edgeSize;
        thisBox.current.style.width = shrunkW + "px";
        thisBox.current.style.height = shrunkH + "px";
        setDimensions({w: shrunkW, h: shrunkH});
    }
 
    function addInitialEdge() { //used when loading scalebox for first time to add edge buffer
        if(thisBox.current === null) return;
        thisBox.current.style.width = (parseInt(thisBox.current.style.width.slice(0,-1)) + edgeSize) + "px";
        thisBox.current.style.height =  (parseInt(thisBox.current.style.height.slice(0,-1)) + edgeSize) + "px";
    }

    function snapToGrid() {
        if(thisBox.current === null) return;

        let boxRect = thisBox.current.getBoundingClientRect();
        const x =  boxRect.left % gridSnap <= gridSnap/2 ? boxRect.left - boxRect.left % gridSnap :  boxRect.left + (gridSnap - boxRect.left % gridSnap)
        const y =  boxRect.top % gridSnap <= gridSnap/2 ? boxRect.top - boxRect.top % gridSnap :  boxRect.top + (gridSnap - boxRect.top % gridSnap)

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
