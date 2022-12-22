const widgetReducer = (state = false, action: any) => {
    switch(action.type) {
        case "ADD":
            console.log(action);
            return state;
        case "REMOVE":
            console.log(action);
            return state;
        case "UPDATE":
            console.log("YYYYYYYYYY")
            console.log(action);
            return state;
        default:
            return state;
    }
}

export default widgetReducer;