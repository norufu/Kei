import scaleReducer from "./Scale";

import {combineReducers} from 'redux';

const allReducers = combineReducers({
    scaleMode: scaleReducer
})

export default allReducers;