import React, { useEffect, useRef, useState } from 'react';

import './DropdownMenu.css';


function DropdownMenu({cords, options, closeHandler}:{cords: {x: number, y: number}, options: any[], closeHandler:any}) {
    const menu = useRef<HTMLDivElement>(null);
    const [menuElements, setMenuElements] = useState<JSX.Element[]>([]);

    useEffect(() => { //relocate div to mouse cords
        if(menu.current !== null) {
            menu.current.style.left = cords.x + "px";
            menu.current.style.top = cords.y + "px";
        }
    },[cords]);

    useEffect(() => { //set up the options
        let tempElements = [];
        for(let i = 0; i < options.length; i++) {
            if(options[i].text == "SEPARATOR") {
                tempElements.push(<hr className='groupSeparator'></hr>)
            }
            else {
                tempElements.push(<button key={i} onClick={options[i].handler} className='menuButton' id={options[i].text}>{options[i].text}</button>)
                tempElements.push(<hr className='separator'></hr>)
            }
        }
        setMenuElements(tempElements);
    },[options]);

    return (
        <div ref={menu} className="dropdown" onMouseLeave={closeHandler}>
            {menuElements}
        </div>
    );
}

export default DropdownMenu;
