// @flow

import actionTypes from './actionTypes';
import backends from './backends';
import defaultSettings from './defaultSettings';

export function set(settings) {
    return (dispatch, getState) => {
        const state = getState();

        const dirtyBackends = [];
        const newSettings = {
            ...state.settings,
        };

        // Copy the new setting.
        for (const key in settings) {
            const defaultSetting = defaultSettings[key];

            // Track all backends that have been touched.
            if (dirtyBackends.indexOf(defaultSetting.scope) === -1) {
                dirtyBackends.push(defaultSetting.scope);
            }

            newSettings[key] = settings[key];
        }

        // Per dirty backend, collect all settings to update the backend with
        // all settings that should be in it.
        for (const dirtyBackend of dirtyBackends) {
            let backendSettings = {};

            for (const key in newSettings) {
                const defaultSetting = defaultSettings[key];

                if (dirtyBackend === defaultSetting.scope) {
                    backendSettings[key] = newSettings[key];
                }
            }

            for (const backend of Object.values(backends)) {
                if (backend.scope === dirtyBackend) {
                    backend.set(dispatch, state, backendSettings);
                }
            }
        }

        dispatch({
            type: actionTypes.SET,
            payload: newSettings,
        });
    };
}

export function refresh() {
    return (dispatch, getState) => {
        // Load the default settings firt.
        const settings = {}

        for (const key in defaultSettings) {
            settings[key] = defaultSettings[key].default;
        }

        // Then override defaults with settings from the other backends.
        const state = getState();

        for (const backend of Object.values(backends)) {
            const scopedSettings = backend.get(state);

            // The settings must be of the correct type and scope.
            for (const key in scopedSettings) {
                const defaultSetting = defaultSettings[key];

                if (!defaultSetting) {
                    return;
                }

                if (defaultSetting.scope === backend.scope) {
                    if (typeof scopedSettings[key] === defaultSetting.type) {
                        settings[key] = scopedSettings.get(key);
                    }
                }
            }
        }

        dispatch({
            type: actionTypes.SET,
            payload: settings,
        });
    };
}

export default {
    set,
    refresh,
};
