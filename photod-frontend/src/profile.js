// @flow

import bowser from 'bowser';

/**
 * Return the preferred MIME types for images.
 *
 * @return {Array<string>} Array of preferred MIME types.
 */
function getMimeTypes(): Array<string> {
    if (bowser.chrome) {
        return ['image/webp', 'image/jpeg'];
    }

    return ['image/jpeg'];
}

/**
 * Return the minimal quality of images.
 *
 * @return {number} Minimal quality of images.
 */
function getQuality(): number {
    if (bowser.mobile) {
        return 60;
    }

    return 100;
}

export default {
    mimeTypes: getMimeTypes(),
    quality: getQuality(),
};
