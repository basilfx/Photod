import actionTypes from './actionTypes';

export function toggle(parentId, childId) {
    return { type: actionTypes.TOGGLE, payload: { parentId, childId } };
}

export default {
    toggle,
};
