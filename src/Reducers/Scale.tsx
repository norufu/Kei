const scaleReducer = (state = false, action: any) => {
    switch(action.type) {
        case "TOGGLE":
            return !state;
        default:
            return state;
    }
}

export default scaleReducer;