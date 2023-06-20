export const setStorage = (key, value) => {
    return localStorage.setItem(key, value);
}

export const getStorage = (key) => {
    return localStorage.getItem(key);
}

export const removeStorage = (key) => {
    return localStorage.removeItem(key);
}

export const clearStorage = () => {
    return localStorage.clear();
}