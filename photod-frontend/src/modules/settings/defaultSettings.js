// @flow

/*
 * Default exports.
 */
export default {
    'application.welcome': {
        scope: 'user',
        type: 'boolean',
        default: true,
    },
    'application.hints': {
        scope: 'user',
        type: 'object',
        default: {},
    },
    'application.menu.autoExpand': {
        scope: 'user',
        type: 'boolean',
        default: true,
    },
    'application.mediaList.hoverShadow': {
        scope: 'user',
        type: 'boolean',
        default: true,
    },
    'application.lightbox.blur': {
        scope: 'user',
        type: 'boolean',
        default: true,
    },
};
