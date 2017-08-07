// @flow

import localStorage from './localStorage';
import sessionStorage from './sessionStorage';

export default [
    {
        scope: 'local',
        get: () => {
            return localStorage.get('settings', {});
        },
        set: (dispatch, state, settings): void => {
            localStorage.set('settings', settings);
        },
    },
    {
        scope: 'session',
        get: () => {
            return sessionStorage.get('settings', {});
        },
        set: (dispatch, state, settings): void => {
            sessionStorage.set('settings', settings);
        },
    },
    {
        scope: 'user',
        get: (state) => {
            return {};
        },
        set: (dispatch, state, settings): void => {
            void 0;
        },
    },
];
