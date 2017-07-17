import actionTypes from './actionTypes';

const initialState = {};

export default function reducer(state = initialState, action) {
    switch (action.type) {
    case actionTypes.TOGGLE:
        const tree = state[action.payload.parentId] || {};

        return Object.assign({}, state, {
            [action.payload.parentId]: Object.assign({}, tree, {
                [action.payload.childId]: !tree[action.payload.childId],
            })
        });
    default:
        return state;
    }
}
