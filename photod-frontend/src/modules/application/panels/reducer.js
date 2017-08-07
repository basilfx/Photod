// @flow

import actionTypes from './actionTypes';

import type { Action, State } from './types';

const initialState: State = {
    left: true,
    right: true,
};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
    case actionTypes.TOGGLE:
        return {
            ...state,
            [action.payload.panel]: !state[action.payload.panel],
        };
    default:
        return state;
    }
}
