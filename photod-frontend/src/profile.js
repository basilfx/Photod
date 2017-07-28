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

/**
 * Return the preferred width and height of of thumbnails.
 *
 * @return {Object} Object with preferred width and height of thumbnails.
 */
function getThumbnail(): { width: number, height: number } {
    if (bowser.mobile) {
        return {
            width: 128,
            height: 128,
        };
    }

    return {
        width: 256,
        height: 256,
    };
}

export default {
    mimeTypes: getMimeTypes(),
    quality: getQuality(),
    thumbnail: getThumbnail(),
};
