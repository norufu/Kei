export const toggleScale = () => {
    return{
        type: "TOGGLE"
    };
}


export const addWidget = () => {
    return{
        type: "ADD"
    };
}

export const removeWidget = () => {
    return{
        type: "REMOVE"
    };
}

export const updateWidget = (data: any) => {
    return{
        type: "UPDATE",
        data: data
    };
}