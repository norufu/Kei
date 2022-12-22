import scaleReducer from "./Scale";

import {combineReducers} from 'redux';
import widgetReducer from "./Widget";

const allReducers = combineReducers({
    scaleMode: scaleReducer,
    widgetData: widgetReducer
})

export default allReducers;