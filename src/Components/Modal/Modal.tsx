import React, { useEffect, useRef, useState } from 'react';
import './Modal.css';


function Modal({closeHandler, show, children} : {closeHandler: Function, show: boolean, children: JSX.Element}) {
    const showClass = show ? "modal display-block" : "modal display-none"

    function close() {
        closeHandler()
    }
    
    return(
        <div className={showClass}>
            <div className='modalContent'>
                <span className='closeWrapper'><button className='modalCloseButton' onClick={close}>X</button></span>
                {children}
            </div>
        </div>
    )
}

export default Modal;
