// @flow

import actionTypes from './actionTypes';

import type { Action, State } from './types';

const initialState: State = {};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
    case actionTypes.TOGGLE:
        const subState = state[action.payload.parentId] || {};

        return {
            ...state,
            [action.payload.parentId]: {
                ...subState,
                [action.payload.childId]: !subState[action.payload.childId],
            },
        };
    default:
        return state;
    }
}
