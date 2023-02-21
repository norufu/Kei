export const toggleScale = () => {
    return{
        type: "TOGGLE"
    };
}


export const addWidgetData = (data: any) => {
    return{
        type: "ADD",
        data: data
    };
}

export const removeWidget = (data: any) => {
    return{
        type: "REMOVE",
        data: data
    };
}

export const updateWidget = (data: any) => {
    return{
        type: "UPDATE",
        data: data
    };
}