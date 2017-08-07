// @flow

import actionTypes from './actionTypes';

import type { Action } from './types';

export function toggle(panel: string): Action {
    return { type: actionTypes.TOGGLE, payload: { panel } };
}

export default {
    toggle,
};
