// @flow

import actionTypes from './actionTypes';

import type { Action } from './types';

export function setViewport(center: ?[number, number], zoom: ?number): Action {
    return { type: actionTypes.SET_VIEWPORT, payload: { center, zoom } };
}

export default {
    setViewport,
};
