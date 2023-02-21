import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../../..';
import { removeWidget } from '../../../../Actions/Index';
import './ModalWidgetBox.css';


function ModalWidgetBox({id, widgetType} : {id:number, widgetType: string}) {
    const dispatch = useAppDispatch();

    function deleteWidget() {
        dispatch(removeWidget({id:id}));
    }

    return(
        <span className='widgetSpan'>
            <button className='widgetRemove' onClick={deleteWidget}>X</button>
            <p>{widgetType}</p>
        </span>
    )
}

export default ModalWidgetBox;
