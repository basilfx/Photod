// @flow

const sessionStorage = {};

/**
 * Get an item from the session storage.
 *
 * @param {string} key The key.
 * @param {mixed} defaultValue A default value in case the item is not stored.
 * @return {mixed} The item from the session storage.
 */
function get(key: string, defaultValue: mixed = null) {
    // Check if key is set.
    if (!(key in sessionStorage)) {
        return defaultValue;
    }

    // Return the value, since it exists.
    return sessionStorage[key];
}

/**
 * Remove an item from the session storage.
 *
 * @param {string} key The key.
 * @return {void}
 */
function remove(key: string): void {
    delete sessionStorage[key];
}

/**
 * Set an item in the session storage.
 *
 * @param {string} key The key.
 * @param {mixed} value The value to store.
 * @return {void}
 */
function set(key: string, value: mixed): void {
    sessionStorage[key] = value;
}

/*
 * Default export.
 */
export default {
    get,
    remove,
    set,
};
