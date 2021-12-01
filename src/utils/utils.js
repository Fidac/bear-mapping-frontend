export const isNumber = (text) => {
    return !isNaN(parseInt(text)) && isFinite(text);
}

export const isEmpty = prop =>
    prop === null ||
    prop === undefined ||
    (prop.hasOwnProperty("length") && prop.length === 0) ||
    (prop.constructor === Object && Object.keys(prop).length === 0);