// @flow

/**
 * Get an item from the local storage.
 *
 * @param {string} key The key.
 * @param {mixed} defaultValue A default value in case the item is not stored.
 * @return {mixed} The item from the local storage.
 */
function get(key: string, defaultValue: mixed = null) {
    const value = window.localStorage.getItem(key);

    if (value === null) {
        return defaultValue;
    }

    // Try to decode it as JSON, otherwise fail and return the default value.
    try {
        return JSON.parse(value);
    }
    catch (e) {
        return defaultValue;
    }
}

/**
 * Remove an item from the local storage.
 *
 * @param {string} key The key.
 * @return {void}
 */
function remove(key: string): void {
    window.localStorage.removeItem(key);
}

/**
 * Set an item in the local storage.
 *
 * @param {string} key The key.
 * @param {mixed} value The value to store.
 * @return {void}
 */
function set(key: string, value: mixed): void {
    window.localStorage.setItem(key, JSON.stringify(value));
}

/*
 * Default export.
 */
export default {
    get,
    remove,
    set,
};
