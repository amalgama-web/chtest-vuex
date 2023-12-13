export function debounce(fn) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(fn.bind(this, ...args), 300);
    }
}
