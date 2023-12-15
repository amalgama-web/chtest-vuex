export function debounce(fn) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(fn.bind(this, ...args), 300);
    }
}

export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}