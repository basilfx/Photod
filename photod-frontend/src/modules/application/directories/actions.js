// @flow

import actionTypes from './actionTypes';

import type { Action } from './types';

export function toggle(parentId: string, childId: string): Action {
    return { type: actionTypes.TOGGLE, payload: { parentId, childId } };
}

export default {
    toggle,
};
