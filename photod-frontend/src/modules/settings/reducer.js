// @flow

import actionTypes from './actionTypes';

import type { Action, State } from './types';

const initialState: State = {};

export default function reducer(state: State = initialState, action: Action) {
    switch (action.type) {
    case actionTypes.SET:
        return action.payload;
    default:
        return state;
    }
}
