export function setStoreProp(propName, value) {
    window.localStorage.setItem(propName, value)
}

export function getStoreProp(propName) {
    return window.localStorage.getItem(propName)
}