const widgetReducer = (state:any[] = [], action: any) => {
    switch(action.type) {
        case "ADD":


            // let newState = state;
            // newState.push(action.data);
            // return(newState);
            return [...state, action.data]; 
        case "REMOVE":
            console.log(action.data.id);
            var updated = [...state];
            for(let i =0; i < updated.length; i++) {
                if(updated[i].id == action.data.id) { //remove widget of data.id
                    updated.splice(i, 1);
                    break;
                }
            }
            return(updated);
        case "UPDATE":
            var updated = [...state];
            for(let i =0; i < updated.length; i++) {
                if(updated[i].id == action.data.id) {
                    updated[i] = action.data;
                }
            }
            return updated;
        default:
            return state;
    }
}

export default widgetReducer;