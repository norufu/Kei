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

export const removeWidgetData = (data: any) => {
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